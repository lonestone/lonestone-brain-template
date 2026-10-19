# Prise en main

Ce wiki est un simple dossier de pages texte, rangé et tenu à jour par un assistant IA. Ce guide explique comment l'ouvrir, comment travailler avec l'assistant et comment l'adapter à votre entreprise. Pour parcourir le contenu, commencez par le [README](README.md).

## Le principe

Plutôt que de chercher l'information dans des mails, des notes et des documents éparpillés, l'équipe confie chaque source à l'assistant : un article, un transcript de réunion, un document reçu. L'assistant garde l'original de côté, en extrait ce qui compte et met à jour les pages concernées. Le savoir est écrit une fois, relié au reste, et retrouvé en quelques secondes.

Le contenu est rangé en quatre dossiers :

| Dossier | Ce qu'on y trouve |
|---|---|
| `1-Projects/` | Les projets en cours, avec une échéance et un objectif |
| `2-Areas/` | Le fonctionnement de l'entreprise, suivi en continu : organisation, processus, stratégie, communication |
| `3-Resources/` | Les références réutilisables, et dans `sources/` les originaux conservés tels quels |
| `4-Archives/` | Ce qui est terminé ou abandonné |

Le fichier `CLAUDE.md` contient les instructions que lit l'assistant : ses règles d'écriture, la façon de ranger, ce qu'il doit toujours demander avant d'agir. Il s'enrichit au fil de l'usage.

## Choisir son outil

Le dossier fonctionne avec la plupart des assistants qui travaillent sur des fichiers. Ils lisent tous `CLAUDE.md` et, selon l'outil, les savoir-faire de l'assistant décrits dans [SKILLS.md](SKILLS.md).

- **Claude** (application de bureau) : ouvrir le dossier comme dossier de travail, puis discuter normalement. C'est l'usage le plus courant.
- **Claude Code** : lancer `claude` depuis le dossier, dans un terminal ou dans votre éditeur.
- **OpenCode** et **Pi** : lancer l'agent depuis le dossier. Ils reprennent les instructions de `CLAUDE.md`.
- **Obsidian** : ouvrir le dossier comme coffre (« vault ») pour lire, naviguer et modifier les pages à la main. La vue graphe montre les liens entre les pages. Obsidian se combine très bien avec l'un des assistants ci-dessus.

## Travailler avec l'assistant

Parlez-lui comme à un collègue. Quelques demandes courantes :

| Vous voulez | Demandez par exemple |
|---|---|
| Garder une source | « Ajoute cet article au wiki : https://… » |
| Résumer une réunion | « Voici le transcript de la réunion client, fais le compte rendu » |
| Retrouver une information | « Qu'avons-nous décidé sur le prix de l'offre Diagnostic ? » |
| Produire un document | « Rédige une note de cadrage pour le projet X » |
| Préparer une présentation | « Prépare un deck de cinq slides pour le comité de lundi » |
| Écrire un post | « Rédige le post LinkedIn sur notre nouvelle offre » |
| Faire le ménage | « Vérifie la santé du wiki » (pages orphelines, liens cassés, contradictions) |

Quelques règles le rendent fiable :

- Il vous montre ce qu'il compte modifier et attend votre accord avant de toucher aux pages existantes.
- Les originaux restent intacts dans `3-Resources/sources/`, ce qui permet toujours de vérifier une information à sa source.
- Il n'envoie jamais un email ni ne publie un post : il prépare des brouillons.
- Chaque série de modifications est consignée dans le [journal](log.md) au moment de l'enregistrement.

## Lire le wiki comme un site

Le dossier `web/` affiche le wiki comme un site interne, avec une mise en page soignée pour les documents imprimables (notes, propositions, rapports) et les présentations. Demandez à l'assistant de « lancer le site du wiki » : il s'ouvre sur http://localhost:4321. Il peut aussi exporter n'importe quel document ou deck en PDF.

Pour le lancer soi-même, il faut [Node.js](https://nodejs.org/) 22 ou plus récent :

```bash
cd web
npm install
npm run dev
```

## Adapter le wiki à votre entreprise

Le contenu livré est un exemple, celui d'une entreprise fictive nommée « Exemple ». Pour démarrer, le plus simple est de demander à l'assistant : « Adapte ce wiki à mon entreprise », en lui donnant le nom, le site, les couleurs et quelques informations sur l'équipe. Il s'occupe des étapes suivantes :

1. Remplacer le nom et les coordonnées de l'entreprise (`web/src/lib/site-config.ts`) et le titre du [README](README.md).
2. Reprendre les couleurs de la marque dans le site et les présentations, et décrire l'identité visuelle dans la section « Direction artistique » de `CLAUDE.md`.
3. Supprimer le projet et les pages d'exemple, ou les réécrire avec vos vraies informations.
4. Ajouter à `CLAUDE.md` votre vocabulaire et vos règles propres.

## Réglages personnels

Deux fichiers restent sur votre ordinateur et ne sont jamais partagés :

- `USER.md` donne à l'assistant les emplacements de vos dossiers locaux (documents à analyser, stockage partagé). Il se crée à partir de `USER.md.example`, ou en demandant à l'assistant de le configurer.
- `.env` contient les clés d'accès aux services externes, par exemple pour générer des images. Il se crée à partir de `.env.example`, seulement si vous utilisez ces fonctions.
