# Composants

Catalogue des composants utilisables dans les MDX du wiki, sans import. Chaque section décrit un composant et donne son usage avec des données fictives. Sur le wiki, à l'adresse `/COMPONENTS/`, chaque bloc de code est rendu en démo juste au-dessus de lui, et les slides sont affichées depuis un deck de démonstration.

Un composant s'ajoute en déposant son fichier dans `web/src/components/` et sa section dans ce fichier. La section porte un titre `###` au nom exact du composant, une description et un bloc de code `mdx` qui sert à la fois de démo et d'exemple d'usage. Un bloc `mdx slide` s'affiche comme une slide, à l'échelle de la page, et un bloc `mdx deck` comme un deck complet, avec sa navigation. `npm run components:check`, lancé avant chaque build, vérifie que le dossier et ce fichier restent alignés.

## Mise en page

Structure d'un document : couverture, en-tête, sommaire, découpage en sections.

### InfoGrid

Grille de cartes, en trois colonnes par défaut ou en deux avec `cols={2}`, qui accueille des `InfoItem` ou tout autre bloc comme une capture. Une carte seule sur sa dernière ligne s'étend sur toute la largeur. Elle sert aux chiffres clés, à la présentation de l'entreprise ou à un ensemble de points de même rang.

```mdx
<InfoGrid cols={2}>
  <InfoItem icon="📅" title="Démarrage en janvier">
    Atelier de lancement dans les deux semaines qui suivent la validation du périmètre.
  </InfoItem>
  <InfoItem icon="👥" title="Une équipe de quatre personnes">
    Une cheffe de projet, un designer et deux développeurs seniors.
  </InfoItem>
</InfoGrid>
```

### InfoItem

Carte d'une `InfoGrid`, avec un visuel en tête, un titre et un court texte en markdown. Le visuel est soit un emoji passé en `icon`, soit un visuel détouré passé en `img` (redimensionné à 240 px), les deux étant exclusifs. Elle se place toujours dans une `InfoGrid`.

```mdx
<InfoGrid>
  <InfoItem img="/assets/visuels/cube.png" title="Des outils métiers sur mesure">
    Nous concevons et faisons évoluer les outils internes de nos équipes, du besoin à la mise en production.
  </InfoItem>
  <InfoItem img="/assets/visuels/sphere.png" title="Une quarantaine de personnes">
    Des équipes produit, technique et commerciale réparties sur deux sites.
  </InfoItem>
  <InfoItem img="/assets/visuels/pile.png" title="Trois offres complémentaires">
    Conseil, réalisation et accompagnement, vendues seules ou ensemble.
  </InfoItem>
</InfoGrid>
```

## Texte et encadrés

Blocs qui portent un message : encadrés, chiffres clés, points forts, mises en garde.

### Callout

Panneau gris à filet gauche de la couleur de marque, qui met en exergue une liste courte, par exemple les exigences d'un cahier des charges ou le détail d'un point. Le contenu s'écrit en liste markdown, sans gras ni lien, pour un rendu PDF propre.

```mdx
<Callout>
- Accès sécurisé par authentification unique pour les équipes internes
- Export mensuel des indicateurs au format CSV
- Hébergement des données en France
</Callout>
```

### ConstraintCallout

Encadré à liseré coloré qui liste les contraintes transverses d'un backlog ou d'une fiche projet, une par puce. La prop `type` choisit le ton : `info` en bleu (par défaut), `warning` en ambre pour les points à trancher, `restriction` en rouge pour ce qui est bloquant. Le `title` s'affiche en petites capitales.

```mdx
<ConstraintCallout type="restriction" title="Contraintes transverses">
- Back-office utilisable sur ordinateur uniquement, le mobile est réservé aux techniciens
- Toute intervention clôturée passe par une validation du responsable d'agence
- Déploiement simultané dans toutes les agences à la mise en production
</ConstraintCallout>

<ConstraintCallout type="warning" title="Points à trancher en cadrage">
- Périmètre de l'historique à reprendre, deux ans ou dossier complet
- Fournisseur d'authentification unique retenu par l'équipe informatique
</ConstraintCallout>
```

### Disclaimer

Encadré gris à filet gauche, texte en italique, qui pose une réserve en tête de document : ce qui fait l'objet d'un engagement ferme et ce qui relève d'hypothèses à valider. Il ne prend aucune prop et affiche le markdown qu'il enveloppe.

```mdx
<Disclaimer>
Seule la phase de cadrage fait l'objet d'un engagement ferme. Les phases suivantes décrivent une vision de travail dont les enveloppes définitives sont arrêtées à l'issue du cadrage.
</Disclaimer>
```

### HeroStatement

Grand encadré à la couleur de marque, texte noir, qui ouvre une section sur une phrase d'enjeu ou de conviction forte. Le `label` en petites capitales vaut « VOTRE ENJEU » par défaut et se remplace par « Notre conviction » ou tout autre intitulé court. Le contenu s'écrit en markdown et reste bref, une à deux phrases.

```mdx
<HeroStatement label="Votre enjeu">
Donner aux équipes terrain un outil qu'elles ouvrent chaque matin, et qui remplace les trois tableurs qu'elles tiennent aujourd'hui en parallèle.
</HeroStatement>
```

### KeyPoints

Encadré « En bref » sur fond teinté de la couleur de marque, dont chaque puce devient une ligne précédée d'une flèche. Il résume les livrables ou les points clés d'une phase juste après son texte. Le contenu est une liste markdown écrite directement dans le composant.

```mdx
<KeyPoints>
- Cartographie des processus actuels et des points de friction
- Spécification fonctionnelle et technique de la phase 1
- Maquettes des écrans principaux, validées avec l'équipe métier
- Feuille de route chiffrée des phases suivantes
</KeyPoints>
```

### NumberedCards

Grille de cartes numérotées sur deux colonnes, chacune avec un titre et un court texte, le numéro étant posé en grand en haut à droite. Elle convient aux partis pris, aux offres, aux personas ou aux verrous d'un projet. Une carte seule sur sa dernière ligne occupe toute la largeur, et aucune carte n'est coupée entre deux pages à l'impression.

```mdx
<NumberedCards items={[
  { title: "Un outil pensé pour le terrain", body: "Chaque écran est conçu pour une saisie rapide sur mobile, en intervention, avec une connexion instable." },
  { title: "Des données fiables dès la saisie", body: "Les contrôles se font au moment de la saisie plutôt qu'en fin de mois dans un tableur." },
  { title: "Une mise en production progressive", body: "Une première agence pilote l'outil pendant un mois avant son déploiement à l'ensemble du réseau." },
  { title: "Des équipes autonomes", body: "Le back-office permet de gérer utilisateurs, référentiels et paramètres sans passer par l'équipe technique." },
]} />
```

### Principles

Liste de principes ou de partis pris sur deux colonnes, l'affirmation à gauche et son explication à droite, séparées par des filets plutôt qu'enfermées dans des cartes. Elle convient à une section de convictions ou de choix de conception, quand chaque point mérite une explication de quelques lignes. Elle passe sur une colonne en largeur réduite.

```mdx
<Principles items={[
  { title: "Chaque utilisateur repart avec un outil qui tourne.", body: "La formation se termine sur un cas d'usage réel, installé sur le poste de chaque participant, plutôt que sur une démonstration." },
  { title: "Ce qui est automatisé reste lisible.", body: "Les règles et les paramètres vivent dans des fichiers versionnés, que l'équipe relit et modifie elle-même." },
  { title: "Le périmètre se décide sur des usages mesurés.", body: "Chaque fonctionnalité de la phase 2 est retenue d'après les usages observés pendant la phase pilote." },
]} />
```

### StatGrid

Chiffres cibles composés en grand, sans carte, chacun surmonté d'un filet de la couleur de marque et suivi de son libellé. La grille passe de une à quatre colonnes selon la largeur. Elle convient aux indicateurs cibles d'un document et reçoit dans `items` des paires `value` et `label`.

```mdx
<StatGrid items={[
  { value: "≥ 95", label: "Score Lighthouse visé sur les pages principales" },
  { value: "< 2,5 s", label: "Temps d'affichage cible sur mobile en 4G" },
  { value: "80 %", label: "Demandes traitées sans intervention manuelle" },
  { value: "3 j", label: "Délai moyen de mise en ligne d'une nouvelle offre" },
]} />
```

### WorkInProgress

Encadré en pointillés de la couleur de marque, marqué « À compléter », qui signale dans un brouillon ce qu'il reste à trancher ou à rédiger avant diffusion. Le `title` résume le point ouvert, le `role` facultatif désigne la personne qui doit agir, et chaque élément de liste du corps s'affiche avec un point d'interrogation. Il se retire du document avant son envoi.

```mdx
<WorkInProgress title="Budget à valider avant envoi" role="Claire">
Le chiffrage du lot 2 dépend de la réponse de l'éditeur sur son API.

- Confirmer le nombre de jours de recette
- Valider l'enveloppe avec la direction
</WorkInProgress>
```

## Graphiques

Ces graphiques de données sont écrits en HTML et CSS, sans script, et se lisent aussi bien à l'écran que dans le PDF.

### BarChart

Graphique en barres horizontales pour une seule série de grandeurs, dont chaque ligne est un `Bar`. Toutes les barres se mesurent à `max`, en général la plus grande valeur du graphique. Le `title` facultatif nomme ce qui est mesuré, la `caption` facultative donne la source ou une clé de lecture sous le graphique.

```mdx
<BarChart title="Visites organiques estimées par mois" max={12000} caption="Source : relevé de mars, Google France.">
  <Bar label="Concurrent A" value={12000} />
  <Bar label="Concurrent B" value={4500} />
  <Bar label="Notre site" value={300} highlight />
</BarChart>
```

### Bar

Un `Bar` est une ligne de `BarChart`, avec un libellé, une barre proportionnelle à `value` et la valeur. `display` remplace la valeur affichée quand elle diffère du nombre (unité, note sur 5), `note` ajoute un complément discret comme une tendance, et `highlight` passe la ligne en noir pour la désigner au lecteur, tandis que les autres restent grises. Le survol affiche le libellé complet, la valeur et la note.

