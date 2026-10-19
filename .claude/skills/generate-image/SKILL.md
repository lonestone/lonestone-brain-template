---
name: generate-image
description: Génère une image (illustration, infographie, schéma stylisé, couverture) via Nano Banana Pro (Google AI, modèle Gemini 3 Pro Image), dans le style défini par la section « Direction artistique » de CLAUDE.md. À utiliser pour habiller un post, une slide, un document ou une page wiki. Jamais pour des photos réalistes.
argument-hint: '["<prompt>" <output-path.png> [--ratio 16:9|1:1|9:16|4:3|3:4] [--style charte|neutral|none]]'
---

# Génération d'image

Génère une image via Nano Banana Pro (modèle Gemini 3 Pro Image de Google AI), pour habiller un post, une slide, un document, une page wiki ou un schéma explicatif.

## Principe : l'image se suffit à elle-même

Une image générée pour un post ou une slide se comprend sans lire le texte qui l'accompagne. Le lecteur la voit d'abord, souvent seule. Elle porte donc le contexte minimal : un titre qui pose le sujet, des libellés explicites, une lecture évidente (cause vers conséquences, étapes ordonnées, comparaison). Bannir tout ce qui n'a de sens qu'avec le texte (« voir ci-dessus », numéros ou termes sans légende).

## Installation

1. Récupérer une clé API Google AI sur https://aistudio.google.com/apikey
2. La renseigner dans le fichier `.env` à la racine du dépôt (modèle dans `.env.example`) :
   ```
   GOOGLE_AI_API_KEY=...
   ```
   `GEMINI_API_KEY` est accepté comme alias.
3. Aucune dépendance Python à installer : le script n'utilise que la bibliothèque standard.

## Usage

```bash
.claude/skills/generate-image/generate.py "<prompt>" <output-path.png> [--ratio 16:9|1:1|9:16|4:3|3:4] [--style charte|neutral|none]
```

Sortie : fichier PNG au chemin indiqué, dossiers parents créés si besoin.

## Le style vit dans CLAUDE.md

Pour qu'un même style sorte stable d'une génération à l'autre, il est décrit une fois, hors du prompt. Le prompt ne porte que le contenu (textes, structure).

- `--style charte` (par défaut) : le script lit la section `## Direction artistique` de `CLAUDE.md`, à la racine du dépôt, et la place en tête du prompt. C'est là que l'entreprise décrit sa palette (codes hexadécimaux), sa typographie, son ton visuel et ses interdits. Pour faire évoluer le style, modifier cette section, jamais le redécrire dans chaque prompt.
- `--style neutral` : style éditorial sobre et plat, indépendant de toute marque. Il sert aussi de repli quand `CLAUDE.md` n'a pas de section « Direction artistique ».
- `--style none` : le prompt part brut, pour explorer un style avant de l'inscrire dans `CLAUDE.md`.

Une section « Direction artistique » efficace pour la génération donne des consignes vérifiables : couleurs en hexadécimal avec leur rôle (fond, texte, accent), familles de polices, règles de composition (grille, marges, filets plutôt que cartes), et une liste d'interdits (ombres, dégradés, néon, 3D, fond sombre).

## Cas d'usage et interdits

**À utiliser pour** : infographies, schémas conceptuels, illustrations éditoriales, diagrammes stylisés, couvertures de slides ou de documents, visuels d'article.

**À proscrire** : photos réalistes, portraits, scènes humaines crédibles, faux paysages. La skill produit de l'illustration assumée, jamais une image qui se fait passer pour une photo. Si l'utilisateur demande du photoréalisme, refuser et proposer une alternative (photo de banque d'images, photographe).

## Structure d'un prompt

Le style étant porté par la charte, le prompt décrit le contenu et son agencement. Deux règles tiennent la qualité :

- **Texte court et précis.** Le modèle rend bien les titres et les phrases courtes, mal les paragraphes. Une phrase par bloc.
- **Textes cités verbatim entre guillemets**, avec la liste des mots accentués rappelée en fin de prompt. Le modèle perd les accents dès qu'on ne les exige pas.

Gabarit type :

```
SUJET, en haut, gras, taille moyenne : "..."
MESSAGE PRINCIPAL, deux fois plus grand, deux lignes maximum : "..." / "...", accent sur "..."
BLOCS NUMÉROTÉS :
  "01", "TITRE COURT", "Une phrase."
  "02", ...
CONCLUSION sous un filet : "..."
Aucun autre texte. Accents corrects : marqué, août, même, déjà.
```

## Workflow

1. **Discuter le concept** avec l'utilisateur avant de générer : composition, hiérarchie visuelle, texte à inclure. Si l'image accompagne un post ou une slide, le lire pour comprendre le message à porter.
2. **Obtenir un go** sur le concept.
3. **Lancer `generate.py`** avec un chemin de sortie cohérent : dossier `assets/` à côté du contenu qui utilise l'image (ex. `2-Areas/communication/posts/brouillons/assets/<slug>.png`, `1-Projects/<projet>/documents/assets/<nom>.png`).
4. **Itérer** : si le résultat ne convient pas, ajuster le prompt (composition, formulation des libellés, position des éléments) et regénérer.
