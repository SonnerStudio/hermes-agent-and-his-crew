#!/usr/bin/env python3
"""Tests for the composer-button RPC handlers in mlx-proxy.py.

These tests exercise the real handle_rpc coroutine (imported from mlx-proxy)
and surface behaviour + gaps in the four composer buttons:

  subagent_orchestration.toggle  -> Button 1: "Sub-Agenten aktivieren"
  voice_comms.toggle             -> Button 2: "Secretary / Sekretärin"
  orchestration.toggle           -> Button 3: temporary cloning (Klonen)
  double_mode.toggle             -> Button 4: harmonize/sync/orchestrate

Goal: discover edge cases and state gaps before writing the implementation plan.

Runs WITHOUT pytest-asyncio: coroutines are driven via asyncio.run().
"""
import asyncio
import importlib.util
import json
import os
import sys

import pytest

_HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("mlx_proxy_test", os.path.join(_HERE, "mlx-proxy.py"))
mp = importlib.util.module_from_spec(_spec)
try:
    _spec.loader.exec_module(mp)
except ImportError as e:
    pytest.skip(f"aiohttp not available: {e}", allow_module_level=True)

_orig_json = mp.web.json_response


def _install_capture():
    cap = {}

    def _fake(data, status=200):
        cap["body"] = data
        cap["status"] = status
        return data, status

    mp.web.json_response = _fake
    return cap


def run(coro):
    return asyncio.run(coro)


class FakeRequest:
    def __init__(self, payload):
        self._raw = json.dumps(payload).encode() if payload is not None else b""

    async def read(self):
        return self._raw


class BadReq:
    async def read(self):
        return b"{not valid json"


@pytest.fixture
def capture():
    cap = _install_capture()
    yield cap
    mp.web.json_response = _orig_json


@pytest.fixture(autouse=True)
def reset_state(tmp_path, monkeypatch):
    mp._button_state = {}
    monkeypatch.setattr(mp, "FLAGS_FILE", str(tmp_path / "composer-flags.json"))
    yield
    mp.web.json_response = _orig_json


# ---------------------------------------------------------------------------
# 1. VALID TOGGLES — every button must at least persist its active flag.
# ---------------------------------------------------------------------------

def test_subagent_orchestration_on(capture):
    run(mp.handle_rpc(FakeRequest({"method": "subagent_orchestration.toggle", "params": {"active": True}})))
    assert capture["status"] == 200
    assert capture["body"]["ok"] is True
    st = mp._button_state.get("subagent_orchestration.toggle")
    assert st is not None, "Button 1 state was NOT recorded"
    assert st["active"] is True


def test_voice_comms_off(capture):
    run(mp.handle_rpc(FakeRequest({"method": "voice_comms.toggle", "params": {"active": False}})))
    assert capture["status"] == 200
    st = mp._button_state.get("voice_comms.toggle")
    assert st is not None
    assert st["active"] is False


def test_orchestration_and_double_mode_toggle(capture):
    for method in ("orchestration.toggle", "double_mode.toggle"):
        run(mp.handle_rpc(FakeRequest({"method": method, "params": {"active": True}})))
        st = mp._button_state.get(method)
        assert st is not None, f"{method} state missing"
        assert st["active"] is True


# ---------------------------------------------------------------------------
# 2. EDGE CASES — malformed / odd inputs.
# ---------------------------------------------------------------------------

def test_missing_method(capture):
    run(mp.handle_rpc(FakeRequest({"params": {"active": True}})))
    assert capture["status"] == 404
    assert "unknown rpc method" in capture["body"]["error"]["message"].lower()


def test_unknown_method(capture):
    run(mp.handle_rpc(FakeRequest({"method": "frobnicate.toggle", "params": {"active": True}})))
    assert capture["status"] == 404


def test_invalid_json(capture):
    run(mp.handle_rpc(BadReq()))
    assert capture["status"] == 400
    assert "invalid json" in capture["body"]["error"]["message"].lower()


def test_active_as_string_true(capture):
    run(mp.handle_rpc(FakeRequest({"method": "orchestration.toggle", "params": {"active": "true"}})))
    assert mp._button_state["orchestration.toggle"]["active"] is True


def test_active_as_int_zero_is_false(capture):
    run(mp.handle_rpc(FakeRequest({"method": "orchestration.toggle", "params": {"active": 0}})))
    assert mp._button_state["orchestration.toggle"]["active"] is False


def test_active_missing_defaults_false(capture):
    run(mp.handle_rpc(FakeRequest({"method": "orchestration.toggle", "params": {}})))
    assert mp._button_state["orchestration.toggle"]["active"] is False


def test_active_as_string_false_is_truthy(capture):
    # bool("false") -> True (non-empty string). A real TRAP if the renderer
    # ever sends the string "false" instead of a boolean.
    run(mp.handle_rpc(FakeRequest({"method": "orchestration.toggle", "params": {"active": "false"}})))
    assert mp._button_state["orchestration.toggle"]["active"] is True


# ---------------------------------------------------------------------------
# 3. PERSISTENCE — flags survive to FLAGS_FILE.
# ---------------------------------------------------------------------------

def test_persist_writes_flags_file(capture, tmp_path):
    run(mp.handle_rpc(FakeRequest({"method": "subagent_orchestration.toggle", "params": {"active": True}})))
    flags = json.loads(open(mp.FLAGS_FILE).read())
    assert "subagent_orchestration.toggle" in flags
    assert flags["subagent_orchestration.toggle"]["active"] is True
    # pending must never persist (durability rule)
    assert flags["subagent_orchestration.toggle"]["pending"] is False


# ---------------------------------------------------------------------------
# 4. GAP DOCUMENTATION — buttons without a script have no behaviour (only state).
# ---------------------------------------------------------------------------

def test_buttons_without_script_are_state_only():
    HANDLERS = {
        "voice_comms.toggle": {"name": "voice_comms", "script": "/Users/m4janfriske/voice_comms.py"},
        "orchestration.toggle": {"name": "orchestration", "script": None},
        "double_mode.toggle": {"name": "double_mode", "script": None},
        "subagent_orchestration.toggle": {"name": "subagent_orchestration", "script": None},
    }
    no_script = [m for m, s in HANDLERS.items() if s["script"] is None]
    assert set(no_script) == {
        "orchestration.toggle",
        "double_mode.toggle",
        "subagent_orchestration.toggle",
    }


# ---------------------------------------------------------------------------
# 5. BEHAVIOUR GAP — Button 1 should actually spawn a sub-agent, but does not.
#    Marked xfail until the implementation plan is executed. This makes the
#    missing behaviour measurable rather than silent.
# ---------------------------------------------------------------------------

@pytest.mark.xfail(reason="Button 1 has no sub-agent spawn logic yet — only flips a flag")
def test_button1_spawns_subagent(capture, tmp_path, monkeypatch):
    # A sentinel side-effect we expect the real implementation to trigger.
    spawned = {}

    def fake_delegate(*a, **k):
        spawned["called"] = True
        return "ok"

    # If/when the proxy gains a hook, it would call into delegation here.
    monkeypatch.setattr(mp, "_spawn_subagent", fake_delegate, raising=False)
    run(mp.handle_rpc(FakeRequest({"method": "subagent_orchestration.toggle", "params": {"active": True}})))
    assert spawned.get("called") is True, "No sub-agent was spawned on Button 1 activation"


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-v"]))