```mdx
<BarChart max={5}>
  <Bar label="Emballage" value={5} display="5/5" note="en hausse" highlight />
  <Bar label="Textile" value={4} display="4/5" />
  <Bar label="Pharmacie" value={1} display="1/5" />
</BarChart>
```

## Listes et suivi

Tableaux de travail qu'on filtre et qu'on parcourt : clients, projets, demandes, pistes.

### DataTable

Tableau filtrable pour toute liste de travail (clients, projets, demandes entrantes, pistes commerciales) : un champ de recherche, une pastille par groupe de lignes et un tableau encadré dont les lignes sont des `DataRow`. `columns` donne les en-têtes, en texte ou en objet `{ label, align: "right" }` pour une colonne de montants. Une pastille masque au clic les lignes de son groupe (le `group` de chaque `DataRow`) et les réaffiche au clic suivant, avec leur nombre. `filters` liste les pastilles dans l'ordre voulu, chacune avec sa `value`, son `label`, sa couleur (`class`) et, si elle doit être masquée d'emblée, `hidden`. `filter` seul en construit une par valeur de groupe, précédées de son libellé. `searchable={false}` retire la recherche, `placeholder` et `empty` changent ses textes, et `dense` passe le tableau en petite taille pour les tableaux larges. Une cellule empile plusieurs informations liées plutôt que d'ouvrir une colonne par champ.

```mdx
<DataTable dense columns={["Piste et besoin", "Échéance et budget", "Priorité", "Fiche"]} filter="Priorité">
<DataRow group="4" cells={[{ title: "Groupe Hélios", text: "Outil interne de suivi des interventions", note: "Recommandé par un client" }, { title: "19/10", text: "150 k€ HT sur 2 ans" }, { text: "4", badge: "high", note: "besoin clair, budget validé" }, { button: "Fiche", href: "https://example.org/pistes/helios", note: "Brief reçu par e-mail" }]} />
<DataRow group="3" cells={[{ title: "Maison Bertin", text: "Refonte du site et de l'espace client", note: "Lyon (69)" }, { title: "26/10", text: "n.c." }, { text: "3", badge: "mid", note: "refonte d'un existant" }, { button: "Fiche", href: "https://example.org/pistes/bertin", note: "Premier rendez-vous fait" }]} />
<DataRow group="2" cells={[{ title: "Transports Morel", text: "Maintenance applicative", note: "Rennes (35)" }, { title: "30/10", text: "40 k€" }, { text: "2", badge: "low", note: "maintenance seule" }, { note: "Brief à demander" }]} />
</DataTable>

<DataTable columns={["Client", "Projets", "Statut", { label: "Budget", align: "right" }]} filters={[{ value: "client", label: "Client", class: "bg-ok-wash text-ok-ink" }, { value: "perdu", label: "Perdu", class: "bg-alert-wash text-alert", hidden: true }]}>
<DataRow group="client" cells={[{ title: "Atelier Dupré", href: "/1-Projects/" }, { items: ["Portail fournisseurs", "Application d'inventaire"] }, { text: "Client", badgeClass: "bg-ok-wash text-ok-ink" }, { title: "48 000 €", note: "12 000 € en cours", align: "right" }]} />
<DataRow group="perdu" cells={[{ title: "Maison Leroux" }, { text: "Aucun", muted: true }, { text: "Perdu", badgeClass: "bg-alert-wash text-alert" }, { text: "n.c.", muted: true, align: "right" }]} />
</DataTable>
```

### DataRow

Une ligne de `DataTable`. Chaque élément de `cells` est un texte, ou un objet qui empile de haut en bas un titre en gras (`title`), un texte (`text`) précédé si besoin d'une petite étiquette (`tag`), une liste (`items`), un lien et une note discrète (`note`). Le lien (`href`) porte le titre, ou à défaut le texte, ou devient un petit bouton quand `button` lui donne un libellé, ce qui évite d'afficher une longue adresse ; une adresse absolue s'ouvre dans un nouvel onglet. `badge` (`high`, `mid` ou `low`) ou `badgeClass` (les classes d'une couleur de statut) affichent le texte dans une pastille. `align: "right"`, `muted` et `nowrap` règlent l'alignement, la couleur et le retour à la ligne de la cellule. `group` porte la valeur filtrée par les pastilles du tableau.

Un contenu placé entre les balises de la ligne, markdown compris, devient un panneau de détail : la ligne devient cliquable, une étiquette `detailLabel` (Détail par défaut) le signale dans la première cellule, et un clic l'ouvre dans une `Popin` titrée d'après cette cellule, ou d'après `detailTitle` et `detailSubtitle`.

```mdx
<DataTable columns={["Piste et besoin", "Priorité", "Fiche"]} searchable={false}>
<DataRow group="4" detailLabel="Analyse du besoin" detailSubtitle="Brief relu le 9 octobre" cells={[{ title: "Groupe Hélios", text: "Outil interne de suivi des interventions", tag: "Urgent", note: "Recommandé par un client" }, { text: "4", badge: "high", note: "besoin clair, budget validé" }, { button: "Fiche", href: "https://example.org/pistes/helios", note: "Brief reçu par e-mail" }]}>

Le groupe attend une équipe capable de reprendre une application existante et d'y ajouter trois modules.

- Décision prise par la direction des opérations et l'équipe informatique
- Deux références d'outils métiers demandées
- Réponse attendue le 19 octobre

</DataRow>
<DataRow group="2" cells={[{ title: "Transports Morel", text: "Maintenance applicative", note: "Rennes (35)" }, { text: "2", badge: "low", note: "maintenance seule" }, { note: "Brief à demander" }]} />
</DataTable>
```

### Popin

Fenêtre modale, construite sur l'élément `dialog` natif. Elle s'ouvre depuis tout élément dont l'attribut `data-popin-target` porte son `id`, et se ferme par son bouton, par Échap ou par un clic hors du panneau. `title` et `subtitle` forment l'en-tête, le contenu passe en slot, markdown et composants compris, et s'affiche dans l'échelle dense `doc-compact` pour que `StatGrid`, les tableaux et les encadrés tiennent dans le panneau. `DataRow` s'en sert pour son panneau de détail.

```mdx
<DataTable columns={["Piste", "Priorité"]} searchable={false}>
<DataRow group="3" detailTitle="Atelier Dupré" cells={[{ title: "Atelier Dupré", note: "Cliquer sur la ligne pour ouvrir la popin" }, { text: "3", badge: "mid" }]}>

Le panneau reçoit n'importe quel contenu : un résumé, une liste de points d'attention, un lien vers la fiche complète.

</DataRow>
</DataTable>
```

## Budget et chiffrage

Montants, taux journaliers, estimations et récapitulatifs budgétaires.

### AdvisoryNote

Encadré gris discret, en petit corps, qui se place juste sous un chiffrage pour en préciser les hypothèses (dimensionnement de l'hébergement, ce que couvre la garantie, conditions d'ajustement). Il ne prend aucune prop et affiche le markdown qu'il enveloppe.

```mdx
<AdvisoryNote>
L'hébergement est calculé sur un déploiement en France avec une base PostgreSQL managée, pour un trafic nominal de 20 000 visites par mois. Un audit de trafic pendant le cadrage permet d'affiner ce dimensionnement.
</AdvisoryNote>
```

### BudgetCallout

Grand bloc à la couleur de marque qui annonce un montant, pour le budget global d'un document comme pour l'enveloppe d'une phase. À gauche, un libellé en petites capitales (« Budget estimatif » par défaut) coiffe le montant ; à droite, `duration` porte en gras la durée ou la nature du forfait, et `note` une précision en dessous. Un `amount` numérique est formaté en euros et suivi de « € HT » ; une chaîne passe telle quelle, son unité finale (`€ HT/mois`) composée plus petite que le chiffre. À défaut d'`amount`, `min` et `max` affichent une fourchette. Le composant n'affiche pas de contenu enfant, il s'écrit donc fermé.

```mdx
<BudgetCallout amount={20800} duration="Forfait ferme · Phase de cadrage" note="32 jours sur 6 semaines" />
<BudgetCallout label="Enveloppe Phase 1" min="18 000 €" max="24 000 € HT" duration="env. 2 mois" note="à affiner en cadrage" />
<BudgetCallout label="Maintenance" amount="à partir de 3 000 € HT/mois" note="ajustée chaque mois selon les priorités" />
```

### BudgetTable

Tableau de chiffrage, une ligne par profil, module ou lot, avec sa charge en jours, son montant HT et une ligne de total calculée à partir des lignes. Une ligne en `days` est valorisée à son propre `rate` ou, à défaut, au taux journalier `dayRate` de la table ; `amount` fixe le montant d'une ligne, qui s'affiche comme un forfait quand elle n'a pas de `days`. La colonne des jours n'apparaît que si une ligne porte des jours, celle du taux journalier que si une ligne fixe son propre `rate`. `firstColumn` renomme la première colonne (Profil par défaut), `totalLabel` la ligne de total, et `title` ajoute une étiquette au-dessus. Il remplace un tableau markdown dès qu'un total doit apparaître, et précède en général un `BudgetCallout` qui porte le montant global.

```mdx
<BudgetTable
  title="Phase 1 : conception et développement de la première version"
  firstColumn="Module"
  dayRate={700}
  rows={[
    { label: "Cadrage et ateliers utilisateurs", days: 4, rate: 750 },
    { label: "Maquettes des écrans clés", days: 6 },
    { label: "Développement du back-office et de l'API", days: 18, rate: 680 },
    { label: "Mise en production et recette", amount: 2500 },
  ]}
/>
```

## Planning et méthode

Phases, jalons, plannings et organisation du travail.

### Deliverables

Grille de cartes numérotées `01`, `02`… qui détaille les livrables d'une phase, chacun avec une icône, un titre, une description et, au besoin, un volume en jours et un prix. Le `title` ouvre la grille sous une étiquette, et `total` ajoute un bandeau sombre de synthèse. Les icônes disponibles sont `clipboard`, `git-branch`, `layers`, `bar-chart`, `figma`, `layout`, `users`, `code`, `check-square`, `map`, `cpu` et `search`.

