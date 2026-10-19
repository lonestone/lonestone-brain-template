// Mermaid fences, in both markdown pipelines.
//
// MDX collections (rehype) and `marked` pages (the wiki) both turn a
// ```mermaid fence into the same `<pre class="mermaid">`, so
// `scripts/mermaid.ts` has a single shape to look for. It is the markup
// a site would get from `rehype-mermaid` in its `pre-mermaid` strategy, which
// cannot be used here: the package loads Playwright as soon as it is imported.

import { marked } from "marked";
import { visit } from "unist-util-visit";
import type { Root, Element, ElementContent } from "hast";

const textOf = (node: ElementContent): string =>
  node.type === "text" ? node.value : "children" in node ? node.children.map(textOf).join("") : "";

/** Rehype plugin: `<pre><code class="language-mermaid">` becomes `<pre class="mermaid">`. */
export function rehypeMermaidFence() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const code = node.children.find((c): c is Element => c.type === "element" && c.tagName === "code");
      const classes = code?.properties?.className;
      if (!code || !Array.isArray(classes) || !classes.includes("language-mermaid")) return;
      node.properties = { className: ["mermaid"] };
      node.children = [{ type: "text", value: textOf(code) }];
    });
  };
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Registered on the shared `marked` instance: pages import `marked` from here.
marked.use({
  renderer: {
    code({ text, lang }) {
      if (lang?.trim() !== "mermaid") return false;
      return `<pre class="mermaid">${escapeHtml(text)}</pre>\n`;
    },
  },
});

export { marked };
