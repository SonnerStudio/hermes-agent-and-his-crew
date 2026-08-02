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
from typing import Dict

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
    # Cloning (Button 3) only makes sense when sub-agent orchestration
    # (Button 1) is armed — you cannot clone agents that are not spawned.
    _clone = bool(getattr(agent, "_orchestration_mode", False)) and _subagent
    # voice_comms / double_mode gates are intentionally no-ops on the call
    # list here (planning / sync layers live in their own stages, C / D).

    # --- Stage C (always-on, display-only): Secretary planning (Button 2) ---
    # Runs BEFORE the fast path so the plan is produced even when Button 1/3
    # are off (plan is then purely for display). Never mutates tool_calls.
    try:
        from agent.composer_plan import plan_delegation

        _plan = plan_delegation(agent, tool_calls)
        if _plan is not None:
            agent._secretary_plan = _plan
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

    return tool_calls


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
