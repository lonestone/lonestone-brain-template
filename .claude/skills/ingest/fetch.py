#!/usr/bin/env python3
"""Fetch a URL and save its main content as verbatim markdown for the wiki.

Usage: fetch.py <url> <output-path.md>

Uses trafilatura to extract the article body and metadata (title, author,
publication date), then writes the file with the project's source header:

    # <title>

    **Source** : <url>
    **Auteur** : <author>
    **Date** : <pubdate>
    **Capture** : <today>

    ---

    <verbatim markdown body>
"""
import argparse
import sys
from datetime import date
from pathlib import Path

import trafilatura


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("url")
    parser.add_argument("output", help="Output .md path")
    parser.add_argument("--title", help="Override extracted title")
    parser.add_argument("--author", help="Override extracted author")
    parser.add_argument("--date", dest="pubdate", help="Override extracted publication date")
    args = parser.parse_args()

    downloaded = trafilatura.fetch_url(args.url)
    if downloaded is None:
        print(f"ERROR: failed to download {args.url}", file=sys.stderr)
        return 1

    meta = trafilatura.extract_metadata(downloaded)
    title = args.title or (getattr(meta, "title", None) or "").strip() or "Untitled"
    author = args.author or (getattr(meta, "author", None) or "").strip()
    pubdate = args.pubdate or (getattr(meta, "date", None) or "").strip()

    body = trafilatura.extract(
        downloaded,
        output_format="markdown",
        with_metadata=False,
        include_formatting=True,
        include_links=True,
        include_comments=False,
        include_tables=True,
    )
    if not body:
        print(f"ERROR: no extractable content for {args.url}", file=sys.stderr)
        return 1

    today = date.today().isoformat()
    header = (
        f"# {title}\n\n"
        f"**Source** : {args.url}\n"
        f"**Auteur** : {author}\n"
        f"**Date** : {pubdate}\n"
        f"**Capture** : {today}\n\n"
        "---\n\n"
    )

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(header + body + "\n", encoding="utf-8")
    print(f"wrote {out_path} ({len(body)} chars)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
