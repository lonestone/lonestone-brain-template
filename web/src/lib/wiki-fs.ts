// Server-only: walks the repo for markdown/mdx files, builds the sidebar tree, and renders
// individual pages. Kept separate from lib/wiki.ts (which is pure and safe to import from the
// browser component) because this module imports node:fs.
//
// Generic pages are rendered with `marked` from the filesystem rather than through an Astro
// content collection. A collection globbing the whole repo root leaks its image-resolution
// context into other collections and breaks relative `image()` paths (./photo.jpg), so the
// wiki as a whole stays out of content collections.
import fs from "node:fs";
import path from "node:path";
import { marked } from "./mermaid-fence";
import { addMdClass } from "./md-class";
import { decodePath, pageHref, resolveRepoPath } from "./md-links";
import {
  buildWikiTree,
  fileTitle,
  prettify,
  wikiUrl,
  type WikiNode,
} from "./wiki";
import { SKIP_DIRS, ROOT_SKIP_DIRS, PARA_ROOTS, isHiddenFile } from "./wiki-config";

const REPO_ROOT = path.resolve(process.cwd(), "..");

// Repo-root folders served at the app root. A relative asset path that resolves under one of
// these becomes a real URL.
const SERVED_ROOTS = ["assets/"];

/** Rewrite a relative image source → its served URL, else null. Images co-located with a page
 * get their repository path, which `resizeHtmlImages` turns into a resized derivative. Using an
 * absolute URL also sidesteps the trailing slash on file-page URLs (which would otherwise make
 * `foo.png` resolve against `/.../page/` instead of the page's own directory). */
function rewriteSrc(dirSegs: string[], raw: string): string | null {
  if (!raw || /^([a-z]+:|\/\/|\/|#|data:)/i.test(raw)) return null;
  const repoPath = resolveRepoPath(dirSegs, decodePath(raw));
  if (SERVED_ROOTS.some((r) => repoPath.startsWith(r))) return `/${repoPath}`;
  if (isWikiAsset(repoPath)) return `/${repoPath}`;
  return null;
}

/** Render a markdown body to HTML, rewriting relative links and image sources so they resolve
 * from the page's URL (which sits at a different depth than the source file). Rewriting the HTML
 * string here (not client-side) avoids a flash of broken images and works without JS. */
function renderMarkdown(raw: string, dir: string): string {
  const dirSegs = dir.split("/").filter(Boolean);
  let html = addMdClass(marked.parse(stripFrontmatter(raw), { async: false }) as string);
  html = html.replace(/\bhref=("([^"]*)"|'([^']*)')/gi, (full, _q, dq, sq) => {
    const nw = pageHref(dirSegs, dq ?? sq ?? "");
    return nw ? `href="${nw}"` : full;
  });
  html = html.replace(/\bsrc=("([^"]*)"|'([^']*)')/gi, (full, _q, dq, sq) => {
    const nw = rewriteSrc(dirSegs, dq ?? sq ?? "");
    return nw ? `src="${nw}"` : full;
  });
  return html;
}

/** Light frontmatter parse: enough to pick a display title, no YAML dependency. */
function parseFrontmatter(raw: string): Record<string, string> {
  if (!raw.startsWith("---")) return {};
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return {};
  const block = raw.slice(3, end);
  const data: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z_]+):\s*(.+?)\s*$/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return raw;
  const nl = raw.indexOf("\n", end + 1);
  return nl === -1 ? "" : raw.slice(nl + 1);
}

function idFor(absPath: string): string {
  return path
    .relative(REPO_ROOT, absPath)
    .split(path.sep)
    .join("/")
    .replace(/\.(md|mdx|html?)$/i, "");
}

interface WikiFile {
  id: string;
  data: Record<string, string>;
  abs: string;
}

// Static asset types co-located with wiki pages (not under the served `assets/` mirror), served
// raw at /<path>.<ext>. Their MIME type keys the per-extension endpoints.
export const ASSET_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
};

function relPath(abs: string): string {
  return path.relative(REPO_ROOT, abs).split(path.sep).join("/");
}

let filesCache: WikiFile[] | null = null;
let htmlCache: { id: string; abs: string }[] | null = null;
let assetsCache: { path: string; abs: string }[] | null = null;
let assetPathSet: Set<string> | null = null;

