---
name: edit-mdx
description: Règles d'écriture des contenus MDX du wiki (documents, decks, pages qui appellent des composants). À invoquer AVANT de créer ou de modifier un fichier `.mdx`. Pour modifier le code de la web app (composants, styles, renderers), utiliser la skill "web-dev".
---

# Écrire un contenu MDX

Le dossier `web/` affiche chaque page du wiki à son chemin dans le dépôt. Un fichier `.mdx` mêle du markdown et des appels de composants ; cette skill dit comment l'écrire pour qu'il s'affiche bien à l'écran et en PDF.

## Documents et decks

- Un `.mdx` rangé dans un dossier `documents/`, n'importe où sous `1-Projects/`, `2-Areas/`, `3-Resources/` ou `4-Archives/`, appartient à la collection `documents`. Lire son schéma dans `web/src/content.config.ts` avant d'écrire le frontmatter, sans jamais deviner un champ ni une valeur.
- `kind: document` (par défaut) donne le gabarit imprimable : en-tête, couverture, sommaire, pied de page. `kind: deck` donne une présentation en slides 16:9. La skill "write-document" décrit la rédaction d'un document, la skill "build-slides" celle d'un deck.
- Un document commence directement à sa première section `##`. Le titre et le chapô vivent dans le frontmatter (`title`, `lead`), le sommaire se construit depuis les `##`, et la numérotation des sections est automatique : un titre n'écrit jamais son numéro.
- Un `.mdx` hors d'un dossier `documents/` s'affiche comme une page ordinaire du wiki, avec ses composants.

## Ce qu'un MDX contient

- Du markdown et des appels de composants, rien d'autre. Les données passent en props et en slots, jamais en `export const`, en variables de frontmatter ni en blocs de script.
- **Aucun import.** Tous les composants sont chargés automatiquement : écrire `<Callout>` ou `<StatGrid />` directement dans le texte.
- Pas de balise HTML brute (`<div>`, `<section>`, `<h2>`, `<p>`, `<img>`). Une mise en page qu'aucun composant ne couvre demande un nouveau composant, avec la skill "web-dev".

## Choisir un composant

- `COMPONENTS.md`, à la racine, décrit chaque composant avec une démo et son code ; le site le montre sur `/COMPONENTS/` (et `/COMPONENTS/deck/` pour les slides). Y chercher le composant avant d'écrire, et recopier les props de sa démo plutôt que de les deviner.
- Préférer un composant à un tableau markdown dès qu'il en existe un : chiffres clés (`StatGrid`, `InfoGrid`), étapes (`NextStep`, `PhasesRoadmap`), planning (`GanttPlanning`), risques (`RiskGrid`, `Risk`), budget (`BudgetTable`, `BudgetCallout`), équipe (`TeamProfile`).
- Un contenu passé en slot s'écrit en markdown simple (listes, paragraphes).

## Images

- **Image propre à un contenu** : dans un dossier `assets/` à côté du fichier, appelée en markdown `![Ce que montre l'image](./assets/nom.png)`. La nommer d'après ce qu'elle montre, sans espace. Dans une prop de composant, elle s'appelle par son chemin dans le dépôt (`src="/1-Projects/<projet>/documents/assets/ecran.png"`).
- **Image commune à plusieurs contenus** : dans `web/src/assets/`, appelée par `/assets/<dossier>/<fichier>`. Le template y range `visuels/` (illustrations détourées), `captures/`, `photos/` et `personnes/`.
- Jamais dans `web/public/`. Les images sont redimensionnées automatiquement, une capture en haute résolution convient.

## Règles pour un bon PDF

- Pas de gras dans les items de liste ni dans les cellules de tableau : il provoque des césures erratiques.
- Pas de lien markdown dans un `Callout` : il ressort en syntaxe brute. Écrire l'URL en texte.
- Pas d'émoji dans les titres `##`, qui alimentent le sommaire.
- Pas de bloc de code pour une arborescence : utiliser un tableau.
- Un schéma Mermaid est vertical (`flowchart TD`), compact (six nœuds au plus) et toujours précédé d'un titre `###`.

## Vérifier

- Reconstruire le site après toute modification d'un document : `cd web && npm run build`. Le build signale en clair un champ de frontmatter invalide, un composant inconnu ou une image introuvable.
- Ouvrir la page sur le serveur de dev (port fixé dans `web/astro.config.mjs`), et pour un document destiné à être imprimé, vérifier le PDF avec la skill "print-doc".
