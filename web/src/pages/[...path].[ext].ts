import type { APIRoute } from "astro";
import {
  invalidateWikiScan,
  listWikiServablePaths,
  serveWikiFile,
} from "../lib/wiki-fs";

// Single endpoint serving every raw wiki file (standalone HTML pages + co-located assets) at
// /<path>.<ext>. The `[ext]` param captures the extension so one route covers all types
// instead of a file per extension. The `.astro` route next to this one keeps /<path>/ pages.
//
// `path` + `.` + `ext` always reconstructs the full path, even when the split lands on the wrong
// dot for a name like `shot_17.54.51.png`, so we look the file up by that full path.
export function getStaticPaths() {
  // Rescan so assets renamed after the last start appear in the path list.
  invalidateWikiScan();
  return listWikiServablePaths().map((full) => {
    const dot = full.lastIndexOf(".");
    return { params: { path: full.slice(0, dot), ext: full.slice(dot + 1) } };
  });
}

export const GET: APIRoute = ({ params }) =>
  serveWikiFile(`${params.path ?? ""}.${params.ext ?? ""}`);
