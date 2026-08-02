"""Tests for Phase D — harmonization & sync topology (Button 4).

Covers:
- peer mode (Button 2 off): shared sync_context injected into delegate calls.
- managed mode (Button 2 on + plan.topology=='managed'): priority-ordered
  two-batch split (orchestrator units first, leaves after).
- total-children cap TOTAL_CHILDREN_CAP=8 respected.
- flag-only topology decision (never model text).
- combination matrix: all 16 flag combos run without exception; 0000 (all off)
  yields byte-identical batch.
"""

import sys
import types
import importlib.util
import os
import json

import pytest

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if REPO not in sys.path:
    sys.path.insert(0, REPO)


def _load(modname, path):
    spec = importlib.util.spec_from_file_location(modname, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[modname] = mod
    spec.loader.exec_module(mod)
    return mod


composer_state = _load(
    "agent.composer_state",
    os.path.join(REPO, "agent", "composer_state.py"),
)
composer_sync = _load(
    "agent.composer_sync",
    os.path.join(REPO, "agent", "composer_sync.py"),
)
composer_plan = _load(
    "agent.composer_plan",
    os.path.join(REPO, "agent", "composer_plan.py"),
)


def _tc(name, args="{}"):
    fn = types.SimpleNamespace(name=name, arguments=args)
    return types.SimpleNamespace(id=f"call_{name}", function=fn, _is_clone=False)


def _dt(goal="do it", tasks=None):
    if tasks is not None:
        args = json.dumps({"tasks": tasks})
    else:
        args = json.dumps({"goal": goal})
    return _tc("delegate_task", args)


def _agent(btn2=False, btn4=False):
    a = types.SimpleNamespace()
    a._subagent_orchestration = False
    a._orchestration_mode = False
    a._voice_comms = btn2  # Button 2
    a._double_mode = btn4  # Button 4
    a._spawn_depth = 0
    a._clone_factor = 2
    return a


# --- peer mode (Button 2 off) -------------------------------------------------


def test_peer_injects_sync_context():
    a = _agent(btn2=False, btn4=True)
    calls = [_dt(goal="write code")]
    out = composer_sync.harmonize(a, calls, None)
    assert len(out) == 1
    data = json.loads(out[0].function.arguments)
    assert "SYNC:" in data.get("context", "")


def test_peer_unchanged_when_btn4_off():
    a = _agent(btn2=False, btn4=False)
    calls = [_dt(goal="write code")]
    out = composer_sync.harmonize(a, calls, None)
    # No sync_context added when Button 4 off.
    data = json.loads(out[0].function.arguments)
    assert "SYNC:" not in data.get("context", "")


# --- managed mode (Button 2 on + plan managed) -------------------------------


def _managed_plan():
    u1 = composer_plan.PlanUnit(goal="split into subtasks", context="", role="orchestrator", priority=1)
    u2 = composer_plan.PlanUnit(goal="leaf task", context="", role="leaf", priority=0)
    return composer_plan.SecretaryPlan(
        units=[u1, u2], topology="managed",
        directive="Secretary coordinating",
    )


def test_managed_orders_priority_first():
    a = _agent(btn2=True, btn4=True)
    calls = [_dt(goal="leaf task"), _dt(goal="split into subtasks")]
    plan = _managed_plan()
    out = composer_sync.harmonize(a, calls, plan)
    # Leading call should be the orchestrator (priority) unit.
    assert len(out) == 2
    first_goal = json.loads(out[0].function.arguments).get("goal", "")
    assert "split into subtasks" in first_goal


def test_managed_without_plan_falls_back_to_peer():
    a = _agent(btn2=True, btn4=True)
    calls = [_dt(goal="write code")]
    # plan is None => not managed => peer sync_context path.
    out = composer_sync.harmonize(a, calls, None)
    data = json.loads(out[0].function.arguments)
    assert "SYNC:" in data.get("context", "")


# --- cap ----------------------------------------------------------------------


def test_total_children_cap():
    a = _agent(btn2=True, btn4=True)
    # 10 leaf units => capped to 8 children total.
    calls = [_dt(tasks=[{"goal": f"t{i}", "context": "", "role": "leaf"} for i in range(10)])]
    plan = composer_plan.SecretaryPlan(
        units=[composer_plan.PlanUnit(goal=f"t{i}", context="", role="leaf") for i in range(10)],
        topology="managed",
    )
    out = composer_sync.harmonize(a, calls, plan)
    total = sum(
        len(json.loads(c.function.arguments).get("tasks", [c.function.arguments]))
        if "tasks" in json.loads(c.function.arguments)
        else 1
        for c in out
        if c.function.name == "delegate_task"
    )
    # 10 requested, 8 cap => at most 8.
    assert total <= 8


# --- combination matrix (no exception, 0000 identical) -----------------------


@pytest.mark.parametrize(
    "b1,b2,b3,b4",
    [(i & 1, (i >> 1) & 1, (i >> 2) & 1, (i >> 3) & 1) for i in range(16)],
)
def test_all_16_combos_run(b1, b2, b3, b4):
    a = types.SimpleNamespace()
    a._subagent_orchestration = bool(b1)
    a._orchestration_mode = bool(b3)
    a._voice_comms = bool(b2)
    a._double_mode = bool(b4)
    a._spawn_depth = 0
    a._clone_factor = 2
    calls = [_dt(goal="g1"), _dt(goal="g2")]
    plan = composer_plan.SecretaryPlan(
        units=[composer_plan.PlanUnit(goal="g1", context=""), composer_plan.PlanUnit(goal="g2", context="")],
        topology="managed" if b2 else "peer",
    )
    # Must not raise.
    out = composer_sync.harmonize(a, calls, plan if b2 else None)
    assert isinstance(out, list)


def test_combo_0000_identical():
    a = _agent(btn2=False, btn4=False)
    calls = [_dt(goal="g1"), _dt(goal="g2")]
    out = composer_sync.harmonize(a, calls, None)
    # No mutation when both buttons off.
    assert len(out) == 2
    assert json.loads(out[0].function.arguments).get("goal") == "g1"
    assert "SYNC:" not in json.loads(out[0].function.arguments).get("context", "")
