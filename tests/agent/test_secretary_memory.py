"""Tests for Phase E1 — Secretary's own learning memory.

Covers:
- sync_turn records outcomes + persists atomically.
- get_learned_routing returns a preference per unit-count bucket.
- missing file is safe (starts empty).
- learned preference reflects recorded successes.
- bounded history (last 200).
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


secretary_memory = _load(
    "agent.secretary_memory",
    os.path.join(REPO, "agent", "secretary_memory.py"),
)


@pytest.fixture
def store():
    d = tempfile.mkdtemp()
    p = os.path.join(d, "memory.json")
    return secretary_memory.SecretaryMemory(path=os.path.join(d, "memory.json"))


def test_empty_store_safe(store):
    assert store.count() == 0
    assert store.get_learned_routing(3)["topology"] == "peer"


def test_sync_turn_records_and_persists(store):
    store.sync_turn({"topology": "managed", "clone_factor": 3, "units": 4, "success": True})
    assert store.count() == 1
    # File written atomically.
    assert os.path.exists(store._path)
    with open(store._path, encoding="utf-8") as fh:
        data = json.load(fh)
    assert len(data["outcomes"]) == 1
    assert data["outcomes"][0]["topology"] == "managed"


def test_learned_routing_reflects_success(store):
    # 5 successful "managed" delegations at units=4 => mid bucket prefers managed.
    for _ in range(5):
        store.sync_turn({"topology": "managed", "clone_factor": 3, "units": 4, "success": True})
    routing = store.get_learned_routing(4)
    assert routing["topology"] == "managed"
    assert routing["clone_factor"] == 3


def test_failed_outcomes_excluded_from_learning(store):
    # All failures => no learning signal => default peer.
    for _ in range(3):
        store.sync_turn({"topology": "managed", "units": 4, "success": False})
    routing = store.get_learned_routing(4)
    assert routing["topology"] == "peer"  # default, no success recorded


def test_bounded_history(store):
    for i in range(250):
        store.sync_turn({"topology": "peer", "units": 1 + (i % 8), "success": True})
    assert store.count() == 200  # capped


def test_missing_file_safe(tmp_path):
    p = tmp_path / "nope" / "memory.json"
    sm = secretary_memory.SecretaryMemory(path=p)
    assert sm.count() == 0
    # sync_turn creates the dir + file.
    sm.sync_turn({"topology": "peer", "units": 2, "success": True})
    assert p.exists()
