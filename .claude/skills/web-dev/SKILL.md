---
name: web-dev
description: Règles de développement de la web app `web/` (Astro, Tailwind, MDX) qui sert le wiki. À invoquer AVANT de créer ou modifier un composant, un renderer, un style, une collection, un script de build, ou pour adapter le template à une entreprise (nom, couleurs). Pour écrire un contenu MDX, utiliser la skill "edit-mdx".
---

# Développer la web app

`web/` est un site Astro statique qui sert tout le wiki : chaque markdown du dépôt devient une page à son chemin, et les entrées de la collection `documents` ont leur gabarit imprimable ou de slides. Stack : Astro, Tailwind 4, TypeScript, MDX, React pour la barre latérale.

**Tout le code et tous les commentaires sont en anglais**, même quand le contenu affiché est en français : noms de composants, de props, de variables, de fonctions et de classes CSS, commentaires, messages d'erreur, sortie console des scripts.

## Serveur et build

- Le serveur de dev tourne normalement déjà sur le port fixé dans `web/astro.config.mjs` (`server.port`). Utiliser ce port uniquement. S'il ne répond pas, le démarrer (`cd web && npm run dev`) ; s'il répond mais qu'il est cassé, le tuer et le relancer. Ne jamais le démarrer sur un autre port.
- `npm run build` lance d'abord trois garde-fous, puis construit `dist/` :
  - `assets:check` refuse une image commune trop large ou trop lourde et signale un chemin `/assets/...` sans fichier (`assets:fix` redimensionne, en écrasant les sources) ;
  - `routes:check` refuse un renderer qui ne correspond à aucun contenu, deux renderers qui revendiquent la même page, une variante sans base, deux pages qui se disputent une URL ;
  - `components:check` refuse deux composants de même nom, un composant appelé sans fichier, un composant sans section dans `COMPONENTS.md` et une section sans composant ni démo.

## Adapter le template à une entreprise

- `web/src/lib/site-config.ts` porte le nom de l'entreprise, son site, l'email de contact et le titre du wiki. Tout endroit qui nomme l'entreprise le lit là.
- `web/src/styles/global.css` (`@theme`) porte la palette des documents, `web/src/styles/deck.css` (`.deck`) celle des decks. Remplacer `--color-brand`, `--color-accent` et `--deck-accent` par les couleurs de la marque, en gardant une couleur de marque claire sur laquelle un texte foncé reste lisible.
- Décrire l'identité visuelle dans la section « Direction artistique » de `CLAUDE.md`, que lisent aussi les skills "generate-image" et "edit-mdx".

## Collections

- Les collections se déclarent dans `web/src/content.config.ts`. Le template n'en porte qu'une, `documents` : tout `.mdx` rangé dans un dossier `documents/` sous les dossiers PARA, dessiné par `components/pages/DocumentPage.astro` (`kind: document`) ou par `layouts/DeckLayout.astro` (`kind: deck`). Comme ces fichiers vivent partout dans l'arborescence, c'est `renderers/default.astro` qui les aiguille.
- Ajouter une collection se justifie quand une famille de pages a besoin d'un schéma et d'un rendu dédiés (fiches équipe, comptes rendus structurés, tableau de bord). La déclarer avec un motif de fichiers précis, puis lui donner un renderer positionnel.
- Ne pas faire porter un glob sur toute la racine du dépôt : il casse les chemins `image()` relatifs des autres collections. Les pages ordinaires du wiki sont lues depuis le disque et rendues avec `marked` (`lib/wiki-fs.ts`).

## Routage des pages

- L'URL d'une page est son chemin dans le dépôt, seuls les espaces devenant des tirets. Un fichier `index.mdx` ou `README.md` et son dossier sont une seule et même page ; le `README.md` racine est la page d'accueil, `/`.
- Une seule route existe, `web/src/pages/[...path].astro`. Le composant qui dessine une page vient de sa position dans `web/src/renderers/`, dont l'arborescence calque celle du contenu :

  ```
  web/src/renderers/2-Areas/equipe/[slug]/index.astro
     dessine   2-Areas/equipe/<personne>/ et son index.mdx
  ```

