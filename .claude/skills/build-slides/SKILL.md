---
name: build-slides
description: Crée ou met à jour un deck de slides en MDX, rendu en 16:9 par la web app (soutenance, présentation, atelier, restitution). À utiliser dès que l'utilisateur demande des slides, une présentation ou un deck.
argument-hint: [sujet, ou fichier source à mettre en slides]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Construire un deck de slides

Crée ou met à jour un deck pour $ARGUMENTS. Le deck est un fichier MDX que la web app dessine en slides 1920 × 1080, mises à l'échelle de l'écran, avec navigation au clavier, vue présentateur et impression en PDF.

Avant d'écrire, invoquer la skill "edit-mdx" : ses règles valent pour le deck (pas d'import, pas de HTML brut, composants du catalogue).

## Où vit un deck

Un deck est un fichier `.mdx` placé dans un dossier `documents/`, n'importe où sous `1-Projects/`, `2-Areas/`, `3-Resources/` ou `4-Archives/`, au plus près du projet ou du sujet qu'il sert. Exemple : `1-Projects/refonte-site/documents/Restitution du cadrage.mdx`, servi sur `/1-Projects/refonte-site/documents/Restitution-du-cadrage/`.

Le nom de fichier dit ce que le deck présente, en français, espaces autorisés. Un deck qui accompagne un document formel (skill "write-document") vit dans le même dossier `documents/`.

### Frontmatter

```yaml
---
kind: deck
title: "Restitution du cadrage"
date: 2026-11-12
---
```

`kind: deck` fait dessiner le fichier par le gabarit de deck plutôt que par le gabarit de document. `title` et `date` sont requis. Lire le schéma de la collection `documents` dans `web/src/content.config.ts` pour les champs optionnels, sans les deviner.

### Corps

Le corps commence directement par `<DeckShell>`, qui enveloppe toutes les slides. Sa prop `label` s'affiche dans l'en-tête de chaque slide, suivie du `kicker` de la slide et de son rang. Elle prend la forme « Entreprise × Destinataire » pour un deck adressé à quelqu'un, ou le nom du sujet pour un deck interne.

```mdx
<DeckShell label="Entreprise × Destinataire">
  <SlideCover
    tag="Restitution du cadrage"
    title="Un site qui transforme les visites en demandes de devis"
    subtitle="Synthèse des quatre ateliers d'octobre et proposition de feuille de route."
    items={[
      { key: "Quand", value: "12 novembre 2026" },
      { key: "Qui", value: "Équipe projet et direction marketing" },
      { key: "Mise en ligne visée", value: "Mars 2027" },
    ]}
  />

  <Slide kicker="01 · Constat">
    <SlideHead title="Les visiteurs trouvent l'offre, puis repartent sans laisser de contact." />
    <SlideFigures>
      <SlideFigure value="62 %">des visites s'arrêtent sur la page tarifs.</SlideFigure>
      <SlideFigure value="1,4 %">des visites finissent par une demande de devis.</SlideFigure>
    </SlideFigures>
  </Slide>

  <SlideClosing
    eyebrow="15 minutes"
    headline="Vos questions."
    contacts={[{ role: "Direction de projet", name: "Prénom Nom", email: "prenom@exemple.com" }]}
  />
</DeckShell>
```

## Composants disponibles

Le catalogue `COMPONENTS.md`, section « Slides », donne pour chaque composant sa description, ses props et une démo rendue sur `/COMPONENTS/`. Le lire avant d'écrire, et y vérifier les props plutôt que de les supposer.

Un deck se compose de deux familles.

**Les slides entières** couvrent les pages qui reviennent dans tout deck :

| Composant | Usage |
|---|---|
| `SlideCover` | couverture : tag, titre, phrase de contexte, repères |
| `SlideSection` | intercalaire qui ouvre une partie, avec son rang |
| `SlideStatement` | une seule phrase, le temps d'arrêt d'une présentation |
| `SlideTeam` | l'équipe en bandeau de portraits |
| `SlideClosing` | dernière slide, la question posée à la salle et les contacts |
| `SlideGantt` | planning en barres sur une échelle de mois |

**Le vocabulaire de blocs** (`web/src/components/deck/blocks/`) couvre tout le reste. Une `Slide` porte la surface et l'en-tête, un `SlideHead` ouvre la page, et un ou deux blocs remplissent la hauteur restante :

