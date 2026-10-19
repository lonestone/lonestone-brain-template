// Markdown provenance marker.
//
// Every element produced from markdown gets the `md` class, and the styles in
// global.css only target those. A component never gets it, so its own layout
// belongs to it entirely and never has to guard against a prose rule inherited
// from a container.
//
// The repository has two rendering paths and both need covering: MDX
// collections go through Astro, where the rehype plugin walks the tree, while
// wiki pages go through `marked`, whose output is already-serialised HTML.

import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/** Rehype plugin: sets `md` on every element of the markdown tree. */
export function rehypeMdClass() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      node.properties ??= {};
      const classes = node.properties.className;
      if (Array.isArray(classes)) classes.push("md");
      else if (typeof classes === "string") node.properties.className = [classes, "md"];
      else node.properties.className = ["md"];
    });
  };
}

// The tags markdown produces. An explicit list rather than a blind replacement:
// raw HTML written inside a document keeps its own classes, and no component
// tag is ever marked.
const MD_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "a", "strong", "em", "del", "code", "pre", "blockquote", "hr",
  "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td",
  "img", "figure", "figcaption",
];

const OPENING_TAG = new RegExp(`<(${MD_TAGS.join("|")})(\\s[^>]*)?>`, "gi");

/** Sets `md` on the tags of already-serialised HTML, as `marked` renders it. */
export function addMdClass(html: string): string {
  return html.replace(OPENING_TAG, (full, tag: string, attrs: string | undefined) => {
    if (!attrs) return `<${tag} class="md">`;
    const withClass = attrs.replace(
      /\bclass=("([^"]*)"|'([^']*)')/i,
      (_m, _q, dq, sq) => `class="${(dq ?? sq ?? "").trim()} md"`,
    );
    return withClass === attrs ? `<${tag}${attrs} class="md">` : `<${tag}${withClass}>`;
  });
}
