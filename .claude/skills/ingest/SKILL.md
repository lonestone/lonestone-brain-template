---
name: ingest
description: Ingérer une source externe (URL, document local ou texte collé) dans le wiki. Sauvegarde verbatim dans 3-Resources/sources/, mise en perspective contre les pages existantes (stratégie, projets, fonctionnement), puis propositions de modifications attendant un go/no-go explicite avant toute écriture dans la couche wiki.
argument-hint: [URL, chemin de fichier, texte entre guillemets, ou rien si la source arrive ensuite]
---

# Ingestion d'une source

Tu ingères la source `$ARGUMENTS` (ou celle que l'utilisateur va coller ou pointer ensuite) dans le wiki. Tu sauvegardes verbatim dans `3-Resources/sources/`, tu la mets en perspective contre les pages existantes du wiki, tu proposes des modifications précises, et tu **attends l'accord de l'utilisateur** avant toute écriture dans la couche wiki.

## Règles spécifiques à l'ingestion

- **Une seule source à la fois.** Si l'utilisateur donne plusieurs URLs ou textes, demander laquelle traiter en premier.
- **Verbatim absolu.** Le fichier de `3-Resources/sources/` contient le texte d'origine, sans résumé, paraphrase ni annotation. Si un fetch renvoie un résumé, refetch avec un prompt strict, ou demander le texte original.
- **Le wiki attend l'accord explicite.** Le fichier source (Phase 1) peut être créé en autonomie. Toute autre modification attend le go de la Phase 5.
- **Distinguer la source de ta déduction.** Citer la phrase exacte de la source quand un point clé est mobilisé. Une affirmation qui vient d'une déduction est nommée comme déduction.
- **Codes visuels** pour les statuts dans cette skill : 🟢 / 🟠 / 🔴 et ✅ / ⚠️ / ❌.

## Anti-patterns à bannir

- **Sauvegarder un résumé reformulé en source.** Un contenu non verbatim reste hors de `sources/`.
- **Modifier le wiki avant accord.** Aucune écriture spéculative.
- **Tout toucher en une fois.** Une ingestion peut concerner 5 à 10 pages. Tu listes, tu proposes, tu attends.
- **Reformuler la source pour qu'elle « tienne » mieux** que ce qu'elle dit vraiment. Si la source se révèle plus faible que prévu à la lecture verbatim, l'admettre et limiter les propositions.
- **Surinterpréter.** Écrire « la source dit X » uniquement quand elle le dit.
- **Sauter la discussion (Phase 2).** Sans angle de l'utilisateur, les propositions tirent dans toutes les directions.

## Phase 0 : Récupération de la source

Détecter la nature de l'entrée :

1. **URL article web** : utiliser le script `fetch.py` à côté de cette skill. Il télécharge la page, extrait le contenu via trafilatura et écrit directement le fichier source au format attendu (en-tête et corps verbatim).

   ```bash
   .claude/skills/ingest/fetch.py [--title "..."] [--author "..."] [--date YYYY-MM-DD] <url> <output-path.md>
   ```

   Dépendance : `pip install trafilatura`. Les flags `--title`, `--author` et `--date` servent uniquement à corriger ce que trafilatura n'a pas su extraire. Si le script échoue ou renvoie un contenu vide, basculer sur `WebFetch` avec un prompt strict du type *"Return the full verbatim text of this article in its original language. No summary, no paraphrase, no commentary. Output only the article text."*. En dernier recours, demander à l'utilisateur de coller le texte.

2. **URL vidéo (YouTube, Vimeo, etc.)** : demander la transcription. Les métadonnées d'une vidéo ne suffisent jamais à la « résumer ».
3. **URL réseau social (X, LinkedIn, Threads, Bluesky)** : tenter `fetch.py` puis `WebFetch`. Si le contenu est protégé ou tronqué, demander une copie texte.
   - **X / Twitter** : `fetch.py` et `WebFetch` échouent (JavaScript requis, connexion obligatoire pour les articles longs). Utiliser le script dédié `fetch-tweet.py`, qui passe par l'API publique `api.fxtwitter.com` :

     ```bash
     .claude/skills/ingest/fetch-tweet.py <tweet-url> <output-path.md>
     ```

     Il gère les tweets simples et les articles longs X (blocs Draft.js convertis en markdown), sans authentification. Si fxtwitter tombe un jour, demander à l'utilisateur de coller le texte.
4. **URL podcast** : demander la transcription ou les notes d'épisode verbatim.
5. **Document local (PDF, DOCX, XLSX, PPTX, EPUB, image)** : voir la section « Conversion des documents » ci-dessous.
6. **Texte collé** : utiliser tel quel.
7. **Aucun argument** : demander la source (URL, fichier ou texte).

Annoncer ce qui a été récupéré (titre, auteur, longueur approximative, premières lignes) et confirmer avant de continuer.

### Conversion des documents

`markitdown` (Microsoft) convertit un document en markdown, quel que soit son format. Il s'installe via `uv tool install 'markitdown[pdf,docx,xlsx,pptx,outlook]'` et se vérifie avec `markitdown --version`.

```bash
markitdown <fichier.pdf> > <sortie.md>
```

Il lit la couche texte du document sans modèle ni GPU, en préservant l'ordre de lecture et le calage des colonnes.

Traitement du résultat selon le document :

- **Document dont la mise en page porte du sens** (facture, relevé, tableau aligné à l'espace) : placer la sortie dans un bloc ` ```text ` sous l'en-tête, ce qui préserve l'alignement des colonnes.
- **Document en prose** (rapport, article, livre blanc) : garder le markdown tel quel.

Cas où `markitdown` ne suffit pas :

- **PDF scanné sans couche texte** : la sortie est vide ou presque. Passer le PDF à l'OCR en amont (`uvx ocrmypdf <in.pdf> <out.pdf>`) puis reconvertir.
- **Tableaux complexes, colonnes multiples, formules** : `markitdown` aplatit les cellules fusionnées. Basculer sur `docling` (IBM), qui préserve la structure, via `uvx --from docling docling --to md <fichier>`.

Vérifier la conversion avant d'écrire dans `sources/` : premières et dernières lignes présentes, totaux et montants intacts, aucun bloc manquant.

## Phase 1 : Sauvegarde verbatim

Le script `fetch.py` écrit déjà le fichier au bon format. Cette phase consiste à :

1. Choisir le chemin de sortie : `[auteur-ou-domaine]-[mots-cles-titre].md` dans `3-Resources/sources/`. Pour une œuvre en plusieurs pages, utiliser un sous-dossier (ex. `auteur-titre-de-l-essai/<chapitre>.md`) avec un `README.md` d'index.
2. Lancer `fetch.py` avec les corrections nécessaires si trafilatura rate des métadonnées (cas fréquent : auteur introuvable).
3. Vérifier après écriture que le contenu est bien verbatim et complet (lire les premières et dernières lignes, comparer à la longueur attendue). Si le contenu est résumé, partiel ou pollué, supprimer le fichier et passer au repli de la Phase 0.

Format du fichier produit (référence, déjà géré par `fetch.py`) :

```
# [Titre]

**Source** : [URL]
**Auteur** : [Auteur]
**Date** : [Date de publication]
**Capture** : [YYYY-MM-DD du jour]

---

[contenu verbatim, dans la langue d'origine]
```

Pour une source en plusieurs pages, créer en plus un `README.md` dans le sous-dossier qui liste les fichiers dans l'ordre, avec les mêmes métadonnées globales.

Pour un document local, l'en-tête remplace `**Source**` par une description du document et ajoute une ligne `**Original**` qui indique où le fichier d'origine est archivé, le dépôt ne stockant pas de binaire :

```
**Source** : rapport annuel 2025 de l'organisme X, transmis par mail
**Original** : espace documentaire partagé, dossier `Rapports/2025/`
**Date** : 2026-03-12
**Capture** : 2026-03-14
```

Quand un même type de document revient périodiquement, lui donner un sous-dossier avec un `README.md` d'index et un niveau par année (ex. `releves-mensuels/2026/`). L'index liste une ligne par document avec ses repères (date, montant, émetteur).

## Phase 2 : Discussion

Avant de toucher au reste du wiki, discuter avec l'utilisateur :

1. **Idées clés** : 3 à 7 points à retenir. Refléter ce que dit la source, pas ce qu'on aurait aimé qu'elle dise. Citer une ou deux phrases exactes quand un point est central.
2. **Question d'orientation** : qu'est-ce qui a retenu son attention ? Sur quoi insister ? Quel angle l'intéresse ?

Passer en Phase 3 une fois l'angle donné. Si l'utilisateur répond « à toi de voir », proposer un angle par défaut et attendre sa validation.

## Phase 3 : Mise en perspective

Lectures préalables, en parallèle si possible :

- `README.md` racine (catalogue des projets, du fonctionnement et des ressources)
- Les pages de stratégie ou de positionnement de l'entreprise, si le wiki en contient (vision, objectifs, offre, marché)
- `README.md` des projets actifs et des sujets de fonctionnement potentiellement concernés
- Les pages de détail que la source mobilise directement

Pour chaque page potentiellement touchée, produire un tableau :

| Page | Type d'impact | Commentaire d'une ligne |
|---|---|---|
| `2-Areas/strategie/X.md` | renforce / nuance / contredit / orthogonal | en quoi |
| `1-Projects/Z/README.md` | apport opérationnel / décision à arbitrer / orthogonal | en quoi |
| `2-Areas/<sujet>/README.md` | apport opérationnel / risque à suivre / orthogonal | en quoi |

Présenter ce tableau avant toute proposition de modification.

## Phase 4 : Propositions de modifications

Pour chaque page identifiée, formuler une proposition précise :

- **Nature** : ajout d'une section, mise à jour d'un paragraphe, requalification d'un risque, contradiction à arbitrer, nouvelle page à créer
- **Emplacement** : section ou ligne concernée
- **Contenu proposé** : deux à cinq lignes ou un paragraphe rédigé
- **Liens croisés** : vers la nouvelle source et vers les autres pages touchées

Penser aussi aux propositions structurelles :

- **Nouvelle page de fonctionnement ou de ressource** si la source révèle un sujet absent du wiki
- **Nouvelle page projet** si la source justifie un suivi dédié
- **Question à creuser** : sujet ouvert par la source et encore non couvert, à mettre en file pour plus tard

Récapitulatif obligatoire en tableau numéroté :

| # | Page | Action | Pourquoi |
|---|---|---|---|
| 1 | `2-Areas/strategie/X.md` | ajouter la section « ... » | renforce avec un exemple récent |
| 2 | `1-Projects/Y/README.md` | requalifier le risque n° 3 | la source contredit l'hypothèse |
| 3 | `3-Resources/<sujet>.md` (création) | créer | sujet encore absent du wiki |
| 4 | `README.md` (catalogue) | ajouter le lien vers la nouvelle page | maintenir l'index |

Inclure systématiquement les mises à jour d'index (`README.md` racine, `README.md` du dossier concerné) quand une page est créée.

## Phase 5 : Go/no-go par modification

Pour chaque ligne du tableau, attendre un statut explicite :

- 🟢 Go : appliquer la modification telle que proposée
- 🟠 Go avec ajustement : l'utilisateur précise quoi changer
- 🔴 No-go : ignorer

Demander une réponse en bloc (« toutes en go ? ») ou ligne par ligne selon la préférence de l'utilisateur. Une ligne sans statut reste en attente. Si l'utilisateur demande de reformuler une proposition, refaire le tour avant écriture.

## Phase 6 : Application

Pour chaque go validé :

1. Modifier ou créer la page concernée
2. Ajouter les liens croisés (vers la source `3-Resources/sources/<nom>.md` et vers les autres pages liées)
3. Mettre à jour les index si une page a été créée : `README.md` racine pour un nouveau projet, `README.md` du dossier parent pour toute nouvelle page

À la fin, présenter un récapitulatif court :

- Pages créées
- Pages modifiées
- Index mis à jour
- Questions ouvertes laissées en file pour plus tard

## Transition entre phases

- Annoncer chaque phase clairement
- Suivre toutes les phases, sauf demande explicite (« on saute la discussion, vas-y direct »)
- Si une phase révèle qu'une phase précédente a manqué un point, revenir en arrière proprement
- Si la source s'avère faible ou hors sujet après lecture, le dire et proposer d'arrêter avant la Phase 4
