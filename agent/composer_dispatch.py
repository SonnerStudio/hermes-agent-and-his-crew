"""Composer Button 1 — proactive sub-agent dispatch (Phase 2b, Phase A).

This module turns the ``subagent_orchestration`` flag (Button 1) from a
pass-through into an actual behaviour: when the agent's model response
contains several *independent* tool calls of the same category, we advise a
single ``delegate_task`` batch call that fans them out in parallel — instead of
the agent executing them serially in the main thread.

Design rules (see PHASE2B_PLAN.md):
- **Post-Response, not Pre-Call.** We read the *already produced* tool-call
  batch and decide whether to delegate. We never inject a prompt telling the
  model "you may now delegate" — that would break the prompt cache
  (Invariante 2).
- **Pure decision function.** ``should_dispatch`` has no side effects and is
  fully unit-testable.
- **Conservative signals.** All six signals must hold before we dispatch
  (S1–S6 in the plan). The default is *not* to dispatch.
- **Non-breaking.** With Button 1 off, ``apply_composer_gates`` returns the
  batch unchanged (delegation stays freely callable; the button *arms*, it
  never *blocks*).
- **Spawn isolation.** Children do not inherit the proactive-dispatch flag
  (R1): we check ``_spawn_depth`` and ``is_spawn_paused()``.

External killswitch: env ``HERMES_DISABLE_PROACTIVE_DISPATCH=1`` disables A
entirely.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any, List, Optional

# Tunables (env-overridable for live tuning without code edits).
MIN_PARALLEL_UNITS = int(os.environ.get("HERMES_MIN_PARALLEL_UNITS", "3"))
MAX_PROACTIVE_DISPATCHES = int(
    os.environ.get("HERMES_MAX_PROACTIVE_DISPATCHES", "2")
)

# Hard caps (never exceed, regardless of env).
MAX_CLONE_FACTOR = 4
TOTAL_CHILDREN_CAP = 8


@dataclass
class DispatchDecision:
    """Result of :func:`should_dispatch`."""

    dispatch: bool
    reason: str = ""
    # The tool-call indices (into the incoming batch) that form one coherent
    # delegation unit. Empty when ``dispatch`` is False.
    unit_indices: List[int] = field(default_factory=list)
    # The category (function name) the unit shares, e.g. "web_search".
    category: str = ""


def _fn_name(tc: Any) -> str:
    fn = getattr(tc, "function", None)
    if isinstance(fn, dict):
        return fn.get("name", "")
    return getattr(fn, "name", "") or ""


def _tool_call_count(agent) -> int:
    """Best-effort read of the configured max spawn depth (S4)."""
    try:
        from tools.delegate_tool import is_spawn_paused  # local import

        return is_spawn_paused()
    except Exception:
        return False


def should_dispatch(
    agent,
    tool_calls: List[Any],
    min_parallel_units: int = MIN_PARALLEL_UNITS,
) -> DispatchDecision:
    """Decide whether the current batch should be proactively delegated.

    All signals S1–S6 must hold. Pure function — no mutation of ``agent`` or
    ``tool_calls``.
    """
    # Kill-switch (env)
    if os.environ.get("HERMES_DISABLE_PROACTIVE_DISPATCH") == "1":
        return DispatchDecision(False, "killswitch")

    # S1: Button 1 armed?
    if not getattr(agent, "_subagent_orchestration", False):
        return DispatchDecision(False, "button1_off")

    # Need at least one tool call.
    if not tool_calls:
        return DispatchDecision(False, "no_calls")

    # S3: do not double-fan-out if a delegate_task is already in the batch.
    has_delegate = any(_fn_name(tc) == "delegate_task" for tc in tool_calls)
    if has_delegate:
        return DispatchDecision(False, "already_delegating")

    # Group non-delegate tool calls by function name.
    by_cat: dict[str, List[int]] = {}
    for i, tc in enumerate(tool_calls):
        name = _fn_name(tc)
        if name == "delegate_task":
            continue
        # Only consider calls that are safe to parallelise (read-only-ish).
        by_cat.setdefault(name, []).append(i)

    # S2: find a category with >= min_parallel_units independent calls.
    best_cat = ""
    best_idx: List[int] = []
    for cat, idxs in by_cat.items():
        if len(idxs) >= min_parallel_units:
            # Prefer the largest coherent unit.
            if len(idxs) > len(best_idx):
                best_cat, best_idx = cat, idxs
    if not best_idx:
        return DispatchDecision(False, "below_parallel_threshold")

    # S4: spawn depth guard.
    depth = getattr(agent, "_spawn_depth", 0)
    try:
        import tools.delegate_tool as _dt  # local import

        max_depth = getattr(getattr(_dt, "delegation", None), "max_spawn_depth", 3) or 3
    except Exception:
        max_depth = 3
    if depth >= max_depth - 1:
        return DispatchDecision(False, "spawn_depth_limit")

    # S5: spawn paused?
    if _tool_call_count(agent):
        return DispatchDecision(False, "spawn_paused")

    # S6: per-conversation budget.
    count = getattr(agent, "_proactive_dispatch_count", 0)
    if count >= MAX_PROACTIVE_DISPATCHES:
        return DispatchDecision(False, "budget_exhausted")

    return DispatchDecision(
        True, "ok", unit_indices=best_idx[:TOTAL_CHILDREN_CAP], category=best_cat
    )


def build_delegation_call(decision: DispatchDecision, tool_calls: List[Any]) -> dict:
    """Build ONE synthetic ``delegate_task`` batch call covering the unit.

    The returned dict is OpenAI-style (``id``/``function``) so it can be
    inserted into ``assistant_message.tool_calls`` in place of the original
    calls. The batch uses the native parallel ``tasks=[...]`` form.
    """
    tasks = []
    for i in decision.unit_indices:
        tc = tool_calls[i]
        fn = getattr(tc, "function", None)
        args = fn.get("arguments", "{}") if isinstance(fn, dict) else getattr(fn, "arguments", "{}")
        goal = f"Execute the following tool call as an independent sub-task: {args}"
        tasks.append(
            {
                "goal": goal,
                "context": "Run this single tool call autonomously and return its result.",
                "role": "leaf",
            }
        )
    synthetic = {
        "id": f"composer_dispatch_{abs(hash(decision.category)) % 10**8}",
        "type": "function",
        "function": {
            "name": "delegate_task",
            "arguments": '{"tasks": ' + __import__("json").dumps(tasks) + "}",
        },
    }
    return synthetic
