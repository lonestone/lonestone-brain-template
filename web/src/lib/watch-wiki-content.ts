// The wiki lives next to `web/`, not inside Vite's project root, so Vite never sees those
// writes. Two caches go stale until a restart: Astro holds `getStaticPaths()` results in
// `RouteCache` until *its* Vite watcher fires, and `wiki-fs` holds its repo scan in module
// state. New pages 404 as long as either survives.
//
// Node's `fs.watch` observes the content folders directly. Each burst emits a `change` on
// `wiki-fs.ts`, so Vite re-executes the module with empty scan caches, and on the two catch-all
// routes, which is what Astro listens to to clear RouteCache (see `astro:server`
// `rebuildManifest`). Vite reloads the open page off the same emit.
//
// The repo root is watched as a folder rather than file by file: a watch bound to a single file
// follows an inode, and an editor that saves through a temporary file plus a rename leaves it
// deaf for good. Watching the folder also covers pages created after startup.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PARA_ROOTS } from "./wiki-config";

const PLUGIN_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(PLUGIN_DIR, "../../..");

/** Modules holding a cache of the wiki tree, from the scan itself to the routes built on it. */
const STALE_ON_CHANGE = [
  path.join(PLUGIN_DIR, "wiki-fs.ts"),
  path.resolve(PLUGIN_DIR, "../pages/[...path].astro"),
  path.resolve(PLUGIN_DIR, "../pages/[...path].[ext].ts"),
];

/** Extensions that make a repo-root file a wiki page. Everything else at the root is tooling. */
const CONTENT_FILE = /\.(md|mdx|html?)$/i;

const DEBOUNCE_MS = 80;

interface ViteDevServer {
  watcher: {
    emit: (event: string, file: string) => void;
  };
  httpServer?: { once: (event: string, cb: () => void) => void } | null;
}

/** Editor scratch files and tooling folders that must not trigger a reload. */
function isNoise(filename: string | null): boolean {
  if (!filename) return false;
  const parts = filename.split(path.sep);
  const base = parts[parts.length - 1] ?? "";
  if (base === ".DS_Store" || base.endsWith("~") || base.startsWith(".#")) return true;
  return parts.some((p) => p === "node_modules" || p === ".git" || p === ".astro");
}

export default function watchWikiContent() {
  let stop = (): void => {};

  return {
    name: "watch-wiki-content",

    configureServer(server: ViteDevServer) {
      const watchers: fs.FSWatcher[] = [];
      let reloadTimer: ReturnType<typeof setTimeout> | undefined;

      const schedule = () => {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
          for (const file of STALE_ON_CHANGE) server.watcher.emit("change", file);
        }, DEBOUNCE_MS);
      };

      const watch = (
        target: string,
        recursive: boolean,
        accepts: (filename: string | null) => boolean,
      ) => {
        try {
          const watcher = fs.watch(target, { persistent: true, recursive }, (_event, filename) => {
            if (accepts(filename)) schedule();
          });
          // A watcher can die on its own (folder renamed, watch limit reached). Its `error` event
          // would throw without a listener and take the dev server down with it.
          watcher.on("error", () => watcher.close());
          watchers.push(watcher);
        } catch {
          /* a root that cannot be watched only loses its hot reload */
        }
      };

      // The PARA folders hold every page but the handful sitting at the repo root.
      for (const root of PARA_ROOTS) {
        const abs = path.join(REPO_ROOT, root.id);
        if (fs.existsSync(abs)) watch(abs, true, (filename) => !isNoise(filename));
      }

      // The repo root itself, for `README.md`, `log.md` and their neighbours. Only content files
      // count here: the rest of the root is `web/`, `.git` and other churn Vite already handles.
      watch(REPO_ROOT, false, (filename) => !!filename && CONTENT_FILE.test(filename));

      stop = () => {
        clearTimeout(reloadTimer);
        for (const watcher of watchers) watcher.close();
        watchers.length = 0;
      };
      server.httpServer?.once("close", stop);
    },

    // Covers the dev server closing without an http server of its own (middleware mode).
    closeBundle() {
      stop();
    },
  };
}
