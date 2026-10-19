// Checks the components a document actually uses against the ones the MDX
// runtime can provide.
//
// Components reach MDX without an import: `src/components/index.ts` maps every
// .astro file by its base name, and each renderer passes that map to
// `<Content components={...} />`. Two failure modes are silent at runtime and
// caught here.
//
// Two files sharing a base name: one silently shadows the other, since the map
// is keyed by name alone. A component used in a document but absent from the
// map: MDX renders nothing at all for it, without an error.
//
// It also keeps COMPONENTS.md, the catalogue, in step with the folder.
//
// Run by `npm run components:check`, and by `prebuild` before every build.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const WEB_ROOT = path.resolve(import.meta.dirname, "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const COMPONENTS_DIR = path.join(WEB_ROOT, "src", "components");
const CONTENT_DIRS = ["1-Projects", "2-Areas", "3-Resources", "4-Archives"];

/** Every .astro under src/components, by base name. */
function listComponents() {
  const byName = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else if (entry.name.endsWith(".astro")) {
        const name = entry.name.replace(".astro", "");
        const rel = path.relative(COMPONENTS_DIR, abs);
        byName.set(name, [...(byName.get(name) ?? []), rel]);
      }
    }
  };
  walk(COMPONENTS_DIR);
  return byName;
}

/** Capitalised tags used in a document, minus the ones it declares itself. */
function usedComponents(source) {
  const used = new Set();
  for (const m of source.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)) used.add(m[1]);
  // A name imported explicitly is the document's business, not the map's.
  for (const m of source.matchAll(/^import\s+(\w+)\s+from/gm)) used.delete(m[1]);
  return used;
}

function listDocuments() {
  const docs = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (entry.name.endsWith(".mdx")) docs.push(abs);
    }
  };
  for (const dir of CONTENT_DIRS) walk(path.join(REPO_ROOT, dir));
  return docs;
}

const components = listComponents();
const errors = [];

for (const [name, files] of components) {
  if (files.length > 1) {
    errors.push(
      `Le nom ${name} est porté par ${files.length} fichiers (${files.join(", ")}). ` +
        `La table des composants MDX est indexée par nom, l'un masquerait l'autre.`,
    );
  }
}

const documents = listDocuments();
let uses = 0;
for (const abs of documents) {
  const rel = path.relative(REPO_ROOT, abs);
  const source = fs.readFileSync(abs, "utf-8");
  for (const name of usedComponents(source)) {
    uses++;
    if (!components.has(name)) {
      errors.push(`${rel} utilise <${name}>, qui n'existe pas dans src/components.`);
    }
  }
}

// COMPONENTS.md documents every component of the map, one level 3 heading each,
// followed by its demo fence. `pages/` is left out of the map, hence of the file.
const catalogue = fs.readFileSync(path.join(REPO_ROOT, "COMPONENTS.md"), "utf-8");
const sections = catalogue.split(/^### /m).slice(1);
const documented = new Set(sections.map((s) => s.split("\n")[0].trim()));
for (const [name, files] of components) {
  if (files.every((f) => f.startsWith(`pages${path.sep}`))) continue;
  if (!documented.has(name)) {
    errors.push(`${name} n'a pas de section dans COMPONENTS.md.`);
  }
}
for (const section of sections) {
  const name = section.split("\n")[0].trim();
  if (!components.has(name)) {
    errors.push(`COMPONENTS.md documente ${name}, qui n'existe pas dans src/components.`);
  } else if (!/^```mdx( slide| deck)?$/m.test(section)) {
    errors.push(`La section ${name} de COMPONENTS.md n'a pas de démo \`\`\`mdx.`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problème(s) de composants :`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log(
  `✓ Composants : ${components.size} disponibles sans import, ` +
    `${uses} usages vérifiés dans ${documents.length} documents.`,
);
