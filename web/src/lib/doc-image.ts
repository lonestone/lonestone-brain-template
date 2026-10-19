// doc-image.ts: single entry point for every image used by the documents.
//
// Documents refer to their visuals by public path. A shared visual lives under
// `src/assets` and is called `/assets/photos/x.jpg`; a visual filed next to the
// content that shows it is called by its repository path,
// `/1-Projects/x/assets/z.png`. Both go through Astro's image
// service here. Nothing is served from `public/`, which is copied verbatim, at
// its original resolution.
//
// Chromium embeds every bitmap in a PDF at its intrinsic resolution, never at
// its display size. A 7000px photo rendered in a 940px banner therefore weighs
// its full 7000px in the export. The served width is the only lever, and it is
// set here, for the web and for print at once.
//
// This is a function rather than a component: an `<img>` rendered by a child
// component loses its caller's scoped-style attribute, and every sizing rule
// with it. Components keep their own tag and only ask for the URL.
import { getImage } from "astro:assets";
import {
  JPEG_BACKGROUND,
  JPEG_QUALITY,
  RESIZABLE_IMAGE,
  outputFormat,
} from "./image-policy";

type Loaded = { default: ImageMetadata };

const sharedFiles = import.meta.glob<Loaded>(
  "/src/assets/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: true },
);

// Loaded on demand: a page calls for a handful of them at most. Raw captures in
// `3-Resources/sources` are never displayed.
const contentFiles = import.meta.glob<Loaded>([
  "../../../{1-Projects,2-Areas,3-Resources,4-Archives}/**/*.{jpg,jpeg,png,webp,avif}",
  "!../../../3-Resources/sources/**",
]);

const CONTENT_PATH = /^\/(1-Projects|2-Areas|3-Resources|4-Archives)\//;

type Format = "jpeg" | "png" | "webp";

interface Options {
  /** Served width, in pixels. Aim for twice the CSS display width. */
  width: number;
  /** Force the output format. Defaults to jpeg, png for cut-out visuals. */
  format?: Format;
}

function decode(src: string): string {
  try {
    return decodeURI(src);
  } catch {
    return src;
  }
}

async function sourceFor(publicPath: string): Promise<ImageMetadata | undefined> {
  if (publicPath.startsWith("/assets/")) {
    return sharedFiles[`/src/assets${publicPath.slice("/assets".length)}`]?.default;
  }
  const load = contentFiles[`../../..${publicPath}`];
  return load ? (await load()).default : undefined;
}

/**
 * Returns the URL of the derivative to serve for a document visual path.
 * A remote URL, a relative path or an unknown path is returned unchanged.
 */
export async function docImage(
  src: string | undefined,
  { width, format }: Options,
): Promise<string | undefined> {
  if (!src) return src;

  const publicPath = decode(src.split(/[?#]/)[0]);
  const managed = publicPath.startsWith("/assets/") || CONTENT_PATH.test(publicPath);
  if (!managed || !RESIZABLE_IMAGE.test(publicPath)) return src;

  const source = await sourceFor(publicPath);
  if (!source) {
    // A missing visual is a content defect, not an infrastructure one: report it
    // and let the raw path through rather than failing the build of every
    // document. `npm run assets:check` lists them all.
    console.warn(`docImage: no image found for path "${publicPath}".`);
    return src;
  }

  const output: Format = format ?? outputFormat(publicPath);
  const rendered = await getImage({
    src: source,
    // Never upscale: a source smaller than the target keeps its own size.
    width: Math.min(width, source.width),
    format: output,
    quality: output === "jpeg" ? JPEG_QUALITY : undefined,
    background: output === "jpeg" ? JPEG_BACKGROUND : undefined,
  });
  return rendered.src;
}

const IMG_SRC = /(<img\b[^>]*?\bsrc=)(?:"([^"]*)"|'([^']*)')/gi;

/**
 * Runs every `<img>` of already-rendered HTML through `docImage`, for the pages
 * rendered with `marked`, which cannot call it per image. `dir`, the repository
 * folder of the source document, resolves relative sources.
 */
export async function resizeHtmlImages(
  html: string,
  { width, dir }: { width: number; dir?: string },
): Promise<string> {
  const toPublic = (src: string): string => {
    if (!dir || /^([a-z]+:|\/|#)/i.test(src)) return src;
    const segments = dir.split("/").filter(Boolean);
    for (const part of src.split("/")) {
      if (part === "" || part === ".") continue;
      if (part === "..") segments.pop();
      else segments.push(part);
    }
    return `/${segments.join("/")}`;
  };

  const sources = new Set(
    [...html.matchAll(IMG_SRC)].map((match) => match[2] ?? match[3] ?? ""),
  );
  const resolved = new Map<string, string>();
  await Promise.all(
    [...sources].map(async (src) => {
      const publicSrc = toPublic(src);
      const rendered = await docImage(publicSrc, { width });
      if (rendered && rendered !== publicSrc) resolved.set(src, rendered);
    }),
  );

  return html.replace(IMG_SRC, (full, head: string, dq?: string, sq?: string) => {
    const rendered = resolved.get(dq ?? sq ?? "");
    return rendered ? `${head}"${rendered}"` : full;
  });
}
