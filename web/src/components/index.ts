// Auto-discovers every .astro component in this folder, sub-folders included.
// A component dropped here is usable straight from an MDX file, with no import
// at the top of the document.
//
// Rendering goes through `<Content components={mdxComponents} />` in each
// renderer: MDX compiles an unimported capitalised name into a lookup in this
// map. File names are therefore unique across the whole tree, which
// `npm run components:check` verifies at build time.
//
// Page bodies under `pages/` are left out: no document calls them, and they
// import this map themselves to render their MDX, which would make a cycle.
const modules = import.meta.glob(['./**/*.astro', '!./pages/**'], { eager: true })

export const mdxComponents: Record<string, unknown> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    path.split('/').pop()!.replace('.astro', ''),
    (mod as { default: unknown }).default,
  ])
)
