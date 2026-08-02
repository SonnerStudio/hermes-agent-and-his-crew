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
        self._load()

    # ── persistence (atomic, like Core) ──────────────────────────────────

    def _load(self) -> None:
        try:
            if self._path.exists():
                with open(self._path, "r", encoding="utf-8") as fh:
                    self._data = json.load(fh)
                if not isinstance(self._data, dict):
                    self._data = {"outcomes": [], "learned": {}}
        except (OSError, json.JSONDecodeError):
            self._data = {"outcomes": [], "learned": {}}

    def _save(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self._path.with_suffix(".json.tmp")
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(self._data, fh, ensure_ascii=False, indent=2)
        tmp.replace(self._path)

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
            learned = self._data.get("learned", {})
            if units <= 2:
                key = "small"
            elif units <= 5:
                key = "mid"
            else:
                key = "large"
            return learned.get(key, {"topology": "peer", "clone_factor": 2})

    def prefetch(self) -> Dict[str, Any]:
        """Lightweight read of learned state (mirrors MemoryManager.prefetch)."""
        with self._lock:
            return {
                "learned": self._data.get("learned", {}),
                "outcome_count": len(self._data.get("outcomes", [])),
            }

    def count(self) -> int:
        with self._lock:
            return len(self._data.get("outcomes", []))
