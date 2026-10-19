import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Note: the generic wiki (every md/mdx with no dedicated render) is NOT a content collection.
// Generic pages are rendered from the filesystem with `marked`, see lib/wiki-fs.ts.
//
// The template ships a single collection, `documents`: every `.mdx` file filed in a
// `documents/` folder anywhere under the PARA roots. A document is drawn by the printable
// template (header, cover, contents, footer), a deck by the slide layout. Add a collection
// here when a family of pages needs a schema and a renderer of its own.

const documents = defineCollection({
  loader: glob({
    pattern: "{1-Projects,2-Areas,3-Resources,4-Archives}/**/documents/*.mdx",
    base: "..",
  }),
  schema: z.object({
    // `document` renders through the printable template, `deck` through the slide layout.
    kind: z.enum(["document", "deck"]).default("document"),
    title: z.string(),
    // Standfirst shown under the cover title.
    lead: z.string().optional(),
    date: z.coerce.date(),
    // Recipient, shown in the header as "pour <recipient>".
    recipient: z.string().optional(),
    // Document type shown in the header, e.g. "Note de cadrage", "Proposition".
    label: z.string().default("Document"),
    // Cover visual, as a shared asset path ("/assets/...") or a repo path.
    cover: z.string().optional(),
    // People signing the document, listed in the footer.
    authors: z
      .array(
        z.object({
          name: z.string(),
          role: z.string().optional(),
          email: z.string().email().optional(),
        }),
      )
      .default([]),
    // Overrides the default footer disclaimer.
    footerNote: z.string().optional(),
    status: z.enum(["draft", "review", "final"]).default("draft"),
  }),
});

export const collections = { documents };