| Bloc | Pour |
|---|---|
| `SlideHead` | ouvrir toute slide de contenu : kicker, titre, aside ou badge de prix |
| `SlideLead` | une prise de position centrée dans la hauteur |
| `SlideQuote` | une phrase mise à part, tenue par un filet |
| `SlideNumbers` / `SlideNumber` | grille numérotée : arguments, engagements, livrables |
| `SlideFigures` / `SlideFigure` | chiffres marquants et la phrase qui les lit |
| `SlidePanels` / `SlidePanel` | cartes pleine hauteur : phases, deux lectures en regard |
| `SlideTiles` / `SlideTile` | tuiles courtes libellé et valeur : stack, volumes, conditions |
| `SlideTable` / `SlideTableRow` | tableau aligné, avec total facultatif |
| `SlideRanks` / `SlideRank` | lignes numérotées : risques et parades, liste d'affirmations |
| `SlideMatrix` | comparaison d'options, une colonne par option |
| `SlideChain` / `SlideStep` | enchaînement de gauche à droite, quand l'ordre compte |
| `SlideBand` / `SlideBandItem` | bandeau qui ferme une slide : deux ou trois affirmations, ou un montant |
| `SlideNotes` / `SlideNote` | précisions courtes en bas de slide |
| `SlideBudget`, `SlideBudgetColumn`, `SlideBudgetLine`, `SlideBudgetTotal`, `SlideBudgetAside` | slide budget en deux colonnes |
| `SlideMedia` | photo ou visuel dans le slot `media` ou `aside` d'une slide |
| `SlideStrip` | bandeau photographique en bas de slide |
| `SlideScreen` | capture d'écran dans un cadre de navigateur, avec texte à côté |
| `SlideFoot` | ligne de termes courts qui ferme une slide |
| `SlideEmblem` | visuel posé à côté d'un titre |

Trois surfaces existent sur `Slide` : `paper` par défaut, `ink` pour les pages sombres, `accent` pour la couleur de marque. Un bloc lit la surface de sa slide, il n'a donc pas de variante claire ou sombre. Une carte qui doit trancher avec sa slide prend `tone="ink"` ou `tone="accent"`. La prop `notes` d'une `Slide` porte les notes du présentateur.

Un besoin qu'aucun composant ne couvre se signale à l'utilisateur avant de créer un composant, qui suit alors les règles de la skill "web-dev" (fichier dans `web/src/components/deck/`, section dans `COMPONENTS.md`).

## Écrire les slides

- **Une idée par slide.** Le `SlideHead` porte cette idée en phrase complète avec un verbe (« Les visiteurs repartent sans laisser de contact »), jamais un intitulé de rubrique (« Constat »). Le rubricage va dans le `kicker`.
- **Peu de texte.** Un bloc rempli de paragraphes appelle un document, pas une slide. Le détail se renvoie au document qui accompagne le deck.
- **Chiffres en bloc visuel** (`SlideFigures`, `SlideTiles`, `SlideTable`), jamais noyés dans une phrase.
- **Un rythme.** Alterner les surfaces, placer une `SlideStatement` ou une `SlideSection` entre deux enchaînements denses.
- **Structure type** d'un deck de restitution ou de soutenance : couverture, contexte ou constat, proposition, déroulé ou planning, budget s'il y a lieu, risques, prochaines étapes, clôture.
- **Images** : chemin dans le dépôt (`/1-Projects/<projet>/documents/assets/ecran.png`) ou image commune (`/assets/<dossier>/<fichier>`). Un visuel à créer passe par la skill "generate-image".
- Les schémas horizontaux restent acceptables en slide, où la largeur est disponible.

## Workflow

1. **Cadrer** avec l'utilisateur : destinataire, occasion (soutenance, atelier, comité), durée de présentation, message à retenir, source éventuelle (document, page wiki, compte rendu). Lire les sources avant d'écrire.
2. **Proposer le plan** slide par slide (titre de chaque `SlideHead` et composant envisagé) et attendre la validation.
3. **Écrire le MDX** dans le dossier `documents/` concerné.
4. **Relire avec la skill "content-rules"** une fois, sur l'ensemble des textes du deck, avant de livrer.
5. **Vérifier le rendu** : `cd web && npm run build` (les erreurs de schéma et de composant inconnu apparaissent en clair), puis ouvrir la route du deck. Contrôler chaque slide : texte qui déborde, bloc trop dense, slide vide.
6. **Exporter en PDF** si demandé, avec la skill "print-doc" : le script détecte le deck et imprime une slide par page en 16:9, à côté du fichier MDX.
7. Donner à l'utilisateur la route du deck et, le cas échéant, le chemin du PDF.
