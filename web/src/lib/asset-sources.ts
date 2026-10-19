// asset-sources: Serves the raw `/assets/...` paths from `src/assets`.
//
// Shared visuals live under `src/assets`: the only place where Astro's image
// service can produce derivatives, which `public/` does not allow. Document images
// go through that service (`docImage`, `remarkDocImages`, `resizeHtmlImages`).
//
// What remains are the raw paths written straight into a layout or a component,
// such as the brand logo. This integration serves them from the same source, in
// dev, in preview and in the build alike.
// Their file size is held in check by `scripts/check-assets.mjs`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ASSETS_ROOT = fileURLToPath(new URL("../assets", import.meta.url));

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

type Middleware = (
  request: { url?: string },
  response: NodeJS.WritableStream & {
    setHeader: (name: string, value: string) => void;
  },
  next: () => void,
) => void;

function serveFrom(root: string): Middleware {
  return (request, response, next) => {
    const url = decodeURIComponent((request.url ?? "").split("?")[0]);
    // A `..` in the URL would escape the visuals folder.
    const file = path.join(root, path.normalize(url).replace(/^(\.\.[\/])+/, ""));
    if (!file.startsWith(root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      return next();
    }
    response.setHeader(
      "Content-Type",
      MIME_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
    );
    fs.createReadStream(file).pipe(response);
  };
}

interface ServerWithMiddlewares {
  middlewares: { use: (route: string, handler: Middleware) => unknown };
}

function vitePlugin() {
  const serveAssets = serveFrom(ASSETS_ROOT);
  return {
    name: "asset-sources",
    // Block bodies on purpose: Vite treats a value returned by these hooks as a
    // post hook, and a connect app is itself callable.
    configureServer(server: ServerWithMiddlewares) {
      server.middlewares.use("/assets", serveAssets);
    },
    configurePreviewServer(server: ServerWithMiddlewares) {
      server.middlewares.use("/assets", serveAssets);
    },
  };
}

export default function assetSources() {
  return {
    name: "asset-sources",
    hooks: {
      "astro:config:setup": ({ updateConfig }: { updateConfig: (config: unknown) => void }) => {
        updateConfig({ vite: { plugins: [vitePlugin()] } });
      },
      "astro:build:done": ({ dir }: { dir: URL }) => {
        fs.cpSync(ASSETS_ROOT, path.join(fileURLToPath(dir), "assets"), {
          recursive: true,
        });
      },
    },
  };
}