```mdx
<Deliverables
  title="Phase 0 : Cadrage (2 semaines)"
  items={[
    { icon: "users", title: "Atelier de lancement", description: "Réunion avec les équipes métier, validation du planning et des interlocuteurs.", days: 1 },
    { icon: "search", title: "Audit de l'existant", description: "Inventaire des pages, des flux et des données à reprendre.", days: 3 },
    { icon: "map", title: "Parcours cibles", description: "Cartographie des parcours prioritaires et des règles de gestion.", days: 3 },
    { icon: "clipboard", title: "Backlog priorisé", description: "Lots et récits utilisateurs estimés, prêts pour le premier sprint.", days: 3, price: "7 000 € HT" },
  ]}
  total={{ days: 10, price: "7 000 € HT" }}
/>
```

### GanttPlanning

Diagramme de Gantt pour le planning prévisionnel d'un document, avec des colonnes regroupées par mois, une ligne par piste et des jalons tracés en rouge sur toute la hauteur. `totalCols` fixe le nombre de colonnes (souvent deux par mois), `colGroups` les regroupe sous un libellé, et chaque segment choisit sa couleur parmi les variantes `framing` (cadrage), `lot1`, `lot2`, `lot3`, `run`, `migration` et `warranty`. À l'impression, le diagramme passe entier sur la page suivante plutôt que d'être coupé.

```mdx
<GanttPlanning
  totalCols={8}
  colGroups={[
    { label: "Janvier", span: 2 },
    { label: "Février", span: 2 },
    { label: "Mars", span: 2 },
    { label: "Avril", span: 2 },
  ]}
  milestones={[
    { afterCol: 2, label: "Go conception", sub: "Fin janvier" },
    { afterCol: 7, label: "Mise en prod", sub: "Mi-avril" },
  ]}
  tracks={[
    { label: "Cadrage", segments: [{ from: 1, to: 2, label: "Ateliers et spécifications", variant: "framing" }] },
    { label: "Design", segments: [{ from: 2, to: 4, label: "Maquettes haute fidélité", variant: "lot1" }] },
    { label: "Développement", segments: [{ from: 3, to: 7, label: "Sprints de développement", variant: "lot2" }] },
    { label: "Reprise des données", segments: [{ from: 5, to: 7, label: "Migration", variant: "migration" }] },
    { label: "Garantie", segments: [{ from: 8, to: 8, label: "Garantie", variant: "warranty" }] },
  ]}
/>
```

### IterationTrack

Deux cartes côte à côte reliées par une flèche aller et retour, pour montrer une phase de découverte qui alimente une phase de livraison, typiquement le déroulé d'un cadrage. Chaque carte porte un libellé facultatif (une période), un titre et une liste de points passés en tableau. `feedback` ajoute sous le bloc une note en italique, utile pour signaler le risque principal ou la boucle de retour.

```mdx
<IterationTrack
  discoveryLabel="Semaines 1 et 2"
  discoveryTitle="Découverte"
  discoveryItems={["Ateliers avec l'équipe métier sur le processus actuel", "Exploration de l'API existante et des formats de données", "Revue des contraintes RGPD et d'hébergement"]}
  deliveryLabel="Semaine 3"
  deliveryTitle="Spécification"
  deliveryItems={["Spécification fonctionnelle et technique de la phase 1", "Maquettes des écrans principaux", "Feuille de route chiffrée des phases suivantes"]}
  feedback="Chaque découverte de la semaine 2 réajuste la spécification avant sa validation en fin de semaine 3."
/>
```

### NextStep

Étape numérotée de la section de clôture « Prochaines étapes » d'un document. `num` accepte un nombre, affiché sur deux chiffres (01, 02...), ou un texte libre, `title` nomme l'étape et `desc` la détaille en une phrase. Les étapes successives se séparent d'un filet fin.

```mdx
<NextStep num={1} title="Validation du périmètre" desc="Retour sur le document et confirmation du périmètre de la première phase." />
<NextStep num={2} title="Lancement" desc="Atelier de lancement avec l'équipe et ouverture des accès aux outils existants." />
<NextStep num={3} title="Restitution du cadrage" desc="Présentation de la spécification et de la feuille de route chiffrée des phases suivantes." />
```

### PhasesRoadmap

Frise des phases d'un projet, séparées par des chevrons, chaque phase affichant un libellé, un titre, un sous-titre et un budget facultatifs. `optional` trace une phase en pointillés, `highlight` la met en valeur sur fond sombre (souvent l'accompagnement continu), et `goLiveBefore` remplace le chevron précédent par un jalon rouge « Mise en prod ». Elle donne la vue d'ensemble avant le détail de chaque phase.

```mdx
<PhasesRoadmap phases={[
  { label: "Phase 0", title: "Cadrage", sub: "Ateliers, spécifications, feuille de route", budget: "3 sem. · 9 000 €" },
  { label: "Phase 1", title: "Première version", sub: "Parcours principal et back-office", budget: "~8 sem. · ~40 k€" },
  { label: "Phase 2", title: "Déploiement", sub: "Ouverture à toutes les agences", budget: "~4 sem. · ~15 k€", goLiveBefore: true },
  { label: "Phase 3", title: "Application mobile", sub: "iOS et Android", budget: "à définir", optional: true },
  { label: "Suite", title: "Maintenance évolutive", sub: "Correctifs et évolutions", budget: "dès 3 k€/mois", highlight: true },
]} />
```

### PlanningGrid

Grille de cartes sur trois colonnes, chacune avec un libellé en petites capitales précédé d'un losange de la couleur de marque, une valeur et une note facultative. Elle présente un planning prévisionnel en quelques dates clés, des scénarios ou des jalons, quand un Gantt serait trop détaillé. Elle passe sur une colonne en largeur réduite.

```mdx
<PlanningGrid items={[
  { label: "Démarrage", value: "Janvier 2027", note: "Sous réserve de validation en décembre" },
  { label: "Durée du cadrage", value: "3 semaines", note: "Ateliers, spécification et maquettes" },
  { label: "Mise en production", value: "Avril 2027", note: "Première agence pilote" },
]} />
```

### RACIMatrix

Matrice de responsabilités qui croise les activités du projet (en lignes) et les rôles (en colonnes), chaque cellule portant un badge R, A, C ou I avec sa légende en tête. Elle sert dans la section gouvernance d'un document pour dire qui réalise, qui valide et qui est consulté. Chaque rôle prend un `label`, un `sub` facultatif, et un `group` (`internal` pour les rôles tenus dans l'entreprise, `external` pour ceux tenus à l'extérieur) qui trace un filet entre les deux camps ; les `values` de chaque ligne suivent l'ordre des rôles, une chaîne vide laissant la cellule vide.

```mdx
<RACIMatrix
  roles={[
    { label: "Cheffe de projet", sub: "Exemple", group: "internal" },
    { label: "Équipe technique", sub: "Exemple", group: "internal" },
    { label: "Référent métier", sub: "Groupe Hélios", group: "external" },
    { label: "Direction informatique", sub: "Groupe Hélios", group: "external" },
  ]}
  rows={[
    { activity: "Cadrage et priorisation", values: ["R", "C", "A", "I"] },
    { activity: "Architecture technique", values: ["A", "R", "I", "C"] },
    { activity: "Développement et recette", values: ["A", "R", "C", ""] },
    { activity: "Mise en production", values: ["R", "R", "I", "A"] },
  ]}
/>
```

### Risk

Carte d'un risque projet avec son titre et, dans le corps, sa description suivie de sa mitigation. La prop `severity` (`low`, `medium` par défaut, `high`) colore le filet gauche en vert, ocre ou rouge. Chaque carte s'écrit seule, à la suite des autres ; pour une section risques plus aérée et sans cartes, `RiskGrid` prend le relais.

```mdx
<Risk title="Livraison des contenus" severity="high">
Les textes et visuels des vingt pages produit arrivent de trois services différents, ce qui fait peser un risque direct sur la date de mise en ligne.

Un calendrier de livraison fixé au cadrage le maîtrise, et les pages s'intègrent au fil de l'eau avec des contenus provisoires signalés.
</Risk>

<Risk title="Montée en charge lors du lancement" severity="low">
Le pic de trafic attendu reste modeste. Un test de charge en fin de recette confirme la marge disponible.
</Risk>
```

### RiskGrid

Section risques en grille de deux colonnes, sans cartes, chaque risque séparé du suivant par un filet. Elle reçoit la liste des risques dans `items`, chacun avec un `title` et un `body` en texte simple qui réunit le risque et sa mitigation. C'est la présentation la plus lisible quand les risques sont nombreux.

```mdx
<RiskGrid items={[
  {
    title: "Hétérogénéité des niveaux dans un groupe",
    body: "Les groupes se constituent à partir d'un questionnaire préalable, par proximité métier et niveau de pratique.",
  },
  {
    title: "Disponibilité des référents métier",
    body: "Les ateliers se planifient dès le cadrage, avec un suppléant désigné pour chaque référent.",
  },
  {
    title: "API du logiciel de caisse peu documentée",
    body: "Une session technique avec l'éditeur lève les points ouverts avant le premier sprint.",
  },
  {
    title: "Validation tardive des maquettes",
    body: "Chaque maquette est soumise au fil de l'eau avec un délai de retour convenu de trois jours ouvrés.",
  },
]} />
```

## Équipe

Personnes impliquées dans un projet et leur rôle.

### TeamProfile

Fiche d'un membre de l'équipe sur un projet : portrait, identité et années d'expérience, puis rôle dans le projet. Le corps prend une liste markdown d'expériences pertinentes pour le lecteur. Sans `photo`, la fiche affiche les initiales ; les portraits partagés vivent dans `web/src/assets/personnes/`. Dans un document, un titre `###` par catégorie (direction, produit, technique) précède les fiches.

```mdx
<TeamProfile
  firstname="Claire"
  name="Moreau"
  jobTitle="Directrice de projet"
  roleInProject="Interlocutrice principale côté Exemple. Pilotage de la relation, arbitrages de périmètre et de planning, présence aux jalons de validation."
  yearsExperience={12}
  photo="/assets/personnes/personne-woman-1.jpg"
>
- Pilotage de projets en coordination avec plusieurs parties (équipes internes, partenaires, intégrateurs)
- Conduite du changement auprès d'équipes terrain réparties sur plusieurs sites
</TeamProfile>
```

