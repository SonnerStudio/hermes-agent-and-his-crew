#!/usr/bin/env python3
"""Add the full language-badge row to every README.*.md except README.md.

Robust line-based approach (no heavy regex). Extracts every badge line
(<a href="README.xx.md">...) from README.md and injects the full set into
each sibling README after its first H1, replacing any existing full row.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(ROOT, "README.md"), encoding="utf-8") as f:
    en_lines = f.read().split("\n")

# Collect badge lines: those containing an <a href="README. ... .md"> Lang badge.
badge_lines = [
    ln for ln in en_lines
    if ln.strip().startswith("<a href=\"README.") and "shields.io/badge/Lang-" in ln
]
if not badge_lines:
    raise SystemExit("No language-badge lines found in README.md")
badge_block = "\n".join(badge_lines)

lang_files = sorted(
    f for f in os.listdir(ROOT)
    if re.match(r"README\.[a-z]{2}(-[A-Z]{2})?\.md$", f) and f != "README.md"
)

count = 0
for fn in lang_files:
    path = os.path.join(ROOT, fn)
    with open(path, encoding="utf-8") as f:
        lines = f.read().split("\n")

    # Remove any existing full badge row (>= 5 badge lines in one <p> block).
    out = []
    i = 0
    removed = False
    while i < len(lines):
        if lines[i].strip().startswith("<p align=\"center\">") and i + 1 < len(lines):
            # Count badge lines until closing </p>
            j = i + 1
            nbadges = 0
            while j < len(lines) and not lines[j].strip().startswith("</p>"):
                if "shields.io/badge/Lang-" in lines[j]:
                    nbadges += 1
                j += 1
            if nbadges >= 5:
                # Skip this whole <p>...</p> block.
                i = j + 1
                removed = True
                continue
        out.append(lines[i])
        i += 1

    # Inject after first H1.
    final = []
    injected = False
    for idx, line in enumerate(final if False else out):
        final.append(line)
        if not injected and line.startswith("# ") and idx + 1 < len(out):
            final.append("")
            final.append(badge_block)
            final.append("")
            injected = True

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(final))
    count += 1

print(f"Updated {count} README files with the full {len(badge_lines)}-language badge row.")
