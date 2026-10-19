---
name: add-meeting-notes
description: Transforme un transcript ou des notes brutes de réunion en compte rendu dans le wiki. Sauvegarde le verbatim dans 3-Resources/sources/transcripts/, rédige le compte rendu (décisions, actions avec porteur et échéance, questions ouvertes) dans le dossier du projet ou du sujet concerné, puis met à jour les pages liées.
argument-hint: [projet ou sujet concerné?] [chemin du fichier ou rien si le texte est collé]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Ajouter le compte rendu d'une réunion

Le transcript vient de n'importe quel outil (visioconférence, enregistreur, prise de notes) ou d'un texte collé. La skill ne dépend d'aucun outil de transcription.

Tout le contenu produit est en français et suit la skill "content-rules".

## Étape 1 : Récupérer la source

Prendre la source fournie par l'utilisateur : texte collé, chemin de fichier, export de l'outil de visioconférence. Accepter tout format (verbatim horodaté, puces, notes éparses, email de compte rendu). Un fichier PDF ou DOCX se convertit avec `markitdown` (voir la skill "ingest").

Sans source, demander à l'utilisateur de coller le transcript ou de donner le chemin du fichier.

## Étape 2 : Identifier où ranger la réunion

Si `$ARGUMENTS` nomme un projet ou un sujet, le retrouver dans `1-Projects/` ou `2-Areas/`. Sinon, le déduire du contenu et le proposer, en lisant `README.md` racine pour connaître les dossiers existants. En cas de doute, lister les candidats et demander.

Le compte rendu se range dans le dossier du projet ou du sujet, dans un sous-dossier `reunions/` s'il existe ou dès que le dossier en compte plusieurs.

## Étape 3 : Analyser et faire valider

Un transcript automatique déforme souvent les noms propres et le jargon (noms de personnes, d'entreprises, d'outils, acronymes). Interpréter d'après le contexte et les pages du wiki, et écrire le terme juste dans le compte rendu.

Extraire :

- **Date** de la réunion (`YYYY-MM-DD`), à demander si absente
- **Type** : réunion, appel, atelier, démo, comité, autre
- **Participants** : `Prénom Nom` et rôle quand il est connu
- **Projets et sujets** concernés
- **Décisions** prises
- **Actions** : quoi, qui porte, pour quand
- **Questions ouvertes** : ce qui reste à trancher

Présenter cette extraction à l'utilisateur avant d'écrire quoi que ce soit :

```
Voici ce que j'ai extrait :
- Date : ...
- Type : ...
- Participants : ...
- Rangement proposé : 1-Projects/<projet>/reunions/
- Décisions : ...
- Actions : ...
- Questions ouvertes : ...

Des corrections avant que je rédige le compte rendu ?
```

Une action sans porteur ou sans échéance se signale ici : l'utilisateur la complète, ou elle reste marquée « à préciser ».

## Étape 4 : Sauvegarder le verbatim

Un transcript intégral se copie tel quel, sans retouche, dans `3-Resources/sources/transcripts/YYYY-MM-DD-<slug>.txt`. Le fichier du presse-papier ou des téléchargements n'est pas une source pérenne : sans cette copie, le compte rendu devient la seule trace et ce qui s'en nourrit ne peut plus être vérifié.

Le `<slug>` résume le sujet en kebab-case (`lancement-refonte-site`, `comite-budget-t4`), et reste le même que celui du compte rendu.

Des notes éparses ou un email de compte rendu se copient aussi en `.txt` s'ils contiennent des informations absentes du compte rendu. Sinon, le compte rendu suffit.

## Étape 5 : Rédiger le compte rendu

Créer `YYYY-MM-DD-<slug>.md` dans le dossier retenu à l'étape 2. Le compte rendu se comprend sans relire le transcript : il le transforme, il ne le recopie pas.

```markdown
---
date: YYYY-MM-DD
type: réunion
participants:
  - Prénom Nom (rôle)
projets:
  - <slug-du-projet>
---

# <Sujet de la réunion> (<date lisible>)

## Contexte

Une ou deux phrases sur la raison de la réunion et son objectif.

Transcript intégral : [YYYY-MM-DD-<slug>.txt](<chemin relatif>/3-Resources/sources/transcripts/YYYY-MM-DD-<slug>.txt).

## Points discutés

- Point 1
- Point 2

## Décisions

- Décision 1
- Décision 2

## Actions

| Action | Porteur | Échéance |
|---|---|---|
| Envoyer la maquette de la page d'accueil | Prénom Nom | 2026-11-20 |
| Valider le budget du lot 2 | Prénom Nom | à préciser |

## Questions ouvertes

- Question 1, et qui doit y répondre
```

N'inclure une section que si elle a du contenu. Sections facultatives selon la réunion : « Chiffres et citations » pour un fragment du transcript à garder mot pour mot, « Prochaine réunion » pour une date fixée.

Règles de rédaction :

- Une décision dit ce qui est décidé, sans le débat qui y a mené.
- Une action commence par un verbe à l'infinitif et désigne une seule personne.
- Les échéances relatives (« vendredi prochain ») se convertissent en dates absolues à partir de la date de la réunion.
- Les propos s'attribuent seulement quand le transcript les attribue sans ambiguïté. Dans une salle partagée, un enregistrement attribue souvent à une seule personne ce que plusieurs ont dit.

## Étape 6 : Mettre à jour les pages liées

Proposer puis appliquer, après accord de l'utilisateur, les mises à jour que la réunion appelle :

- `README.md` du projet ou du sujet : lien vers le compte rendu, statut, prochaines échéances, décisions qui changent le plan
- Liste d'actions du projet si elle existe : nouvelles actions en tête, actions closes cochées
- Pages de référence touchées par une décision (périmètre, planning, budget, organisation)
- Fiches des personnes ou organisations rencontrées, si le wiki en tient

Un compte rendu qui contredit une page existante se signale explicitement à l'utilisateur plutôt que de trancher en silence.

## Étape 7 : Récapituler

Présenter un récapitulatif court : fichier de compte rendu créé, verbatim sauvegardé, pages mises à jour, actions sans porteur ou sans échéance restantes. Si un email de suivi est utile, proposer de le rédiger en brouillon avec la skill "email-rules".
