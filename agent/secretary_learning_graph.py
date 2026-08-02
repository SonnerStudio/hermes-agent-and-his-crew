"""Secretary's learning graph (Phase E4, Option B).

Renders the Secretary's learned journey — her routing preferences and her
private planning skills — as a graph, mirroring Hermes' own ``learning_graph``
shape (``SkillNode`` + edges) so the desktop HUD can show it the same way it
shows the user's journey.

Scope is strictly the Secretary's private store (``~/.hermes/secretary/*``):
- nodes: one per learned routing bucket (small/mid/large) + one per
  Secretary skill in ``~/.hermes/secretary/skills/``.
- edges: link each routing bucket to the skills it is associated with.

Pure read-only: builds from ``secretary_memory`` + skill scan, never mutates.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

from hermes_constants import get_hermes_home


@dataclass
class SecretaryNode:
    """A node in the Secretary's learning graph (compatible shape to SkillNode)."""

    id: str
    kind: str  # "routing" | "skill"
    label: str
    detail: str = ""
    use_count: int = 0
    related: List[str] = field(default_factory=list)


def _secretary_skills_dir() -> Path:
    return get_hermes_home() / "secretary" / "skills"


def _iter_secretary_skills() -> List[Path]:
    root = _secretary_skills_dir()
    if not root.exists():
        return []
    out = []
    for p in root.rglob("SKILL.md"):
        if ".archive" in p.parts:
            continue
        out.append(p)
    return out


def _skill_label(skill_md: Path) -> str:
    try:
        with open(skill_md, "r", encoding="utf-8") as fh:
            text = fh.read(4000)
        # crude frontmatter name extraction
        if text.startswith("---"):
            block = text.split("---", 2)
            if len(block) >= 3:
                for line in block[1].splitlines():
                    if line.strip().startswith("name:"):
                        return line.split(":", 1)[1].strip() or skill_md.parent.name
    except OSError:
        pass
    return skill_md.parent.name


def build_secretary_graph() -> Dict[str, Any]:
    """Build the Secretary's learning graph as a JSON-serialisable dict.

    Returns ``{"nodes": [...], "edges": [...]}`` consumable by the HUD.
    """
    nodes: Dict[str, SecretaryNode] = {}
    edges: List[List[str]] = []

    # --- Routing-preference nodes (from secretary_memory) ---
    try:
        from agent.secretary_memory import SecretaryMemory

        mem = SecretaryMemory()
        learned = mem.prefetch().get("learned", {})
    except Exception:
        learned = {}

    bucket_labels = {
        "small": "Kleine Delegation (1-2 Einheiten)",
        "mid": "Mittlere Delegation (3-5 Einheiten)",
        "large": "Große Delegation (6+ Einheiten)",
    }
    for bucket, pref in learned.items():
        node_id = f"routing:{bucket}"
        topo = pref.get("topology", "peer")
        cf = pref.get("clone_factor", 2)
        nodes[node_id] = SecretaryNode(
            id=node_id,
            kind="routing",
            label=bucket_labels.get(bucket, bucket),
            detail=f"Präferiert: {topo}, clone_factor={cf}",
        )

    # --- Skill nodes (from ~/.hermes/secretary/skills/) ---
    for skill_md in _iter_secretary_skills():
        name = _skill_label(skill_md)
        node_id = f"skill:{name}"
        nodes[node_id] = SecretaryNode(
            id=node_id,
            kind="skill",
            label=name,
            detail="Sekretärin-Planungs-Skill",
        )

    # --- Edges: each skill supports the routing buckets (simple heuristic:
    # a skill whose name hints at a bucket links to it). ---
    for node in list(nodes.values()):
        if node.kind != "skill":
            continue
        low = node.label.lower()
        for bucket in ("small", "mid", "large"):
            bucket_word = {"small": "small", "mid": "mid", "large": "large"}[bucket]
            if bucket_word in low or (bucket == "large" and "parallel" in low):
                rid = f"routing:{bucket}"
                if rid in nodes:
                    edge = sorted((node.id, rid))
                    if edge not in edges:
                        edges.append(edge)
                        nodes[node.id].related.append(rid)
                        nodes[rid].related.append(node.id)

    return {
        "nodes": [vars(n) for n in nodes.values()],
        "edges": edges,
    }


def render_secretary_graph_json() -> str:
    """Return the graph as a JSON string (HUD-friendly)."""
    return json.dumps(build_secretary_graph(), ensure_ascii=False, indent=2)
