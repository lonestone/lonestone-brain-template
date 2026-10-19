// The wiki's special paths: the folders never walked, the PARA roots and their labels, and the
// files surfaced inside another page rather than on their own. These are the rules no path
// convention can express.
//
// Which component draws a page is decided by the position of its renderer file under
// `src/renderers/`, which mirrors the content tree. See `src/lib/renderers.ts`.
//
// Pure module (no node:fs) so it is safe to import from browser components too.

/** Folders never walked as wiki content, at any depth: tooling and build output. */
export const SKIP_DIRS: ReadonlySet<string> = new Set([
  "node_modules",
  ".git",
  ".claude",
  ".astro",
  "web",
]);

/** Folders skipped at the repo root only. A root `assets/` holds tooling files (themes,
 * exports), while an `assets/` folder inside the content holds the images of the pages next to it. */
export const ROOT_SKIP_DIRS: ReadonlySet<string> = new Set(["assets"]);

/** The four PARA roots, in display order, with their sidebar labels. */
export const PARA_ROOTS = [
  { id: "1-Projects", label: "Projets" },
  { id: "2-Areas", label: "Fonctionnement" },
  { id: "3-Resources", label: "Ressources" },
  { id: "4-Archives", label: "Archives" },
] as const;

/**
 * Files rendered inside another page rather than on their own: they get no generic /wiki page
 * and are hidden from the sidebar tree. Returns true to skip the file id.
 */
export function isHiddenFile(id: string): boolean {
  return id === "USER"; // local machine config, not wiki content
}
