// Wiki tree + link resolution shared by the sidebar (Layout), the catch-all route and the
// client-side link rewriter.
//
// A page URL is its repo path, always. `1-Projects/demo/documents/x.mdx` lives at
// `/1-Projects/demo/documents/x/`, whatever component draws it. The choice of component
// belongs to `src/renderers/`.

import { PARA_ROOTS } from "./wiki-config";

export { SKIP_DIRS, ROOT_SKIP_DIRS, PARA_ROOTS, isHiddenFile } from "./wiki-config";

export interface WikiNode {
  /** Display title. */
  name: string;
  /** Raw last path segment (folder name or file basename without extension). */
  segment: string;
  /** Repo-relative id (folders: the folder path, files: the entry id). */
  path: string;
  type: "folder" | "file";
  /** Link target (root-relative). */
  href?: string;
  children?: WikiNode[];
}

const ROOT_LABELS: Record<string, string> = Object.fromEntries(
  PARA_ROOTS.map((r) => [r.id, r.label]),
);

/** URL of a wiki page, folder or file alike: its repo path, with whitespace hyphenated so the
 * URL needs no escaping. An `index` or `README` basename is dropped, since such a file and its
 * folder are the same page; at the repo root that page is the home page, `/`. */
export function wikiUrl(id: string): string {
  const trimmed = id.replace(/(^|\/)(index|readme)$/i, "");
  return trimmed ? `/${urlPath(trimmed)}/` : "/";
}

/** Repo path as it appears in a URL. */
export function urlPath(id: string): string {
  return id.replace(/\s+/g, "-");
}

export function prettify(segment: string): string {
  const s = segment.replace(/[-_]/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const monthNames = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

function fmtDate(v: unknown): string | null {
  const d = v instanceof Date ? v : typeof v === "string" ? new Date(v) : null;
  if (!d || isNaN(d.getTime())) return null;
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

/** Best display title for a file, from its frontmatter, falling back to the filename. */
export function fileTitle(id: string, data: any): string {
  const base = id.split("/").pop() ?? id;
  if (data && typeof data === "object") {
    if (data.firstname && data.name) return `${data.firstname} ${data.name}`;
    if (data.objet) return String(data.objet);
    if (data.title) return String(data.title);
    if (data.title) return String(data.title);
    if (data.name) return String(data.name);
    if (data.date) {
      const d = fmtDate(data.date);
      if (d) return data.type ? `${d} · ${data.type}` : d;
    }
  }
  if (/^index$/i.test(base)) return prettify(id.split("/").slice(-2, -1)[0] ?? base);
  if (/^readme$/i.test(base)) return "README";
  return prettify(base);
}

interface RawEntry {
  id: string;
  data: any;
  /** Precomputed link target. Falls back to wikiUrl(id) when omitted. */
  href?: string;
}

function folderLabel(segment: string, path: string): string {
  return ROOT_LABELS[path] ?? prettify(segment);
}

/** Build a nested tree from the flat list of wiki entries. */
export function buildWikiTree(entries: RawEntry[]): WikiNode[] {
  const root: WikiNode = { name: "", segment: "", path: "", type: "folder", children: [] };

  for (const entry of entries) {
    const parts = entry.id.split("/");
    let cursor = root;
    for (let i = 0; i < parts.length; i++) {
      const seg = parts[i];
      const isLeaf = i === parts.length - 1;
      if (isLeaf) {
        cursor.children!.push({
          name: fileTitle(entry.id, entry.data),
          segment: seg,
          path: entry.id,
          type: "file",
          href: entry.href ?? wikiUrl(entry.id),
        });
      } else {
        const folderPath = parts.slice(0, i + 1).join("/");
        let next = cursor.children!.find(
          (c) => c.type === "folder" && c.path === folderPath,
        );
        if (!next) {
          next = {
            name: folderLabel(seg, folderPath),
            segment: seg,
            path: folderPath,
            type: "folder",
            children: [],
          };
          cursor.children!.push(next);
        }
        cursor = next;
      }
    }
  }

  assignFolderHrefs(root);
  sortTree(root);
  return root.children!;
}

/** Give every folder its URL, and fold its own `index` / `README` file into it: the two are one
 * page, so the file disappears from the child list and lends the folder its title. */
function assignFolderHrefs(node: WikiNode): void {
  if (!node.children) return;
  if (node.path) {
    node.href = wikiUrl(node.path);

    const folded = node.children.filter(
      (c) => c.type === "file" && /^(index|readme)$/i.test(c.segment),
    );
    const indexChild = folded.find((c) => /^index$/i.test(c.segment));
    if (folded.length) {
      if (indexChild?.name && !/^(index|readme)$/i.test(indexChild.name)) {
        node.name = indexChild.name;
      }
      node.children = node.children.filter((c) => !folded.includes(c));
    }
  }
  for (const child of node.children) assignFolderHrefs(child);
}

function sortTree(node: WikiNode): void {
  if (!node.children) return;
  node.children.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.segment.localeCompare(b.segment, "fr");
  });
  for (const child of node.children) sortTree(child);
}