function scanWiki(): void {
  const files: WikiFile[] = [];
  const html: { id: string; abs: string }[] = [];
  const assets: { path: string; abs: string }[] = [];

  const walk = (dir: string) => {
    let dirEntries: fs.Dirent[];
    try {
      dirEntries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of dirEntries) {
      if (e.name.startsWith(".") && e.name !== ".") continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        if (dir === REPO_ROOT && ROOT_SKIP_DIRS.has(e.name)) continue;
        walk(abs);
      } else if (/\.(md|mdx)$/i.test(e.name)) {
        const id = idFor(abs);
        if (isHiddenFile(id)) continue;
        let data: Record<string, string> = {};
        try {
          data = parseFrontmatter(fs.readFileSync(abs, "utf8").slice(0, 2000));
        } catch {
          /* ignore unreadable files */
        }
        files.push({ id, data, abs });
      } else if (/\.html?$/i.test(e.name)) {
        // Standalone HTML pages (interactive simulators, exports…) are served raw, not rendered.
        html.push({ id: idFor(abs), abs });
      } else {
        const ext = e.name.split(".").pop()?.toLowerCase() ?? "";
        if (ext in ASSET_MIME) assets.push({ path: relPath(abs), abs });
      }
    }
  };

  walk(REPO_ROOT);
  filesCache = files;
  htmlCache = html;
  assetsCache = assets;
  assetPathSet = new Set(assets.map((a) => a.path));
}

function listWikiFiles(): WikiFile[] {
  if (!filesCache) scanWiki();
  return filesCache!;
}

/** Standalone `.html` pages, id = repo-relative path without extension (served at /<id>.html). */
export function listWikiHtmlPages(): { id: string; abs: string }[] {
  if (!htmlCache) scanWiki();
  return htmlCache!;
}

function listAssets(): { path: string; abs: string }[] {
  if (!assetsCache) scanWiki();
  return assetsCache!;
}

/** True if a repo-relative path (with extension) is a served wiki asset. */
function isWikiAsset(repoPath: string): boolean {
  if (!assetPathSet) scanWiki();
  return assetPathSet!.has(repoPath);
}

function extOf(p: string): string {
  return p.split(".").pop()?.toLowerCase() ?? "";
}

function servableMime(fullPath: string): string {
  const ext = extOf(fullPath);
  if (ext === "html" || ext === "htm") return "text/html; charset=utf-8";
  return ASSET_MIME[ext] ?? "application/octet-stream";
}

/** Repo-relative paths (with extension) of every file served raw by the single /[...path].[ext]
 * endpoint: standalone HTML pages plus co-located assets. */
export function listWikiServablePaths(): string[] {
  const html = listWikiHtmlPages().map((p) => relPath(p.abs));
  const assets = listAssets().map((a) => a.path);
  return [...html, ...assets];
}

/** Drop the in-memory wiki scan so renamed/added assets are picked up without a server restart. */
export function invalidateWikiScan(): void {
  filesCache = null;
  htmlCache = null;
  assetsCache = null;
  assetPathSet = null;
  treeCache = null;
}

/** Serve a raw wiki file by its full repo-relative path (with extension). Content-type comes from
 * the real last extension, so filenames containing dots (e.g. `shot_17.54.51.png`) are handled
 * regardless of where the route splits path vs ext. */
