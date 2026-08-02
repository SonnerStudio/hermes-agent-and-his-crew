#!/usr/bin/env python3
"""Transliterate the English README.md into Elder Futhark runes (RUN language).

- Prose lines are transliterated letter-by-letter (a->ᚨ, b->ᛒ, ...).
- Code fences (```), URLs, shell/PowerShell commands, badge URLs, and
  markdown link targets are LEFT INTACT (runes would break them).
- Behavior mirrors the app's toRunic() map in i18n.ts.
"""
import re
import sys

RUNE = {
    'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ',
    'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ',
    'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛋ', 't': 'ᛏ', 'u': 'ᚢ',
    'v': 'ᚢ', 'w': 'ᚹ', 'x': 'ᚲ', 'y': 'ᛁ', 'z': 'ᛋ',
}

URL_RE = re.compile(r'https?://\S+|\[[^\]]*\]\([^)]*\)|`[^`]*`|img\.shields\.io[^\s)]*')


def to_rune(text: str) -> str:
    out = []
    pos = 0
    for m in URL_RE.finditer(text):
        # transliterate the prose before the match
        out.append(''.join(RUNE.get(c.lower(), c) for c in text[pos:m.start()]))
        # keep the URL/code/link verbatim
        out.append(m.group(0))
        pos = m.end()
    out.append(''.join(RUNE.get(c.lower(), c) for c in text[pos:]))
    return ''.join(out)


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else 'README.md'
    dst = sys.argv[2] if len(sys.argv) > 2 else 'README.run.md'
    with open(src, encoding='utf-8') as f:
        lines = f.read().split('\n')

    out = []
    in_code = False
    for line in lines:
        # Never transliterate inside fenced code blocks.
        if line.strip().startswith('```'):
            in_code = not in_code
            out.append(line)
            continue
        if in_code:
            out.append(line)
            continue
        # HTML comments (fork notes) keep their ASCII structure.
        if line.strip().startswith('<!--'):
            out.append(line)
            continue
        out.append(to_rune(line))

    with open(dst, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
    print(f"wrote {dst}: {len(out)} lines transliterated (code/URLs preserved)")


if __name__ == '__main__':
    main()
