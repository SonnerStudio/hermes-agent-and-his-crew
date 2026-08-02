"""Tests for the Composer button-state bridge (agent/composer_state.py).

Covers:
- Strict bool coercion (the ``bool("false") == True`` trap is avoided).
- Isolation: one corrupt flag never breaks the others.
- Missing file -> all flags False (proxy not running is safe).
- Gate logic: non-breaking default, clone marking when Button 1 + 3 armed.
"""

import json
import tempfile
from types import SimpleNamespace

import pytest

from agent.composer_state import (
    _coerce_bool,
    apply_composer_gates,
    get_composer_flags,
)


def test_coerce_bool_traps():
    # The classic Python trap: bool("false") is True. We must avoid it.
    assert _coerce_bool("false") is False
    assert _coerce_bool("true") is True
    assert _coerce_bool("False") is False
    assert _coerce_bool("True") is True
    assert _coerce_bool(0) is False
    assert _coerce_bool(1) is True
    assert _coerce_bool(True) is True
    assert _coerce_bool(False) is False
    assert _coerce_bool("yes") is True
    assert _coerce_bool("no") is False
    assert _coerce_bool("") is False
    # Unknown non-empty string -> falsy (safe default, not truthy).
    assert _coerce_bool("maybe") is False


def test_get_flags_missing_file_all_false():
    flags = get_composer_flags("/nonexistent/composer-flags.json")
    assert all(v is False for v in flags.values())
    assert set(flags.keys()) == {
        "subagent_orchestration",
        "voice_comms",
        "orchestration_mode",
        "double_mode",
    }


def test_get_flags_parses_mixed_types(tmp_path):
    p = tmp_path / "composer-flags.json"
    p.write_text(json.dumps({
        "subagent_orchestration.toggle": {"active": True},
        "voice_comms.toggle": {"active": "true"},
        "orchestration.toggle": {"active": 0},
        "double_mode.toggle": {"active": "false"},
    }))
    flags = get_composer_flags(str(p))
    assert flags["subagent_orchestration"] is True
    assert flags["voice_comms"] is True
    assert flags["orchestration_mode"] is False
    assert flags["double_mode"] is False


def test_get_flags_corrupt_json_safe(tmp_path):
    p = tmp_path / "composer-flags.json"
    p.write_text("{ not valid json")
    flags = get_composer_flags(str(p))
    assert all(v is False for v in flags.values())


def test_gate_all_off_is_noop():
    agent = SimpleNamespace(_subagent_orchestration=False, _orchestration_mode=False)
    calls = [
        SimpleNamespace(function=SimpleNamespace(name="delegate_task", arguments="{}")),
        SimpleNamespace(function=SimpleNamespace(name="web_search", arguments="{}")),
    ]
    out = apply_composer_gates(agent, calls)
    assert out == calls  # unchanged


def test_gate_clone_inert_without_subagent():
    agent = SimpleNamespace(_subagent_orchestration=False, _orchestration_mode=True)
    calls = [
        SimpleNamespace(function=SimpleNamespace(name="delegate_task", arguments="{}")),
        SimpleNamespace(function=SimpleNamespace(name="web_search", arguments="{}")),
    ]
    out = apply_composer_gates(agent, calls)
    # clone only matters when sub-agent orchestration is armed; off -> no-op.
    assert len(out) == 2


def test_gate_clone_marks_duplicates():
    agent = SimpleNamespace(_subagent_orchestration=True, _orchestration_mode=True)
    dup = [
        SimpleNamespace(function=SimpleNamespace(name="delegate_task", arguments='{"g":"same"}')),
        SimpleNamespace(function=SimpleNamespace(name="delegate_task", arguments='{"g":"same"}')),
    ]
    out = apply_composer_gates(agent, dup)
    assert len(out) == 2
    assert hasattr(out[1], "_is_clone")