export function serveWikiFile(fullPath: string): Response {
  const abs = path.join(REPO_ROOT, fullPath);
  let known = listWikiServablePaths().includes(fullPath);
  // Assets renamed after the first scan are missing from the cache; rescan once before 404.
  if (!known) {
    invalidateWikiScan();
    known = listWikiServablePaths().includes(fullPath);
  }
  if (!known && !fs.existsSync(abs)) return new Response("Not found", { status: 404 });
  const ext = extOf(fullPath);
  if (!known && !(ext in ASSET_MIME)) return new Response("Not found", { status: 404 });
  try {
    return new Response(new Uint8Array(fs.readFileSync(abs)), {
      headers: { "content-type": servableMime(fullPath) },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

let treeCache: WikiNode[] | null = null;

export function getWikiTree(): WikiNode[] {
  if (!treeCache) {
    const mdEntries = listWikiFiles().map((f) => ({
      id: f.id,
      data: f.data,
      href: wikiUrl(f.id),
    }));
    const htmlEntries = listWikiHtmlPages().map((p) => ({
      id: p.id,
      data: {},
      href: `/${p.id}.html`,
    }));
    treeCache = buildWikiTree([...mdEntries, ...htmlEntries]);
  }
  return treeCache;
}

/** Every page the wiki serves, folder and file alike. A file named `index` or `README` is not a
 * page of its own: it is the content of its folder, which appears here as that folder. */
export function listWikiPageIds(): { id: string; isFolder: boolean }[] {
  const folders = new Set<string>();
  const files: string[] = [];

  const collect = (id: string) => {
    const parts = id.split("/");
    for (let i = 1; i < parts.length; i++) folders.add(parts.slice(0, i).join("/"));
    if (!/^(index|readme)$/i.test(parts[parts.length - 1])) files.push(id);
  };

  for (const f of listWikiFiles()) collect(f.id);
  // The top-level PARA folders get a page even when empty, so README links to them resolve.
  for (const root of PARA_ROOTS) {
    if (fs.existsSync(path.join(REPO_ROOT, root.id))) folders.add(root.id);
  }

  return [
    ...[...folders].map((id) => ({ id, isFolder: true })),
    ...files.map((id) => ({ id, isFolder: false })),
  ];
}

function eachFolder(nodes: WikiNode[], fn: (n: WikiNode) => void): void {
  for (const n of nodes) {
    if (n.type === "folder") {
      fn(n);
      if (n.children) eachFolder(n.children, fn);
    }
  }
}

export interface FolderListing {
  id: string;
  title: string;
  readmeHtml: string | null;
  items: WikiNode[];
}

/** Build a listing for a folder: its README/index content (if any) plus its children. */
export function getFolderListing(id: string): FolderListing | null {
  let found: WikiNode | null = null;
  eachFolder(getWikiTree(), (n) => {
    if (n.path === id) found = n;
  });
  // An empty directory (e.g. a fresh PARA root) has no tree node; render an empty listing.
  if (!found) {
    if (!fs.existsSync(path.join(REPO_ROOT, id))) return null;
    return { id, title: prettify(id.split("/").pop() ?? id), readmeHtml: null, items: [] };
  }
  const node: WikiNode = found;

  // A folder's own content is its README.md, else index.md / index.mdx, if present.
  const files = listWikiFiles();
  const indexFile =
    files.find((f) => f.id === `${id}/README`) ??
    files.find((f) => f.id === `${id}/index`);
  let readmeHtml: string | null = null;
  if (indexFile) {
    try {
      readmeHtml = renderMarkdown(fs.readFileSync(indexFile.abs, "utf8"), id);
    } catch {
      readmeHtml = null;
    }
  }

  return {
    id,
    title: node.name,
    readmeHtml,
    items: node.children ?? [],
  };
}

export interface WikiPage {
  id: string;
  title: string;
  html: string;
  /** Set for an `.mdx` file that calls components: its body and path, for `compileDocument`. */
  mdx?: { source: string; path: string };
}

// A capitalised tag is a component call, the only MDX feature `marked` cannot render.
const COMPONENT_TAG = /<[A-Z][A-Za-z0-9]*[\s/>]/;

/** Read a wiki file and render its body to HTML. Returns null if the id is unknown. */
export function renderWikiPage(id: string): WikiPage | null {
  const file = listWikiFiles().find((f) => f.id === id);
  if (!file) return null;
  let raw = "";
  try {
    raw = fs.readFileSync(file.abs, "utf8");
  } catch {
    return null;
  }
  const dir = id.split("/").slice(0, -1).join("/");
  const body = stripFrontmatter(raw);
  const mdx = file.abs.endsWith(".mdx") && COMPONENT_TAG.test(body) ? { source: body, path: file.abs } : undefined;
  return { id, title: fileTitle(id, file.data), html: renderMarkdown(raw, dir), mdx };
}

export interface WikiCrumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail for a page id: one entry per ancestor folder, each linked to its own page.
 * Labels and hrefs come from the tree, so each ancestor carries its display title. */
export function getBreadcrumbTrail(id: string): WikiCrumb[] {
  const segments = id.split("/").slice(0, -1);
  let nodes: WikiNode[] = getWikiTree();
  const crumbs: WikiCrumb[] = [];
  let prefix = "";
  for (const segment of segments) {
    prefix = prefix ? `${prefix}/${segment}` : segment;
    const node = nodes.find((n) => n.type === "folder" && n.path === prefix);
    crumbs.push({ label: node?.name ?? prettify(segment), href: node?.href });
    nodes = node?.children ?? [];
  }
  return crumbs;
}

/** Breadcrumb of a page: its ancestors, then the page itself. */
export function pageCrumbs(id: string, label: string): WikiCrumb[] {
  return [...getBreadcrumbTrail(id), { label }];
}
