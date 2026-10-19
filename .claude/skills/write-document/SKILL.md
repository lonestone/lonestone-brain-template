---
name: write-document
description: Rédige un document formel imprimable (note de cadrage, proposition, rapport, compte rendu formel, étude) rendu par le gabarit document de la web app, puis le relit avant de rendre la main. À utiliser quand l'utilisateur demande un document à envoyer, imprimer ou présenter à un tiers.
argument-hint: [type de document] [sujet ou projet]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Rédiger un document formel

Produit un document MDX que la web app dessine avec son gabarit document : bandeau d'en-tête, couverture avec titre et chapô, sommaire généré, corps, pied de page avec les auteurs. Le même rendu s'exporte en PDF A4.

Avant d'écrire, invoquer la skill "edit-mdx" : ses règles valent pour le document (pas d'import, pas de HTML brut, composants du catalogue).

## Étape 1 : Cadrer

Poser ensemble, en une seule question, ce qui manque parmi :

- **Type de document** : note de cadrage, proposition, rapport, compte rendu formel, étude, autre
- **Destinataire** : qui le lit, et ce qu'il doit décider ou faire après lecture
- **Message principal** : ce que le lecteur retient en une phrase
- **Sources** : pages du wiki, comptes rendus, documents fournis, chiffres
- **Auteurs** affichés en pied de page, avec rôle et email
- **Contraintes** : nombre de pages, date de remise, plan imposé

Attendre la réponse avant de rédiger.

## Étape 2 : Collecter les sources

Lire `README.md` racine pour situer le projet ou le sujet, puis le dossier concerné : `README.md`, comptes rendus de réunion, documents existants dans `documents/`, sources verbatim liées dans `3-Resources/sources/`. Un document fourni en PDF, DOCX ou XLSX se convertit avec `markitdown` (voir la skill "ingest") et se lit **en entier** : une synthèse omet des exigences et arrondit des chiffres.

Si les sources ne suffisent pas à écrire le fond, le dire et demander les documents manquants plutôt que d'improviser. Chaque fait avancé dans le document (chiffre, date, nom, engagement) doit se retrouver dans une source.

## Étape 3 : Créer le fichier

Un document est un fichier `.mdx` placé dans un dossier `documents/`, n'importe où sous `1-Projects/`, `2-Areas/`, `3-Resources/` ou `4-Archives/`, au plus près du projet ou du sujet qu'il sert. Le nom de fichier est le titre court du document, en français, espaces autorisés. Exemple : `1-Projects/refonte-site/documents/Note de cadrage.mdx`, servi sur `/1-Projects/refonte-site/documents/Note-de-cadrage/`.

### Frontmatter

```yaml
---
kind: document
title: "Refonte du site : périmètre, planning et budget"
lead: "Une phrase qui dit ce que le document propose, pour qui, et l'enjeu."
date: 2026-11-12
recipient: "Direction marketing"
label: "Note de cadrage"
cover: "/1-Projects/refonte-site/documents/assets/maquette-accueil.png"
authors:
  - name: "Prénom Nom"
    role: "Direction de projet"
    email: "prenom@exemple.com"
footerNote: "Document de travail, établi pour la direction marketing."
status: draft
---
```

| Champ | Requis | Rôle |
|---|---|---|
| `kind` | non, `document` par défaut | `document` pour ce gabarit, `deck` pour des slides (skill "build-slides") |
| `title` | oui | titre de couverture, une phrase complète qui dit le sujet |
| `lead` | non | chapô sous le titre |
| `date` | oui | date du document, `YYYY-MM-DD` |
| `recipient` | non | destinataire, affiché « pour X » dans l'en-tête |
| `label` | non, « Document » par défaut | type de document affiché en en-tête |
| `cover` | non | visuel de couverture, chemin dans le dépôt ou `/assets/...` |
| `authors` | non | liste `{ name, role?, email? }`, affichée en pied de page |
| `footerNote` | non | mention de bas de page, remplace la mention par défaut |
| `status` | non, `draft` par défaut | `draft`, `review` ou `final` |

Vérifier le schéma exact de la collection `documents` dans `web/src/content.config.ts` avant d'écrire : il fait foi sur ce tableau.

### Corps

- Le titre et le chapô vivent dans le frontmatter. Le corps commence directement à la première section `##`, sans H1.
- Le sommaire est généré depuis les `##`, et le gabarit les numérote automatiquement. Ne jamais écrire de numéro dans un titre (« 1. Contexte »).
- Les `###` et `####` structurent l'intérieur d'une section et restent hors du sommaire.

Plan indicatif, à adapter au type de document :

| Type | Sections habituelles |
|---|---|
| Note de cadrage | contexte et enjeu, objectifs, périmètre et hors périmètre, approche, planning, budget, risques, prochaines étapes |
| Proposition | compréhension du besoin, réponse proposée, déroulé, équipe, planning, budget, risques, conditions, prochaines étapes |
| Rapport ou étude | résumé, question posée, méthode, constats, analyse, recommandations, annexes |
| Compte rendu formel | objet et participants, points traités, décisions, actions avec porteur et échéance, questions ouvertes |

## Étape 4 : Rédiger

### Fond

