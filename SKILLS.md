# Skills

Catalogue des skills disponibles sous `.claude/skills/` : ce qu'elles font, leurs étapes principales, les skills qu'elles invoquent et ce qu'elles produisent. Un aperçu pour savoir laquelle appeler et comment elles s'enchaînent, sans ouvrir chaque `SKILL.md`.

Une skill s'ajoute en déposant son dossier `.claude/skills/<nom>/SKILL.md`. Ce catalogue se tient à jour à la main, dans le même changement que la skill créée, renommée ou supprimée.

**Comment lire cette page**

- Chaque skill est une section repliable ; cliquer sur son titre l'ouvre. Le résumé visible avant ouverture donne le rôle en une ligne.
- Dès qu'une étape ou la liste **Skills utilisées** fait appel à une autre skill, la mention est un lien en gras vers sa fiche plus bas sur cette page, par exemple **[skill "content-rules"](#content-rules)**. La liste **Skills utilisées** présente une skill par ligne.
- Les scripts des skills lisent leurs clés dans le fichier `.env` à la racine du dépôt, sur le modèle de `.env.example`.

## Vue d'ensemble

| Skill | Rôle | Appelle |
|---|---|---|
| **[ingest](#ingest)** | Fait entrer une source externe dans le wiki | aucune |
| **[add-meeting-notes](#add-meeting-notes)** | Transforme un transcript ou des notes brutes en compte rendu rangé dans le projet ou le sujet concerné | [content-rules](#content-rules), [ingest](#ingest), [email-rules](#email-rules) |
| **[write-document](#write-document)** | Rédige un document formel imprimable (note de cadrage, proposition, rapport, compte rendu formel), puis le relit | [edit-mdx](#edit-mdx), [content-rules](#content-rules), [print-doc](#print-doc), [generate-image](#generate-image), [build-slides](#build-slides) |
| **[build-slides](#build-slides)** | Construit un deck de slides en MDX, rendu en 16:9 par la web app | [edit-mdx](#edit-mdx), [content-rules](#content-rules), [print-doc](#print-doc), [generate-image](#generate-image) |
| **[print-doc](#print-doc)** | Exporte en PDF n'importe quelle page de la web app | aucune |
| **[edit-mdx](#edit-mdx)** | Règles d'écriture des contenus MDX (documents, decks, pages avec composants) | [web-dev](#web-dev), [print-doc](#print-doc) |
| **[web-dev](#web-dev)** | Règles de développement de la web app et adaptation du template | [print-doc](#print-doc) |
| **[generate-image](#generate-image)** | Génère une illustration ou une infographie dans le style de la « Direction artistique » de CLAUDE.md | aucune |
| **[write-social-post](#write-social-post)** | Rédige un post LinkedIn ou X à partir d'une idée, avec hooks et conclusions au choix avant le corps | [content-rules](#content-rules), [generate-image](#generate-image) |
| **[email-rules](#email-rules)** | Règles de ton et de forme des emails, brouillons uniquement | [content-rules](#content-rules) |
| **[content-rules](#content-rules)** | Règles d'écriture et de réécriture de tout contenu, en toutes langues | aucune |

## Wiki et sources

<details id="ingest" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">ingest</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Fait entrer une source externe dans le wiki, verbatim d'abord, modifications ensuite sous go/no-go.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : sauvegarde une source externe (article, post, document local, texte collé) verbatim dans `3-Resources/sources/`, la met en perspective contre les pages existantes du wiki (stratégie, projets, fonctionnement), puis propose des modifications que l'utilisateur valide une par une.
- **Déclenchement** : à la demande de l'utilisateur, avec une URL, un chemin de fichier ou un texte en argument.
- **Étapes** :
  1. Récupérer la source : `fetch.py` pour un article web, `fetch-tweet.py` pour X, `markitdown` pour un PDF ou un document bureautique, texte collé sinon
  2. Sauvegarder le verbatim dans `3-Resources/sources/` avec son en-tête (source, auteur, date, capture)
  3. Discuter les idées clés et l'angle qui intéresse l'utilisateur
  4. Mettre en perspective : tableau des pages touchées et du type d'impact
  5. Proposer les modifications en tableau numéroté
  6. Attendre un go, un go avec ajustement ou un no-go par ligne
  7. Appliquer les modifications validées, ajouter les liens croisés et mettre à jour les index
- **Skills utilisées** : aucune.
- **Sortie** : fichier verbatim dans `3-Resources/sources/`, pages wiki créées ou modifiées après accord, index `README.md` à jour.

</div>
</details>

<details id="add-meeting-notes" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">add-meeting-notes</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Transforme un transcript ou des notes brutes en compte rendu rangé dans le projet ou le sujet concerné.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : à partir d'un transcript ou de notes brutes, quel que soit l'outil d'origine, sauvegarde le verbatim et rédige un compte rendu structuré (décisions, actions avec porteur et échéance, questions ouvertes), puis met à jour les pages liées.
- **Déclenchement** : à la demande de l'utilisateur, avec le projet ou le sujet concerné en argument facultatif.
- **Étapes** :
  1. Récupérer le transcript (texte collé, fichier, export d'outil de visioconférence)
  2. Identifier le projet ou le sujet où ranger la réunion
  3. Extraire date, participants, décisions, actions et questions ouvertes, et faire valider
  4. Copier le verbatim dans `3-Resources/sources/transcripts/YYYY-MM-DD-<slug>.txt`
  5. Rédiger le compte rendu `YYYY-MM-DD-<slug>.md` dans le dossier retenu
  6. Mettre à jour, après accord, le `README.md` du projet et les pages touchées par une décision
  7. Récapituler, et proposer un email de suivi en brouillon
- **Skills utilisées** :
  - **[skill "content-rules"](#content-rules)** : style du compte rendu
  - **[skill "ingest"](#ingest)** : conversion d'un transcript fourni en PDF ou DOCX
  - **[skill "email-rules"](#email-rules)** : email de suivi, sur proposition
- **Sortie** : compte rendu `.md` dans le dossier du projet ou du sujet, verbatim dans `3-Resources/sources/transcripts/`, pages liées mises à jour.

</div>
</details>

## Documents, slides et web app

<details id="write-document" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">write-document</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Rédige un document formel imprimable (note de cadrage, proposition, rapport, compte rendu formel), puis le relit.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : produit un document MDX rendu par le gabarit document de la web app (en-tête, couverture, sommaire généré, corps, pied de page avec les auteurs), exportable en PDF A4, et le relit avant de rendre la main.
- **Déclenchement** : à la demande de l'utilisateur, avec le type de document et le sujet en argument.
- **Étapes** :
  1. Cadrer : type, destinataire, message principal, sources, auteurs, contraintes
  2. Lire les sources en entier (pages du wiki, comptes rendus, documents fournis)
  3. Créer `<dossier>/documents/<Titre>.mdx` avec le frontmatter `kind: document`, `title`, `date` et les champs facultatifs
  4. Rédiger à partir de la première section `##`, sans numéroter les titres, avec les composants du catalogue
  5. Vérifier la couverture des sources et corriger les manques
  6. Relire selon cinq axes : cohérence interne, style, règles de la skill, exactitude, pertinence
  7. Construire (`cd web && npm run build`), exporter en PDF et relire le PDF
- **Skills utilisées** :
  - **[skill "edit-mdx"](#edit-mdx)** : règles d'écriture des MDX
  - **[skill "content-rules"](#content-rules)** : style, appliqué dès le premier jet puis en relecture
  - **[skill "print-doc"](#print-doc)** : export PDF
  - **[skill "generate-image"](#generate-image)** : visuel de couverture ou schéma, si besoin
  - **[skill "build-slides"](#build-slides)** : deck d'accompagnement, si demandé
- **Sortie** : fichier `.mdx` dans un dossier `documents/`, PDF à côté, lien ajouté dans le `README.md` du projet ou du sujet.

</div>
</details>

<details id="build-slides" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">build-slides</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Construit un deck de slides en MDX, rendu en 16:9 par la web app.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : crée ou met à jour un deck MDX (`kind: deck`) composé de slides entières (`SlideCover`, `SlideSection`, `SlideClosing`...) et du vocabulaire de blocs (`SlideHead`, `SlideNumbers`, `SlideFigures`...), enveloppés dans un `DeckShell`.
- **Déclenchement** : à la demande de l'utilisateur, pour une soutenance, une restitution, un atelier ou une présentation.
- **Étapes** :
  1. Cadrer : destinataire, occasion, durée, message à retenir, sources
  2. Proposer le plan slide par slide et le faire valider
  3. Écrire `<dossier>/documents/<Titre>.mdx` avec `kind: deck`, `title`, `date`, et le corps dans `<DeckShell label="Entreprise × Destinataire">`
  4. Relire les textes avec la skill "content-rules"
  5. Construire (`cd web && npm run build`) et contrôler chaque slide
  6. Exporter en PDF si demandé, une slide par page
- **Skills utilisées** :
  - **[skill "edit-mdx"](#edit-mdx)** : règles d'écriture des MDX
  - **[skill "content-rules"](#content-rules)** : style
  - **[skill "print-doc"](#print-doc)** : export PDF 16:9
  - **[skill "generate-image"](#generate-image)** : visuels, si besoin
- **Sortie** : fichier `.mdx` de deck dans un dossier `documents/`, servi à son chemin, et PDF à côté si demandé.

</div>
</details>

<details id="print-doc" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">print-doc</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Exporte en PDF n'importe quelle page de la web app.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : imprime une route de la web app en PDF avec Playwright, en A4 pour un document ou une page du wiki, au format 16:9 du deck pour des slides.
- **Déclenchement** : à la demande de l'utilisateur, ou en fin de **[skill "write-document"](#write-document)** et **[skill "build-slides"](#build-slides)**. Aussi pour vérifier tout changement de mise en page à l'impression.
- **Étapes** :
  1. Trouver Playwright (skill, skills voisines, `web/node_modules`)
  2. Réutiliser le serveur de dev s'il répond, sinon construire puis lancer un `astro preview`
  3. Charger la route, attendre images et schémas Mermaid, détecter un deck
  4. Imprimer avec les fonds, au format de la page
- **Skills utilisées** : aucune.
- **Sortie** : fichier PDF à côté de la source.

</div>
</details>

<details id="edit-mdx" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">edit-mdx</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Règles d'écriture des contenus MDX (documents, decks, pages avec composants), à invoquer avant d'en créer ou d'en modifier un.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : rappelle comment écrire un `.mdx` qui s'affiche bien à l'écran et en PDF : collection `documents` et son frontmatter, aucun import ni HTML brut, choix des composants dans `COMPONENTS.md`, emplacement des images, règles propres au PDF.
- **Déclenchement** : avant de créer ou de modifier un `.mdx`, y compris depuis une autre skill.
- **Étapes** :
  1. Lire le schéma de la collection dans `web/src/content.config.ts` si le fichier en fait partie
  2. Chercher les composants utiles dans `COMPONENTS.md` et recopier leurs props
  3. Écrire le contenu en markdown et appels de composants
  4. Reconstruire le site (`cd web && npm run build`) et relire la page
- **Skills utilisées** :
  - **[skill "web-dev"](#web-dev)** : quand une mise en page demande un nouveau composant
  - **[skill "print-doc"](#print-doc)** : vérification du PDF
- **Sortie** : aucune production propre ; encadre l'écriture des autres skills.

</div>
</details>

<details id="web-dev" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">web-dev</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Règles de développement de la web app : composants, renderers, styles, collections, images, adaptation du template à une entreprise.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : rassemble les règles du code de `web/` : serveur et garde-fous du build, personnalisation (`site-config.ts`, palette), collections, routage par renderers, composants auto-chargés et leur catalogue, jetons et Tailwind d'abord, impression, circuit des images.
- **Déclenchement** : avant de créer ou de modifier un composant, un renderer, un style, une collection ou un script de build, et pour adapter le template au nom et aux couleurs d'une entreprise.
- **Étapes** :
  1. Chercher dans `COMPONENTS.md` ou dans le code ce qui existe déjà
  2. Modifier en anglais (code et commentaires), avec des jetons et des classes Tailwind
  3. Mettre à jour `COMPONENTS.md` dans le même changement qu'un composant
  4. Construire (`cd web && npm run build`) pour passer les trois garde-fous
- **Skills utilisées** :
  - **[skill "print-doc"](#print-doc)** : vérification d'un changement d'impression
- **Sortie** : code de `web/` modifié, catalogue des composants à jour.

</div>
</details>

<details id="generate-image" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">generate-image</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Génère une illustration ou une infographie dans le style de la « Direction artistique » de CLAUDE.md.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : génère une image via Nano Banana Pro (Google AI) pour un post, une slide, un document ou une page wiki. Le style vient de la section « Direction artistique » de `CLAUDE.md`, le prompt ne porte que le contenu. Jamais de photo réaliste.
- **Déclenchement** : à la demande de l'utilisateur, ou sur proposition de **[skill "write-social-post"](#write-social-post)**, **[skill "build-slides"](#build-slides)** et **[skill "write-document"](#write-document)**.
- **Étapes** :
  1. Discuter le concept : composition, hiérarchie, textes à inclure
  2. Obtenir un go
  3. Lancer `generate.py` avec un chemin de sortie dans le dossier `assets/` du contenu concerné
  4. Itérer sur le prompt si le résultat ne convient pas
- **Skills utilisées** : aucune.
- **Sortie** : fichier PNG au chemin indiqué. Clé `GOOGLE_AI_API_KEY` dans `.env`.

</div>
</details>

## Communication

<details id="write-social-post" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">write-social-post</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Rédige un post LinkedIn ou X à partir d'une idée, avec hooks et conclusions au choix avant le corps.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : transforme une idée de `2-Areas/communication/posts/idees/` en brouillon dans `2-Areas/communication/posts/brouillons/`, puis suit sa publication dans `publies/`.
- **Déclenchement** : à la demande de l'utilisateur (« rédige le post sur X »), avec le slug ou le sujet en argument facultatif.
- **Étapes** :
  1. Cadrer par questions : objectif, registre, audience, réseau, angle, faits, appel à l'action
  2. Vérifier les faits à la source primaire
  3. Proposer trois hooks et trois conclusions, et attendre le choix
  4. Rédiger le corps, déplacer le fichier dans `brouillons/`, proposer un média
  5. Relire : cohérence interne, filtre de style, contraintes de forme
  6. À la publication, déplacer dans `publies/` et ajouter date, URL et section de retours
- **Skills utilisées** :
  - **[skill "content-rules"](#content-rules)** : style
  - **[skill "generate-image"](#generate-image)** : visuel d'accompagnement, si retenu
- **Sortie** : fichier de brouillon dans `brouillons/` (post, premier commentaire, variantes, notes de cadrage), déplacé dans `publies/` après publication.

</div>
</details>

<details id="email-rules" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">email-rules</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Règles de ton et de forme des emails, brouillons uniquement.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : fixe le ton, le style et la mise en forme de tout email, et impose le brouillon : aucun envoi sans accord explicite de l'utilisateur, email par email. Donne en exemple les pièges courants des API de messagerie.
- **Déclenchement** : dès qu'on rédige, met en forme ou crée le brouillon d'un email, y compris depuis **[skill "add-meeting-notes"](#add-meeting-notes)**.
- **Étapes** :
  1. Choisir le registre selon `CLAUDE.md` ou le dernier échange
  2. Écrire un objet descriptif et une seule demande claire
  3. Mettre en forme pour la messagerie (paragraphes courts, HTML simple si brouillon créé par API)
  4. Créer le brouillon, jamais l'envoyer
- **Skills utilisées** :
  - **[skill "content-rules"](#content-rules)** : formulation
- **Sortie** : brouillon d'email, dans la conversation, un fichier ou la messagerie connectée.

</div>
</details>

## Écriture

<details id="content-rules" class="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
<summary class="cursor-pointer list-none px-4 py-3 hover:bg-zinc-50"><div class="flex flex-wrap items-center gap-2"><strong class="text-base font-semibold text-zinc-900">content-rules</strong></div><p class="mt-1 text-sm font-normal text-zinc-500">Règles d'écriture et de réécriture de tout contenu, en toutes langues.</p></summary>
<div class="border-t border-zinc-200 bg-zinc-50 px-5 py-4">

- **Rôle** : référence de style pour tout contenu : test de l'oral, règles structurelles (tirets cadratins, formulations positives, label-colon, phrases sans verbe), expressions bannies en français et en anglais, motifs de texte généré à éviter.
- **Déclenchement** : en rédigeant tout contenu, et pour nettoyer un texte qui sonne généré. Appelée par les skills de rédaction.
- **Étapes** :
  1. Écrire avec les règles dès le premier jet
  2. Pour un contenu publié ou envoyé, déléguer une relecture à un sous-agent qui corrige directement
  3. Relancer tant qu'une passe corrige le texte d'origine, trois passes au plus
- **Skills utilisées** : aucune.
- **Sortie** : texte corrigé en place, avec le compte rendu des corrections.

</div>
</details>
