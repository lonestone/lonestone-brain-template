// component-catalog.ts: Reads `COMPONENTS.md`, the catalogue of the MDX components.
//
// The file is plain markdown so that it reads on GitHub too. Each component has a level 3
// heading, a description and an ```mdx fence holding its usage with mock data. The wiki page
// renders every fence live above its code: the demo and the usage are one source.
//
// A slide only renders inside a deck, whose styles hang off `.deck`. Its fence is tagged
// ```mdx slide: the page renders it in a `.deck` frame, scaled down to the column width.
// A fence tagged ```mdx deck holds a whole deck, which takes the window: it is rendered on the
// catalogue's deck variant, `/COMPONENTS/deck/`, and the page embeds it in an iframe.
import fs from "node:fs";
import path from "node:path";
import type { Tokens } from "marked";
import { marked } from "./mermaid-fence";
import { addMdClass } from "./md-class";
import { compileSnippet } from "./mdx-snippet";

const FILE = path.resolve(process.cwd(), "..", "COMPONENTS.md");

export type CatalogPart =
  | { kind: "html"; html: string }
  | { kind: "heading"; depth: number; text: string; slug: string }
  | { kind: "demo"; code: string; Content: Awaited<ReturnType<typeof compileSnippet>> }
  | { kind: "slide"; code: string; Content: Awaited<ReturnType<typeof compileSnippet>> }
  | { kind: "deck"; code: string };

export const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function tokens() {
  return marked.lexer(fs.readFileSync(FILE, "utf-8"));
}

const isFence = (token: { type: string }, tag: string): token is Tokens.Code =>
  token.type === "code" && (token as Tokens.Code).lang?.trim() === tag;

/** The page, in order: prose as HTML, headings, and one demo per fence. */
export async function catalogParts(): Promise<CatalogPart[]> {
  const parts: CatalogPart[] = [];
  for (const token of tokens()) {
    if (token.type === "heading") {
      const { depth, text } = token as Tokens.Heading;
      parts.push({ kind: "heading", depth, text, slug: slugify(text) });
    } else if (isFence(token, "mdx")) {
      parts.push({ kind: "demo", code: token.text, Content: await compileSnippet(token.text) });
    } else if (isFence(token, "mdx slide")) {
      parts.push({ kind: "slide", code: token.text, Content: await compileSnippet(token.text) });
    } else if (isFence(token, "mdx deck")) {
      parts.push({ kind: "deck", code: token.text });
    } else {
      parts.push({ kind: "html", html: addMdClass(marked.parser(Object.assign([token], { links: {} }) as any)) });
    }
  }
  return parts;
}

/** The ```mdx deck fence, compiled, for the catalogue's deck variant. */
export async function catalogDeck() {
  const fence = tokens().find((token) => isFence(token, "mdx deck")) as Tokens.Code | undefined;
  return fence ? compileSnippet(fence.text) : null;
}