## Visuels et captures

Photos, captures d'écran, maquettes et parcours illustrés.

### DemoScreenshot

Capture pleine largeur encadrée, suivie d'un titre et d'une légende, pour montrer un écran de prototype ou de produit dans un document. L'image passe par le service d'images et sort à 1600 px au plus. `alt` décrit l'image pour l'accessibilité.

```mdx
<DemoScreenshot
  src="/assets/captures/capture-produit.jpg"
  title="Tableau de bord"
  caption="Les interventions du jour visibles dès l'arrivée, avec deux actions principales et une navigation par agence."
  alt="Capture du tableau de bord du prototype"
/>
```

### PhotoBanner

Bandeau photo pleine largeur qui déborde des marges du document, pour aérer un document entre deux grandes sections. `height` règle la hauteur en pixels (240 par défaut) et `objectPosition` le cadrage de la photo dans le bandeau. L'image est servie à 1800 px de large.

```mdx
<PhotoBanner src="/assets/photos/bandeau.jpg" alt="Bandeau visuel" height={220} objectPosition="center 35%" />
```

### SectionVisual

Visuel détouré flottant à droite d'une section, autour duquel le texte s'enroule. Il se pose juste après un titre, avec une image de `/assets/visuels/`, et la prop `size` (`sm`, `md` par défaut, `lg`) règle sa hauteur.

```mdx
<SectionVisual src="/assets/visuels/diamant.png" size="md" />

La phase de construction s'organise en sprints de deux semaines. Chaque sprint se conclut par une démonstration sur l'environnement de recette, ce qui permet aux équipes métier de valider les fonctionnalités au fil de l'eau et d'ajuster les priorités du sprint suivant.
```

### UserFlowStrip

Parcours utilisateurs dessinés en bandes horizontales, une par parcours, avec un numéro, un titre, un persona, un sous-titre et une suite d'étapes reliées par des flèches. Chaque étape porte un `label`, une `desc` facultative et un `kind` qui change la forme du nœud (`start`, `step`, `key`, `decision`, `wait`, `reject`, `end`) ; `async: true` dessine un trait pointillé avant l'étape. Il sert dans un document ou une fiche projet pour montrer l'enchaînement des écrans d'un parcours clé.

```mdx
<UserFlowStrip flows={[
  {
    n: 1,
    title: "Réservation d'une salle de réunion",
    persona: "Membre",
    subtitle: "Le membre choisit un créneau, paie en ligne et reçoit sa confirmation.",
    steps: [
      { label: "Accueil", desc: "Recherche par date", kind: "start" },
      { label: "Choix du créneau", desc: "Disponibilités en direct", kind: "step" },
      { label: "Paiement", desc: "Carte ou avoir", kind: "key" },
      { label: "Paiement accepté ?", kind: "decision" },
      { label: "Validation", desc: "Contrôle par l'équipe", kind: "wait", async: true },
      { label: "Confirmation", desc: "E-mail et agenda", kind: "end" },
    ],
  },
]} />
```

## Slides

Composants des decks, présentés en 16:9.

Un deck se compose de deux familles. Les **slides entières** couvrent les pages qui reviennent dans tout deck, couverture, intercalaire de partie, équipe, clôture. Le **vocabulaire de blocs** couvre le reste : une `Slide` porte la surface et l'en-tête, un `SlideHead` ouvre la page, et un ou deux blocs remplissent la hauteur restante.

Trois surfaces existent, `paper` par défaut, `ink` pour les pages sombres et `accent` pour la couleur de marque. Un bloc lit la surface de sa slide, il n'a donc pas de variante claire et sombre : le même `SlidePanels` rend correctement sur les trois. Une carte qui doit trancher avec sa slide prend `tone="ink"` ou `tone="accent"`.

### DeckShell

Enveloppe obligatoire de tout deck MDX. Elle crée la scène 1920 × 1080 mise à l'échelle de l'écran, avec la liste des slides en miniatures à gauche hors plein écran, la navigation au clavier et au toucher, le plein écran (`F`), les notes de l'orateur (`N`) et l'impression, et reporte `label` dans l'en-tête de chaque slide, suivi du `kicker` de la slide et de son rang. Le `label` prend en général la forme « Entreprise × Destinataire ».

```mdx deck
<DeckShell label="Exemple × Maison Bertin">
  <SlideCover
    title="Un site qui transforme les visites en demandes de devis"
    subtitle="Refonte du site et de l'espace client de Maison Bertin. Enveloppe forfaitaire de 80 400 € HT."
    tag="Note de cadrage"
    items={[
      { key: "Quand", value: "12 novembre 2026" },
      { key: "Qui", value: "Claire Moreau, Julien Faure" },
      { key: "Mise en ligne visée", value: "Mars 2027" },
    ]}
  />
  <SlideSection
    num="01"
    title={"Pilotage\net maintenance."}
    sub="Cinq mois entre le lancement et la mise en ligne. Le planning tient si les décisions de cadrage tombent en novembre."
    img="/assets/visuels/cube.png"
  />
  <SlideClosing
    eyebrow="15 minutes"
    headline="Vos questions."
    contacts={[
      { role: "Direction de projet", name: "Claire Moreau", email: "claire.moreau@exemple.fr" },
      { role: "Product management", name: "Julien Faure", email: "julien.faure@exemple.fr" },
    ]}
  />
</DeckShell>
```

### Slide

Cadre d'une slide. Il pose la surface, la barre d'en-tête et les marges ; le contenu vient des blocs du vocabulaire. `centered` cale le corps au centre de la hauteur, pour une slide qui ne porte qu'une idée. `bleed` retire les marges quand un bloc doit toucher les bords, et `media` ou `aside` placent un visuel à droite, ce qui bascule la slide en deux colonnes. `notes` porte les notes de l'orateur, affichées sous la slide avec la touche `N`.

```mdx slide
<Slide surface="paper" kicker="Notre conviction">
  <SlideHead
    kicker="Notre approche"
    title="Un outil terrain se construit avec ceux qui l'utilisent."
    aside="Trois engagements|tenus du cadrage à la production"
  />
  <SlideNumbers cols={3}>
    <SlideNumber n="01" title="Des ateliers avec trois agences pilotes">
      Les parcours sont testés sur de vraies interventions dès la deuxième semaine de cadrage.
    </SlideNumber>
    <SlideNumber n="02" title="Une adoption mesurée avant d'être généralisée">
      Le taux d'interventions saisies dans l'outil est suivi chaque semaine pendant le pilote.
    </SlideNumber>
    <SlideNumber n="03" title="La même équipe du cadrage à la production">
      Le contexte recueilli en atelier reste dans l'équipe qui développe et maintient l'outil.
    </SlideNumber>
  </SlideNumbers>
</Slide>
```

### SlideCover

Couverture du deck. Un `tag` en capitales, le titre à l'échelle d'affichage, une phrase de contexte, et une rangée de repères sous le filet d'accent. Les repères se passent en `items`, chacun avec sa clé et sa valeur. La surface est sombre par défaut, `surface` la change.

```mdx slide
<SlideCover
  title="Un outil de suivi des interventions pour les équipes terrain"
  subtitle="Note de cadrage pour le Groupe Hélios. Première version en production au printemps, pour un budget de 88 440 € HT."
  tag="Outil interne"
  items={[
    { key: "Quand", value: "21 septembre 2026" },
    { key: "Qui", value: "Claire Moreau, Julien Faure" },
    { key: "Mise en ligne visée", value: "Février 2027" },
  ]}
/>
```

### SlideSection

Intercalaire qui ouvre une partie : son rang en couleur d'accent, le titre à grande échelle, la phrase qui annonce ce que la partie couvre, et un visuel détouré à droite. Un retour à la ligne dans `title` coupe le titre. `img` prend le chemin direct du visuel, par exemple `/assets/visuels/cube.png`, et `kicker` remplace l'intitulé « Partie N » tiré du rang.

```mdx slide
<SlideSection
  num="02"
  title="Le lancement de l'offre."
  sub="Une offre d'abonnement présentée sur le site, dans l'outil commercial et en rendez-vous. Les équipes la vendent dès le premier jour avec les mêmes arguments."
  img="/assets/visuels/diamant.png"
/>
```

### SlideStatement

Slide qui ne porte qu'une phrase, sur fond d'accent par défaut. Le temps d'arrêt d'une présentation, avant ou après un enchaînement dense.

```mdx slide
<SlideStatement
  kicker="Notre lecture"
  statement="Relier les équipes commerciales et terrain autour d'une même donnée client."
  sub="Présenter les trois offres dans une logique intégrée, avec un récit qui fait sens pour le client et qui le fait avancer."
/>
```

### SlideTeam

L'équipe en bandeau de portraits, une colonne par personne, passée dans `members`. `lead` marque d'un filet d'accent ceux qui portent le projet au quotidien, les autres gardent un filet neutre. `footer` ferme la slide sur une ligne.

```mdx slide
<SlideTeam
  label="L'équipe projet"
  headline="L'équipe qui vous répond est celle qui construit."
  members={[
    { name: "Claire Moreau", role: "Directrice de projet", xp: "12 ans", detail: "Pilotage, arbitrages de périmètre, relation avec les équipes métier", photo: "/assets/personnes/personne-woman-1.jpg", lead: true },
    { name: "Julien Faure", role: "Product manager", xp: "9 ans", detail: "Ateliers de cadrage, backlog, coordination", photo: "/assets/personnes/personne-man-1.jpg", lead: true },
    { name: "Antoine Girard", role: "Designer produit", xp: "8 ans", detail: "Parcours utilisateurs, maquettes, tests terrain", photo: "/assets/personnes/personne-man-2.jpg" },
    { name: "Mathieu Roux", role: "Directeur technique", xp: "14 ans", detail: "Architecture, sécurité, choix d'hébergement", photo: "/assets/personnes/personne-man-3.jpg" },
    { name: "Hugo Bernard", role: "Développeur senior", xp: "10 ans", detail: "Application mobile, synchronisation hors ligne", photo: "/assets/personnes/personne-man-4.jpg" },
    { name: "Romain Perrin", role: "Développeur", xp: "5 ans", detail: "Back-office, intégrations, tests automatisés", photo: "/assets/personnes/personne-man-5.jpg" },
  ]}
  footer="Deux sites · La même équipe du cadrage à la mise en production"
/>
```

