"""Composer Button 4 — harmonization & sync topology (Phase 2b, Phase D).

This module decides *how* the units produced by Phases A–C are reconciled:

- **peer (Button 2 OFF):** all units receive a shared ``sync_context`` block
  (identical constraint/goal lines) so independent children do not diverge.
  Results are returned together and the parent gets a consolidation hint in
  the tool-result prefix. No reordering.
- **managed (Button 2 ON):** ``SecretaryPlan.topology == "managed"``. The
  priority from Phase C becomes binding: units with ``priority > 0`` run as a
  *leading* batch, the rest afterwards (two sequential ``delegate_task``
  batches instead of one). This avoids a high-priority orchestrator unit being
  starved by a flood of leaf units.

The topology decision is made **exclusively from flags** (never from model
text). A hard cap ``TOTAL_CHILDREN_CAP = 8`` bounds fan-out (plan R2).

``harmonize`` does NOT execute anything — it rewrites the ``tool_calls`` batch
into the final shape the conversation loop will dispatch. It is the last stage
of the gate pipeline.
"""

from __future__ import annotations

import json
from typing import Any, List, Optional

# Hard cap on total children spawned by one harmonized batch (plan R2).
TOTAL_CHILDREN_CAP = 8


def _fn_name(tc: Any) -> str:
    fn = getattr(tc, "function", None)
    if isinstance(fn, dict):
        return fn.get("name", "")
    return getattr(fn, "name", "") or ""


def _fn_args(tc: Any) -> str:
    fn = getattr(tc, "function", None)
    if isinstance(fn, dict):
        return fn.get("arguments", "{}")
    return getattr(fn, "arguments", "{}") or "{}"


def _wrap(func_name: str, arguments: str, tc_id: Optional[str] = None):
    """Build a tool-call-shaped object (SimpleNamespace) like the rest of the
    pipeline emits, so the downstream loop (.function.name / .function.arguments)
    works uniformly."""
    from types import SimpleNamespace

    fn = SimpleNamespace(name=func_name, arguments=arguments)
    return SimpleNamespace(id=tc_id, function=fn, _is_clone=False)


def _count_children(tc: Any) -> int:
    """How many sub-agents a delegate_task call would spawn."""
    try:
        data = json.loads(_fn_args(tc)) if _fn_args(tc) else {}
    except Exception:
        return 1
    if isinstance(data.get("tasks"), list):
        return max(1, len(data["tasks"]))
    return 1


def _add_sync_context(tc: Any, sync_context: str) -> Any:
    """Inject ``sync_context`` into a delegate_task call's arguments (peer mode)."""
    try:
        data = json.loads(_fn_args(tc)) if _fn_args(tc) else {}
    except Exception:
        return tc
    if "tasks" in data and isinstance(data["tasks"], list):
        for t in data["tasks"]:
            if isinstance(t, dict):
                existing = t.get("context", "")
                t["context"] = (existing + "\n" + sync_context).strip()
    elif "goal" in data:
        existing = data.get("context", "")
        data["context"] = (existing + "\n" + sync_context).strip()
    else:
        return tc
    return _wrap("delegate_task", json.dumps(data), getattr(tc, "id", None))


def harmonize(
    agent,
    tool_calls: List[Any],
    plan: Optional[Any] = None,
) -> List[Any]:
    """Apply the Button-4 harmonization topology to the batch.

    Args:
        agent: the AIAgent (read-only; reads ``_double_mode`` / ``_voice_comms``).
        tool_calls: the batch after Stages A–C.
        plan: optional SecretaryPlan from Stage C (drives 'managed' mode).

    Returns:
        The (possibly reordered / context-enriched) batch.
    """
    if not tool_calls:
        return tool_calls

    # Button 4 (double_mode / harmonization) is the gate for this stage. With
    # it off, harmonize is a complete no-op (non-breaking: batch unchanged).
    if not getattr(agent, "_double_mode", False):
        return tool_calls

    managed = bool(getattr(agent, "_voice_comms", False)) and bool(
        getattr(plan, "topology", "") == "managed"
    )
    double_on = bool(getattr(agent, "_double_mode", False))

    # Collect delegate_task calls (the ones we harmonize).
    deleg = [tc for tc in tool_calls if _fn_name(tc) == "delegate_task"]

    # --- Peer mode: shared sync_context, no reordering ----------------------
    if not managed:
        sync_context = (
            "SYNC: coordinate with sibling agents; align on the shared goal "
            "and avoid contradicting their results."
        )
        out = []
        for tc in tool_calls:
            if _fn_name(tc) == "delegate_task":
                out.append(_add_sync_context(tc, sync_context))
            else:
                out.append(tc)
        return out

    # --- Managed mode: priority-ordered two-batch split ---------------------
    # Units with priority > 0 (orchestrator-planned) first, the rest after.
    priority_calls = []
    rest_calls = []
    for tc in deleg:
        # Map this call to its plan unit priority (by goal match).
        prio = _priority_for(tc, plan)
        if prio and prio > 0:
            priority_calls.append(tc)
        else:
            rest_calls.append(tc)

    # Enforce total-children cap across both batches (plan R2).
    priority_calls = _cap_calls(priority_calls)
    rest_calls = _cap_calls(rest_calls, used=sum(_count_children(c) for c in priority_calls))

    non_deleg = [tc for tc in tool_calls if _fn_name(tc) != "delegate_task"]
    # Leading batch (priority) then trailing batch (rest), non-deleg calls
    # appended at the end (they run in the main thread regardless).
    return priority_calls + rest_calls + non_deleg


def _priority_for(tc: Any, plan: Optional[Any]) -> int:
    """Find the priority of the plan unit matching this call's goal."""
    if plan is None or not getattr(plan, "units", None):
        return 0
    try:
        data = json.loads(_fn_args(tc)) if _fn_args(tc) else {}
    except Exception:
        return 0
    goal = data.get("goal", "")
    if "tasks" in data and isinstance(data["tasks"], list):
        goal = " | ".join(
            str(t.get("goal", "")) for t in data["tasks"] if isinstance(t, dict)
        )
    for u in plan.units:
        if u.goal == goal:
            return getattr(u, "priority", 0)
    return 0


def _cap_calls(calls: List[Any], used: int = 0) -> List[Any]:
    """Truncate calls (and tasks inside batch calls) so total spawned children
    stay within TOTAL_CHILDREN_CAP (plan R2). A batch call is *split* (only its
    first N tasks kept) rather than dropped wholesale."""
    out: List[Any] = []
    budget = TOTAL_CHILDREN_CAP - used
    if budget <= 0:
        return out
    for tc in calls:
        c = _count_children(tc)
        if c <= budget:
            out.append(tc)
            budget -= c
        else:
            # Split this batch call: keep only the first `budget` tasks.
            try:
                data = json.loads(_fn_args(tc)) if _fn_args(tc) else {}
            except Exception:
                data = {}
            if isinstance(data.get("tasks"), list):
                data["tasks"] = data["tasks"][:budget]
                out.append(_wrap("delegate_task", json.dumps(data), getattr(tc, "id", None)))
                budget = 0
                break
            else:
                # Single-goal call but over budget => drop.
                break
    return out
    return out
