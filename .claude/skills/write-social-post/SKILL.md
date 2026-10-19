---
name: write-social-post
description: Rédige un brouillon de post LinkedIn ou X à partir d'une idée stockée dans 2-Areas/communication/posts/idees/. À utiliser quand l'utilisateur dit « rédige le post sur X », « brouillon LinkedIn pour Y », « écris un post sur l'événement Z ». Pose toujours des questions de cadrage avant d'écrire et propose plusieurs hooks et plusieurs conclusions au choix avant de rédiger le corps.
argument-hint: [slug-ou-sujet?]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Rédiger un post LinkedIn ou X

## Organisation des fichiers

Trois dossiers, le statut d'un post se lit à son emplacement :

- `2-Areas/communication/posts/idees/` : idées brutes
- `2-Areas/communication/posts/brouillons/` : brouillons rédigés, en attente de publication
- `2-Areas/communication/posts/publies/` : posts publiés

Pour faire avancer un post, **déplacer le fichier** d'un dossier à l'autre (`mv`). Le statut se lit au dossier, sans champ `status` dans le frontmatter.

Frontmatter minimal :

```yaml
---
network: linkedin | x | both
author: Prénom Nom        # qui publie, quand plusieurs personnes postent
topic: ...
created: YYYY-MM-DD
published: YYYY-MM-DD     # uniquement dans publies/
url:                      # uniquement dans publies/
---
```

## Avant de commencer

**Identifier le post.** Retrouver le fichier correspondant à l'argument dans `idees/` (ou dans `brouillons/` pour reprendre un brouillon). Si rien ne correspond, demander avant de créer une nouvelle idée.

**Lire les règles d'écriture :**

- skill "content-rules" (style général : pas de tiret cadratin, formulations positives, pas de label-colon)
- Tout en français, accents respectés, sauf post explicitement en anglais
- Texte du post (brouillon et premier commentaire) tapé comme au clavier : guillemets droits `"..."` à la place de `« »`, apostrophe droite `'` à la place de `’`, `...` à la place de `…`, aucune espace insécable, aucun tiret long ou demi-cadratin. Cette règle vaut pour LinkedIn et X et prime sur la règle d'apostrophe typographique de "content-rules". Les notes de cadrage du fichier gardent la typographie du wiki.

**Calibrer le ton.** Lire les posts existants dans `publies/` et `brouillons/` pour reprendre le ton et repérer les angles déjà travaillés. Lire aussi la section « Communication » de `CLAUDE.md` si elle existe (audience cible, ligne éditoriale, sujets à éviter).

## Audience et accessibilité

L'audience prioritaire est celle que définit `CLAUDE.md`. Sans consigne, viser les décideurs du secteur de l'entreprise, et poser la question à l'étape 1.

Un post reste **pertinent pour les profils experts et accessible aux autres** :

- Tout terme technique utilisé se définit en passant, dans la même phrase ou la suivante.
- Les termes anglais utiles sont gardés, puis traduits ou explicités.
- Le contexte minimal est posé dans le post, sans supposer que le lecteur a suivi le débat.

Test de dosage : un dirigeant non spécialiste comprend l'idée et son enjeu, **et** un expert du sujet y trouve un apport.

## Un post, un sujet

**Règle par défaut.** Un post traite un seul sujet, clairement. Une idée annexe qui émerge en cadrage devient un autre post.

**Exception.** Un post peut couvrir plusieurs sujets s'il se présente comme une **synthèse-liste assumée** (observations, implications, conseils), annoncée d'emblée (« 5 observations sur X »).

**Plusieurs posts sur un même thème.** Un sujet riche se découpe en plusieurs posts plutôt qu'en un gros. Avant de rédiger, parcourir `brouillons/` et `publies/` pour écarter une redite grossière. Un même thème sous un angle distinct (cible, exemple, posture) reste légitime.

**Regarder les dates des derniers posts publiés.** Une audience qui voit trois fois le même sujet dans la semaine décroche. Si les derniers posts tournent autour du même thème, suggérer un changement de sujet, de format ou de registre, sans en faire un veto.

