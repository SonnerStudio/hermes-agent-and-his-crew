"""Tests for module_scores (live learning-score gauge).

Covers:
- empty memory => all modules score 0, trend 'neu'.
- recorded decisions => score 0-100, decisions count, trend string.
- consistency raises score (stable topology beats volatile).
- volume saturates (many decisions don't exceed 100).
"""

import sys
import os
import tempfile

import pytest

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if REPO not in sys.path:
    sys.path.insert(0, REPO)

import importlib.util


def _load(modname, path):
    spec = importlib.util.spec_from_file_location(modname, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[modname] = mod
    spec.loader.exec_module(mod)
    return mod


secretary_memory = _load(
    "agent.secretary_memory",
    os.path.join(REPO, "agent", "secretary_memory.py"),
)


@pytest.fixture
def store(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    return secretary_memory.SecretaryMemory(path=tmp_path / "secretary" / "memory.json")


def test_empty_scores_zero(store):
    scores = store.module_scores()
    for m in ("subagent", "planner", "secretary"):
        assert scores[m]["score"] == 0
        assert scores[m]["decisions"] == 0
        assert scores[m]["trend"] == "neu"


def test_recorded_scores_nonzero(store):
    for _ in range(5):
        store.sync_turn({"stage": "subagent", "topology": "peer", "clone_factor": 1, "units": 3, "success": True})
    s = store.module_scores()["subagent"]
    assert s["decisions"] == 5
    assert 0 <= s["score"] <= 100
    assert s["trend"] in ("steigend", "stabil", "fallend")


def test_consistency_raises_score(store):
    # Stable topology => high consistency => higher score than volatile.
    for _ in range(8):
        store.sync_turn({"stage": "planner", "topology": "managed", "clone_factor": 3, "units": 4, "success": True})
    stable = store.module_scores()["planner"]["score"]

    # Volatile: alternate topologies.
    for i in range(8):
        topo = "managed" if i % 2 == 0 else "peer"
        store.sync_turn({"stage": "subagent", "topology": topo, "clone_factor": 1, "units": 3, "success": True})
    volatile = store.module_scores()["subagent"]["score"]
    assert stable >= volatile  # stable preference scores higher


def test_volume_saturates(store):
    for _ in range(60):
        store.sync_turn({"stage": "secretary", "topology": "managed", "clone_factor": 2, "units": 4, "success": True})
    s = store.module_scores()["secretary"]["score"]
    assert s <= 100  # never exceeds cap
    assert s >= 50   # many consistent decisions => solid score
