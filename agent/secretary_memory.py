"""Secretary's own learning memory (Phase E, Option B).

This is the Secretary's **private** MemoryManager — a self-contained learning
store that records the outcome of every delegation the Secretary orchestrates,
and surfaces learned routing preferences back to the planning layer.

It deliberately mirrors the *shape* of Hermes' own ``MemoryManager``
(``sync_turn`` / ``prefetch`` / atomic JSON persistence) but lives in its own
scope (``~/.hermes/secretary/memory.json``) so it never touches Core memory or
skills. This is what makes the Secretary "self-learning like Hermes" — she keeps
her own journey of what routing/topology worked.

Non-breaking: all methods are pure add-ons. With Button 2 off, nothing reads or
writes this store. Every call is wrapped by the caller in try/except so a broken
store can never break a delegation.
"""

from __future__ import annotations

import json
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from hermes_constants import get_hermes_home


def _store_path() -> Path:
    """Private store under HERMES_HOME/secretary (own scope, never Core)."""
    return get_hermes_home() / "secretary" / "memory.json"


class SecretaryMemory:
    """The Secretary's learning memory.

    Records delegation outcomes and derives a learned routing preference
    (which ``(topology, clone_factor)`` works best for a given unit-count
    bucket). No model call — a transparent heuristic over recorded outcomes.
    """

    def __init__(self, path: Optional[Path] = None):
        self._path = Path(path) if path else _store_path()
        self._lock = threading.RLock()
        self._data: Dict[str, Any] = {"outcomes": [], "learned": {}}
        self._loaded_mtime: Optional[float] = None
        self._load()

    # ── persistence (atomic, like Core) ──────────────────────────────────

    def _load_if_stale(self) -> None:
        """Reload only if the backing file changed on disk (mtime-based cache).

        The Secretary learning graph + footer poll this store every ~2s. Without
        a staleness check we re-parse the JSON on every poll even though writes
        happen rarely (only when a delegation resolves). This is the single
        biggest runtime win for the E4 HUD hot path.
        """
        try:
            mtime = self._path.stat().st_mtime if self._path.exists() else None
        except OSError:
            mtime = None
        if mtime == self._loaded_mtime:
            return  # unchanged — keep in-memory data, skip disk read
        try:
            if self._path.exists():
                with open(self._path, "r", encoding="utf-8") as fh:
                    self._data = json.load(fh)
                if not isinstance(self._data, dict):
                    self._data = {"outcomes": [], "learned": {}}
            else:
                self._data = {"outcomes": [], "learned": {}}
            self._loaded_mtime = mtime
        except (OSError, json.JSONDecodeError):
            self._data = {"outcomes": [], "learned": {}}
            self._loaded_mtime = mtime

    def _load(self) -> None:
        self._loaded_mtime = None  # force a fresh read on next access
        self._load_if_stale()

    def _save(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self._path.with_suffix(".json.tmp")
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(self._data, fh, ensure_ascii=False, indent=2)
        tmp.replace(self._path)
        # Refresh our cached mtime so the next poll sees the fresh write
        # (don't skip the just-written data on the very next read).
        try:
            self._loaded_mtime = self._path.stat().st_mtime
        except OSError:
            self._loaded_mtime = None

    # ── learning API (mirrors MemoryManager.sync_turn) ─────────────────────

    def sync_turn(self, outcome: Dict[str, Any]) -> None:
        """Record one delegation outcome and update learned routing.

        ``outcome`` keys (all optional, tolerant):
          - topology: "peer" | "managed"
          - clone_factor: int
          - units: int (number of units delegated)
          - success: bool
          - latency_s: float
          - cost: float
        """
        with self._lock:
            rec = {
                "ts": datetime.now(timezone.utc).isoformat(),
                "topology": outcome.get("topology", "peer"),
                "clone_factor": int(outcome.get("clone_factor", 1)),
                "units": int(outcome.get("units", 1)),
                "success": bool(outcome.get("success", True)),
                "latency_s": float(outcome.get("latency_s", 0.0)),
                "cost": float(outcome.get("cost", 0.0)),
                "stage": outcome.get("stage", "secretary"),
                # Optional agent id so per-sub-agent scores can be shown in the HUD.
                "agent_id": outcome.get("agent_id"),
                "agent_name": outcome.get("agent_name"),
            }
            self._data.setdefault("outcomes", []).append(rec)
            # Keep bounded (last 200 outcomes).
            if len(self._data["outcomes"]) > 200:
                self._data["outcomes"] = self._data["outcomes"][-200:]
            self._update_learned()
            self._save()

    def _update_learned(self) -> None:
        """Derive a preferred (topology, clone_factor) per unit-count bucket.

        For each bucket of unit-count (1-2, 3-5, 6+), pick the config with the
        best success-weighted score among recorded outcomes.
        """
        buckets: Dict[str, List[Dict[str, Any]]] = {"small": [], "mid": [], "large": []}

        def _bucket(n: int) -> str:
            if n <= 2:
                return "small"
            if n <= 5:
                return "mid"
            return "large"

        for o in self._data.get("outcomes", []):
            if not o.get("success", True):
                continue
            buckets[_bucket(int(o.get("units", 1)))].append(o)

        learned: Dict[str, Any] = {}
        for name, recs in buckets.items():
            if not recs:
                learned[name] = {"topology": "peer", "clone_factor": 2}
                continue
            # Score = success rate minus normalized latency penalty.
            best = None
            best_score = -1e9
            for o in recs:
                lat = float(o.get("latency_s", 0.0))
                score = 1.0 - min(lat / 60.0, 0.5)  # latency penalty capped
                if score > best_score:
                    best_score = score
                    best = o
            learned[name] = {
                "topology": best.get("topology", "peer"),
                "clone_factor": int(best.get("clone_factor", 2)),
            }
        self._data["learned"] = learned

    def get_learned_routing(self, units: int = 1) -> Dict[str, Any]:
        """Return the learned preferred config for a given unit count."""
        with self._lock:
            self._load_if_stale()
            learned = self._data.get("learned", {})
            if units <= 2:
                key = "small"
            elif units <= 5:
                key = "mid"
            else:
                key = "large"
            return learned.get(key, {"topology": "peer", "clone_factor": 2})

    def module_scores(self) -> Dict[str, Any]:
        """Compute a live 0-100 learning score per crew module (self-improvement
        gauge). Higher = the module has learned more consistent, successful
        routing/planning decisions over time.

        Score blends:
          - volume: how many decisions this module has recorded (experience)
          - consistency: how stable its learned preference is (low variance in
            recorded topology/clone_factor => higher)
          - recency: recent activity weights slightly higher

        Returns {module: {score, decisions, trend}} so the HUD can show both
        the absolute score and how many decisions fed it.
        """
        with self._lock:
            self._load_if_stale()
            outcomes = self._data.get("outcomes", [])
        from collections import Counter

        modules = ("subagent", "planner", "secretary")
        per: Dict[str, list] = {m: [] for m in modules}
        for o in outcomes:
            s = o.get("stage", "secretary")
            if s in per:
                per[s].append(o)

        result: Dict[str, Any] = {}
        for m in modules:
            recs = per[m]
            n = len(recs)
            if n == 0:
                result[m] = {"score": 0, "decisions": 0, "trend": "neu"}
                continue
            # Consistency: topology + clone_factor stability.
            topo = Counter(o.get("topology", "peer") for o in recs)
            cf = Counter(int(o.get("clone_factor", 1)) for o in recs)
            topo_share = max(topo.values()) / n
            cf_share = max(cf.values()) / n
            consistency = 0.5 * topo_share + 0.5 * cf_share
            # Volume: log-scaled experience (saturates around ~40 decisions).
            import math

            volume = min(1.0, math.log(n + 1) / math.log(40 + 1))
            # Recency: fraction of decisions in the last 25% of the window.
            recency = 0.5
            if n >= 4:
                recent = recs[int(n * 0.75):]
                recency = len(recent) / len(recs)
            score = int(round(100 * (0.55 * consistency + 0.30 * volume + 0.15 * recency)))
            # Trend arrow from last 3 vs prior 3 decisions (success-weighted).
            def _succ(xs):
                return sum(1 for x in xs if x.get("success", True)) / max(1, len(xs))

            if n >= 6:
                latest = _succ(recs[-3:])
                prior = _succ(recs[-6:-3])
                if latest > prior:
                    trend = "steigend"
                elif latest < prior:
                    trend = "fallend"
                else:
                    trend = "stabil"
            else:
                trend = "steigend" if all(o.get("success", True) for o in recs[-3:]) else "stabil"
            result[m] = {"score": score, "decisions": n, "trend": trend}

        # Per-sub-agent breakdown (each delegated agent gets its own score bar).
        agents: Dict[str, Any] = {}
        for o in outcomes:
            if o.get("stage") != "subagent":
                continue
            aid = o.get("agent_id") or o.get("agent_name") or "subagent"
            agents.setdefault(aid, []).append(o)
        agent_scores: Dict[str, Any] = {}
        for aid, recs in agents.items():
            n = len(recs)
            if n == 0:
                continue
            topo = Counter(o.get("topology", "peer") for o in recs)
            cf = Counter(int(o.get("clone_factor", 1)) for o in recs)
            consistency = 0.5 * (max(topo.values()) / n) + 0.5 * (max(cf.values()) / n)
            import math

            volume = min(1.0, math.log(n + 1) / math.log(40 + 1))
            recency = 0.5
            if n >= 4:
                recency = len(recs[int(n * 0.75):]) / len(recs)
            score = int(round(100 * (0.55 * consistency + 0.30 * volume + 0.15 * recency)))
            agent_scores[aid] = {
                "score": score,
                "decisions": n,
                "name": next((o.get("agent_name") or aid for o in recs), aid),
                "trend": "steigend" if all(o.get("success", True) for o in recs[-3:]) else "stabil",
            }
        result["agents"] = agent_scores

        # HUD layout (Jan's requirement): EVERY sub-agent specialist gets its
        # OWN scored row with its specialization label — never collapsed into a
        # single anonymous bar. The frontend stacks them vertically (wrapping
        # to 2-3 rows only on very narrow widths), so the crew stays readable.
        # ``agents`` above is kept as the raw source (tooltips/details).
        ranked = sorted(
            agent_scores.items(), key=lambda kv: (-kv[1]["score"], kv[0])
        )
        per_line = max(1, -(-len(ranked) // 2))  # ceil: fill line 1, then 2+
        result["agent_lines"] = [
            [
                {"id": aid, "name": d["name"], "score": d["score"],
                 "decisions": d["decisions"], "trend": d["trend"]}
                for aid, d in ranked[i:i + per_line]
            ]
            for i in range(0, len(ranked), per_line)
        ]
        return result

    def prefetch(self) -> Dict[str, Any]:
        """Lightweight read of learned state (mirrors MemoryManager.prefetch)."""
        with self._lock:
            self._load_if_stale()
            return {
                "learned": self._data.get("learned", {}),
                "outcome_count": len(self._data.get("outcomes", [])),
            }

    def count(self) -> int:
        with self._lock:
            self._load_if_stale()
            return len(self._data.get("outcomes", []))