### SlideClosing

Dernière slide : la question posée à la salle, et qui y répond. `eyebrow` porte généralement le temps d'échange restant, `sub` ajoute une phrase sous le titre.

```mdx slide
<SlideClosing
  eyebrow="15 minutes"
  headline="Vos questions."
  contacts={[
    { role: "Direction de projet", name: "Claire Moreau", email: "claire.moreau@exemple.fr" },
    { role: "Product management", name: "Julien Faure", email: "julien.faure@exemple.fr" },
  ]}
/>
```

### SlideGantt

Planning en barres sur une échelle continue : `from` et `to` sont des positions sur cette échelle comptées à partir de zéro, `months.length - 1` en marquant la fin, ce qui permet à une phase de démarrer en milieu de mois. `tone` dit qui porte le travail, `client` traçant la barre pointillée de ce que le destinataire livre et `alert` les audits et la mise en production.

```mdx slide
<SlideGantt
  label="01 · Planning"
  eyebrow="Du lancement à la mise en ligne"
  headline="Octobre 2026 à février 2027."
  months={["Octobre", "Novembre", "Décembre", "Janvier", "Février", ""]}
  milestone="Mise en ligne · Février 2027"
  lanes={[
    { label: "Cadrage", items: [{ from: 0, to: 1, label: "Rôles, arborescence, spécification de l'API" }] },
    { label: "Design", items: [{ from: 0.5, to: 2.5, label: "Maquettes haute fidélité, tous parcours", tone: "soft" }] },
    { label: "Développement", items: [{ from: 2.5, to: 4.5, label: "Socle technique et intégrations", tone: "ink" }] },
    { label: "Contenus", items: [{ from: 2, to: 3.5, label: "Fourniture des contenus finaux", tone: "client" }] },
    { label: "Accessibilité et sécurité", items: [{ from: 3.4, to: 4.4, label: "Audit d'accessibilité, test d'intrusion", tone: "alert-soft" }] },
    { label: "Recette et mise en ligne", items: [{ from: 4, to: 5, label: "Migration, recette, mise en production", tone: "alert" }] },
  ]}
/>
```

### SlideHead

Bandeau qui ouvre une slide : un `kicker` en capitales, le titre, et à droite soit un `aside` court en capitales, le caractère `|` y coupant la ligne, soit un badge de prix à la couleur d'accent via `price` et `priceLabel`. `size` (`sm`, `md` par défaut, `lg`) règle l'échelle du titre. Toute slide qui n'est ni une couverture, ni un intercalaire, ni une clôture s'ouvre par lui.

```mdx slide
<Slide kicker="05 · Option A">
  <SlideHead
    kicker="Option A · en complément"
    title="Audit d'accessibilité et correction des parcours critiques."
    priceLabel="12 jours"
    price="8 200 € HT"
  />
  <SlideQuote>
    Le taux de conformité se fixe une fois les maquettes finales et les contenus réels disponibles. L'accessibilité se traite donc en deux paliers.
  </SlideQuote>
</Slide>
```

### SlideQuote

Phrase tenue par le filet d'accent. La façon dont le deck met une idée à part sans lui donner une slide entière. `size="body"` la ramène à l'échelle du texte courant.

```mdx slide
<Slide surface="ink" kicker="Notre lecture">
  <SlideHead title="Ce que la refonte change vraiment." />
  <SlideQuote>
    Le site actuel additionne trois logiques commerciales au lieu de les servir. La refonte transforme un site vitrine en outil de conversion mesurable.
  </SlideQuote>
</Slide>
```

### SlideLead

Bloc centré dans la hauteur que l'en-tête lui laisse : un `kicker`, une phrase en grand, et ce que la slide ajoute dessous. Il porte une prise de position ou l'enjeu qui ouvre une option. `size="enjeu"` descend d'un cran pour une phrase longue, `ruled` l'encadre de deux filets.

```mdx slide
<Slide kicker="Qui vous répond">
  <SlideLead kicker="Exemple" title="Une équipe qui conçoit, développe et accompagne.">
    <SlideQuote>
      Depuis 2012, nous accompagnons nos clients du besoin à l'exploitation : conception, développement, recette, formation et maintenance, dans une seule équipe.
    </SlideQuote>
  </SlideLead>
  <SlideFoot items={["Deux sites", "Depuis 2012", "Quarante personnes", "Tout en interne"]} />
  <SlideMedia slot="media" src="/assets/photos/bandeau.jpg" alt="Bandeau visuel" position="center 35%" />
</Slide>
```

### SlideFoot

Ligne de termes courts en capitales qui ferme une slide, au-dessus de sa marge basse. Pour les quelques mots qui situent l'entreprise ou l'offre.

```mdx slide
<Slide kicker="Option C">
  <SlideHead kicker="Option C, à partir de la mise en ligne" title="Faire progresser votre visibilité chaque semaine." priceLabel="Référencement en continu" price="1 500 € HT/mois" />
  <SlideLead
    ruled
    size="enjeu"
    kicker="Votre enjeu"
    title="Vos prospects cherchent sur Google, et posent de plus en plus la même question à un assistant conversationnel. Vous devez apparaître dans les deux, sur chacune de vos activités."
  />
  <SlideFoot items={["Dès la mise en ligne", "Engagement de 6 mois", "Puis résiliable chaque mois"]} />
</Slide>
```

### SlideNumbers

Grille numérotée, le bloc le plus courant du deck : engagements, arguments, verrous, livrables. En deux colonnes elle se lit comme un bloc 2 × 2 ; en trois ou quatre, chaque entrée empile son numéro au-dessus de son texte.

```mdx slide
<Slide kicker="01 · Méthode">
  <SlideHead title="Une équipe de cinq personnes, tout en interne." aside="Comment nous travaillons" />
  <SlideNumbers cols={2}>
    <SlideNumber n="01" title="Un interlocuteur unique pour vos équipes">
      La directrice de projet coordonne les équipes métier, informatique et les prestataires tiers sur toute la durée du projet.
    </SlideNumber>
    <SlideNumber n="02" title="Sprints de deux semaines, démo en recette">
      Un environnement de recette permanent est accessible à vos équipes dès le premier jour.
    </SlideNumber>
    <SlideNumber n="03" title="Un tableau de décisions tenu en temps réel">
      Chaque point ouvert porte un propriétaire, une date limite de réponse et son impact sur le planning.
    </SlideNumber>
    <SlideNumber n="04" title="Le code vous appartient, la reprise est possible">
      La stack reste volontairement standard, TypeScript et PostgreSQL, pour qu'une équipe interne reprenne le projet.
    </SlideNumber>
  </SlideNumbers>
</Slide>
```

### SlideNumber

Une entrée d'une `SlideNumbers` : le filet d'accent, son rang, un titre et un paragraphe. Le rang s'écrit à la main plutôt que de se compter, ce qui permet à une grille de commencer où elle veut.

```mdx slide
<Slide kicker="05 · Option C">
  <SlideHead kicker="Ce que vous recevez chaque mois" title="Quatre leviers travaillés ensemble." />
  <SlideNumbers cols={4}>
    <SlideNumber n="01" title="Des contenus pour les recherches de vos prospects">
      Pages par intention, articles de blog et fiches produit enrichies.
    </SlideNumber>
    <SlideNumber n="02" title="Les pages existantes remontées">
      Nous rafraîchissons celles qui perdent des positions et optimisons celles qui stagnent.
    </SlideNumber>
    <SlideNumber n="03" title="Un site que les moteurs lisent correctement">
      Un audit technique tourne en continu sur les balises, les données structurées et les redirections.
    </SlideNumber>
    <SlideNumber n="04" title="Votre présence dans les réponses des assistants suivie">
      Nous suivons vos requêtes clés dans les principaux assistants conversationnels.
    </SlideNumber>
  </SlideNumbers>
</Slide>
```

### SlideFigures

Grille de chiffres marquants : une valeur en grand, et la phrase qui la lit. Pour les constats qui ouvrent une analyse.

```mdx slide
<Slide kicker="Notre lecture">
  <SlideHead title="Ce que disent les chiffres et l'existant." />
  <SlideFigures cols={2}>
    <SlideFigure value="3 000 à 4 000">
      visiteurs par mois, dont moins de 1 % déposent une demande de devis
    </SlideFigure>
    <SlideFigure value="Après la page produit">
      les abandons surviennent avant la validation ou le paiement
    </SlideFigure>
    <SlideFigure value="Un seul système de vérité">
      le site s'y connecte et lit ses données à la source
    </SlideFigure>
    <SlideFigure value="Par intention">
      l'arborescence se construit selon les intentions des visiteurs plutôt que selon l'organisation interne
    </SlideFigure>
  </SlideFigures>
</Slide>
```

### SlideFigure

Un chiffre d'une `SlideFigures`. La valeur accepte n'importe quel texte, ce qui met un constat sans nombre à la même échelle qu'un nombre.

```mdx slide
<Slide surface="ink" kicker="Résultats">
  <SlideHead title="Trois mois après la mise en ligne." />
  <SlideFigures cols={3}>
    <SlideFigure value="+38 %">de demandes de devis déposées depuis le site</SlideFigure>
    <SlideFigure value="1,4 s">de temps de chargement sur la page produit la plus consultée</SlideFigure>
    <SlideFigure value="Zéro">régression de position sur les adresses migrées</SlideFigure>
  </SlideFigures>
</Slide>
```

### SlidePanels

Cartes séparées par un joint de la couleur du filet, qui occupent toute la hauteur qu'on leur laisse. Pour des phases, des étapes, ou deux lectures mises en regard.

