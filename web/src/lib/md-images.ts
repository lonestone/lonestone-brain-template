// md-images.ts: Brings the images of markdown collections under the image policy.
//
// Astro already resizes an image written in markdown when its path is relative:
// it imports the file and renders it through its image service. Left alone, it
// keeps the intrinsic width and encodes WebP, which the PDF export cannot copy
// as is (see image-policy). An absolute path, `/assets/x.png` or
// `/2-Areas/.../x.png`, it does not touch at all, and the source ships at full size.
//
// This remark plugin runs before Astro collects the images. It rewrites every
// local path to one relative to the document, so Astro picks it up, and sets the
// transform on the node: width capped at the source's own, JPEG on a white
// ground, eager loading so a PDF export never meets a placeholder. Astro passes
// these properties to its image service, for `.md` and `.mdx` alike.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";
import type { VFile } from "vfile";
import {
  JPEG_BACKGROUND,
  JPEG_QUALITY,
  MARKDOWN_IMAGE_WIDTH,
  RESIZABLE_IMAGE,
  outputFormat,
} from "./image-policy";

const LIB_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(LIB_DIR, "../../..");
const SHARED_ASSETS = path.resolve(LIB_DIR, "../assets");

function decode(url: string): string {
  try {
    return decodeURI(url);
  } catch {
    return url;
  }
}

/** Absolute file behind a markdown image path, or null for a remote one. */
function fileFor(url: string, documentDir: string): string | null {
  if (/^([a-z]+:|\/\/)/i.test(url)) return null;
  if (url.startsWith("/assets/")) return path.join(SHARED_ASSETS, url.slice("/assets/".length));
  if (url.startsWith("/")) return path.join(REPO_ROOT, url);
  return path.resolve(documentDir, url);
}

/** Public path of a file, as `outputFormat` expects it. */
function publicPathOf(file: string): string {
  const shared = path.relative(SHARED_ASSETS, file);
  if (!shared.startsWith("..")) return `/assets/${shared.split(path.sep).join("/")}`;
  return `/${path.relative(REPO_ROOT, file).split(path.sep).join("/")}`;
}

async function prepare(node: Image, documentDir: string): Promise<void> {
  const file = fileFor(decode(node.url), documentDir);
  if (!file || !RESIZABLE_IMAGE.test(file) || !fs.existsSync(file)) return;

  let relative = path.relative(documentDir, file).split(path.sep).join("/");
  if (!relative.startsWith(".")) relative = `./${relative}`;
  node.url = encodeURI(relative);

  const { width = MARKDOWN_IMAGE_WIDTH } = await sharp(file).metadata();
  const format = outputFormat(publicPathOf(file));
  node.data ??= {};
  node.data.hProperties = {
    ...node.data.hProperties,
    width: Math.min(MARKDOWN_IMAGE_WIDTH, width),
    format,
    ...(format === "jpeg" ? { quality: JPEG_QUALITY, background: JPEG_BACKGROUND } : {}),
    loading: "eager",
  };
}

/** Remark plugin: resizes the local images of a markdown or MDX document. */
export function remarkDocImages() {
  return async (tree: Root, file: VFile) => {
    if (!file.path) return;
    const documentDir = path.dirname(file.path);
    const jobs: Promise<void>[] = [];
    visit(tree, "image", (node: Image) => {
      jobs.push(prepare(node, documentDir));
    });
    await Promise.all(jobs);
  };
}
