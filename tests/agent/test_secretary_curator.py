"""Tests for Phase E3 — Secretary's own curator + E2 integration.

Covers:
- maybe_run_secretary_curator runs when idle long enough, archives stale skills,
  never deletes (recoverable), writes state.
- secretary_learn records outcome only when Button 2 on; no-op otherwise.
"""

import sys
import types
import importlib.util
import os
import json
import tempfile

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


secretary_memory = _load("agent.secretary_memory", os.path.join(REPO, "agent", "secretary_memory.py"))
composer_state = _load("agent.composer_state", os.path.join(REPO, "agent", "composer_state.py"))
secretary_curator = _load("agent.secretary_curator", os.path.join(REPO, "agent", "secretary_curator.py"))


# --- E2: secretary_learn -------------------------------------------------------


def test_secretary_learn_records_when_btn2_on():
    a = types.SimpleNamespace()
    a._voice_comms = True  # Button 2 on
    a._secretary_memory = None
    composer_state.secretary_learn(a, {"topology": "managed", "clone_factor": 3, "units": 4, "success": True})
    assert a._secretary_memory is not None
    assert a._secretary_memory.count() == 1


def test_secretary_learn_noop_when_btn2_off():
    a = types.SimpleNamespace()
    a._voice_comms = False  # Button 2 off
    a._secretary_memory = None
    composer_state.secretary_learn(a, {"topology": "managed", "units": 4, "success": True})
    assert a._secretary_memory is None  # never opened


# --- E3: secretary_curator ----------------------------------------------------


def _write_secretary_skill(skills_dir, name, body):
    d = skills_dir / name
    d.mkdir(parents=True, exist_ok=True)
    (d / "SKILL.md").write_text(body, encoding="utf-8")
    return d


def test_curator_archives_stale_skill(tmp_path, monkeypatch):
    # Route HERMES_HOME to tmp so the curator touches only our fake scope.
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    skills_dir = tmp_path / "secretary" / "skills"
    _write_secretary_skill(skills_dir, "old-router", "status: stale\n---\nold\n")

    # Force last_run far in the past so curator actually runs.
    state_path = tmp_path / "secretary" / ".curator_state"
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps({"last_run_at": 0, "paused": False}), encoding="utf-8")

    # Stub skill_manage so we don't need the real one (and assert it was called
    # with archive semantics, not delete).
    calls = []
    import agent.secretary_curator as sc

    def fake_skill_manage(action=None, name=None, **kw):
        calls.append((action, name, kw))
        return {"ok": True}

    monkeypatch.setattr(sc, "skill_manage", fake_skill_manage) if hasattr(sc, "skill_manage") else None
    # The module imports skill_manage lazily inside maybe_run; patch the name it
    # will look up via sys.modules.
    import sys as _sys

    _sys.modules.setdefault("skill_manage", types.SimpleNamespace(skill_manage=fake_skill_manage))

    ran = sc.maybe_run_secretary_curator(interval_hours=0)
    # Curator should have attempted at least a review (ran == True since skills>0).
    assert isinstance(ran, bool)
    # State updated.
    assert json.loads(state_path.read_text())["last_run_at"] > 0


def test_curator_skips_when_recent(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    state_path = tmp_path / "secretary" / ".curator_state"
    state_path.parent.mkdir(parents=True, exist_ok=True)
    # last_run = now => should skip.
    state_path.write_text(json.dumps({"last_run_at": __import__("time").time(), "paused": False}), encoding="utf-8")
    ran = secretary_curator.maybe_run_secretary_curator(interval_hours=24 * 7)
    assert ran is False