- Un segment `[param]` accepte n'importe quel segment de chemin et le passe au renderer dans `params`. Un dossier se résout comme s'il finissait par `index`. Le renderer le plus précis gagne, la précision se comptant en segments littéraux. Toute page sans renderer tombe sur `renderers/default.astro`.
- Un renderer reçoit `id` (le chemin de la page), `isFolder` et `params`. Il retrouve son entrée de collection avec `entryForPage` (`lib/content-lookup.ts`), puisque le loader slugifie les identifiants.
- Un lien vers une autre page passe toujours par `wikiUrl(id)`, jamais par une URL écrite à la main.
- **Variantes.** Un fichier `[name].print.astro` posé à côté de `[name].astro` ajoute une variante servie sur `/<page>/print/`. Une variante qui ne convient qu'à une partie des pages de son renderer exporte `appliesTo(id)`.
- **Corps volumineux.** Quand un renderer doit pouvoir déléguer à `default.astro`, son corps part dans `components/pages/` et le renderer se réduit au choix entre les deux, comme `DocumentPage.astro`.

## Composants

- Tous les composants d'affichage vivent dans `web/src/components/` (les slides dans `components/deck/`). `components/index.ts` les découvre avec `import.meta.glob` et les expose par leur nom de fichier : **ajouter un composant revient à déposer un fichier**, utilisable dans les MDX au rebuild suivant, sans import.
- Les noms de fichiers sont donc uniques dans toute l'arborescence. Les corps de pages de `components/pages/` sont exclus de la table.
- Un renderer qui affiche du MDX passe `components={mdxComponents}` à `<Content />`, faute de quoi ses composants ne rendent rien, silencieusement.
- **Un composant porte le nom de sa fonction visuelle, jamais celui d'une section** : `NumberedCards` et pas `NosEngagements`, puisque le même composant sert aux engagements, aux personas ou aux principes. Un seul dossier, pas de préfixe par famille : le même composant sert un document et un deck.
- Un composant reste générique, sans texte propre à un document ni lien avec un projet précis.
- Un slot MDX arrive déjà enveloppé dans un `<p>` : un composant qui reçoit du contenu l'enveloppe dans un `<div>`, jamais dans un `<p>`, sinon le parseur casse le bloc.
- **Catalogue.** `COMPONENTS.md` répertorie chaque composant : un titre `###` à son nom, une description courte et un bloc ```` ```mdx ```` d'usage avec des données fictives, rendu en démo sur `/COMPONENTS/`. Une slide prend un bloc ```` ```mdx slide ````, rendue sur la même page dans un cadre `.deck` à l'échelle. `DeckShell` prend un bloc ```` ```mdx deck ````, seul affiché dans une iframe, sur `/COMPONENTS/deck/`. Créer, renommer ou supprimer un composant, ou changer ses props, met à jour sa section dans le même changement. Avant de créer un composant, y chercher celui qui existe déjà.

## Styles et jetons

- `web/src/styles/global.css` porte les jetons, la typographie et le cadre des documents. Palette et échelle (`--text-micro` à `--text-h1`) sont déclarées dans `@theme`, donc utilisables en `var(--color-ink)` comme en utilitaire Tailwind (`bg-alt`, `text-muted`, `border-border`).
- **Le markdown se style par la classe `md`.** `lib/md-class.ts` la pose sur chaque élément issu d'un markdown ; les règles visent `h2.md`, `p.md`, `td.md` et ne débordent jamais dans un composant.
- **Le cadre est commun.** `.doc-frame`, `.doc-page`, `.doc-body` et `.doc-footer` donnent la largeur de page, le chapô, les listes de prose et le pied de page. Une vue qui diverge redéfinit les jetons, jamais les règles : l'impression descend l'échelle d'un cran sous `@media print`, `.doc-compact` resserre les pages de travail.
- **Les slides ont leur propre identité**, confinée sous `.deck` dans `styles/deck.css` (le `body` d'une page de deck, ou le cadre d'une slide du catalogue) : trois surfaces (`paper`, `ink`, `accent`) et une police. Une slide pose sa surface une fois ; ses blocs lisent `--on-surface`, `--rule`, `--muted` et `--dim`, sans variante claire et sombre. Un deck se compose de slides entières (`SlideCover`, `SlideSection`, `SlideStatement`, `SlideTeam`, `SlideGantt`, `SlideClosing`) et des blocs de `components/deck/blocks/`. Une classe CSS du deck ne porte jamais un nom d'utilitaire Tailwind (`invert` en tête), puisque `global.css` voyage avec le deck.
- **Aucune valeur en dur dans un composant**, ni couleur ni taille de police. Une nuance absente devient un jeton de `global.css`, nommé d'après son rôle et non sa teinte.
- **Sélecteurs globaux.** La route unique importe tous les renderers, donc tous les blocs `is:global` finissent dans le même bundle. Confiner `html`, `body` ou `*` sous une racine (`.deck`, `.doc-page`), et enrober le préfixe de `:where()` pour un reset.