## Workflow obligatoire

Les étapes s'enchaînent dans l'ordre. Le corps s'écrit seulement après validation d'un hook et d'une conclusion.

### Étape 1 : Cadrage par questions

Lire le fichier de l'idée pour récupérer le contexte et les points « à creuser ». Poser les questions qui manquent vraiment pour rédiger, trois à cinq à la fois :

- **Objectif** : informer, inviter à un événement, montrer une réalisation, partager un point de vue, recruter, lancer un débat
- **Registre** : post d'opinion ou d'analyse (le lecteur retient une idée), post utilitaire (le lecteur s'inscrit, postule, achète), post communauté ou événement local (le lecteur reconnaît son cercle). Le registre oriente la conclusion (punchline ou appel à l'action) et le ton (sobre ou chaleureux).
- **Audience** visée : clients et prospects, pairs, candidats, écosystème local
- **Réseau** : LinkedIn, X, ou les deux
- **Angle** : ce que le lecteur doit retenir en une phrase
- **Faits concrets** manquants : chiffres, dates, noms, liens, visuels
- **Ancre temporelle des anecdotes à la première personne** : quand exactement cela s'est passé (« ce matin », « la semaine dernière »). Ne jamais inventer une date.
- **Appel à l'action** souhaité : commenter, s'inscrire, contacter, rien
- **Ce que seuls l'auteur ou l'entreprise peuvent écrire** : un test, un chiffre interne, une décision prise, un échec. Si le post se résume à une explication qu'un assistant IA produirait en trente secondes, chercher cet apport avant de proposer des hooks. S'il manque, le signaler, et l'utilisateur décide de publier ou non.

### Étape 1 bis : Vérification des faits

À faire avant les hooks, parce qu'un fait mal vérifié construit un angle entier qui s'effondre ensuite.

- **Lire la source primaire** quand le post rapporte ce que quelqu'un dit. Les résumés de presse déforment.
- **Calculer les dates et les jours de la semaine**, ne jamais les supposer.
- **Nommer précisément qui fait quoi**, avec un fait daté.
- **Séparer le sourcé du déduit.** Une hypothèse personnelle s'annonce comme telle (« je vois deux explications ») ou se coupe.
- **Signaler les faits périssables** dans les notes de cadrage (compteur, classement, « sorti mardi ») : ils demandent une revérification si la publication glisse.

### Étape 2 : Hooks et conclusions au choix

Proposer en parallèle :

