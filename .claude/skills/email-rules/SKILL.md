---
name: email-rules
description: Règles générales pour tous les emails (ton, style, mise en forme, brouillons). À appliquer dès qu'on rédige, met en forme ou crée le brouillon d'un email, en complément de la skill "content-rules". Brouillon uniquement, jamais d'envoi sans accord explicite.
---

# Règles email

## Règle absolue : brouillon uniquement

**Un email ne part jamais sans l'accord explicite de l'utilisateur, donné pour cet email précis.** Par défaut, produire un brouillon : texte dans la conversation ou dans un fichier, ou brouillon créé dans la messagerie quand une intégration le permet. L'utilisateur relit et envoie lui-même.

Un accord vaut pour un email, pas pour une série. Même quand l'utilisateur dit « envoie-le », créer le brouillon et lui rappeler qu'il l'envoie depuis sa messagerie, sauf si la configuration du dépôt (`CLAUDE.md`) autorise explicitement l'envoi pour ce cas.

Ces règles s'appliquent à tout email : sollicitation, suivi de réunion, récapitulatif, relance, réponse. Elles s'ajoutent à la skill "content-rules", qui reste la référence pour la formulation.

## Ton et style

- **Registre** : suivre la convention de l'entreprise décrite dans `CLAUDE.md` (tutoiement ou vouvoiement). Sans consigne, reprendre le registre du dernier échange avec le destinataire, et vouvoyer un premier contact.
- **Objet sobre et descriptif**, qui annonce le contenu. Les accroches marketing (« 2 min ? », « un service ? », « ça va vous intéresser ») font spam.
- **Aller à l'essentiel.** Une seule demande claire par email. Le contexte se limite à ce qui sert la réponse attendue.
- **Ouverture courte et chaleureuse, clôture qui invite à répondre.** Garder les accents.
- **Une action attendue se voit** : ce que l'on demande, à qui, pour quand.
- **Un email de suivi de réunion** reprend les décisions et les actions avec leur porteur et leur échéance, sans recopier tout le compte rendu.
- **Une relance** rappelle la demande initiale en une phrase et propose une suite simple, sans reproche.

## Mise en forme

- Paragraphes courts, une ligne vide entre deux paragraphes.
- Listes à puces seulement pour trois éléments ou plus de même nature.
- Pas de markdown dans un brouillon destiné à une messagerie : ni `**gras**`, ni `##`. Un brouillon créé par API se compose en HTML simple.
- Liens en clair ou intégrés au texte, jamais de lien raccourci.
- La signature de l'utilisateur s'ajoute à la fin si l'outil ne l'insère pas. Elle porte déjà le nom : le corps se termine sur la formule de politesse, sans re-signer.

## Exemple d'intégration : brouillons via une API de messagerie

Quand le dépôt connecte une messagerie (Gmail, Outlook, via un serveur MCP ou un connecteur), créer le brouillon directement dans la boîte. Points de vigilance communs aux API de messagerie :

- **Créer, jamais envoyer.** Utiliser l'action de création de brouillon, pas l'action d'envoi.
- **Corps en HTML.** Certaines messageries collent les paragraphes entre eux : séparer les blocs par une ligne vide explicite (`<div>&nbsp;</div>` entre deux `<div>`), un simple `<p>` pouvant perdre ses marges.
- **Signature.** Un brouillon créé par API n'embarque généralement pas la signature configurée dans le client. La récupérer dans un email envoyé récemment et l'ajouter en fin de corps.
- **Identifiant de brouillon instable.** Chez certains fournisseurs, l'identifiant change à chaque modification, y compris quand l'utilisateur l'édite lui-même. Avant de mettre à jour un brouillon, relister le dossier Brouillons et le retrouver par destinataire et objet.
- **Destinataires en tableau** (`["a@exemple.com", "b@exemple.com"]`), jamais en chaîne séparée par des virgules.

Les détails propres à la messagerie de l'entreprise (outil, boîtes connectées, signature actuelle) se documentent dans `CLAUDE.md` ou dans une page `2-Areas/` dédiée, pas dans cette skill.
