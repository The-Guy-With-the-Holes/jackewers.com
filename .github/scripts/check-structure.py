#!/usr/bin/env python3
"""Structural checks that the other CI jobs don't cover.

Each check exists because something actually slipped through:

  dead ends          - several project pages shipped with no way back to the
                       site. Naive greps for href-like strings kept giving
                       false positives on paths inside <script> blocks, so
                       script and style content is stripped before matching.
  missing local refs - lychee doesn't follow <script src>, which is how three
                       404ing script tags survived a full link check.
  unreferenced assets- files under shared/assets/ that nothing loads, which is
                       how ~40KB of CSS and a 488-line dead JS file lingered.

Exits non-zero with a report if anything fails.
"""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

SKIP_DIRS = {".git", "email-signatures", "node_modules", ".claude"}
# Fragments fetched at runtime, not standalone pages.
SKIP_FILES = {"shared/assets/components/navbar.html"}


def html_files() -> list[Path]:
    out = []
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.relative_to(ROOT).as_posix()
        if any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts):
            continue
        if rel in SKIP_FILES:
            continue
        out.append(p)
    return out


def strip_code(html: str) -> str:
    """Remove <script>/<style> bodies so their string literals aren't mistaken
    for real markup - the exact false positive that hid the dead-end pages."""
    return re.sub(r"<(script|style)\b.*?</\1>", "", html, flags=re.DOTALL | re.IGNORECASE)


def body_of(html: str) -> str:
    i = html.find("<body")
    return html[i:] if i != -1 else html


def check_dead_ends(files: list[Path]) -> list[str]:
    """Every page needs at least one internal link or a shared/simple nav."""
    problems = []
    for p in files:
        html = p.read_text(encoding="utf-8")
        rel = p.relative_to(ROOT).as_posix()
        if "http-equiv=\"refresh\"" in html:      # redirect stub, e.g. /mods/
            continue
        body = body_of(html)
        if "nav-placeholder" in body or "simple-navigation" in body:
            continue
        markup = strip_code(body)
        if re.search(r'<a\s[^>]*href="(/[^"#][^"]*|/)"', markup):
            continue
        problems.append(f"{rel}: no internal link and no nav - visitors are stranded")
    return problems


def check_local_refs(files: list[Path]) -> list[str]:
    """Root-relative script/link/img targets must exist on disk."""
    problems = []
    pattern = re.compile(
        r'<(?:script|link|img|source)\b[^>]*?(?:src|href)="(/[^"?#]+)"', re.IGNORECASE
    )
    for p in files:
        html = p.read_text(encoding="utf-8")
        rel = p.relative_to(ROOT).as_posix()
        for ref in set(pattern.findall(html)):
            if (ROOT / ref.lstrip("/")).exists():
                continue
            target = ROOT / ref.lstrip("/") / "index.html"
            if target.exists():
                continue
            problems.append(f"{rel}: references {ref} which does not exist")
    return problems


def check_unreferenced_assets(files: list[Path]) -> list[str]:
    """Nothing under shared/assets/ should be orphaned."""
    haystack = []
    for pat in ("*.html", "*.js", "*.css", "*.json", "*.php", "*.md"):
        for p in ROOT.rglob(pat):
            if any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts):
                continue
            haystack.append((p, p.read_text(encoding="utf-8", errors="ignore")))

    problems = []
    assets = ROOT / "shared" / "assets"
    if not assets.is_dir():
        return problems
    for p in sorted(assets.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(ROOT).as_posix()
        name = p.name
        # A reference from any file other than itself counts.
        if any(name in text for other, text in haystack if other != p):
            continue
        problems.append(f"{rel}: not referenced anywhere - dead asset?")
    return problems


def main() -> int:
    files = html_files()
    sections = [
        ("Dead-end pages", check_dead_ends(files)),
        ("Missing local references", check_local_refs(files)),
        ("Unreferenced shared assets", check_unreferenced_assets(files)),
    ]
    failed = False
    for title, problems in sections:
        if problems:
            failed = True
            print(f"\n{title}:")
            for line in problems:
                print(f"  - {line}")
        else:
            print(f"OK  {title}: none")
    if failed:
        print("\nStructural check failed.")
        return 1
    print(f"\nAll structural checks passed across {len(files)} pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
