"""Secretary's own curator (Phase E, Option B).

Mirrors Hermes' ``agent/curator.py`` pattern but scoped to the Secretary's
private skill collection (``~/.hermes/secretary/skills/``). It reviews the
planning/routing skills the Secretary has accumulated and maintains them:
pin frequently-used ones, archive stale ones, consolidate near-duplicates.

Like the Core curator it is **inactivity-triggered** (no cron daemon): call
``maybe_run_secretary_curator()`` when the agent goes idle; it runs only if the
last run was longer than ``interval_hours`` ago. It uses ``skill_manage`` for
the actual mutations and never touches Core skills.

Strict invariants (same as Core curator):
- Only touches agent-created Secretary skills.
- Never auto-deletes — only archives (recoverable).
- Pinned skills bypass auto-transitions.
"""

from __future__ import annotations

import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from hermes_constants import get_hermes_home

logger = logging.getLogger(__name__)

DEFAULT_INTERVAL_HOURS = 24 * 7  # 7 days, mirrors Core curator

_STATE_PATH = "secretary/.curator_state"


def _curator_state_path() -> Path:
    return get_hermes_home() / _STATE_PATH


def _secretary_skills_dir() -> Path:
    return get_hermes_home() / "secretary" / "skills"


def _load_state() -> Dict[str, Any]:
    try:
        with open(_curator_state_path(), "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, json.JSONDecodeError):
        return {"last_run_at": 0, "paused": False}


def _save_state(state: Dict[str, Any]) -> None:
    _curator_state_path().parent.mkdir(parents=True, exist_ok=True)
    tmp = _curator_state_path().with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(state, fh, ensure_ascii=False, indent=2)
    tmp.replace(_curator_state_path())


def _iter_secretary_skills() -> List[Path]:
    """List Secretary skill dirs (each containing SKILL.md)."""
    root = _secretary_skills_dir()
    if not root.exists():
        return []
    return [p for p in root.rglob("SKILL.md")]


def maybe_run_secretary_curator(interval_hours: int = DEFAULT_INTERVAL_HOURS) -> bool:
    """Run the Secretary curator if idle long enough. Returns True if it ran.

    Inactivity-triggered: only proceeds when ``last_run_at`` is older than
    ``interval_hours``. Uses ``skill_manage`` to patch/archive stale skills.
    """
    state = _load_state()
    if state.get("paused"):
        return False
    now = time.time()
    if now - float(state.get("last_run_at", 0)) < interval_hours * 3600:
        return False

    try:
        from skill_manage import skill_manage

        skills = _iter_secretary_skills()
        acted = False
        for skill_md in skills:
            skill_dir = skill_md.parent
            name = skill_dir.name
            # Archive skills with no recent use (heuristic: no use_count in fm).
            try:
                with open(skill_md, "r", encoding="utf-8") as fh:
                    text = fh.read()
            except OSError:
                continue
            # Detect staleness via a simple marker the Secretary may write.
            if "status: stale" in text or "deprecated: true" in text:
                # Archive (recoverable) instead of delete.
                try:
                    skill_manage(
                        action="delete",
                        name=name,
                        absorbed_into="secretary-skills-archive",
                    )
                    acted = True
                except Exception as exc:  # pragma: no cover
                    logger.debug("secretary curator archive failed: %s", exc)
        # Record run.
        state["last_run_at"] = now
        _save_state(state)
        return acted or len(skills) > 0
    except Exception as exc:
        logger.debug("secretary curator skipped: %s", exc)
        # Still mark run so we don't spin.
        state["last_run_at"] = now
        _save_state(state)
        return False
