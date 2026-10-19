#!/usr/bin/env node
// print-doc.js: export any route of the web app to PDF.
// No special case per document type: the route and the output file are arguments.
// What varies is how a server is obtained, and the page size (A4 for documents,
// the deck's own 16:9 size when the page holds a <deck-stage>).
import { spawn, execSync } from "node:child_process";
import { resolve, dirname, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "../../..");
const WEB_DIR = resolve(REPO_ROOT, "web");

const [route, outArg] = process.argv.slice(2);
if (!route || !outArg) {
  console.error("Usage: node print-doc.js <route> <output.pdf>");
  console.error("  e.g. node print-doc.js /1-Projects/website-redesign/documents/scoping-note/ \\");
  console.error("         1-Projects/website-redesign/documents/scoping-note.pdf");
  process.exit(1);
}
const outFile = isAbsolute(outArg) ? outArg : resolve(REPO_ROOT, outArg);
mkdirSync(dirname(outFile), { recursive: true });

// ── Playwright, wherever it is installed ────────────────────────────────────
async function loadChromium() {
  // require.resolve returns the package entry point: an ESM import cannot
  // resolve a node_modules folder on its own.
  const require = createRequire(import.meta.url);
  const roots = [__dirname, WEB_DIR, resolve(__dirname, "..")];
  for (const root of roots) {
    try {
      const entry = require.resolve("playwright", { paths: [root] });
      const mod = await import(pathToFileURL(entry).href);
      // Playwright ships as CommonJS: depending on the resolution path, the
      // exports arrive flat or under `default`.
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return chromium;
    } catch {}
  }
  console.error("Playwright not found. Install the skill dependencies:");
  console.error("  cd .claude/skills/print-doc && npm install");
  process.exit(1);
}

// ── Server: reuse the one running, otherwise start one ──────────────────────
function devPort() {
  const cfg = resolve(WEB_DIR, "astro.config.mjs");
  const m = existsSync(cfg) && readFileSync(cfg, "utf8").match(/server:\s*\{[^}]*port:\s*(\d+)/s);
  return m ? Number(m[1]) : 4321;
}

async function responds(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return res.status < 500;
  } catch {
    return false;
  }
}

async function waitFor(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    if (await responds(url)) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`No response from ${url} after 15s`);
}

async function server() {
  const port = devPort();
  const url = `http://localhost:${port}${route}`;
  if (await responds(url)) {
    console.log(`Dev server already listening on :${port}`);
    return { url, stop: () => {} };
  }
  console.log(`Nothing on :${port}, building then previewing...`);
  execSync("npm run build", { cwd: WEB_DIR, stdio: "inherit" });
  const proc = spawn("npm", ["run", "preview", "--", "--port", String(port)], {
    cwd: WEB_DIR,
    stdio: ["ignore", "ignore", "pipe"],
  });
  proc.stderr.on("data", (d) => process.stderr.write(d));
  await waitFor(url);
  return { url, stop: () => proc.kill("SIGTERM") };
}

// ── Rendering ───────────────────────────────────────────────────────────────
const A4 = { width: 794, height: 1123 }; // 96 dpi

const chromium = await loadChromium();
const { url, stop } = await server();
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.setViewportSize(A4);
  await page.goto(url, { waitUntil: "load", timeout: 60000 });

  // A deck declares its own page size (1920 × 1080 by default) through the
  // @page rule deck-stage injects, so the PDF follows it instead of A4.
  const deck = await page.evaluate(() => {
    const stage = document.querySelector("deck-stage");
    if (!stage) return null;
    return {
      width: Number(stage.getAttribute("width")) || 1920,
      height: Number(stage.getAttribute("height")) || 1080,
    };
  });
  if (deck) await page.setViewportSize(deck);

  await page.addStyleTag({
    content: `
      astro-dev-toolbar { display: none !important; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      html, body { background: #fff !important; }
    `,
  });
  await page.emulateMedia({ media: "print" });

  await page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.onload = i.onerror = r; })),
    ),
  );

  const mermaid = await page.evaluate(() => document.querySelectorAll(".mermaid").length);
  if (mermaid > 0) {
    await page.waitForFunction(
      (n) => document.querySelectorAll(".mermaid svg").length >= n,
      mermaid,
      { timeout: 15000 },
    );
  }

  // Paginated table of contents: page numbers are injected into `[data-for]`
  // slots when the route has them, skipped elsewhere.
  const hasToc = !deck && (await page.evaluate(() => document.querySelectorAll("[data-for]").length > 0));
  if (hasToc) {
    const pages = await page.evaluate((h) => {
      const out = {};
      document.querySelectorAll(".section-sep[id], h2[id], h3[id], h4[id]").forEach((el) => {
        out[el.id] = Math.ceil(el.getBoundingClientRect().top / h);
      });
      return out;
    }, A4.height);
    await page.evaluate((nums) => {
      document.querySelectorAll("[data-for]").forEach((el) => {
        const key = el.getAttribute("data-for");
        if (nums[key] !== undefined) el.textContent = String(nums[key]);
      });
    }, pages);
  }

  await page.pdf({
    path: outFile,
    printBackground: true,
    margin: { top: "0", bottom: "0", left: "0", right: "0" },
    ...(deck ? { preferCSSPageSize: true } : { format: "A4" }),
  });
  console.log(`PDF written: ${outFile}`);
} finally {
  await browser.close();
  stop();
}
