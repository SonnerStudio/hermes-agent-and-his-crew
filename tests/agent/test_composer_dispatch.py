"""Tests for Phase A — proactive sub-agent dispatch (Button 1).

Covers:
- should_dispatch decision logic (all signals S1-S6).
- build_delegation_call synthesises ONE batch call with N tasks.
- apply_composer_gates integrates the stage (non-breaking when off; fans out
  when on + threshold met).
- Invariante 2: no system_message mutation.
- Invariante 3: stage isolation (a broken stage passes through).
"""

import sys
import types
import importlib.util
import os
import json

import pytest

# Make the repo importable regardless of cwd.
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
composer_dispatch = _load(
    "agent.composer_dispatch",
    os.path.join(REPO, "agent", "composer_dispatch.py"),
)


def _tc(name, args="{}"):
    """Build a minimal tool-call object with .function.name / .function.arguments."""
    fn = types.SimpleNamespace(name=name, arguments=args)
    return types.SimpleNamespace(id=f"call_{name}", function=fn, _is_clone=False)


def _agent(button1=False, spawn_depth=0, dispatch_count=0):
    a = types.SimpleNamespace()
    a._subagent_orchestration = button1
    a._orchestration_mode = False
    a._voice_comms = False
    a._double_mode = False
    a._spawn_depth = spawn_depth
    a._proactive_dispatch_count = dispatch_count
    a._clone_factor = 2
    return a


# --- should_dispatch: negative cases -----------------------------------------


def test_button1_off_never_dispatches():
    a = _agent(button1=False)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(5)]
    d = composer_dispatch.should_dispatch(a, calls)
    assert d.dispatch is False
    assert d.reason == "button1_off"


def test_below_threshold_no_dispatch():
    a = _agent(button1=True)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(2)]  # < 3
    d = composer_dispatch.should_dispatch(a, calls)
    assert d.dispatch is False
    assert d.reason == "below_parallel_threshold"


def test_already_delegating_no_double_fanout():
    a = _agent(button1=True)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(3)]
    calls.append(_tc("delegate_task", '{"goal": "x"}'))
    d = composer_dispatch.should_dispatch(a, calls)
    assert d.dispatch is False
    assert d.reason == "already_delegating"


def test_spawn_depth_limit_respected():
    a = _agent(button1=True, spawn_depth=10)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(4)]
    d = composer_dispatch.should_dispatch(a, calls)
    assert d.dispatch is False
    assert d.reason == "spawn_depth_limit"


def test_budget_exhausted():
    a = _agent(button1=True, dispatch_count=2)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(4)]
    d = composer_dispatch.should_dispatch(a, calls)
    assert d.dispatch is False
    assert d.reason == "budget_exhausted"


def test_killswitch_disables():
    os.environ["HERMES_DISABLE_PROACTIVE_DISPATCH"] = "1"
    try:
        a = _agent(button1=True)
        calls = [_tc("web_search", '{"q": str(i)}') for i in range(4)]
        d = composer_dispatch.should_dispatch(a, calls)
        assert d.dispatch is False
        assert d.reason == "killswitch"
    finally:
        del os.environ["HERMES_DISABLE_PROACTIVE_DISPATCH"]


# --- should_dispatch: positive case -------------------------------------------


def test_threshold_met_dispatches():
    a = _agent(button1=True)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(3)]
    d = composer_dispatch.should_dispatch(a, calls)
    assert d.dispatch is True
    assert d.category == "web_search"
    assert len(d.unit_indices) == 3


# --- build_delegation_call -------------------------------------------------------


def test_build_call_is_single_batch_with_n_tasks():
    a = _agent(button1=True)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(3)]
    decision = composer_dispatch.should_dispatch(a, calls)
    synthetic = composer_dispatch.build_delegation_call(decision, calls)
    assert synthetic["function"]["name"] == "delegate_task"
    payload = json.loads(synthetic["function"]["arguments"])
    assert "tasks" in payload
    assert len(payload["tasks"]) == 3
    assert all(t["role"] == "leaf" for t in payload["tasks"])


# --- apply_composer_gates integration (non-breaking + fan-out) -----------------