```mdx slide
<Slide kicker="01 · Pilotage">
  <SlideHead title="Chaque phase se valide avant de démarrer la suivante." aside="Le pilotage|phase par phase" />
  <SlidePanels cols={4}>
    <SlidePanel kicker="Phase 1" title="Cadrage" lead="Rôles et spécification validés">
      Arborescence, spécification de l'API et périmètre d'accessibilité validés avant le premier sprint.
    </SlidePanel>
    <SlidePanel kicker="Phase 2" title="Design" lead="Maquettes haute fidélité validées">
      Chaque gabarit est validé par vos équipes avant son passage en développement.
    </SlidePanel>
    <SlidePanel kicker="Phase 3" title="Développement" lead="Démonstration de fin de sprint">
      Sprints de deux semaines, revue de code systématique avant chaque fusion.
    </SlidePanel>
    <SlidePanel kicker="Phase 4" title="Recette" lead="Cahier de recette signé" tone="ink">
      Recette fonctionnelle par parcours, audit d'accessibilité et test d'intrusion validés avant la mise en ligne.
    </SlidePanel>
  </SlidePanels>
</Slide>
```

### SlidePanel

Une carte d'une `SlidePanels`. `tone="ink"` l'inverse par rapport à sa slide, ce qui marque celle qui porte la réponse, `tone="accent"` la passe à la couleur de marque, et `n` ajoute un rang à l'échelle de la carte.

```mdx slide
<Slide kicker="05 · Option B">
  <SlideHead kicker="Option B · en complément" title="Un assistant pour qualifier les demandes." priceLabel="20 jours" price="13 640 € HT" />
  <SlidePanels cols={2}>
    <SlidePanel kicker="Sans l'option, au forfait" title="Le formulaire guide la demande en étapes.">
      Format, volume, date et budget sont demandés en quelques écrans. Le commercial reçoit un dossier pré-rempli.
    </SlidePanel>
    <SlidePanel kicker="Avec l'option B" title="Le visiteur écrit sa demande en une phrase." tone="ink">
      L'assistant la traduit en critères exploitables, pose des questions ciblées sur les informations manquantes et recommande les offres adaptées.
    </SlidePanel>
  </SlidePanels>
</Slide>
```

### SlideTiles

Grille de tuiles courtes, chacune un libellé et une valeur. Pour une stack technique, des volumes mensuels ou les conditions qui ferment une slide. `fill` lui fait prendre la hauteur restante.

```mdx slide
<Slide kicker="02 · Stack">
  <SlideHead title="Standard, documentée, reprenable." aside="La stack technique" />
  <SlideTiles cols={3} fill>
    <SlideTile label="Interface" value="React et TypeScript, rendu serveur" tick />
    <SlideTile label="Gestion de contenu" value="CMS headless open source" tick />
    <SlideTile label="API" value="Node.js et TypeScript" tick />
    <SlideTile label="Base de données" value="PostgreSQL et Redis" tick />
    <SlideTile label="Authentification" value="Authentification unique pour les équipes, compte pour les clients" tone="ink" tick />
    <SlideTile label="Paiement" value="Prestataire de paiement en ligne" tone="ink" tick />
    <SlideTile label="Hébergement" value="Hébergeur français certifié ISO 27001" tick />
    <SlideTile label="Observabilité" value="Journaux, erreurs et métriques centralisés" tick />
    <SlideTile label="Mesure d'audience" value="Plan de marquage structuré" tick />
  </SlideTiles>
</Slide>
```

### SlideTile

Une tuile. `value` porte une entrée de stack, `figure` un volume à l'échelle du chiffre, et le contenu accueille une phrase quand la tuile en demande une. `tick` ajoute le trait d'accent au-dessus du libellé.

```mdx slide
<Slide kicker="05 · Option C">
  <SlideHead title="Les volumes couverts chaque mois." aside="Ce que couvre l'abonnement" />
  <SlideTiles cols={4} fill>
    <SlideTile figure="4 à 10" tone="accent">Nouveaux contenus par mois</SlideTile>
    <SlideTile figure="10 à 15">Pages existantes optimisées par mois</SlideTile>
    <SlideTile figure="300">Mots-clés suivis sur Google</SlideTile>
    <SlideTile figure="50">Requêtes suivies dans les assistants conversationnels</SlideTile>
  </SlideTiles>
</Slide>
```

### SlideTable

Tableau qui occupe la hauteur qu'on lui laisse : une ligne d'en-tête, les lignes réparties régulièrement, et un total à la couleur d'accent facultatif. Les colonnes se déclarent une fois en gabarit de grille, ce qui aligne chaque ligne sans balise `table`.

```mdx slide
<Slide kicker="05 · Phase 2">
  <SlideHead title="Les postes les plus lourds sont les parcours." aside="Phase 2, détail des principaux lots" />
  <SlideTable cols="1fr 140px 200px" head={["Lot", "Jours", "Montant HT"]}>
    <SlideTableRow label="Parcours de réservation : recherche, réservation, paiement" cells={["21", "14 340 €"]} soft={[0]} />
    <SlideTableRow label="Socle technique et intégration continue" cells={["12", "8 160 €"]} soft={[0]} />
    <SlideTableRow label="Intégration au logiciel de gestion" cells={["12", "8 200 €"]} soft={[0]} />
    <SlideTableRow label="Espace client" cells={["12", "8 200 €"]} soft={[0]} />
    <SlideTableRow label="Gestion de contenu et pages éditoriales" cells={["7", "4 780 €"]} soft={[0]} />
    <SlideTableRow slot="total" label="Total Phase 2" cells={["64", "43 680 €"]} total />
  </SlideTable>
</Slide>
```

### SlideTableRow

Une ligne de `SlideTable`. Les `cells` se calent à droite et se lisent comme des chiffres, sauf celles que `soft` désigne, ce qui grise un nombre de jours à côté d'un montant. `detail` ajoute une seconde ligne discrète sous le libellé. `total` en fait la ligne de total à la couleur d'accent, à placer dans le slot `total`.

```mdx slide
<Slide kicker="01 · Maintenance">
  <SlideHead title="Garantie de trois mois, puis maintenance à la carte." aside="Après la mise en ligne" />
  <SlideTable cols="1fr 1.5fr 240px" head={["Profil", "Périmètre d'intervention", "Taux journalier HT"]}>
    <SlideTableRow label="Développeur senior" detail="Référent technique du projet" cells={["Architecture, intégrations complexes, évolutions techniques", "680 €"]} soft={[0]} />
    <SlideTableRow label="Développeur" cells={["Correctifs, ajustements d'intégration, évolutions courantes", "580 €"]} soft={[0]} />
    <SlideTableRow label="Designer produit" cells={["Retouches d'interface, nouveaux gabarits, ajustements mobiles", "700 €"]} soft={[0]} />
    <SlideTableRow label="Product manager" cells={["Coordination, arbitrages de périmètre, suivi des livraisons", "700 €"]} soft={[0]} />
  </SlideTable>
</Slide>
```

### SlideRanks

Lignes numérotées qui remplissent la slide. Par défaut elles rangent le rang, le sujet et la réponse en trois colonnes, ce qui est la lecture des risques et de leur parade ; `wide` donne une affirmation par ligne, pour une liste qui n'a pas de seconde colonne.

```mdx slide
<Slide kicker="01 · Risques">
  <SlideHead title="Cinq risques, et leur parade." aside="Ce qui peut faire|glisser le projet" />
  <SlideRanks>
    <SlideRank n="01" title="L'API du logiciel de gestion reste peu documentée">
      Une session technique dédiée se tient en semaine 1 du cadrage, avant tout développement.
    </SlideRank>
    <SlideRank n="02" title="Le planning enchaîne des dépendances critiques">
      Les décisions de cadrage sont datées et suivies dans le tableau de décisions.
    </SlideRank>
    <SlideRank n="03" title="Les contenus arrivent de plusieurs services">
      Un calendrier de livraison est fixé au cadrage, et les gabarits s'intègrent au fil de l'eau.
    </SlideRank>
    <SlideRank n="04" title="Les objectifs d'accessibilité restent à définir">
      Le cadrage produit un document de périmètre signé par les deux parties.
    </SlideRank>
    <SlideRank n="05" title="L'équipe informatique valide l'hébergement et la sécurité">
      Elle est associée dès le lancement, et le test d'intrusion se planifie avec elle.
    </SlideRank>
  </SlideRanks>
</Slide>
```

### SlideRank

Une ligne d'une `SlideRanks`. Sans contenu, la ligne se réduit à son rang et son titre, ce qui convient à la variante `wide`.

```mdx slide
<Slide surface="accent" kicker="05 · Inclus">
  <SlideHead title="Ce que le forfait couvre déjà." aside="Sans ligne supplémentaire" />
  <SlideRanks wide>
    <SlideRank n="01" title="La conception de tous les gabarits, ordinateur, tablette et mobile" />
    <SlideRank n="02" title="Un hébergement en France, certifié ISO 27001" />
    <SlideRank n="03" title="La formation de vos équipes à la gestion de contenu" />
    <SlideRank n="04" title="La garantie corrective de trois mois après la mise en ligne" />
    <SlideRank n="05" title="La réversibilité complète, code source livré et documentation technique" />
  </SlideRanks>
</Slide>
```

### SlideMatrix

Grille de comparaison : une première colonne de clés, puis une colonne par option. La colonne désignée par `invert`, comptée à partir de zéro, passe sur fond sombre, ce qui marque celle dont on parle.

```mdx slide
<Slide kicker="05 · Option A">
  <SlideHead kicker="Option A · en complément" title="L'accessibilité se traite en deux paliers." priceLabel="12 jours" price="8 200 € HT" />
  <SlideMatrix
    cols="300px 1fr 1fr"
    head={["Étape", "Palier 1 · inclus au forfait", "Palier 2 · Option A"]}
    invert={2}
    rows={[
      ["Cadrage", "Document de périmètre signé par les deux parties", "Définition des parcours critiques, gabarit par gabarit"],
      ["Développement", "Composants accessibles dès la conception, revue à chaque sprint", "Corrections par composant sur les parcours critiques"],
      ["Avant mise en production", "Audit interne sur le périmètre défini", "Audit externe indépendant sur les parcours critiques"],
      ["Après le lancement", "Corrections des écarts identifiés en audit, sans surcoût", "Correction après le rapport de conformité"],
    ]}
  />
</Slide>
```

