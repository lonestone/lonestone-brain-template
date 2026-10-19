// Checks the renderer tree against the content tree, without booting Astro.
//
// Two things can go wrong in a tree-mirrors-tree system, and both are silent at runtime:
// a renderer whose path matches no content at all (a typo, or content that moved), and two
// renderers claiming the same page with equal precision. A third check covers URLs: two pages
// whose paths differ only by whitespace would land on the same URL.
//
// Run by `npm run routes:check`, and by `prebuild` before every build.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const WEB_ROOT = path.resolve(import.meta.dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const RENDERERS = path.join(WEB_ROOT, "src", "renderers");

// Kept in step with src/lib/wiki-config.ts.
const SKIP_DIRS = new Set(["node_modules", ".git", ".claude", ".astro", "web"]);
// A root `assets/` holds tooling files; an `assets/` folder inside the content is content.
const ROOT_SKIP_DIRS = new Set(["assets"]);
const PARA_ROOTS = ["1-Projects", "2-Areas", "3-Resources", "4-Archives"];

function isHiddenFile(id) {
  return id === "USER";
}

/** Every page the wiki serves, matched the way the resolver matches it. */
function listPages() {
  const folders = new Set();
  const pages = [];

  const walk = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name.startsWith(".")) continue;
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (SKIP_DIRS.has(item.name)) continue;
        if (dir === REPO_ROOT && ROOT_SKIP_DIRS.has(item.name)) continue;
        walk(abs);
        continue;
      }
      if (!/\.(md|mdx)$/i.test(item.name)) continue;
      const id = path.relative(REPO_ROOT, abs).split(path.sep).join("/").replace(/\.(md|mdx)$/i, "");
      if (isHiddenFile(id)) continue;
      const parts = id.split("/");
      for (let i = 1; i < parts.length; i++) folders.add(parts.slice(0, i).join("/"));
      if (!/^(index|readme)$/i.test(parts[parts.length - 1])) pages.push({ id, isFolder: false });
    }
  };
  walk(REPO_ROOT);

  for (const root of PARA_ROOTS) {
    if (fs.existsSync(path.join(REPO_ROOT, root))) folders.add(root);
  }
  for (const id of folders) pages.push({ id, isFolder: true });
  return pages;
}

/** Every renderer, read from its position in the tree. */
function listRenderers() {
  const found = [];
  const walk = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!item.name.endsWith(".astro")) continue;
      const rel = path.relative(RENDERERS, abs).split(path.sep).join("/").replace(/\.astro$/, "");
      if (rel === "default") continue;
      const segments = rel.split("/");
      const last = segments[segments.length - 1];
      const dot = last.indexOf(".");
      let variant = null;
      if (dot !== -1) {
        variant = last.slice(dot + 1);
        segments[segments.length - 1] = last.slice(0, dot);
      }
      found.push({ rel, segments, variant, base: segments.join("/") });
    }
  };
  walk(RENDERERS);
  return found;
}

const isParam = (s) => s.startsWith("[") && s.endsWith("]");

function matches(renderer, page) {
  const segments = page.isFolder ? [...page.id.split("/"), "index"] : page.id.split("/");
  if (renderer.segments.length !== segments.length) return false;
  if (page.isFolder && renderer.segments[renderer.segments.length - 1] !== "index") return false;
  return renderer.segments.every((claim, i) => isParam(claim) || claim === segments[i]);
}

const specificity = (r) => r.segments.filter((s) => !isParam(s)).length;

const pages = listPages();
const renderers = listRenderers();
const errors = [];

// 1. A renderer that draws nothing points at content that is not there.
for (const renderer of renderers) {
  if (renderer.variant) continue;
  if (!pages.some((page) => matches(renderer, page))) {
    errors.push(`Le renderer ${renderer.rel} ne correspond à aucune page. Chemin obsolète ?`);
  }
}

// 2. Two renderers of equal precision on one page leave the choice undefined.
for (const page of pages) {
  const claiming = renderers.filter((r) => !r.variant && matches(r, page));
  if (claiming.length < 2) continue;
  const top = Math.max(...claiming.map(specificity));
  const tied = claiming.filter((r) => specificity(r) === top);
  if (tied.length > 1) {
    errors.push(`${page.id} est revendiquée par ${tied.map((r) => r.rel).join(" et ")}.`);
  }
}

// 3. Whitespace becomes a hyphen in a URL, so two pages can collide there.
const byUrl = new Map();
for (const page of pages) {
  const url = page.id.replace(/\s+/g, "-");
  const seen = byUrl.get(url);
  if (seen) errors.push(`${seen} et ${page.id} partagent l'URL /${url}/.`);
  else byUrl.set(url, page.id);
}

// A variant with no base renderer would never be reached.
for (const variant of renderers.filter((r) => r.variant)) {
  if (!renderers.some((r) => !r.variant && r.base === variant.base)) {
    errors.push(`La variante ${variant.rel} n'a pas de renderer de base ${variant.base}.astro.`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problème(s) de routage :`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const drawn = pages.filter((page) => renderers.some((r) => !r.variant && matches(r, page))).length;
console.log(
  `✓ Routage : ${pages.length} pages, ${drawn} avec un renderer dédié, ` +
    `${pages.length - drawn} en vue markdown. ${renderers.length} renderers.`,
);
