---
name: print-doc
description: Exporte en PDF n'importe quelle page de la web app (document, deck, page du wiki). À utiliser dès que l'utilisateur veut imprimer ou exporter une page en PDF, et pour vérifier un changement de mise en page à l'impression.
argument-hint: <route> <fichier-de-sortie.pdf>
allowed-tools: Bash, Read, Glob
---

# Exporter une page en PDF

Une seule commande pour toutes les pages. Le script ignore le type de document : il prend une route et un fichier de sortie.

```bash
node .claude/skills/print-doc/print-doc.js <route> <sortie.pdf>
```

Exemple :

```bash
node .claude/skills/print-doc/print-doc.js \
  "/1-Projects/refonte-site/documents/Note-de-cadrage/" \
  "1-Projects/refonte-site/documents/Note de cadrage.pdf"
```

## Où trouver la route et où déposer le PDF

Le PDF se dépose à côté de son fichier source, sous le même nom.

La route d'une page est son chemin dans le dépôt, sans extension, encadré de slashes, les espaces remplacés par des tirets. `2-Areas/finance/documents/Rapport annuel 2026.mdx` s'imprime donc depuis `/2-Areas/finance/documents/Rapport-annuel-2026/`. Un dossier et son `README.md` (ou `index.mdx`) sont une seule page, servie à la route du dossier.

| Source | Route | PDF |
|---|---|---|
| `<para>/<chemin>/documents/<nom>.mdx` (`kind: document`) | `/<para>/<chemin>/documents/<nom>/` | à côté du MDX, au format A4 |
| `<para>/<chemin>/documents/<nom>.mdx` (`kind: deck`) | `/<para>/<chemin>/documents/<nom>/` | à côté du MDX, une slide par page en 16:9 |
| toute autre page `.md` ou `.mdx` | `/<chemin>/` | à côté de la source, au format A4 |

Une page qui expose une variante d'impression (fichier `[name].print.astro` dans `web/src/renderers/`) s'imprime depuis `<route>print/`.

## Ce que le script fait selon l'environnement

1. **Playwright** : cherché dans la skill, puis dans les skills voisines, puis dans `web/node_modules`. S'il manque partout, la commande d'installation est affichée.
2. **Serveur** : si le serveur de dev Astro répond déjà sur le port défini par `server.port` dans `web/astro.config.mjs` (4321 par défaut), il est réutilisé tel quel, sans build. Sinon le script lance `npm run build` puis un `astro preview` sur ce même port, et l'arrête en sortant.
3. **Format** : A4 pour un document ou une page du wiki. Une page qui contient un deck (`<deck-stage>`) prend la taille de page déclarée par le deck, 1920 × 1080 par défaut, une slide par page.
4. **Rendu** : barre d'outils de dev masquée, attente du décodage des images, attente du rendu Mermaid quand la page en contient, puis impression avec les fonds.
5. **Sommaire paginé** : si la page contient des emplacements `[data-for]`, les numéros de page y sont injectés. Sinon l'étape est sautée.

## Installation

```bash
cd .claude/skills/print-doc && npm install
```

Le `postinstall` télécharge Chromium s'il n'est pas déjà en cache.

## Après l'export

Ouvrir le PDF et le relire page par page : schémas Mermaid qui débordent sur deux pages, blocs coupés, images floues ou trop lourdes, page blanche derrière un grand bloc. Corriger dans le MDX ou le composant, puis réexporter.
