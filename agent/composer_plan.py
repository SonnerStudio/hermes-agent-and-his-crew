"""Composer Button 2 — Secretary / planning layer (Phase 2b, Phase C).

This module implements the Secretary as a *plan layer before task execution*,
not as an extra agent in the chat path. It inspects the tool-call batch that is
about to be delegated and produces a structured :class:`SecretaryPlan` that:

- de-duplicates goals,
- attaches a compact context excerpt (latest user intent + constraint lines)
  to every unit,
- assigns ``role="orchestrator"`` **only** to units with recognisable
  sub-tasks and **only** when the current agent is the root (``_spawn_depth ==
  0``) — this is the recursion guard (plan R1).

The plan is exposed as ``agent._secretary_plan`` (runtime attribute) and mirrored
as a 1-line summary inside each unit's context. It is **never** written into
``system_message`` (Invariante 2). The HUD / MLX proxy read it over the existing
RPC channel; no Whisper/Kokoro I/O happens in the Core.

If nothing is being delegated (Button 1 off), the plan is still produced but the
call list is left untouched — it is then purely for display.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any, List, Optional


@dataclass
class PlanUnit:
    """One planned delegation unit."""

    goal: str
    context: str
    role: str = "leaf"  # "leaf" | "orchestrator"
    priority: int = 0
    assignee_hint: str = ""


@dataclass
class SecretaryPlan:
    """Structured plan the Secretary produces for a delegation batch."""

    units: List[PlanUnit] = field(default_factory=list)
    topology: str = "peer"  # "peer" | "managed"
    directive: str = ""  # the Secretary's direct instruction to Hermes Agent

    def summary(self) -> str:
        """One-line HUD-friendly summary."""
        n = len(self.units)
        orch = sum(1 for u in self.units if u.role == "orchestrator")
        return f"Secretary: {n} unit(s), {orch} orchestrator, topology={self.topology}"

    def to_json(self) -> str:
        return json.dumps(
            {
                "units": [
                    {
                        "goal": u.goal,
                        "role": u.role,
                        "priority": u.priority,
                        "assignee_hint": u.assignee_hint,
                    }
                    for u in self.units
                ],
                "topology": self.topology,
                "directive": self.directive,
            },
            ensure_ascii=False,
        )


# A unit is treated as having sub-tasks (and thus eligible for orchestrator
# role) when its goal/context mentions decomposition keywords OR it is itself a
# batch delegate_task (multiple tasks).
_SUBTASK_HINTS = re.compile(
    r"\b(subtask|sub-task|subtask|teilaufgabe|unteraufgabe|split|break down|"
    r"zerlege|decompose|parallel|fan[- ]?out|mehrere|multiple|tasks?)\b",
    re.IGNORECASE,
)


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


def _extract_goal(tc: Any) -> str:
    """Best-effort goal extraction from a delegate_task call (single or batch)."""
    try:
        data = json.loads(_fn_args(tc)) if _fn_args(tc) else {}
    except Exception:
        return ""
    if "goal" in data:
        return str(data["goal"])
    if "tasks" in data and isinstance(data["tasks"], list):
        goals = [str(t.get("goal", "")) for t in data["tasks"] if isinstance(t, dict)]
        return " | ".join(g for g in goals if g)
    return ""


def _is_batch(tc: Any) -> bool:
    try:
        data = json.loads(_fn_args(tc)) if _fn_args(tc) else {}
    except Exception:
        return False
    return isinstance(data.get("tasks"), list) and len(data.get("tasks", [])) > 1


def _context_excerpt(agent) -> str:
    """Compact context excerpt: latest user intent + constraint lines.

    Pulled from the agent's conversation tail if available, otherwise empty.
    Never touches system_message.
    """
    tail: List[str] = []
    try:
        history = getattr(agent, "_conversation_history", None) or getattr(
            agent, "conversation_history", None
        )
        if history:
            # last few user/assistant turns
            for msg in history[-6:]:
                role = (msg.get("role") if isinstance(msg, dict) else None) or getattr(
                    msg, "role", None
                )
                content = (
                    msg.get("content") if isinstance(msg, dict) else None
                ) or getattr(msg, "content", "")
                if role in ("user", "system") and content:
                    tail.append(str(content)[-300:])
    except Exception:
        return ""
    return "\n".join(tail)


def plan_delegation(agent, tool_calls: List[Any]) -> Optional[SecretaryPlan]:
    """Build a SecretaryPlan from the (already gated) tool-call batch.

    Pure-ish: reads ``agent`` attributes (flags, depth, history) but mutates
    nothing except optionally setting ``agent._secretary_plan`` when called from
    the gate. Returns ``None`` when there is nothing to plan (no delegation
    calls in the batch).

    Args:
        agent: the AIAgent (read-only; we read ``_voice_comms``, ``_spawn_depth``).
        tool_calls: the batch after Stages A (dispatch) and B (clones).

    Returns:
        A :class:`SecretaryPlan`, or ``None`` if no delegatable calls exist.
    """
    if not tool_calls:
        return None

    # Only delegate_task calls are planned (the Secretary plans *which* agents
    # get *what* — non-delegation calls run in the main thread).
    deleg_calls = [tc for tc in tool_calls if _fn_name(tc) == "delegate_task"]
    if not deleg_calls:
        return None

    excerpt = _context_excerpt(agent)
    depth = getattr(agent, "_spawn_depth", 0)
    managed = bool(getattr(agent, "_voice_comms", False))  # Button 2 on

    # De-duplicate by goal signature (plan C: dedupe goals).
    seen: set = set()
    units: List[PlanUnit] = []
    for tc in deleg_calls:
        goal = _extract_goal(tc)
        sig = goal.strip().lower()
        if sig in seen:
            continue
        seen.add(sig)

        is_batch = _is_batch(tc)
        has_subtasks = bool(_SUBTASK_HINTS.search(goal)) or is_batch
        # Recursion guard (plan R1): orchestrator role only at root depth and
        # only for units that actually have sub-tasks.
        role = "orchestrator" if (managed and depth == 0 and has_subtasks) else "leaf"

        ctx = excerpt
        if managed:
            ctx = (ctx + "\n" + f"[secretary plan: {goal}]").strip()

        units.append(
            PlanUnit(
                goal=goal,
                context=ctx,
                role=role,
                priority=1 if role == "orchestrator" else 0,
                assignee_hint="orchestrator" if role == "orchestrator" else "",
            )
        )

    if not units:
        return None

    topology = "managed" if managed else "peer"
    # The Secretary's direct instruction to Hermes Agent: tells the agent how
    # it is orchestrating — this is the Secretary *acting*, not just planning.
    # It is consumed by the loop as a tool-result prefix (never system_message),
    # so it is a direct communication channel from the Secretary to Hermes Agent.
    orch_n = sum(1 for u in units if u.role == "orchestrator")
    if managed:
        directive = (
            f"Secretary (Managerin von Hermes Agent): {len(units)} Einheit(en) "
            f"geplant, {orch_n} als Orchestrator. Ich koordiniere die Agenten — "
            f"führe zuerst die priorisierten Einheiten aus, dann den Rest. "
            f"Ich bin die Kommunikationsschnittstelle zum Anwender: melde "
            f"Ergebnisse, Rückfragen und Blocker über mich, nicht einzeln."
        )
    elif getattr(agent, "_subagent_orchestration", False):
        # Crew armed, Secretary off: the sub-agents source their own work and
        # report straight back to Hermes Agent (no Managerin in between).
        directive = (
            f"Sub-Agenten-Crew (autonom, ohne Sekretärin): {len(units)} "
            f"Einheit(en) eigenständig übernommen. Die Crew holt sich Jobs "
            f"selbst bei Hermes Agent ab und meldet direkt an ihn zurück."
        )
    else:
        directive = (
            f"Secretary: {len(units)} Einheit(en) zur Peer-Synchronisation "
            f"vorgemerkt. Kein aktives Eingreifen (Button 2 aus)."
        )
    return SecretaryPlan(units=units, topology=topology, directive=directive)
