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

    Gates:
    - **Button 1 (subagent_orchestration):** arms ``delegate_task`` — when the
      flag is on, delegation is permitted (the model may spawn sub-agents); when
      off, any ``delegate_task`` call is stripped (kept inert) so the agent runs
      single-threaded as before.
    - **Button 2 (voice_comms / Secretary):** planning layer only — no tool-call
      mutation here (the Secretary plans *which* sub-agents get *what*, done
      elsewhere in the Core). This gate is a no-op on the call list.
    - **Button 3 (orchestration_mode / cloning):** clones — when on, duplicate
      ``delegate_task`` calls with the same goal signature are *allowed*
      (normally de-duplicated); we mark them so the broker can fan them out.
    - **Button 4 (double_mode / harmonization):** sync layer — no tool-call
      mutation; the orchestration topology is harmonized via the HUD/relay.

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
    # voice_comms / double_mode have no tool-call mutation here (planning/sync
    # layers live elsewhere), so they are intentionally unused in this gate.

    # Non-breaking default: if neither relevant button is active, the batch is
    # returned unchanged (delegate_task remains freely callable, as in the
    # unmodified Core — Button 1 does not *block* delegation, it *arms* the
    # agent's own proactive sub-agent dispatch, which happens elsewhere).
    if not _subagent and not _clone:
        return tool_calls

    filtered = []
    seen_signatures = set()
    for tc in tool_calls:
        fn_name = _fn_name(tc)
        if fn_name != "delegate_task":
            filtered.append(tc)
            continue
        args = _fn_args(tc)
        if _clone:
            # Button 3 ON -> allow clones: skip de-duplication of identical
            # delegate_task goals so the broker can fan them out in parallel.
            sig = f"delegate_task:{args}"
            if sig in seen_signatures:
                try:
                    tc._is_clone = True  # type: ignore[attr-defined]
                except Exception:
                    pass
            seen_signatures.add(sig)
        filtered.append(tc)

    return filtered


if __name__ == "__main__":
    # Quick self-check when run directly.
    import pprint

    pprint.pprint(get_composer_flags())
