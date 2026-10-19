// Renderer resolution: which component draws a given wiki page.
//
// The tree under `src/renderers/` mirrors the content tree of the repo, so the position of a
// renderer file is its rule:
//
//   src/renderers/2-Areas/team/[slug]/index.astro
//     draws  2-Areas/team/<any>  (the folder and its index file)
//
// A `[param]` segment matches any single path segment and exposes it under that name. A folder
// page matches as if its path ended in `index`, so `.../[slug]/index.astro` draws both the
// folder and the `index.mdx` it holds (they are one page); only a literal `index` claims a
// folder, so `[name].astro` stays a renderer of files. Everything with no renderer falls back
// to `default.astro`, the plain markdown view.
//
// A file named `<base>.<variant>.astro` next to `<base>.astro` adds a variant of that page,
// served at `/<page>/<variant>/`, a print view for instance. A
// variant attaches to its own base renderer, so it applies to exactly the pages that base draws.
// A variant that suits only some of them exports `appliesTo(id)` and is built where it returns
// true.
//
// The most specific match wins, counting literal segments. Two renderers that claim the same
// page with equal specificity is a bug in the tree, and throws at build time.

const MODULES = import.meta.glob<{ default: unknown }>("../renderers/**/*.astro", {
  eager: true,
});

const PREFIX = "../renderers/";

export interface Renderer {
  /** Content path this renderer claims, e.g. ["2-Areas", "team", "[slug]", "index"]. */
  segments: string[];
  /** Variant suffix taken from the filename (`[name].print.astro` → "print"), else null. */
  variant: string | null;
  /** Key of the base renderer this one belongs to, used to attach variants to their base. */
  base: string;
  component: any;
  /** Optional guard a variant exports to claim only part of its base's pages. */
  appliesTo?: (id: string) => boolean | Promise<boolean>;
}

function parse(key: string): Renderer | null {
  const rel = key.slice(PREFIX.length).replace(/\.astro$/, "");
  if (rel === "default") return null;
  const segments = rel.split("/");
  const last = segments[segments.length - 1];
  const dot = last.indexOf(".");
  let variant: string | null = null;
  if (dot !== -1) {
    variant = last.slice(dot + 1);
    segments[segments.length - 1] = last.slice(0, dot);
  }
  const module = MODULES[key] as { default: unknown; appliesTo?: Renderer["appliesTo"] };
  return {
    segments,
    variant,
    base: segments.join("/"),
    component: module.default,
    appliesTo: module.appliesTo,
  };
}

const ALL: Renderer[] = Object.keys(MODULES)
  .map(parse)
  .filter((r): r is Renderer => r !== null);

const DEFAULT_COMPONENT = (MODULES[`${PREFIX}default.astro`] as { default: unknown } | undefined)
  ?.default;

function isParam(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

/** Match one renderer against a content path. Returns its params, or null when it does not claim
 * the path. */
function match(
  renderer: Renderer,
  segments: string[],
  isFolder: boolean,
): Record<string, string> | null {
  if (renderer.segments.length !== segments.length) return null;
  // The trailing `index` of a folder is synthetic, so only a literal `index` claims a folder.
  if (isFolder && renderer.segments[renderer.segments.length - 1] !== "index") return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < segments.length; i++) {
    const claim = renderer.segments[i];
    if (isParam(claim)) params[claim.slice(1, -1)] = segments[i];
    else if (claim !== segments[i]) return null;
  }
  return params;
}

/** Literal segments a renderer commits to. More literals means more specific. */
function specificity(renderer: Renderer): number {
  return renderer.segments.filter((s) => !isParam(s)).length;
}

export interface Resolution {
  component: any;
  params: Record<string, string>;
  /** Base key of the winning renderer, or null when the default view took the page. */
  base: string | null;
}

/** Path a page is matched on: a folder is matched as its own `index`, like the file it holds. */
export function matchPath(id: string, isFolder: boolean): string[] {
  const segments = id.split("/").filter(Boolean);
  return isFolder ? [...segments, "index"] : segments;
}

/** The component that draws a page, with the params its renderer captured. */
export function resolveRenderer(id: string, isFolder: boolean, variant?: string): Resolution {
  const segments = matchPath(id, isFolder);
  let best: { renderer: Renderer; params: Record<string, string> } | null = null;

  for (const renderer of ALL) {
    if ((renderer.variant ?? undefined) !== variant) continue;
    const params = match(renderer, segments, isFolder);
    if (!params) continue;
    if (!best) {
      best = { renderer, params };
      continue;
    }
    const diff = specificity(renderer) - specificity(best.renderer);
    if (diff > 0) best = { renderer, params };
    else if (diff === 0) {
      throw new Error(
        `Deux renderers revendiquent « ${segments.join("/")} » avec la même précision : ` +
          `${best.renderer.base} et ${renderer.base}. Un seul doit correspondre.`,
      );
    }
  }

  if (!best) return { component: DEFAULT_COMPONENT, params: {}, base: null };
  return { component: best.renderer.component, params: best.params, base: best.renderer.base };
}

/** Variant names available for a page, taken from the base renderer that draws it. */
export async function variantsFor(id: string, isFolder: boolean): Promise<string[]> {
  const { base } = resolveRenderer(id, isFolder);
  if (!base) return [];
  const names: string[] = [];
  for (const renderer of ALL) {
    if (renderer.base !== base || !renderer.variant) continue;
    if (renderer.appliesTo && !(await renderer.appliesTo(id))) continue;
    names.push(renderer.variant);
  }
  return names;
}

/** Every renderer in the tree, for the build-time check. */
export function listRenderers(): Renderer[] {
  return ALL;
}