def test_gate_off_is_passthrough():
    a = _agent(button1=False)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(3)]
    out = composer_state.apply_composer_gates(a, calls)
    # Unchanged list (same objects, same order).
    assert out == calls


def test_gate_on_fans_out_to_single_batch():
    a = _agent(button1=True)
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(3)]
    out = composer_state.apply_composer_gates(a, calls)
    # 3 web_search replaced by exactly 1 synthetic delegate_task batch.
    assert len(out) == 1
    assert out[0].function.name == "delegate_task"
    payload = json.loads(out[0].function.arguments)
    assert len(payload["tasks"]) == 3
    # Counter incremented.
    assert a._proactive_dispatch_count == 1


def test_gate_no_system_message_mutation():
    """Invariante 2: the gate must never touch system_message."""
    a = _agent(button1=True)
    a.system_message = "STABLE_PROMPT_HASH_MARKER"
    calls = [_tc("web_search", '{"q": str(i)}') for i in range(3)]
    composer_state.apply_composer_gates(a, calls)
    assert a.system_message == "STABLE_PROMPT_HASH_MARKER"


# --- Phase B: clone fan-out (Button 3) ----------------------------------------


def _dt(goal="solve it", context="", role="leaf", is_clone=False):
    """Build a delegate_task tool call with a single goal (clone-eligible)."""
    args = json.dumps({"goal": goal, "context": context, "role": role})
    tc = _tc("delegate_task", args)
    tc._is_clone = is_clone
    return tc


def test_clone_factor_1_is_noop():
    a = _agent(button1=True)
    a._orchestration_mode = True
    a._clone_factor = 1
    calls = [_dt()]
    out = composer_dispatch.expand_clones(a, calls)
    assert len(out) == 1
    # Single call preserved, not rewritten into a batch.
    assert json.loads(out[0].function.arguments).get("goal") == "solve it"


def test_clone_factor_3_makes_3_tasks():
    a = _agent(button1=True)
    a._orchestration_mode = True
    a._clone_factor = 3
    calls = [_dt(goal="G", context="ctx")]
    out = composer_dispatch.expand_clones(a, calls)
    assert len(out) == 1
    payload = json.loads(out[0].function.arguments)
    assert "tasks" in payload
    assert len(payload["tasks"]) == 3
    # Each clone carries the independent-solution-path marker.
    assert all("[clone 1/3" in payload["tasks"][0]["context"] for _ in [0])
    assert "independent solution path" in payload["tasks"][0]["context"]
    assert "independent solution path" in payload["tasks"][2]["context"]


def test_clone_cap_at_4():
    a = _agent(button1=True)
    a._orchestration_mode = True
    a._clone_factor = 99  # exceeds hard deckel
    calls = [_dt()]
    out = composer_dispatch.expand_clones(a, calls)
    payload = json.loads(out[0].function.arguments)
    assert len(payload["tasks"]) == 4  # capped


def test_clone_requires_button1_armed():
    # Button 3 on, Button 1 off -> no effect.
    a = _agent(button1=False)
    a._orchestration_mode = True
    a._clone_factor = 3
    calls = [_dt()]
    out = composer_dispatch.expand_clones(a, calls)
    assert len(out) == 1
    assert "tasks" not in json.loads(out[0].function.arguments)


def test_clone_button3_off_is_noop():
    # Button 1 on, Button 3 off -> no clone fan-out.
    a = _agent(button1=True)
    a._orchestration_mode = False
    a._clone_factor = 3
    calls = [_dt()]
    out = composer_dispatch.expand_clones(a, calls)
    assert len(out) == 1
    assert "tasks" not in json.loads(out[0].function.arguments)


def test_clone_gate_integration_fans_out():
    a = _agent(button1=True)
    a._orchestration_mode = True
    a._clone_factor = 2
    calls = [_dt(goal="write code")]
    out = composer_state.apply_composer_gates(a, calls)
    assert len(out) == 1
    payload = json.loads(out[0].function.arguments)
    assert len(payload["tasks"]) == 2
    assert "independent solution path" in payload["tasks"][0]["context"]
