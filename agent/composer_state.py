"""Composer button-state bridge for the Hermes Core.

The desktop Composer UI toggles four buttons (sub-agent orchestration,
voice communication / Secretary, orchestration mode, double mode). Those
toggles are persisted by the MLX proxy to ``~/.hermes/composer-flags.json``
as ``{"<method>.toggle": {...}}`` blocks.

The Core previously never read that file, so the buttons were "blind" — the
agent had no idea a button had been pressed. This module is the bridge: it
exposes :func:`get_composer_flags`, which the Core calls (lazily, once per
conversation turn) to learn the current button state.

Design rules (see IMPLEMENTATION_PLAN_BUTTONS.md §9):
- **Strict bool coercion.** ``bool("false")`` is ``True`` in Python, which is
  a trap. We coerce strings explicitly.
- **Per-flag isolation.** A malformed value for one flag must never break the
  others; each flag defaults to ``False`` on any error.
- **No new dependencies.** ``watchdog`` is not guaranteed to be installed, so
  we use a lazy file re-read (sub-millisecond) instead of a file watcher.
- **No prompt-cache impact.** Flags are only read as runtime attributes; they
  are never written into ``system_message``.
- **No proxy import.** This module only reads a JSON file; the Core keeps
  working even if the proxy is not running.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict

# The four button method names persisted by the proxy. Keys here are the
# short internal names used by the Core (see AIAgent flag attributes).
BUTTON_METHODS = (
    "subagent_orchestration.toggle",
    "voice_comms.toggle",
    "orchestration.toggle",
    "double_mode.toggle",
)

# Mapping from the proxy method name to the short Core flag name.
METHOD_TO_FLAG = {
    "subagent_orchestration.toggle": "subagent_orchestration",
    "voice_comms.toggle": "voice_comms",
    "orchestration.toggle": "orchestration_mode",
    "double_mode.toggle": "double_mode",
}

# Canonical Core flag names (order is stable for callers that iterate).
FLAG_NAMES = tuple(METHOD_TO_FLAG.values())


def _default_flags_path() -> Path:
    """Resolve the composer-flags file path without importing the whole
    hermes_constants module (keeps this bridge dependency-light). Falls back
    to ``~/.hermes`` if HERMES_HOME is unset."""
    home = os.environ.get("HERMES_HOME")
    if home:
        return Path(home) / "composer-flags.json"
    return Path.home() / ".hermes" / "composer-flags.json"


def _coerce_bool(value) -> bool:
    """Strict boolean coercion that avoids the ``bool("false") == True`` trap.

    - ``True`` / ``1`` / ``"1"`` / ``"true"`` / ``"yes"`` / ``"on"`` -> ``True``
    - ``False`` / ``0`` / ``"0"`` / ``"false"`` / ``"no"`` / ``"off"`` -> ``False``
    - anything else -> ``False`` (safe default)
    """
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value != 0
    if isinstance(value, str):
        s = value.strip().lower()
        if s in ("1", "true", "yes", "on", "y", "t"):
            return True
        if s in ("0", "false", "no", "off", "n", "f", ""):
            return False
        # Non-empty unknown string -> treat as falsy to avoid surprises.
        return False
    return bool(value)


def _extract_active(block) -> bool:
    """Pull ``active`` out of a single button block, with isolation."""
    if not isinstance(block, dict):
        return False
    return _coerce_bool(block.get("active", False))


def get_composer_flags(path: str | os.PathLike | None = None) -> Dict[str, bool]:
    """Return the current Composer button state as a dict of 4 Core flags.

    All values are ``bool``. Any missing/corrupt flag defaults to ``False``.
    A missing file (proxy not running) yields all-``False`` without error.
    """
    flags = {name: False for name in FLAG_NAMES}
    flags_path = Path(path) if path else _default_flags_path()
    try:
        with open(flags_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
    except (FileNotFoundError, json.JSONDecodeError, OSError, PermissionError):
        # Proxy not running or file unreadable -> all flags off (safe).
        return flags

    if not isinstance(data, dict):
        return flags

    for method, flag in METHOD_TO_FLAG.items():
        try:
            block = data.get(method)
            flags[flag] = _extract_active(block)
        except Exception:
            # Isolation: a bad value for one button never breaks the others.
            flags[flag] = False
    return flags


def is_any_orchestration_active(flags: Dict[str, bool] | None = None) -> bool:
    """True if any of the three orchestration-related buttons is on.

    Used by the HUD to decide whether the live panels should render.
    """
    if flags is None:
        flags = get_composer_flags()
    return any(flags.get(name, False) for name in FLAG_NAMES)


def _fn_name(tc) -> str:
    """Extract the tool-call function name from either a dict or an object."""
    fn = getattr(tc, "function", None)
    if isinstance(fn, dict):
        return fn.get("name", "")
    return getattr(fn, "name", "") or ""


def _fn_args(tc) -> str:
    """Extract the tool-call arguments (string) from either a dict or object."""
    fn = getattr(tc, "function", None)
    if isinstance(fn, dict):
        return fn.get("arguments", "{}")
    return getattr(fn, "arguments", "{}") or "{}"


def apply_composer_gates(agent, tool_calls: list) -> list:
    """Apply the four Composer button gates to a batch of tool calls.

    Called from ``agent.conversation_loop`` after ``_cap_delegate_task_calls``
    and ``_deduplicate_tool_calls``. **Non-breaking by design:** when no button
    is active, ``tool_calls`` is returned unchanged. Each button only *adds*
    behaviour, never removes existing capability.

    Pipeline (Phase 2b): the gates run as an ordered, isolated sequence
    ``dispatch (A) -> clones (B) -> plan (C) -> sync (D)``. Every stage is
    wrapped in its own ``try/except`` (Invariante 3): a failing stage passes
    the batch through unchanged instead of breaking the others.

    Args:
        agent: the AIAgent instance (read-only access to ``_subagent_orchestration``
            and friends).
        tool_calls: list of OpenAI-style tool-call dicts from the model.

    Returns:
        The (possibly modified) list of tool calls.
    """
    if not tool_calls:
        return tool_calls

    # Snapshot flags (already loaded per-turn by run_conversation).
    _subagent = bool(getattr(agent, "_subagent_orchestration", False))
    # The Secretary (Button 2 / voice_comms) is the Managerin — when she is
    # on, her crew (sub-agents + planner) is implicitly available, mirroring
    # the proxy auto-arming Button 1 on Secretary activation. So Button 2
    # implies Button 1 for dispatch purposes.
    if getattr(agent, "_voice_comms", False):
        _subagent = True
    # Cloning (Button 3) only makes sense when sub-agent orchestration
    # (Button 1) is armed — you cannot clone agents that are not spawned.
    _clone = bool(getattr(agent, "_orchestration_mode", False)) and _subagent
    # voice_comms / double_mode gates are intentionally no-ops on the call
    # list here (planning / sync layers live in their own stages, C / D).

    # --- Stage C (always-on, display-only): Secretary planning (Button 2) ---\n    # Runs BEFORE the fast path so the plan is produced even when Button 1/3\n    # are off (plan is then purely for display). Never mutates tool_calls.
    try:
        from agent.composer_plan import plan_delegation

        _plan = plan_delegation(agent, tool_calls)
        if _plan is not None:
            agent._secretary_plan = _plan
            # Phase E (Option B): the Planner (Stage C) learns from its own
            # planning decision (self-improving like Hermes). Shared crew
            # memory, tagged stage="planner" so the graph can separate it.
            if getattr(agent, "_voice_comms", False):
                try:
                    composer_learn(
                        agent,
                        "planner",
                        {
                            "topology": _plan.topology,
                            "clone_factor": getattr(agent, "_clone_factor", 2),
                            "units": len(_plan.units),
                            "success": True,  # decision recorded; refined post-run
                        },
                    )
                except Exception:
                    pass
    except Exception:
        pass

    # Non-breaking fast path: if no relevant button is active, return as-is.
    if not _subagent and not _clone:
        return tool_calls

    # Stage pipeline. Each stage is isolated; a failure passes through.
    def _safe(stage_name, stage_fn, calls):
        try:
            return stage_fn(agent, calls)
        except Exception:
            # Invariante 3: one bad stage never breaks the others.
            return calls

    # --- Stage A: proactive sub-agent dispatch (Button 1) ---
    if _subagent:
        from agent.composer_dispatch import (
            should_dispatch,
            build_delegation_call,
            DispatchDecision,
        )

        decision = should_dispatch(agent, tool_calls)
        if isinstance(decision, DispatchDecision) and decision.dispatch:
            try:
                synthetic = build_delegation_call(decision, tool_calls)
                # Replace the coherent unit with the single batch call.
                keep = [
                    tc
                    for i, tc in enumerate(tool_calls)
                    if i not in decision.unit_indices
                ]
                keep.append(_wrap_as_tool_call(synthetic))
                agent._proactive_dispatch_count = getattr(agent, "_proactive_dispatch_count", 0) + 1
                # Phase E (Option B): Sub-Agents learn from this dispatch
                # decision (self-improving like Hermes). Shared crew memory.
                # Per-specialist: record ONE entry per named specialist in the
                # unit (not one anonymous batch entry), so the "Lernende Crew"
                # HUD can give every specialist its own scored row.
                try:
                    _seen = {}
                    for _i in decision.unit_indices:
                        try:
                            _cat = _fn_name(tool_calls[_i])
                        except Exception:
                            _cat = decision.category
                        _aid, _aname = specialist_for(_cat, decision.category)
                        _seen.setdefault(_aid, [_aname, 0])
                        _seen[_aid][1] += 1
                    if not _seen:  # safety: never lose the signal entirely
                        _aid, _aname = specialist_for(decision.category)
                        _seen = {_aid: [_aname, len(decision.unit_indices)]}
                    for _aid, (_aname, _n) in _seen.items():
                        composer_learn(
                            agent,
                            "subagent",
                            {
                                "topology": "peer",
                                "clone_factor": 1,
                                "units": _n,
                                "success": True,  # decision recorded; refined post-run
                                "agent_id": _aid,
                                "agent_name": _aname,
                            },
                        )
                except Exception:
                    pass
                return keep
            except Exception:
                pass

    # --- Stage B: clone fan-out (Button 3) ---
    # Collapse each clone/clone-eligible delegate_task call into ONE batch call
    # with factor cloned tasks. expand_clones is a no-op unless Button 3 is on
    # AND Button 1 is armed (per plan Phase B.4).
    from agent.composer_dispatch import expand_clones

    tool_calls = _safe("clones", expand_clones, tool_calls)

    # --- Stage C: secretary planning (Button 2) ---
    # Produces a structured plan (agent._secretary_plan + agent._secretary_directive)
    # without mutating the call list. The plan is for display + downstream Stage D.
    # The directive is the Secretary *acting* (direct comms to Hermes Agent),
    # consumed as a tool-result prefix — never system_message (Invariante 2).
    from agent.composer_plan import plan_delegation, SecretaryPlan

    try:
        plan = plan_delegation(agent, tool_calls)
    except Exception:
        plan = None
    if isinstance(plan, SecretaryPlan) and plan is not None:
        try:
            agent._secretary_plan = plan
            agent._secretary_directive = plan.directive
        except Exception:
            pass
    # Note: Stage C intentionally does NOT rewrite tool_calls here (plan C:
    # without Button 1 there is nothing to delegate, so the plan is display-only;
    # with Button 1 the plan context is already mirrored into units in D).

    # --- Stage D: harmonization sync (Button 4) ---
    # Decides the reconciliation topology (peer vs managed) from flags only,
    # never from model text. peer => shared sync_context; managed => priority
    # ordered two-batch split. Hard cap TOTAL_CHILDREN_CAP=8 (plan R2).
    from agent.composer_sync import harmonize

    tool_calls = _safe("sync", lambda a, c: harmonize(a, c, plan), tool_calls)

    # Phase E (Option B): the Secretary records her own planning decision into
    # her learning memory (self-improving like Hermes). This is a pre-outcome
    # signal (her decision), not the post-result — non-blocking, own scope.
    # Called here so no extra conversation_loop edit is needed; the real
    # post-result learning can be added later by calling secretary_learn()
    # again from the loop once delegate_task results return.
    try:
        if getattr(agent, "_voice_comms", False) and plan is not None:
            deleg_n = sum(1 for tc in tool_calls if _fn_name(tc) == "delegate_task")
            if deleg_n > 0:
                secretary_learn(
                    agent,
                    {
                        "topology": getattr(plan, "topology", "peer"),
                        "clone_factor": getattr(agent, "_clone_factor", 2),
                        "units": deleg_n,
                        "success": True,  # decision recorded; outcome refined post-run
                    },
                )
    except Exception:
        pass

    return tool_calls


def specialist_for(category: str, goal: str = "") -> tuple:
    """Map a tool category / delegation goal to a named crew SPECIALIST.

    Jan's requirement: the "Lernende Crew" HUD must list EVERY sub-agent
    specialist on its own row with its own score, instead of collapsing them
    into one anonymous "subagent" bar. To score them individually they must
    first be *identified* individually, which is what this does.

    Returns ``(agent_id, display_name)``. Unknown categories fall back to a
    generic-but-still-distinct id so a new tool never silently merges into an
    existing specialist's score.
    """
    cat = (category or "").strip().lower()
    goal_l = (goal or "").lower()

    # tool/function name -> (stable id, German HUD label)
    table = {
        "web_search": ("web-search", "Recherche-Spezialist"),
        "web_extract": ("web-search", "Recherche-Spezialist"),
        "browser_navigate": ("web-search", "Recherche-Spezialist"),
        "terminal": ("coder", "Code-Spezialist"),
        "execute_code": ("coder", "Code-Spezialist"),
        "patch": ("coder", "Code-Spezialist"),
        "write_file": ("coder", "Code-Spezialist"),
        "read_file": ("analyst", "Analyse-Spezialist"),
        "search_files": ("analyst", "Analyse-Spezialist"),
        "vision_analyze": ("vision", "Bild-Spezialist"),
        "text_to_speech": ("audio", "Audio-Spezialist"),
        "delegate_task": ("planner-agent", "Planungs-Spezialist"),
    }
    if cat in table:
        return table[cat]

    # Fall back to intent keywords in the delegation goal.
    for kw, val in (
        ("recherch", ("web-search", "Recherche-Spezialist")),
        ("search", ("web-search", "Recherche-Spezialist")),
        ("code", ("coder", "Code-Spezialist")),
        ("plan", ("planner-agent", "Planungs-Spezialist")),
        ("bild", ("vision", "Bild-Spezialist")),
        ("image", ("vision", "Bild-Spezialist")),
        ("audio", ("audio", "Audio-Spezialist")),
    ):
        if kw in goal_l:
            return val

    safe = cat or "generalist"
    return (safe, f"Spezialist: {safe}")


def composer_learn(agent, stage: str, outcome: dict) -> None:
    """Phase E (Option B): record a composer-stage outcome into the shared
    Secretary learning memory, so the Sub-Agents (Button 1 / dispatch), the
    Planner (Button 2 / plan), and the Secretary (Button 2 / voice) ALL learn
    and self-improve — like Hermes' own MemoryManager.sync_turn, but in the
    Secretary's private scope (~/.hermes/secretary/*).

    This is what makes the whole crew self-learning, not just the Secretary:
    every stage writes its decision into the same memory, so the learned
    routing (topology / clone_factor / dispatch threshold) improves over time.

    Non-blocking: any failure is swallowed (Invariante 3 — learning never
    breaks the delegation). No-op when no composer flag is active (so 0000
    never touches the store).
    """
    # Only learn when at least one crew flag is on.
    if not (
        getattr(agent, "_voice_comms", False)
        or getattr(agent, "_subagent_orchestration", False)
        or getattr(agent, "_orchestration_mode", False)
    ):
        return
    try:
        from agent.secretary_memory import SecretaryMemory

        # Reuse one store per agent (lazy) — own scope, never Core memory.
        store = getattr(agent, "_secretary_memory", None)
        if store is None:
            store = SecretaryMemory()
            agent._secretary_memory = store
        rec = dict(outcome)
        rec["stage"] = stage  # tag which crew member learned this
        store.sync_turn(rec)
    except Exception:
        # Invariante 3: learning never breaks the delegation.
        pass


# Back-compat alias: the Secretary's learning is now part of the shared crew
# memory (Sub-Agents + Planner + Secretary all learn together).
def secretary_learn(agent, outcome: dict) -> None:
    """Deprecated alias — use composer_learn(agent, 'secretary', outcome)."""
    composer_learn(agent, "secretary", outcome)


def refine_composer_learning(agent, agent_id: str, task_result: Any) -> None:
    """Phase E (Option B) — post-run refinement.

    The dispatcher records ``success=True`` at dispatch time (composer_learn,
    line ~270) because it cannot know the outcome yet. Once the delegated
    sub-agent returns, we close the loop: inspect ``task_result`` for an error
    and write the real success/latency back into the crew memory so the
    specialist's score trend and learned routing reflect reality.

    This is what makes the Bild-Spezialist (and every other specialist) truly
    self-improving: it learns from failures, not just from being dispatched.

    Non-blocking (Invariante 3). No-op when no crew flag is active.
    """
    if not (
        getattr(agent, "_voice_comms", False)
        or getattr(agent, "_subagent_orchestration", False)
        or getattr(agent, "_orchestration_mode", False)
    ):
        return
    try:
        # Derive success from the result payload (defensive: many shapes).
        success = True
        latency = None
        if isinstance(task_result, dict):
            if task_result.get("success") is False or "error" in task_result:
                success = False
            latency = task_result.get("latency_s")
        elif isinstance(task_result, str):
            # Raw string result: error markers => failure.
            low = task_result.lower()
            if any(k in low for k in ("error", "failed", "exception", "traceback")):
                success = False
        from agent.secretary_memory import SecretaryMemory

        store = getattr(agent, "_secretary_memory", None)
        if store is None:
            store = SecretaryMemory()
            agent._secretary_memory = store
        store.refine_last_outcome(
            "subagent", agent_id=agent_id, success=success, latency_s=latency
        )
    except Exception:
        # Invariante 3: learning never breaks the delegation.
        pass


def _wrap_as_tool_call(synthetic: dict):
    """Wrap a synthetic dict into an object with ``.function`` + ``._is_clone``
    compatible shape, matching what conversation_loop expects downstream.

    The OpenAI-style tool_call objects in the loop expose ``function.name`` /
    ``function.arguments`` / ``id``. ``types.SimpleNamespace`` gives us a
    lightweight, attribute-friendly object without a fragile custom class.
    """
    from types import SimpleNamespace

    fn = SimpleNamespace(
        name=synthetic["function"]["name"],
        arguments=synthetic["function"]["arguments"],
    )
    return SimpleNamespace(
        id=synthetic.get("id"),
        function=fn,
        _is_clone=False,
    )


if __name__ == "__main__":
    # Quick self-check when run directly.
    import pprint

    pprint.pprint(get_composer_flags())
