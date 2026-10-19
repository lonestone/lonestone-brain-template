// image-policy.ts: Encoding choices shared by every image path of the documents.
//
// Three paths render images: components through `docImage`, markdown collections
// through `remarkDocImages`, and pages rendered with `marked` through
// `resizeHtmlImages`. They must agree on format and size, or the same screenshot
// weighs differently from one view to the next. This module holds the policy and
// imports nothing from `astro:assets`, so the Astro config can load it.

/** Served width of an image written in markdown: a full-width screenshot of the column. */
export const MARKDOWN_IMAGE_WIDTH = 1600;

export const JPEG_QUALITY = 82;

/** Transparent areas are flattened on white before JPEG encoding, or they turn black. */
export const JPEG_BACKGROUND = "#ffffff";

/** Image extensions the image service can resize. */
export const RESIZABLE_IMAGE = /\.(jpe?g|png|webp|avif)$/i;

/**
 * JPEG rather than WebP, against web practice, because PDF has no WebP support:
 * Chromium then decodes the image and re-encodes it as a losslessly compressed
 * bitmap, multiplying its weight tenfold. A JPEG source is instead copied
 * straight into the PDF stream. Only the cut-out visuals of `/assets/visuels/`
 * stay in PNG, since they need transparency.
 */
export function outputFormat(publicPath: string): "jpeg" | "png" {
  return publicPath.startsWith("/assets/visuels/") ? "png" : "jpeg";
}
