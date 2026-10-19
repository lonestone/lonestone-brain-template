import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

import react from "@astrojs/react";
import assetSources from "./src/lib/asset-sources";
import { rehypeMdClass } from "./src/lib/md-class";
import { rehypeMermaidFence } from "./src/lib/mermaid-fence";
import { remarkDocImages } from "./src/lib/md-images";
import { remarkDocLinks } from "./src/lib/md-links";
import watchWikiContent from "./src/lib/watch-wiki-content";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mermaid fences leave a `<pre class="mermaid">`, rendered client-side by
// `src/scripts/mermaid.ts`. The fence plugin runs before `rehypeMdClass` so the
// diagram `<pre>` also gets `md`, and Shiki skips mermaid so the fence reaches
// the plugin as plain `<code class="language-mermaid">`.
const markdownRehypePlugins = [rehypeMermaidFence, rehypeMdClass];

// Local images are resized under the shared policy, see `src/lib/md-images.ts`.
// Links to `.md`/`.mdx` files become page routes, see `src/lib/md-links.ts`.
const markdownRemarkPlugins = [remarkDocImages, remarkDocLinks];

export default defineConfig({
  // The `md` class is set on every element that comes from markdown: the rules
  // of global.css target it alone, so they never leak into a component. The
  // unified processor carries the plugins, and `mdx` inherits them.
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid", "math"] },
    processor: unified({
      remarkPlugins: markdownRemarkPlugins,
      rehypePlugins: markdownRehypePlugins,
    }),
  },
  integrations: [
    mdx(),
    icon(),
    react(),
    assetSources(),
  ],
  // Fixed port: the dev server is expected there, see CLAUDE.md.
  server: { port: 4321 },
  vite: {
    plugins: [tailwindcss(), watchWikiContent()],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "src"),
      },
    },
    server: {
      fs: {
        allow: [".."],
      },
    },
  },
});
