"""Tests for Phase C — Secretary / planning layer (Button 2).

Covers:
- plan_delegation produces a plan for delegation batches (peer topology).
- Button 2 on => topology "managed", orchestrator role assigned only at root
  depth and only for units with sub-task hints (recursion guard R1).
- Goal de-duplication.
- No system_message mutation (Invariante 2).
- Plan is deterministic for identical input.
- No delegation calls => plan is None (no mutation of call list).
- Gate integration: agent._secretary_plan is set, call list unchanged.
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


def _agent(button2=False, spawn_depth=0):
    a = types.SimpleNamespace()
    a._subagent_orchestration = False
    a._orchestration_mode = False
    a._voice_comms = button2  # Button 2
    a._double_mode = False
    a._spawn_depth = spawn_depth
    a._clone_factor = 2
    a._secretary_plan = None
    a._conversation_history = None
    return a


# --- plan_delegation pure-function tests ---------------------------------------


def test_no_delegation_calls_returns_none():
    a = _agent(button2=True)
    calls = [_tc("web_search", '{"q": "x"}') for _ in range(3)]
    plan = composer_plan.plan_delegation(a, calls)
    assert plan is None


def test_peer_topology_without_button2():
    a = _agent(button2=False)
    calls = [_dt(goal="write a function")]
    plan = composer_plan.plan_delegation(a, calls)
    assert plan is not None
    assert plan.topology == "peer"
    # No orchestrator role without Button 2.
    assert all(u.role == "leaf" for u in plan.units)


def test_managed_topology_with_button2():
    a = _agent(button2=True)
    calls = [_dt(goal="break down the task into subtasks")]
    plan = composer_plan.plan_delegation(a, calls)
    assert plan is not None
    assert plan.topology == "managed"
    # Sub-task hint present + root depth => orchestrator.
    assert any(u.role == "orchestrator" for u in plan.units)


def test_orchestrator_only_at_root_depth():
    # Button 2 on, but spawn_depth > 0 => no orchestrator role (R1 guard).
    a = _agent(button2=True, spawn_depth=1)
    calls = [_dt(goal="split into multiple subtasks")]
    plan = composer_plan.plan_delegation(a, calls)
    assert plan is not None
    assert all(u.role == "leaf" for u in plan.units)


def test_dedup_goals():
    a = _agent(button2=True)
    calls = [_dt(goal="same goal"), _dt(goal="same goal"), _dt(goal="other goal")]
    plan = composer_plan.plan_delegation(a, calls)
    assert plan is not None
    assert len(plan.units) == 2  # duplicate "same goal" collapsed


def test_plan_deterministic():
    a = _agent(button2=True)
    calls = [_dt(goal="decompose this into subtasks")]
    p1 = composer_plan.plan_delegation(a, calls)
    p2 = composer_plan.plan_delegation(a, calls)
    assert p1.to_json() == p2.to_json()


def test_no_system_message_mutation():
    a = _agent(button2=True)
    a.system_message = "STABLE_MARKER"
    a._conversation_history = [
        {"role": "user", "content": "please break down the build into subtasks"}
    ]
    calls = [_dt(goal="break down the build into subtasks")]
    composer_plan.plan_delegation(a, calls)
    assert a.system_message == "STABLE_MARKER"


# --- gate integration -----------------------------------------------------------


def test_gate_sets_secretary_plan_no_call_mutation():
    a = _agent(button2=True)
    a._conversation_history = [
        {"role": "user", "content": "split the migration into subtasks"}
    ]
    calls = [_dt(goal="split the migration into subtasks")]
    out = composer_state.apply_composer_gates(a, calls)
    # Call list unchanged (Button 1 off => nothing delegated, plan is display-only).
    assert len(out) == 1
    assert out[0].function.name == "delegate_task"
    # Plan exposed on agent.
    assert a._secretary_plan is not None
    assert a._secretary_plan.topology == "managed"