- **Un résumé qui convainc en dix secondes** quand le document dépasse quelques pages, dans un `Callout` en tête : ce qui est proposé ou constaté, pourquoi, et ce que le lecteur doit décider.
- **Une position assumée.** Un document qui recommande dit ce qu'il recommande et pourquoi, sans liste de qualités génériques.
- **Une section risques** pour toute proposition, note de cadrage ou plan : trois à cinq risques réels, chacun avec sa mitigation (composant `Risk` ou `RiskGrid`). Un document qui n'affiche que des forces perd la confiance du lecteur.
- **Des objectifs mesurables** quand le sujet s'y prête, marqués « indicatifs » s'ils n'engagent pas.
- **Le périmètre se lit dans les deux sens** : ce qui est inclus, et ce qui a été évoqué sans être retenu.
- **Des chiffres précis et justifiés**, jamais de fourchette large ni de borne basse à zéro.

### Style

- Appliquer la skill "content-rules" dès le premier jet.
- **Titres en phrases complètes avec un verbe**, secs et explicites : « Le planning tient en cinq mois si le cadrage se termine en octobre » plutôt que « Planning » ou des fragments du type « Le planning. En clair. ».
- Voix neutre de document, au présent. Choisir « nous » ou la troisième personne et s'y tenir, sans « on ».
- Phrases tenues plutôt que suites de fragments sans verbe, sauf dans un bloc de chiffres clés.

### Forme

- **Composants plutôt que tableaux markdown** dès qu'un composant existe pour le contenu : chiffres clés (`StatGrid`, `InfoGrid`), étapes (`PhasesRoadmap`, `NextStep`), planning (`GanttPlanning`, `PlanningGrid`), budget (`BudgetTable`, `BudgetCallout`), risques (`Risk`, `RiskGrid`), livrables (`Deliverables`), arguments numérotés (`NumberedCards`, `KeyPoints`), rôles (`RACIMatrix`), équipe (`TeamProfile`), mise en exergue (`Callout`, `HeroStatement`). Le catalogue `COMPONENTS.md` donne la liste à jour et les props : le parcourir avant d'écrire.
- **Chiffres clés en bloc visuel**, jamais en phrase ni en liste de fragments.
- **Schémas Mermaid verticaux et compacts** : `flowchart TD` (et `direction TB` dans les sous-graphes), six nœuds au plus, deux lignes de libellé par nœud, le détail dans le texte ou les libellés de flèches. Un schéma horizontal s'affiche trop petit sur une page A4. Chaque schéma est précédé d'un titre `###` qui dit ce qu'il montre.
- **Images** dans un dossier `assets/` à côté du document, appelées par leur chemin dans le dépôt. Un visuel à créer passe par la skill "generate-image".

### Règles propres au PDF

- Aucun `**gras**` dans un élément de liste ni dans une cellule de tableau, ligne de total comprise : les astérisques provoquent des césures erratiques dans le rendu Chromium. Le libellé fait partie de la phrase.
- Aucun lien markdown `[texte](url)` dans un `Callout` : il ressort en syntaxe brute. Écrire l'URL en texte simple.
- Aucun émoji dans un titre `##` : il pollue le sommaire.
- Aucun bloc de code pour une arborescence ou une liste structurée : utiliser un tableau.

## Étape 5 : Vérifier la couverture

Relire le document contre les sources et produire dans le chat un court rapport :

- **Couvert** : les exigences, attentes et faits des sources repris dans le document.
- **Manquant ou flou** : ce que les sources contiennent et que le document omet ou traite mal, avec l'endroit où l'ajouter. Corriger immédiatement dans le fichier.
- **Questions ouvertes** : ce que les sources laissent sans réponse et qui changerait le contenu. Les reporter dans une section « Prochaines étapes » ou une `AdvisoryNote`, et les poser à l'utilisateur.

## Étape 6 : Relecture finale

Avant de rendre la main, relire le document entier selon cinq axes, et corriger directement ce qui relève de la forme. Signaler dans le chat ce qui demande un arbitrage.

1. **Cohérence interne.** Recalculer chaque total (jours × taux, sous-totaux, total). Un même chiffre (montant, durée, date, effectif) a la même valeur partout où il apparaît : frontmatter, composants, texte, résumé. Le planning, le tableau des jalons et les dates citées concordent, et la charge tient dans le calendrier. Les livrables promis apparaissent dans le planning et le budget.
2. **Conformité au style.** Passer la skill "content-rules" une fois sur l'ensemble du texte : tirets cadratins, points-virgules, label-colon, gras systématique suivi de deux-points, phrases sans verbe, ouvertures molles (« Ainsi, », « De plus, »), jargon creux, formulations négatives.
3. **Conformité à cette skill.** Titres en phrases complètes et sans numéro, composants à la place des tableaux, section risques présente, schémas verticaux précédés d'un `###`, règles PDF respectées.
4. **Exactitude.** Chaque fait avancé se retrouve dans une source. Un fait introuvable est signalé « à vérifier », même s'il paraît plausible.
5. **Pertinence.** La réponse traite les vrais enjeux du destinataire, pas seulement sa demande formulée. Signaler ce qui paraît sur-dimensionné, sous-dimensionné ou générique.

Terminer la relecture par trois à cinq points prioritaires si des arbitrages restent ouverts.

## Étape 7 : Construire et exporter

1. `cd web && npm run build` : les erreurs de schéma Zod et les composants inconnus apparaissent en clair. Corriger jusqu'à un build propre.
2. Ouvrir la route du document et vérifier le rendu : couverture, sommaire, composants.
3. Exporter en PDF avec la skill "print-doc", à côté du fichier MDX, puis relire le PDF page par page (schémas coupés, blocs qui débordent, pages blanches).
4. Passer `status` à `review` quand le document part en relecture, à `final` quand il est validé, sur demande de l'utilisateur.
5. Ajouter le lien vers le document dans le `README.md` du projet ou du sujet concerné.
6. Donner à l'utilisateur la route du document et le chemin du PDF.
