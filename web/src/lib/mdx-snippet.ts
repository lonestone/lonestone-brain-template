// mdx-snippet.ts: Compiles an MDX string at build time into a renderable component.
//
// Documents reach MDX through content collections, compiled by Vite. The component catalogue
// (`COMPONENTS.md`) instead holds its demos as fenced code, which must stay readable as code on
// GitHub and render live in the wiki. Each fence goes through here: `evaluate` compiles it
// against Astro's JSX runtime, and the result is handed the same component map as any document.
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "astro/jsx-runtime";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "~/components";
import { rehypeMdClass } from "./md-class";
import { remarkDocLinks } from "./md-links";
import { rehypeMermaidFence } from "./mermaid-fence";

type Content = ((props?: Record<string, unknown>) => unknown) & Record<symbol, unknown>;

export async function compileSnippet(source: string): Promise<Content> {
  const { default: MDXContent } = await evaluate(source, {
    ...(runtime as any),
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeMdClass],
  });
  const Content: Content = (props = {}) =>
    MDXContent({ ...props, components: mdxComponents as any });
  // Marks the function for the MDX renderer, which otherwise leaves it to the
  // framework renderers (React here) and fails.
  Content[Symbol.for("mdx-component")] = true;
  return Content;
}

/** Compiles a wiki document that calls components but has no renderer of its own, so it would
 * otherwise go through `marked`, which prints component tags as text. Links resolve from the
 * document's own path. Returns null when the source is not valid MDX, so the caller can fall
 * back to the markdown view rather than failing the build. */
export async function compileDocument(source: string, filePath: string): Promise<Content | null> {
  try {
    const { default: MDXContent } = await evaluate(
      { value: source, path: filePath },
      {
        ...(runtime as any),
        remarkPlugins: [remarkGfm, remarkDocLinks],
        rehypePlugins: [rehypeMermaidFence, rehypeMdClass],
      },
    );
    const Content: Content = (props = {}) =>
      MDXContent({ ...props, components: mdxComponents as any });
    Content[Symbol.for("mdx-component")] = true;
    return Content;
  } catch (error) {
    console.warn(`[mdx] ${filePath} falls back to the markdown view: ${(error as Error).message}`);
    return null;
  }
}
