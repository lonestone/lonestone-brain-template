#!/usr/bin/env python3
"""
Generate an image with Nano Banana Pro (Google AI, Gemini 3 Pro Image model).

Usage:
    generate.py "<prompt>" <output-path.png> [--ratio 16:9|1:1|9:16|4:3|3:4] [--style charte|neutral|none]

The prompt describes the CONTENT (texts, structure). The visual style is kept
apart so it stays stable from one generation to the next:

- `charte` (default): the "Direction artistique" section of the repository's
  CLAUDE.md is prepended to the prompt. Falls back to `neutral` when the
  section is missing.
- `neutral`: a sober, flat editorial style, independent of any brand.
- `none`: the prompt is sent raw.

Requires:
    GOOGLE_AI_API_KEY in the .env file at the repository root
    (GEMINI_API_KEY is accepted as an alias). Standard library only.
"""

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[2]
ENV_FILE = REPO_ROOT / ".env"
CLAUDE_MD = REPO_ROOT / "CLAUDE.md"
STYLE_HEADING = "direction artistique"

MODEL = "gemini-3-pro-image-preview"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

# Brand-free fallback style, used when CLAUDE.md has no art direction section.
NEUTRAL_STYLE = (
    "STYLE (fixed, follow every point): clean flat editorial illustration or "
    "infographic, magazine quality, restrained and elegant.\n"
    "- Palette: off-white background, near-black text, one muted grey for "
    "secondary elements, a single accent color used sparingly for emphasis.\n"
    "- Typography: neo-grotesque sans-serif (Inter or similar), strong size "
    "hierarchy, short labels.\n"
    "- Layout: strict grid, generous margins, structure from alignment and thin "
    "rules rather than boxes.\n"
    "- Forbidden: photorealism, realistic human faces, drop shadows, glow, neon, "
    "3D, heavy gradients, clutter, logos.\n"
    "- French text: render every word with its correct accents "
    "(é, è, ê, à, ù, ç, ï, ô). Never omit an accent."
)


def load_env(path: Path) -> None:
    """Load KEY=VALUE lines from a .env file without overriding the environment."""
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip().removeprefix("export ").strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def art_direction() -> str | None:
    """Return the body of the "Direction artistique" section of CLAUDE.md, if any."""
    if not CLAUDE_MD.exists():
        return None
    lines = CLAUDE_MD.read_text(encoding="utf-8").splitlines()
    body: list[str] = []
    level = None
    for line in lines:
        heading = re.match(r"^(#{1,6})\s+(.*)$", line)
        if level is None:
            if heading and heading.group(2).strip().lower() == STYLE_HEADING:
                level = len(heading.group(1))
            continue
        if heading and len(heading.group(1)) <= level:
            break
        body.append(line)
    text = "\n".join(body).strip()
    return text or None


def build_prompt(prompt: str, style: str, ratio: str | None) -> str:
    final = prompt
    if style == "charte":
        charter = art_direction()
        if charter:
            style_text = (
                "STYLE (fixed, follow every point, taken from the brand's art "
                "direction):\n" + charter + "\n\nNo photorealism, no realistic "
                "human faces. Render every French accent correctly."
            )
        else:
            print(
                "No 'Direction artistique' section in CLAUDE.md, using the neutral style.",
                file=sys.stderr,
            )
            style_text = NEUTRAL_STYLE
        final = f"{style_text}\n\n=== CONTENT OF THIS IMAGE ===\n{prompt}"
    elif style == "neutral":
        final = f"{NEUTRAL_STYLE}\n\n=== CONTENT OF THIS IMAGE ===\n{prompt}"
    if ratio:
        final = f"{final}\n\nAspect ratio: {ratio}"
    return final


def generate(prompt: str, output_path: Path, api_key: str) -> None:
    payload = json.dumps(
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]},
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        URL,
        data=payload,
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        sys.exit(f"API error {err.code}: {err.read().decode('utf-8', 'replace')[:1000]}")

    candidates = data.get("candidates") or []
    if not candidates:
        sys.exit(f"No candidates in response: {json.dumps(data)[:500]}")

    for part in candidates[0].get("content", {}).get("parts", []):
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            image_bytes = base64.b64decode(inline["data"])
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(image_bytes)
            mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
            print(f"OK: {output_path} ({len(image_bytes)} bytes, {mime})")
            return

    sys.exit(f"No image in response: {json.dumps(data)[:1000]}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate an image via Nano Banana Pro (Google AI).")
    parser.add_argument("prompt", help="Content of the image: texts and layout")
    parser.add_argument("output", help="Output file path (.png)")
    parser.add_argument("--ratio", default=None, help="Aspect ratio hint (16:9, 1:1, 9:16, 4:3, 3:4)")
    parser.add_argument(
        "--style",
        default="charte",
        choices=["charte", "neutral", "none"],
        help="charte: art direction from CLAUDE.md (default); neutral: brand-free "
        "editorial style; none: raw prompt.",
    )
    args = parser.parse_args()

    load_env(ENV_FILE)
    api_key = os.environ.get("GOOGLE_AI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit(f"GOOGLE_AI_API_KEY is not set. Add it to {ENV_FILE} (see .env.example).")

    output = Path(args.output)
    if not output.is_absolute():
        output = Path.cwd() / output
    generate(build_prompt(args.prompt, args.style, args.ratio), output, api_key)


if __name__ == "__main__":
    main()
