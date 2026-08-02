#!/usr/bin/env python3
"""Smoke + unit tests for mic-level.py (Hermes-Sekretärin mic monitor).

Run:  python3 -m pytest plugins/hermes-sekretaerin/test_mic_level.py
Or:   python3 plugins/hermes-sekretaerin/test_mic_level.py
"""
import importlib.util
import os
import sys
import unittest
from types import SimpleNamespace
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "mic-level.py")


def load_module():
    spec = importlib.util.spec_from_file_location("mic_level_test", SRC)
    assert spec is not None, f"cannot load spec for {SRC}"
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod


class TestMicLevel(unittest.TestCase):
    def setUp(self):
        self.mod = load_module()

    def test_dev_candidates_present_and_ordered(self):
        # Headset name must be probed first (avfoundation "Name:" syntax),
        # then the index, then generic fallbacks.
        cands = self.mod.DEV_CANDIDATES
        self.assertIn("Externes Mikrofon:", cands)
        self.assertEqual(cands[0], "Externes Mikrofon:")
        self.assertIn(":0", cands)
        self.assertIn(":default", cands)

    def test_read_level_parses_mean_volume(self):
        # ffmpeg volumedetect prints: [Parsed_volumedetect ...] mean_volume=-12.3 dB
        fake_stderr = "..." * 3 + "\n[Parsed_volumedetect_1 @ 0x0] mean_volume=-12.34 dB\n"
        with mock.patch.object(self.mod.subprocess, "run") as run:
            run.return_value = SimpleNamespace(stderr=fake_stderr, returncode=0)
            level, ok = self.mod.read_level()
        self.assertTrue(ok)
        # (-12.34 + 50) / 50 = 0.7532 -> *100 = 75.3
        self.assertAlmostEqual(level, 75.3, places=1)

    def test_read_level_handles_silent_device(self):
        # Device opens but no speech -> no mean_volume line -> 0.0 but ok=True.
        with mock.patch.object(self.mod.subprocess, "run") as run:
            run.return_value = SimpleNamespace(stderr="ffmpeg version...\n", returncode=0)
            level, ok = self.mod.read_level()
        self.assertTrue(ok)
        self.assertEqual(level, 0.0)

    def test_read_level_no_device_returns_false(self):
        # avfoundation cannot open any candidate -> Error opening -> ok=False.
        with mock.patch.object(self.mod.subprocess, "run") as run:
            run.return_value = SimpleNamespace(
                stderr="avfoundation: Error opening 'Externes Mikrofon:': no such device",
                returncode=1,
            )
            level, ok = self.mod.read_level()
        self.assertFalse(ok)
        self.assertEqual(level, 0.0)

    def test_read_level_tries_next_candidate_on_failure(self):
        # First candidate fails to open, second succeeds with a level.
        calls = []

        def fake_run(cmd, **kw):
            calls.append(cmd)
            if "Externes Mikrofon:" in cmd:
                return SimpleNamespace(stderr="Error opening 'Externes Mikrofon:'", returncode=1)
            return SimpleNamespace(stderr="mean_volume=-20.0 dB\n", returncode=0)

        with mock.patch.object(self.mod.subprocess, "run", side_effect=fake_run):
            level, ok = self.mod.read_level()
        self.assertTrue(ok)
        # Probed at least two candidates (headset first, then a fallback).
        self.assertGreaterEqual(len(calls), 2)


if __name__ == "__main__":
    unittest.main()