## Tailwind d'abord

- Une règle CSS ne s'écrit que si Tailwind ne peut pas l'exprimer. Espacement, couleurs, tailles, grilles, flex, arrondis, bordures passent par des classes, variantes d'impression comprises (`print:p-0`, `print:break-inside-avoid`). Un composant n'a normalement pas de bloc `<style>`.
- Restent légitimes en CSS le style d'un contenu de slot (`:global(li)`), les pseudo-éléments et compteurs, la géométrie de page (`@page`) et les `calc()` de pagination. Une règle de `global.css` s'écrit en `@apply` sauf pour ce que Tailwind ne nomme pas.
- Le style inline est réservé aux valeurs calculées en JavaScript, comme la position d'une barre de planning.
- Copier un design depuis une capture : hex exacts, mobile d'abord (sm/md/lg/xl), correspondance avec Tailwind ou extension de `global.css`.

## Impression

- `@page` s'applique à tout le site : **la géométrie de page se décide dans `global.css`, une seule fois.** Un document qui a besoin de respirer ajoute du padding à son conteneur. Les pages nommées (`@page cover`) sont sûres.
- La gouttière horizontale vient de la marge de page, pas du conteneur : deux marges superposées rétrécissent le texte, un conteneur trop large fait déborder les blocs.
- `break-inside: avoid` ne vise que des blocs atomiques (une carte, une ligne de planning, un visuel), jamais un conteneur long, qui laisserait une demi-page blanche.
- Vérifier un changement d'impression sur le PDF, jamais sur le rendu écran : skill "print-doc".

## Images

- Trois passages mènent au service d'images d'Astro avec la même politique (`lib/image-policy.ts`) : `docImage` (`lib/doc-image.ts`) pour les composants, le plugin `lib/md-images.ts` pour le markdown des collections, `resizeHtmlImages` dans `WikiContent` pour les pages rendues avec `marked`. Une image markdown sort à 1600 px au plus.
- **Dans un composant, toute image passe par `docImage`**, jamais par un `<img src={...}>` brut :

  ```astro
  ---
  import { docImage } from "~/lib/doc-image";
  const renderedSrc = await docImage(src, { width: 1600 });
  ---
  <img src={renderedSrc} alt={alt} class="..." />
  ```

  `docImage` est une fonction et pas un composant : un `<img>` rendu par un composant enfant perdrait les styles scopés de son appelant. La `width` vaut environ deux fois la largeur d'affichage : bandeau 1800, capture pleine largeur 1600, carte demi-largeur 900, photo de carte 700, portrait 240, visuel détouré 240 à 600.
- **JPEG plutôt que WebP**, parce que le PDF ne connaît pas le WebP : Chromium réencoderait chaque image sans perte et multiplierait son poids par dix. Seuls les visuels de `/assets/visuels/` restent en PNG pour leur transparence. **Pas de `srcset`**, dont le choix n'est pas déterministe sous `page.pdf()`. Chromium embarque chaque bitmap à sa résolution servie : la largeur demandée est le seul levier sur le poids du PDF.
- Rien ne se sert depuis `web/public/`, recopié tel quel. Un chemin `/assets/...` écrit en dur dans un layout est servi brut depuis `src/assets` par `lib/asset-sources.ts`.
- Un fichier image corrompu dans un dossier de contenu fait échouer le build.