### SlideChain

Enchaînement lu de gauche à droite, chaque étape séparée par un chevron. Pour une boucle ou une passation où l'ordre compte plus que la durée.

```mdx slide
<Slide kicker="05 · Option C">
  <SlideHead kicker="Une boucle qui tourne d'elle-même" title="Chaque action part de la donnée de votre site." />
  <SlideChain>
    <SlideStep label="Départ" title="Mesure" detail="Audience, positions, citations" tone="anchor" />
    <SlideStep label="Étape" title="Opportunités" detail="Par activité et par produit" />
    <SlideStep label="Étape" title="Production" detail="Rédaction et optimisation" />
    <SlideStep label="Clé" title="Relecture" detail="Un expert vérifie faits et ton" tone="accent" />
    <SlideStep label="Décision" title="Validation" detail="Brouillon dans votre outil de contenu" tone="pending" />
    <SlideStep label="Étape" title="Publication" detail="Signalement aux moteurs" link="loop" />
    <SlideStep label="Arrivée" title="Effet mesuré" detail="Positions et demandes de devis" tone="ink" link="last" />
  </SlideChain>
</Slide>
```

### SlideStep

Une étape d'une `SlideChain`, avec le chevron qui mène à la suivante. `tone` dit ce qu'est l'étape dans le processus, `anchor` pour son point de départ, `accent` pour celle qui porte la valeur, `ink` pour son résultat, `pending` pour celle qui attend une décision. La dernière étape prend `link="last"`, celle qui reboucle `link="loop"`.

```mdx slide
<Slide surface="ink" kicker="Méthode">
  <SlideHead title="Du besoin au déploiement, en quatre temps." />
  <SlideChain>
    <SlideStep label="Départ" title="Cadrage" detail="Ateliers, arborescence, spécification" tone="anchor" />
    <SlideStep label="Étape" title="Design" detail="Maquettes haute fidélité, parcours par parcours" />
    <SlideStep label="Étape" title="Développement" detail="Sprints de deux semaines, démo en recette" />
    <SlideStep label="Arrivée" title="Mise en production" detail="Recette signée, redirections en place" tone="ink" link="last" />
  </SlideChain>
</Slide>
```

### SlideBand

Bandeau à la couleur d'accent qui ferme une slide. Sans prop il porte deux ou trois affirmations courtes ; avec `figure` il devient une phrase et un montant, la forme que prend le rappel d'un prix.

```mdx slide
<Slide kicker="05 · Option C">
  <SlideHead title="Un expert relit chaque contenu avant publication." aside="L'outil produit le volume,|l'humain décide" />
  <SlidePanels cols={3}>
    <SlidePanel title="L'outil fait le travail de fond.">
      Il croise chaque semaine l'audience, les positions et les conversions, propose les sujets, rédige et optimise.
    </SlidePanel>
    <SlidePanel title="Un expert reste votre interlocuteur." tone="ink">
      Il relit chaque contenu avant qu'il vous parvienne et vous envoie un rapport d'une page chaque mois.
    </SlidePanel>
    <SlidePanel title="Vos équipes gardent la main sur la publication.">
      Les contenus arrivent en brouillon dans votre outil de contenu, où vous les validez ou demandez une reprise.
    </SlidePanel>
  </SlidePanels>
  <SlideBand label="Option C · Référencement en continu" figure="1 500 € HT/mois">
    Dès la mise en ligne, avec un plan de contenu prêt pendant la recette. Engagement de 6 mois, puis résiliable chaque mois.
  </SlideBand>
</Slide>
```

### SlideBandItem

Une affirmation d'un `SlideBand`, introduite par le tiret du bandeau.

```mdx slide
<Slide kicker="L'entreprise">
  <SlideHead title="Exemple en quelques mots." />
  <SlideTiles cols={3} fill>
    <SlideTile label="Fondée en 2012" value="Plus de dix ans de projets numériques" tick />
    <SlideTile label="40 personnes" value="Produit, technique et commercial, tout en interne" tick />
    <SlideTile label="150 clients" value="PME, grands comptes, secteur public" tick />
  </SlideTiles>
  <SlideBand cols={2}>
    <SlideBandItem>
      Chaque projet garde la même équipe du premier atelier à la maintenance.
    </SlideBandItem>
    <SlideBandItem>
      Vous parlez toujours avec la personne qui fait le travail, la cheffe de projet qui pilote, le développeur qui écrit le code.
    </SlideBandItem>
  </SlideBand>
</Slide>
```

### SlideNotes

Rangée de notes courtes qui ferme une slide : les précisions qui ont leur place sur la page sans concurrencer son corps.

```mdx slide
<Slide kicker="05 · Option C">
  <SlideHead kicker="Option C, à partir de la mise en ligne" title="Après la mise en ligne, votre visibilité progresse chaque semaine." priceLabel="Référencement en continu" price="1 500 € HT/mois" />
  <SlideQuote>
    Vos prospects cherchent sur Google, et posent de plus en plus la même question à un assistant conversationnel. Vous devez apparaître dans les deux.
  </SlideQuote>
  <SlideNotes cols={3}>
    <SlideNote>
      La refonte préserve le référencement actuel. L'option le fait progresser après la mise en ligne, avec la stratégie éditoriale que le cahier des charges envisage.
    </SlideNote>
    <SlideNote>
      Le site est relié dès son lancement à un outil de suivi des positions et des contenus.
    </SlideNote>
    <SlideNote>
      L'analyse, la rédaction et l'optimisation tournent chaque semaine. Un expert relit chaque contenu.
    </SlideNote>
  </SlideNotes>
</Slide>
```

### SlideNote

Une note d'une `SlideNotes`. Avec `title`, elle porte un intertitre au-dessus de son texte.

```mdx slide
<Slide kicker="05 · Option B">
  <SlideHead title="Ce que l'option apporte concrètement." aside="Architecture et garanties" />
  <SlideNotes cols={3}>
    <SlideNote title="Des règles métier explicites">
      La logique métier reste déterministe, l'assistant se contente d'orienter la demande. Aucune décision métier ne lui est confiée.
    </SlideNote>
    <SlideNote title="Ce qui remonte dans votre CRM">
      Le contexte structuré, critères, offre pressentie et niveau d'intérêt, arrive avant le rappel commercial.
    </SlideNote>
    <SlideNote title="Une architecture éprouvée">
      Même principe que l'outil interne livré l'an dernier, avec la même exigence sur les réponses hors sujet.
    </SlideNote>
  </SlideNotes>
</Slide>
```

### SlideBudget

Les deux colonnes de la slide budget : le forfait à gauche, ce qui l'accompagne à droite, options et coûts récurrents.

```mdx slide
<Slide kicker="05 · Budget">
  <SlideHead title="La construction du forfait." aside="129 jours, trois phases" />
  <SlideBudget>
    <SlideBudgetColumn label="Le forfait, trois phases">
      <SlideBudgetLine label="Phase 1 : cadrage, design et maquettes" detail="20 jours, designer et product manager" amount="14 000 €" />
      <SlideBudgetLine label="Phase 2 : développement, intégrations, contenus" detail="97 jours, équipe technique, designer et product manager" amount="66 200 €" />
      <SlideBudgetLine label="Phase 3 : recette, migration, formation" detail="12 jours, équipe complète" amount="8 240 €" />
      <SlideBudgetTotal amount="88 440 €">
        Prix global forfaitaire, ferme et définitif. Facturation par jalons de phase. Chaque lot est chiffré indépendamment.
      </SlideBudgetTotal>
    </SlideBudgetColumn>
    <SlideBudgetColumn label="Options en complément">
      <SlideBudgetLine stacked label="Option A : audit d'accessibilité" detail="12 jours, périmètre défini en cadrage" amount="8 200 €" />
      <SlideBudgetLine stacked label="Option B : assistant de qualification" detail="20 jours, qualification des demandes" amount="13 640 €" />
      <SlideBudgetLine stacked label="Option C : référencement en continu" detail="Dès la mise en ligne, engagement de 6 mois" amount="1 500 € HT/mois" />
      <SlideBudgetAside label="Maintenance annuelle" amount="6 160 € HT">
        Hébergement, mises à jour de sécurité et maintenance corrective.
      </SlideBudgetAside>
    </SlideBudgetColumn>
  </SlideBudget>
</Slide>
```

### SlideBudgetColumn

Une colonne d'un `SlideBudget`, sous son libellé en capitales.

```mdx slide
<Slide surface="ink" kicker="Budget">
  <SlideHead title="Deux lots, chiffrés séparément." aside="Le périmètre reste ajustable" />
  <SlideBudget>
    <SlideBudgetColumn label="Lot 1 · Application terrain">
      <SlideBudgetLine label="Cadrage et maquettes" detail="18 jours" amount="12 400 €" />
      <SlideBudgetLine label="Développement de l'application" detail="72 jours" amount="49 000 €" />
      <SlideBudgetTotal amount="61 400 €" />
    </SlideBudgetColumn>
    <SlideBudgetColumn label="Lot 2 · Tableau de bord">
      <SlideBudgetLine stacked label="Indicateurs et exports" detail="24 jours" amount="16 800 €" />
      <SlideBudgetLine stacked label="Reprise de l'historique" detail="8 jours" amount="5 600 €" />
    </SlideBudgetColumn>
  </SlideBudget>
</Slide>
```

### SlideBudgetLine

Une ligne d'une colonne de budget. En ligne par défaut, ce qui se lit comme une phase et son montant ; `stacked` place le montant sous le libellé, la forme que prennent les options dans la colonne étroite.

```mdx slide
<Slide kicker="Budget">
  <SlideHead title="Le détail du forfait, phase par phase." aside="Prix global forfaitaire" />
  <SlideBudget>
    <SlideBudgetColumn label="Les trois phases">
      <SlideBudgetLine label="Phase 1 : cadrage et design" detail="20 jours" amount="14 000 €" />
      <SlideBudgetLine label="Phase 2 : développement" detail="97 jours" amount="66 200 €" />
      <SlideBudgetLine label="Phase 3 : recette et mise en production" detail="12 jours" amount="8 240 €" />
    </SlideBudgetColumn>
    <SlideBudgetColumn label="Les options">
      <SlideBudgetLine stacked label="Option A : audit d'accessibilité" detail="12 jours" amount="8 200 €" />
      <SlideBudgetLine stacked label="Option B : assistant de qualification" detail="20 jours" amount="13 640 €" />
    </SlideBudgetColumn>
  </SlideBudget>
</Slide>
```

