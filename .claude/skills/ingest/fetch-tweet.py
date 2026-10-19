#!/usr/bin/env python3
"""Fetch a tweet or X long-form article via fxtwitter and save as verbatim markdown.

Usage: fetch-tweet.py <tweet-url> <output-path.md>

X (Twitter) blocks anonymous requests, so trafilatura/WebFetch fail. This script
uses the public fxtwitter API (https://api.fxtwitter.com) which proxies tweets
without authentication. It handles three shapes:

  - plain tweet      → header + tweet body (long-form via raw_text)
  - long-form article (X article)  → header + article title + Draft.js content
  - tweet with media → media URLs listed at the end

Output matches fetch.py's project source format.
"""
import argparse
import json
import re
import sys
import urllib.request
from datetime import date, datetime
from pathlib import Path

API_BASE = "https://api.fxtwitter.com"


def get_tweet(url: str) -> dict:
    m = re.search(r"(?:x|twitter)\.com/([^/]+)/status/(\d+)", url)
    if not m:
        raise SystemExit(f"ERROR: not a tweet URL: {url}")
    handle, tid = m.group(1), m.group(2)
    req = urllib.request.Request(
        f"{API_BASE}/{handle}/status/{tid}",
        headers={"Accept": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))["tweet"]


def render_article(article: dict) -> str:
    """Render Draft.js content blocks to verbatim markdown."""
    content = article["content"]
    blocks = content["blocks"]
    by_key = {e["key"]: e["value"] for e in content["entityMap"]}
    out: list[str] = []
    for b in blocks:
        text = b.get("text", "")
        t = b["type"]
        if t == "atomic":
            for r in b.get("entityRanges", []):
                ent = by_key.get(str(r["key"]))
                if not ent:
                    continue
                if ent["type"] == "MARKDOWN":
                    out.append(ent["data"]["markdown"])
                elif ent["type"] == "MEDIA":
                    out.append("*[image]*")
                elif ent["type"] == "LINK":
                    out.append(ent["data"].get("url", ""))
            continue
        prefix = {
            "header-one": "# ",
            "header-two": "## ",
            "header-three": "### ",
            "unordered-list-item": "- ",
            "ordered-list-item": "1. ",
            "blockquote": "> ",
            "code-block": "    ",
            "unstyled": "",
        }.get(t, "")
        out.append(prefix + text)
    return "\n\n".join(out)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("url")
    ap.add_argument("output", help="Output .md path")
    args = ap.parse_args()

    t = get_tweet(args.url)
    author = t["author"]
    name = f"{author['name']} (@{author['screen_name']})"
    created = t.get("created_at", "")
    try:
        iso = datetime.strptime(created, "%a %b %d %H:%M:%S %z %Y").date().isoformat()
    except Exception:
        iso = created

    if t.get("article"):
        art = t["article"]
        title = art.get("title") or "Untitled X article"
        body = render_article(art)
    else:
        title = (t.get("text") or t.get("raw_text", {}).get("text") or "")[:80] or "Tweet"
        body = t.get("raw_text", {}).get("text") or t.get("text") or ""

    media_urls = []
    for m in t.get("media", {}).get("photos", []) or []:
        if m.get("url"):
            media_urls.append(m["url"])
    for m in t.get("media", {}).get("videos", []) or []:
        if m.get("url"):
            media_urls.append(m["url"])

    today = date.today().isoformat()
    header = (
        f"# {title}\n\n"
        f"**Source** : {args.url}\n"
        f"**Auteur** : {name}\n"
        f"**Date** : {iso}\n"
        f"**Capture** : {today}\n\n"
        "---\n\n"
    )
    footer = ""
    if media_urls:
        footer = "\n\n---\n\n**Médias attachés** :\n\n" + "\n".join(f"- {u}" for u in media_urls) + "\n"

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(header + body + footer + "\n", encoding="utf-8")
    print(f"wrote {out_path} ({len(body)} chars body, {len(media_urls)} media)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
