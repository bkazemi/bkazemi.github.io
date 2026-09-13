#!/usr/bin/env python3
"""Generate the static terminal entry pages used by GitHub Pages."""

import argparse
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "index.html": "bkazemi",
    "404.html": "404 Not Found",
    "about/index.html": "about",
    "projects/index.html": "projects",
    "projects/bkgammon/index.html": "bkgammon",
    "projects/fodder/index.html": "fodder",
    "projects/gopoker/index.html": "gopoker",
    "projects/kabobagool/index.html": "kabobagool",
    "projects/shakar/index.html": "shakar",
    "projects/trop/index.html": "trop",
}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Report stale pages without writing.")
    args = parser.parse_args()
    template = (ROOT / "templates/terminal.html").read_text()
    stale = []

    for relative_path, title in PAGES.items():
        metadata = '\n    <meta name="robots" content="noindex" />' if relative_path == "404.html" else ""
        rendered = template.replace("{{title}}", escape(title)).replace("{{metadata}}", metadata)
        target = ROOT / relative_path
        if target.exists() and target.read_text() == rendered:
            continue
        if args.check:
            stale.append(relative_path)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(rendered)

    if stale:
        print("Regenerate pages with python3 scripts/generate-pages.py:")
        print("\n".join(stale))
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