### SlideBudgetTotal

Le total à la couleur d'accent d'une colonne de budget, et les conditions qui le suivent. `label` remplace l'intitulé « Total HT ».

```mdx slide
<Slide kicker="Budget">
  <SlideHead title="Le montant global." aside="Ferme et définitif" />
  <SlideBudget>
    <SlideBudgetColumn label="Le forfait">
      <SlideBudgetLine label="Conception et développement" detail="117 jours" amount="80 200 €" />
      <SlideBudgetLine label="Recette et mise en production" detail="12 jours" amount="8 240 €" />
      <SlideBudgetTotal amount="88 440 €">
        Prix global forfaitaire, ferme et définitif. Tout ajustement de périmètre fait l'objet d'un avenant écrit avant démarrage.
      </SlideBudgetTotal>
    </SlideBudgetColumn>
    <SlideBudgetColumn label="Après la mise en ligne">
      <SlideBudgetLine stacked label="Hébergement et maintenance corrective" detail="Engagement annuel" amount="6 160 € HT/an" />
    </SlideBudgetColumn>
  </SlideBudget>
</Slide>
```

### SlideBudgetAside

L'encadré inversé qui ferme une colonne de budget, pour un coût récurrent tenu à l'écart du forfait.

```mdx slide
<Slide kicker="Budget">
  <SlideHead title="Ce qui court après la mise en ligne." aside="Coûts récurrents" />
  <SlideBudget>
    <SlideBudgetColumn label="Le forfait">
      <SlideBudgetLine label="Conception et développement" detail="129 jours" amount="88 440 €" />
      <SlideBudgetTotal amount="88 440 €" />
    </SlideBudgetColumn>
    <SlideBudgetColumn label="Options en complément">
      <SlideBudgetLine stacked label="Option A : audit d'accessibilité" detail="12 jours" amount="8 200 €" />
      <SlideBudgetAside label="Maintenance annuelle" amount="6 160 € HT">
        Hébergement en France, mises à jour de sécurité et maintenance corrective. La garantie de trois mois s'ajoute sans s'imputer dessus.
      </SlideBudgetAside>
    </SlideBudgetColumn>
  </SlideBudget>
</Slide>
```

### SlideMedia

Image pour le slot `media` ou `aside` d'une slide : une photographie qui va au bord droit, ou le visuel détouré qui marque un intercalaire de partie. `position` règle le cadrage vertical de la photographie.

```mdx slide
<Slide surface="paper" kicker="Qui vous répond">
  <div class="slide-body centered">
    <div class="kicker">Exemple</div>
    <h2 class="slide-title">Une équipe qui conçoit, développe et accompagne.</h2>
    <SlideQuote>
      Depuis 2012, nous accompagnons nos clients du besoin à l'exploitation : conception, développement, recette, formation et maintenance, dans une seule équipe.
    </SlideQuote>
  </div>
  <SlideMedia slot="media" src="/assets/photos/bandeau.jpg" alt="Bandeau visuel" position="center 35%" />
</Slide>
```

### SlideStrip

Bandeau photographique qui ferme une slide, recadré à une hauteur fixe pour laisser leur place aux blocs au-dessus.

```mdx slide
<Slide kicker="01 · Méthode">
  <SlideHead title="Une équipe de cinq personnes, tout en interne." />
  <SlideNumbers cols={2}>
    <SlideNumber n="01" title="Un interlocuteur unique pour vos équipes">
      La directrice de projet coordonne directement les parties prenantes sur toute la durée du projet.
    </SlideNumber>
    <SlideNumber n="02" title="Sprints de deux semaines, démo en recette">
      Un environnement de recette permanent est accessible à vos équipes dès le premier jour.
    </SlideNumber>
  </SlideNumbers>
  <SlideStrip src="/assets/photos/bandeau.jpg" position="center 60%" />
</Slide>
```

### SlideScreen

Capture d'écran d'un produit dans un cadre de navigateur, qui prend la hauteur que l'en-tête lui laisse. Le contenu passé en slot se place à côté de l'écran, pour les deux ou trois idées qu'il illustre ; `reverse` met l'écran à droite. Contrairement à `SlideMedia`, l'image garde ses couleurs et se cale sur son haut, `position` réglant le cadrage quand la capture est plus haute que le cadre.

```mdx slide
<Slide kicker="01 · Parcours">
  <SlideHead title="L'outil part de la journée du technicien." />
  <SlideScreen src="/assets/captures/capture-produit.jpg" alt="Tableau de bord du prototype">
    <SlideNote title="Une vue par journée">
      Le technicien ouvre l'outil et voit ses interventions du jour, dans l'ordre de sa tournée.
    </SlideNote>
    <SlideNote title="Une saisie en trois gestes">
      Chaque intervention se clôture depuis le téléphone, photo et signature comprises.
    </SlideNote>
  </SlideScreen>
</Slide>
```

### SlideEmblem

Visuel détouré posé à côté d'un titre, dans la rangée d'un `SlideHead` ou seul.

```mdx slide
<Slide kicker="Notre conviction">
  <div class="slide-head">
    <SlideEmblem src="/assets/visuels/sphere.png" />
    <div class="headline">
      <span class="kicker">Notre conviction</span>
      <h2 class="slide-title">Chacun des trois défis techniques de ce projet a déjà été résolu en production sur un projet comparable.</h2>
    </div>
  </div>
  <SlideNumbers cols={3}>
    <SlideNumber n="01" title="Un logiciel de gestion partiellement documenté">
      Tarifs appliqués par compte, espace client avec historique. L'architecture proposée ici tourne déjà en production.
    </SlideNumber>
    <SlideNumber n="02" title="Des API à la spécification incomplète">
      Sources multiples, circuit de validation à plusieurs acteurs. La gestion des délais d'attente est éprouvée depuis deux ans.
    </SlideNumber>
    <SlideNumber n="03" title="Une saisie hors connexion">
      Une application qui enregistre sur le téléphone et synchronise dès que le réseau revient.
    </SlideNumber>
  </SlideNumbers>
</Slide>
```

## Interne

Briques que les renderers et les gabarits emploient directement, rarement utiles dans un document. Le gabarit document, `web/src/components/pages/DocumentPage.astro`, assemble `DocHeader`, `DocCover` et `TableOfContent` pour chaque entrée de la collection `documents` (les fichiers `.mdx` rangés dans un dossier `documents/` des dossiers PARA).

### Avatar

Pastille ronde qui affiche les initiales d'un nom sur une couleur tirée de ce nom, toujours la même pour un même nom. C'est une brique destinée aux vues du wiki (liste de personnes, de clients, de projets) plutôt qu'un composant de document. La prop `size` accepte `sm`, `md` (par défaut) et `lg`.

```mdx
<Avatar name="Maison Bertin" size="lg" />
<Avatar name="Atelier Verne" />
<Avatar name="Groupe Hélios" size="sm" />
```

### DocCover

Couverture d'un document imprimable, avec un visuel centré, un grand titre et un chapô, chacun facultatif. Le gabarit document la pose lui-même à partir du frontmatter (`cover`, `title`, `lead`), un document n'a donc pas à l'écrire. En impression, elle occupe toute la première page dès qu'elle porte un titre.

```mdx
<DocCover
  visual="/assets/visuels/pile.png"
  title="Un outil de suivi des interventions pensé pour les équipes terrain"
  lead="Conception et développement d'une application web et mobile, du cadrage à la mise en production."
/>
```

### DocHeader

Bandeau d'en-tête des documents imprimables, avec le nom de l'entreprise (tiré de `web/src/lib/site-config.ts`) et le destinataire facultatif `recipient` à gauche, le type de document `kind` et la date `date` déjà formatée à droite. Le gabarit document le pose au-dessus de la couverture à partir du frontmatter (`recipient`, `label`, `date`) ; `onCover` supprime la marge basse quand une couverture suit.

```mdx
<DocHeader recipient="Groupe Hélios" kind="Note de cadrage" date="11 septembre 2026" />
```

### StatusBadge

Petit badge de statut arrondi, dont la teinte vient entièrement de `colorClass`, une chaîne de classes Tailwind. Il sert aux vues qui listent des projets ou des clients avec leur état, et rarement dans un document.

```mdx
<StatusBadge label="En cours" colorClass="bg-green-100 text-green-700" />
<StatusBadge label="En attente" colorClass="bg-yellow-100 text-yellow-700" />
<StatusBadge label="Prospect" colorClass="bg-blue-100 text-blue-700" />
```

### TableOfContent

Sommaire numéroté construit à partir des titres de rang 2 d'un document, qui occupe une page à lui seul à l'impression. C'est une brique interne du gabarit document (`DocumentPage`), qui lui passe les `headings` produits par le rendu du contenu. Un document n'a donc pas à l'écrire ; `label` remplace l'intitulé « Sommaire ».

```mdx
<TableOfContent
  label="Sommaire"
  headings={[
    { depth: 2, slug: "contexte", text: "Le contexte et les enjeux" },
    { depth: 2, slug: "approche", text: "L'approche proposée" },
    { depth: 3, slug: "equipe", text: "L'équipe" },
    { depth: 2, slug: "planning", text: "Le planning" },
    { depth: 2, slug: "budget", text: "Le budget" },
  ]}
/>
```

### WikiContent

Conteneur d'une page wiki déjà rendue en HTML, qui applique le cadre de document et redimensionne les images au passage. C'est une brique interne du renderer par défaut et de la page d'accueil, qui lui transmettent le HTML produit par `marked` ; un document écrit son contenu directement en markdown.

```mdx
<WikiContent html="<h2>Contexte du projet</h2><p>Le Groupe Hélios souhaite regrouper ses outils de suivi des interventions dans une application unique pour ses agences.</p><ul><li>Planning commun aux vingt-quatre agences</li><li>Suivi des interventions en temps réel</li></ul>" />
```
