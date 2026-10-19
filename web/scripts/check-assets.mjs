#!/usr/bin/env node
// check-assets.mjs: Guard rail on the size of the visuals in `src/assets`.
//
// Astro's image service generates derivatives at the requested width, but it
// starts from the source file: a 7000px photo stays 7000px on disk, in the
// repository and in the build cache. This check rejects a disproportionate
// source as it comes in, rather than discovering it in a 23 MB PDF export.
//
// `--fix` resizes instead of reporting.
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ASSETS = fileURLToPath(new URL("../src/assets", import.meta.url));
const REPO = fileURLToPath(new URL("../..", import.meta.url));
const CONTENT_DIRS = ["1-Projects", "2-Areas", "3-Resources", "4-Archives"].map((dir) => join(REPO, dir));
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

// Maximum width tolerated per folder, in pixels. The rule of thumb: about twice
// the largest display width for that kind of visual. Wide enough to let an
// ordinary screenshot through (1440, 1920 or 2000px) without argument, tight
// enough to stop a camera export.
const MAX_WIDTHS = {
  photos: 2400,
  visuels: 1200,
  personnes: 900,
};
const DEFAULT_MAX_WIDTH = 2000;
const MAX_MEGABYTES = 1.5;

const fix = process.argv.includes("--fix");

function walk(directory, keep) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) return walk(filePath, keep);
    return keep(entry.name) ? [filePath] : [];
  });
}

function maxWidthFor(filePath) {
  const folder = relative(ASSETS, filePath).split("/")[0];
  return MAX_WIDTHS[folder] ?? DEFAULT_MAX_WIDTH;
}

// ── Pass 1: sources that are out of scale ──────────────────────────────────
const oversized = [];

for (const file of walk(ASSETS, (n) => EXTENSIONS.has(extname(n).toLowerCase()))) {
  const maxWidth = maxWidthFor(file);
  const { width, height } = await sharp(file).metadata();
  const megabytes = statSync(file).size / 1e6;
  if (width <= maxWidth && megabytes <= MAX_MEGABYTES) continue;

  const name = relative(ASSETS, file);
  if (!fix) {
    oversized.push(
      `  ${name}: ${width}x${height}, ${megabytes.toFixed(1)} MB ` +
        `(max ${maxWidth}px, ${MAX_MEGABYTES} MB)`,
    );
    continue;
  }

  const target = Math.min(width, maxWidth);
  const buffer = await sharp(file)
    .resize({ width: target, withoutEnlargement: true })
    .toBuffer();
  await sharp(buffer).toFile(file);
  const after = statSync(file).size / 1e6;
  console.log(
    `  ${name}: ${width} -> ${target}px, ${megabytes.toFixed(1)} -> ${after.toFixed(1)} MB`,
  );
}

// ── Pass 2: visuals the content calls for but the repository does not hold ──
// They do not break the build, they leave a hole in the document.
const missing = new Map();

for (const file of CONTENT_DIRS.filter(existsSync).flatMap((dir) => walk(dir, (n) => /\.mdx?$/.test(n)))) {
  const text = readFileSync(file, "utf-8");
  // Component attribute or markdown syntax: both call forms.
  const calls = [
    ...text.matchAll(/"(\/assets\/[^"]+)"/g),
    ...text.matchAll(/!\[[^\]]*\]\((\/assets\/[^)\s]+)\)/g),
  ];
  for (const [, reference] of calls) {
    if (!EXTENSIONS.has(extname(reference).toLowerCase())) continue;
    if (existsSync(join(ASSETS, reference.replace(/^\/assets\//, "")))) continue;
    if (!missing.has(reference)) missing.set(reference, []);
    missing.get(reference).push(relative(REPO, file));
  }
}

if (missing.size > 0) {
  console.warn(`\n${missing.size} visual(s) referenced with no matching file:`);
  for (const [reference, where] of missing) {
    console.warn(`  ${reference}  <- ${where.join(", ")}`);
  }
  console.warn("");
}

if (oversized.length > 0) {
  console.error(
    `\n${oversized.length} visual(s) out of scale in web/src/assets:\n` +
      oversized.join("\n") +
      `\n\nRun "npm run assets:fix" to resize them.\n`,
  );
  process.exit(1);
}

if (!fix) console.log("Visuals: all within bounds.");
