// md-links.ts: Turns links to other wiki pages into their app routes.
//
// A document links to another one by its file path, `../documents/x.mdx`, which is
// what an editor and GitHub resolve. The app serves that page at `/…/documents/x/`,
// without the extension, so the link has to be rewritten or it lands on a 404.
//
// Both rendering paths share `pageHref`: `wiki-fs` applies it to the HTML that
// `marked` produces, and the remark plugin below to the markdown collections.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { visit } from "unist-util-visit";
import type { Root, Link, Definition } from "mdast";
import type { VFile } from "vfile";
import { wikiUrl } from "./wiki";

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(LIB_DIR, "../../..");

/** Resolve a path relative to a page's source directory to a repo-relative path. */
export function resolveRepoPath(dirSegs: string[], target: string): string {
  const segs = [...dirSegs];
  for (const s of target.split("/")) {
    if (s === "" || s === ".") continue;
    if (s === "..") segs.pop();
    else segs.push(s);
  }
  return segs.join("/");
}

/** Decode a percent-encoded path as written in markdown (`Proposition%20X.mdx`). */
export function decodePath(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw; // a malformed escape stays as written
  }
}

/** App route of a link to another .md/.mdx page or folder, else null. Relative targets resolve
 * from the page's source directory, root-relative ones (`/2-Areas/…/x.mdx`) from the repo root. */
export function pageHref(dirSegs: string[], raw: string): string | null {
  const m = raw.match(/^([^#?]*)([#?].*)?$/);
  const target = decodePath(m?.[1] || "");
  const suffix = m?.[2] || "";
  if (!target || /^([a-z]+:|\/\/|#)/i.test(raw)) return null;
  const isAbsolute = target.startsWith("/");
  const isFolder = target.endsWith("/");
  const isMd = /\.(md|mdx)$/i.test(target);
  const isHtml = /\.html?$/i.test(target);
  // A root-relative URL without an extension is already an app route.
  if (isAbsolute && !isMd) return null;
  if (!isFolder && !isMd && !isHtml) return null;
  const repoPath = resolveRepoPath(isAbsolute ? [] : dirSegs, target);
  // Standalone HTML pages are served raw at /<path>.html (keep the extension).
  if (isHtml) return `/${repoPath}${suffix}`;
  return wikiUrl(repoPath.replace(/\.(md|mdx)$/i, "")) + suffix;
}

/** Remark plugin: rewrites the links of a markdown or MDX document to their app routes. */
export function remarkDocLinks() {
  return (tree: Root, file: VFile) => {
    if (!file.path) return;
    const dirSegs = path
      .relative(REPO_ROOT, path.dirname(file.path))
      .split(path.sep)
      .filter(Boolean);
    visit(tree, ["link", "definition"], (node) => {
      const n = node as Link | Definition;
      const href = pageHref(dirSegs, n.url);
      if (href) n.url = href;
    });
  };
}