- **Trois hooks** (première ligne), chacun dans un registre distinct, par exemple factuel ou observationnel, contre-intuitif ou opinion, question ouverte ou courte narration.

  Un hook arrête le défilement dès le premier mot : il contredit, surprend ou attaque une croyance dominante du milieu visé. Test : sans le reste du post, ce hook seul ferait-il réagir ? Un hook qui pose un enjeu personnel concret (« j'ai testé X la semaine dernière, voici ce que ça change ») fonctionne mieux qu'un fait impersonnel.

- **Trois conclusions**, par exemple appel à l'action explicite, question au lecteur, punchline qui reste en tête.

  **Adapter la conclusion au registre.** Sur un post utilitaire (événement, recrutement, lancement), un appel à l'action concret (« réservez votre place et conviez un ou deux collègues ») fonctionne mieux qu'une punchline. La punchline sert les posts d'opinion.

  **Question ouverte avec parcimonie**, quand le sujet appelle vraiment des réponses.

  **Conclusion mesurée plutôt que triomphale.** Après une punchline forte, envisager une dernière ligne de nuance (« reste à voir si Y »).

Présenter chaque option numérotée avec une ligne sur son registre, et demander d'en choisir une de chaque, ou d'en demander d'autres.

### Étape 3 : Rédaction du corps

Une fois le hook et la conclusion validés :

- Hook validé en première ligne, conclusion validée en dernière
- Corps qui développe l'angle avec les faits de l'étape 1
- Registre parlé dès le premier jet (voir les règles de style ci-dessous)
- **Longueur** : LinkedIn plafonne à 3 000 caractères, viser 1 500 à 2 500. Un post `network: both` peut servir tel quel sur X si le compte autorise les messages longs ; sinon, demander s'il faut une version courte ou un fil.
- **Écrire court d'abord.** Un premier jet au ras du plafond oblige à couper sous contrainte, et ces coupes amputent les phrases au lieu de retirer des idées. Compter les caractères avant de présenter le brouillon.
- **Chaque paragraphe apporte un fait nouveau ou un tournant.** Un paragraphe qui reformule le précédent se coupe.

Puis :

1. Déplacer le fichier de `idees/` vers `brouillons/` (ou le créer directement dans `brouillons/` si l'idée n'existait pas)
2. Réécrire le fichier selon le format ci-dessous, en gardant les anciennes notes sous `## Notes de cadrage`
3. **Proposer un média à joindre**, en justifiant en une ligne ce qu'il apporte :
   - infographie ou schéma (skill "generate-image")
   - carrousel de slides pour un post liste
   - photo (terrain, événement, équipe)
   - vidéo de démonstration
   - capture d'écran d'un élément nommé dans le post
   - aucun média, en le justifiant

### Étape 4 : Relecture critique

Rouvrir la skill "content-rules" et relire le post phrase par phrase, règle par règle. Un contrôle de mémoire laisse passer les manquements les plus voyants.

Trois passes, dans cet ordre :

1. **Cohérence interne.** Chaque connecteur (« mais », « donc », « parce que ») énonce un rapport qui tient vraiment. La conclusion découle du corps. Si le hook a changé, relire tout le corps : les expressions qui s'appuyaient sur l'ancien hook deviennent orphelines.
2. **Filtre "content-rules"**, en commençant par le test de l'oral.
3. **Contraintes de forme** : longueur, faits vérifiables, liens hors du corps pour LinkedIn.

Corriger ce qui est trivial, signaler ce qui demande un arbitrage.

## Règles de style propres aux posts

- **Registre parlé par défaut.** Écrire comme on parlerait à un pair : marqueurs oraux assumés (« bon », « du coup »), dislocations (« la première application, elle est médicale »). Éviter le slop et écrire vivant sont deux objectifs distincts, viser les deux. Un post propre mais plat est un échec. Dans le doute sur le registre, poser la question à l'étape 1.
- **Citer des sources externes avec un ton personnel** qui dit pourquoi elles sont là (« deux lectures qui m'ont aidé à comprendre ça »), en liste à puces, le titre entre guillemets en premier puis l'auteur.
- **Phrases courtes, paragraphes courts.** Une ligne vide entre deux paragraphes. Les listes à puces restent collées à leur phrase d'introduction.
- **Pas de jargon creux** ni de buzzwords (« disruptif », « game-changer », « révolutionnaire »).
- **Pas d'émoji ni de hashtag** par défaut, sauf demande. Si hashtags, trois au plus, en fin de post.
- **Mentions** notées `@Nom` en clair dans le brouillon, l'utilisateur fera les vrais tags.
- **Pourcentages avec leur base visible** : « 100 % des 12 projets testés » plutôt que « 12 sur 12 ».
- **Nommer les outils et les situations précises** plutôt qu'une catégorie vague.
- **Citer l'entreprise** quand le post parle d'une réalisation, d'un projet ou d'un événement professionnel, plutôt qu'un « on » sans contexte.
- **Créditer concrètement** les organisateurs ou partenaires, avec des réalisations vérifiables.
- **Repères temporels concrets** (« six mois plus tard », « la veille du lancement ») plutôt que des métaphores à décoder.

## LinkedIn : mise en forme

- **Liens de préférence en premier commentaire.** Écrire dans le corps « (lien en commentaire) » dans la phrase qui parle de ce qui est lié. Un lien qui sert vraiment la lecture peut rester dans le corps si l'utilisateur le préfère.
- **Aucun markdown.** LinkedIn n'en rend aucun : `*`, `**`, `#`, `[texte](url)` apparaissent tels quels. Mettre en avant un titre ou un nom de produit avec des guillemets droits. Les puces `-` passent visuellement.
- **Listes denses** : pas de ligne vide entre la phrase d'introduction et la liste.

  ```
  intro :
  - item 1
  - item 2
  ```

- **Lignes vides et copier-coller.** L'éditeur LinkedIn supprime les lignes vides collées. Le fichier garde des lignes vides normales. Au moment de copier le post, remplacer chaque ligne vide par le caractère invisible U+2800 (Braille Pattern Blank) :

  ```bash
  awk '/^## Brouillon/{f=1;next}/^## /{f=0}f' <fichier>.md | python3 -c "
  import sys,re
  t=sys.stdin.read().strip('\n')
  sys.stdout.write(re.sub(r'\n[ \t]*\n+', '\n⠀\n', t))" | pbcopy
  ```

  Même traitement pour le premier commentaire s'il contient des lignes vides. Pour X, copier le texte brut, X conserve les lignes vides.

## Repères de distribution LinkedIn

Ces repères sont des corrélations publiées par des éditeurs d'outils LinkedIn sur leurs propres données. Ils aident à trancher entre deux options, sans justifier de réécrire un post qui tient déjà. Un post singulier qui s'écarte d'un repère vaut mieux qu'un post conforme et plat.

- L'idée et la légitimité de l'auteur pèsent plus que la forme.
- Les hooks qui génèrent le plus de commentaires annoncent une fin (« X est mort »), une création (« j'ai créé X »), un chiffre brut suivi d'une punchline, ou posent une question qui divise.
- Un post polarisant obtient nettement plus de réactions qu'un post consensuel, mais une polarisation sans légitimité coûte en crédibilité.
- Les posts longs (2 000 caractères et plus) font mieux que les posts très courts.
- Au-delà de trois hashtags, la portée baisse.

## Sous-cas : post communauté ou événement local

Pour un événement local, un cercle professionnel ou une communauté à laquelle l'auteur appartient, les marqueurs d'appartenance comptent plus que la posture d'expert :

- pronom collectif plutôt qu'un « je » exclusif
- collègues présents nommés
- écosystème reconnu (« les habitués de l'événement »)
- organisateurs crédités concrètement
- émoji ponctuel quand il porte une vraie émotion, en complément du texte
- appel à l'action chaleureux et opérationnel
- mention transparente d'un lien institutionnel (bénévole, sponsor, partenaire)

Test : un membre de la communauté reconnaît l'auteur comme l'un des siens.

## Format du fichier de brouillon

```markdown
---
network: linkedin
author: Prénom Nom
topic: ...
created: YYYY-MM-DD
---

# Titre court

## Brouillon

[le post complet, prêt à copier-coller]

## Premier commentaire

[liens et précisions, si besoin]

## Variantes envisagées

- Hook retenu, option N : [recopier]
- Autres hooks proposés : ...
- Conclusion retenue, option N : [recopier]
- Autres conclusions proposées : ...

## Notes de cadrage

[contenu de l'idée et réponses de l'utilisateur à l'étape 1]
```

## Nouvelle idée absente de `idees/`

1. Confirmer avec l'utilisateur le slug et le sujet en une phrase
2. Créer `2-Areas/communication/posts/idees/<slug>.md` avec un frontmatter minimal et un corps court (sujet, angle pressenti, points à creuser)
3. Enchaîner sur les étapes 1 à 4 (le fichier finira dans `brouillons/`)

## Passage en publié

Quand l'utilisateur annonce la publication :

1. `mv 2-Areas/communication/posts/brouillons/<slug>.md 2-Areas/communication/posts/publies/<slug>.md`
2. Ajouter `published: YYYY-MM-DD` et `url: <lien>` au frontmatter
3. Ajouter une section `## Retours` en bas, à compléter une semaine plus tard : impressions, réactions, commentaires notables. Sans chiffres encore, laisser la section avec la date de relevé prévue.
