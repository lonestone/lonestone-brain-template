---
name: content-rules
description: Règles d'écriture et de réécriture pour tout contenu (documents, pages wiki, slides, propositions, posts, emails), dans toutes les langues. À appliquer en rédigeant un contenu neuf, ou pour nettoyer un texte qui sonne généré par une IA.
---

# Content writing rules

The re-check by a sub-agent, described below, covers only content meant to be published or sent:
site pages, posts, emails, slides, documents for a third party. Internal content, such as wiki pages
and notes, gets the rules applied while writing, with no re-check.

Apply these rules to every piece of written content: site pages, blog posts, documentation, slides,
wiki, post drafts, emails, memos. Two uses:

1. **Writing directly.** For new content, follow these rules from the first draft, so the AI patterns
   never make it in.
2. **Rewriting AI content.** For a text that sounds AI-generated (fully or partly), run these rules as
   a filter: spot the patterns below and rewrite them. Keep the ideas, the argument and the logic of
   the original untouched. Only the phrasing and the structure that mark it as AI change.

Each rule carries examples in the language it targets: French examples for rules about French
content, English examples for rules about English content.

## Re-check after writing (mandatory for published or sent content)

Writing with these rules in mind is not applying them. Delegate the re-check, and have the
sub-agent **fix what it finds** rather than report it back for someone else to transcribe.

**Give one sub-agent this skill, every file the run touched, and the passages to start from.** A
page edited only to add a link or a cross-reference counts as touched. When
a content exists in several versions (another language, another format), send them all to the same
agent: a fix applied to one version and not the other is the most common damage a re-check leaves
behind. Naming passages says where to start, never where to stop, since a fix is judged against its
neighbours.

Have it work in this order and report each step.

1. **Read cold, and say what it understood, before opening the rules.** Name every passage that took
   two readings. A passage can break no rule and still fail: an opposition missing its first term, a
   referent the reader has to supply, a clause the reader has to re-attach. A rule sweep never
   catches these, and they are the defects a human reader reports first.
2. **Read every file end to end against every rule here**, frontmatter and takeaways included. Grep
   finds only the patterns you thought of, so a pattern sweep is not this step. Only em dashes and
   semicolons warrant a literal search, being characters a reader skims past.
3. **Check the text against itself**: no figure meaning two different things, a changed number
   changed everywhere it appears, nothing conceded in one section and claimed in another, every
   cross-reference still pointing at something, every calculation redone.
4. **Apply the fixes, then re-read cold, in place, every sentence you rewrote.** A fix that
   replaces a named defect with a vague sentence escapes every step above, since it did not exist
   when they read. Report what changed, what was left, and the rule behind each decision.

**A refusal names a rule or a fact.** House style, a sibling page and the paragraph alongside are
never that rule: existing copy is the next thing to fix, never an exception granted to the new text.
Re-open the refusals on the last round rather than inheriting them, since a refusal nobody re-examines
is the one defect no later round can reach.

**Re-run while a round still corrects the original text. Stop when a round only repairs the round
before it, and after three rounds whatever it finds.** Past that point a round breaks more than it
removes: a fix moves a pleonasm instead of cutting it, drops an antecedent, hooks a relative onto the
wrong noun, or lands on one locale and not the other. Pass each round what changed and what was
refused, so it neither re-reports nor re-reads what did not move.

Report what you found and fixed, never a bare "the rules are applied".

## When the user says a passage is unclear

Analyse before rewriting. Say why it fails, one point per defect, naming the mechanism: the missing
causal step, the word that names nothing, the claim the example just above contradicts, the term used
before it is introduced, the sentence that only announces the next paragraph.

Then propose the change it calls for here, whether that means adding a rule, rewriting one, narrowing
it or deleting it, and **wait for confirmation before touching this file**.

A rule opens on an instruction, carries an ❌ → ✅ pair, and ends on a test separating the defect from
the correct usage it resembles. Without that test it fires on correct text.

## Content language

- In French, keep the accents correct (é, è, ê, à, ù, ç, ï, ô, œ, etc.) and use the typographic
  apostrophe « ’ », never the straight quote. Exception: LinkedIn and X post texts use keyboard characters only (straight
  quotes and apostrophes), see skill "write-social-post".

## Core principles: what good human writing looks like

- Have opinions, do not just report
- Vary the rhythm: short punchy sentences mixed with longer ones that explain
- Prefer the concrete detail over the vague claim (figures, dates, names, examples)
- Simple verbs (« est », « a », « fait ») rather than elaborate constructions
- Acknowledge uncertainty or mixed feelings when it is warranted
- Use the first person when it is relevant
- Quote concrete examples with names, dates, numbers
- Keep the humour, the edge and the personality when the register allows it

### Combative vocabulary outside combat

Keep fight and win words for actual combat or competition. For comparisons and choices, use the plain comparative.

- ❌ « Un modèle par type de réunion bat un modèle générique » → ✅ « Un modèle par type de réunion est plus avantageux qu’un modèle générique »
- ❌ "This template beats the generic one" → ✅ "This template works better than the generic one"

## The spoken test (takes precedence over every rule below)

Before keeping a sentence, ask whether someone would say it out loud. « Vient ensuite l’hygiène des
données », « Sur la fiabilité, Anthropic avoue les limites », « Ce marquage relève du même calcul » :
nobody talks like that.

These literary turns appear mostly **while fixing another rule**. When the fix for a rule produces a
sentence nobody would say, the fix has failed. Look for a third wording rather than choosing between
the slop and the essay style.

- ❌ « Vient ensuite l’hygiène des données. » (was fixing a verbless sentence)
- ✅ « La deuxième, c’est le ménage dans les données. »
- ❌ « Sur la fiabilité, Anthropic avoue les limites. »
- ✅ « Le truc c’est que ce n’est pas très fiable, même Anthropic l’avoue. »

Corollary: take the everyday verb over the literary one. « avoue » rather than « écrit noir sur
blanc », « ça coûte cher » rather than « au prix d’un coût élevé ».

## Structural rules (all languages)

### Em dashes

Never use `—` as a clause separator. Rewrite as two sentences, or use a comma. Genuine parenthetical
asides set off by commas are enough.

### The verb « survivre » / "survive"

Keep it for staying alive. Everywhere else, name what actually happens (lasting, holding up, going
unnoticed).

- ❌ « un contournement qui survit six mois » → ✅ « un contournement encore en place six mois plus tard »
- ❌ « la question qui survit au plus grand nombre de relectures » → ✅ « la question la plus difficile à repérer en relisant »
- ❌ "questions built to survive all three" → ✅ "questions built to hold up against all three"

### Positive phrasing

Prefer positive phrasing over negative. Instead of « X, pas Y » or « ne pas Z », rewrite positively.

- ❌ « rester indépendant en ne dépendant pas des outils tiers » → ✅ « rester indépendant »
- ❌ « pas à la fin du projet » → ✅ « dès le premier sprint »

### Label-colon

Avoid the hollow « Label : valeur » pattern, which drops a catch-all word then delivers the value:
« Objectif : », « Résultat : », « Avantage : », « Bonus : », « À retenir : », « En clair : ». Fold the
information straight into the sentence.

- ❌ « Bonus : le jeu sert aussi en salon. »
- ✅ « Le jeu sert aussi en salon. »

Three uses of the colon stay acceptable:

- **A real enumeration.** « On propose trois options : A, B, C. »
- **A narrative reveal.** « L’an dernier, une de mes meilleures décisions business a été de
  participer à un dîner : la French Tech Night. » The colon sets up a punch, it does not drop a
  rhetorical label.
- **A practical callout.** « Astuce : ne pas oublier de... », « Disclaimer : je suis bénévole de... ».
  The label names a type of information useful to the reader (practical tip, transparency, warning),
  not a hollow category.

Test to tell them apart: if the label can be deleted without losing any meaning (« Bonus : X » → « X »),
it is an empty label-colon to cut. If it carries a signalling function (callout, warning, prepared
reveal), it stays.

### The AI bold + colon + explanation format

Avoid the list format typical of AI: `**Mot en gras** : explication.` Convert to prose, or to plain
bullets without systematic bold.

### Rhetorical question opening a section

Cut « Alors, qu’en est-il ? », "So what does this mean?", « Mais alors ? ». Answer directly.

### Hollow announcement sentences

Cut the sentences that announce a point is important without delivering anything, then go straight to
the fact. They promise value and push it back by one sentence, which slows the reader down for
nothing.

- ❌ « Un point compte plus que le reste. La précision grimpe avec la quantité de données. »
- ✅ « La précision grimpe avec la quantité de données. »
- ❌ « Et c’est là que ça devient intéressant. » / « Voici l’essentiel. » / « Le plus important arrive
  maintenant. » → state the interesting thing directly.

If what follows is genuinely strong, it needs no announcement. If it needs an announcement to look
strong, it is weak.

### Filler around the fact

Three habits pad a fact without adding to it. Glossing a term that explains itself, when naming it
is enough:

- ❌ « le léchage de truffe, un coup de langue rapide sur la babine »
- ✅ « le léchage de truffe »

Setting the scene before an example, when the example can just start:

- ❌ « Sept d’entre eux reviennent souvent dans un salon : »
- ✅ « On y trouve par exemple : »

Keeping a sentence that is accurate but off topic. Cut it.

### Defining a term

Open on the term, give the criterion that separates it from what it is not, then name the forms the
reader will recognise. The paragraph has to work alone.

- ❌ « Une question fermée demande de choisir parmi des options, ou de donner un chiffre. » (le
  classement et le oui/non, énumérés plus loin, n’y entrent pas)
- ✅ « Une question fermée fixe à l’avance la forme de la réponse : oui ou non, une option dans une
  liste, une note sur une échelle, un nombre, ou des propositions à classer. »

Test: run the definition over every case the page lists. One case excluded is a wrong definition, and
the same wording repeats wherever the term is defined again.

### The invented detail

A detail earns its place only if the text uses it. Never reach for a concrete noun to replace a vague
one: the invented precision opens a subject the text never returns to.

- ❌ « l’export arrive dans le tableur sans une cellule à corriger » → ✅ « personne n’a sauté de
  question » (rien dans le texte ne parle de nettoyage de données)
- ❌ « ces 57 points d’écart » → ✅ citer les deux chiffres que donne la source, 61,5 % et 4,6 %
- ❌ « le tableau de bord l’affiche en vert tant qu’il reste au-dessus de 3 » : le détail sert bien sa
  phrase, mais ni le tableau de bord ni le seuil ne reviennent

Setting a scene is fine: « depuis une semaine », « le lundi matin ». Test: does the text use the
detail again, or answer the question it raises? If not, cut it.

### Name the thing instead of gesturing at it

Replace the placeholder noun (« thing », « partie », « version », "shape", "side", "the rest", "the
tooling") with what it is. Drop the metaphor when a plain word exists.

- ❌ "a different shape of thing" → ✅ "a library you install"
- ❌ "the answer flips" → ✅ say which answer, and to what
- ❌ "the tooling you wrapped around it" → ✅ "the dashboard and the logging"
- ❌ "Latency shows the same seam" → ✅ "Latency has the same problem"

Two variants: never refer forward ("All of it is easy to skip" before the list it names), never rate
your own sentence ("which is the useful part here").

Qualify a noun with what identifies it, never with what only adds colour. When the qualifier leaves
the reader unable to pick out which one, name the thing or say what was done.

- ❌ « on la règle avec le modèle qui traînait » → ✅ « on la règle en recopiant le questionnaire
  précédent » (« qui traînait » ne désigne aucun modèle en particulier)
- ✅ « le questionnaire précédent », "the survey you sent last quarter": the reader knows which one

Test: ask « lequel ? ». A sentence that answers it is fine.

A figurative verb on something that has no body is the same defect. Say what happens.

- ❌ « ces signaux portent le message » → ✅ « par ces signaux, le chien dit quelque chose »
- ❌ « désamorcer une situation qui monte » → ✅ « calmer une situation tendue »
- ❌ « la situation se règle en silence » → ✅ « la situation s’arrête là »

### Vague actors and unnamed relations

When a sentence designates an actor, name it. Abstract groups (« ceux qui arrivent », « les acteurs
concernés », « certains ») leave the reader guessing who is meant.

- ❌ « ces règles gênent surtout ceux qui arrivent »
- ✅ « ces règles gênent surtout leurs plus petits concurrents »

The same holds for the relation between two ideas. « C’est la même ligne », « ça relève de la même
logique » never say which relation joins the two. Name the relation, then its concrete counterpart:
« c’est le même calcul, ça leur achète de la crédibilité auprès des régulateurs ».

### The impossible observation

Before giving someone knowledge, check they could have it. Say who holds the information, and what
the other person does with it.

- ❌ « demandez à un comportementaliste de regarder ce que votre chien vit le reste de la journée »
- ✅ « racontez à un comportementaliste une journée type de votre chien, son sommeil, ses sorties »
- ❌ "the auditor watched the team’s day-to-day habits" (a one-day audit)
- ✅ "the team described their habits to the auditor"

Test: name the moment and the place. If the person is absent from them, cut. What someone observes
on the spot stays.

### The third party as subject of a descriptive present

In content addressed to « vous », a professional named in the third person as the subject of a
present-tense verb describes a trade instead of telling the reader what to do. Make them the object
of an instruction.

- ❌ « Un comportementaliste canin retrace son histoire pour trouver ce qui le retient. »
- ✅ « Demandez l’avis d’un comportementaliste canin. »
- ❌ "A tax adviser reviews your filings and finds the deductions you missed."
- ✅ "Ask a tax adviser to review your filings."

Test: does the sentence tell the reader to do something, or describe a job? A modal addressing the
reader keeps the third person (« un comportementaliste **peut vous** aider »).

### « X, et Y »

Two clauses joined by « , et » hide the relation between them. Split them, subordinate, or merge into
one clause. Whichever you pick, the relation has to land somewhere: splitting on its own leaves two
sentences that merely abut, and the reader then guesses the cause, the opposition or the consequence.
Carry it with an adverb inside the clause (« il se fait *pourtant* par habitude »), a subordinate, a
relative, or a word that picks the first sentence back up. At the head of a paragraph that same word
turns into a soft opening and goes out.

- ❌ « Votre vétérinaire écarte d’abord une cause médicale, et le travail sur le comportement vient après. »
- ✅ « Faites d’abord vérifier sa santé par votre vétérinaire. Le bilan comportemental intervient ensuite. »
- ❌ "The question is why people stop after a month. The survey returns a bar chart."
- ✅ "The question is why people stop after a month, which is the one thing a bar chart never returns."

Test: a real enumeration keeps its comma (« 100 €, compte rendu compris, et 140 € pour deux
animaux »). What goes out is two full clauses coordinated. Then name the relation between the two
halves. If nothing carries it, the reader is guessing.

### A relative clause after an enumeration

A relative clause placed after two or more coordinated nouns attaches to all of them. Write each
side of a contrast as a full clause with its own subject, and state the term the opposition rests
on rather than leaving the reader to supply it.

- ❌ « place l’interview face au journal de bord et au test d’utilisabilité, qui enregistrent ce que
  les gens ont fait » (la relative se lit sur les trois méthodes, et ce qu’enregistre l’interview
  n’est jamais dit)
- ✅ « Une interview enregistre ce que les gens disent, là où le journal de bord et le test
  d’utilisabilité enregistrent ce qu’ils ont fait. »
- ❌ "sets the interview against the diary study and the usability test, which record what people did"
- ✅ "An interview records what people say, while a diary study and a usability test record what they
  did."

Test: read the relative clause against each noun that precedes it. True of one and false of another
means it is attached to the wrong set. A clause true of the whole enumeration stays where it is.

### Concrete subject, active verb

The subject of a verb is someone or something able to act: a person, an animal, a body part, a
tool. An abstract noun does nothing, says nothing, shows nothing. An animal, a product or a company
shows, indicates and does, and it never tells, says or explains. When the reader is the one acting,
the verb goes to the reader rather than into a passive or pronominal form.

- ❌ « la souplesse et le mouvement séparent les deux » → ✅ « regardez la souplesse et le mouvement
  pour distinguer les deux »
- ❌ « le contexte tranche » → ✅ « regardez la situation »
- ❌ « une queue qui remue au-dessus d’un corps raide raconte autre chose » → ✅ « … veut dire autre
  chose »
- ❌ « chaque signal se lit avec le reste du corps » → ✅ « lisez chaque signal avec le reste du
  corps »

Then check the pairing: the verb has to be one that goes with that noun. A verb borrowed for its
image produces a sentence that parses and means nothing.

- ❌ « une case ne transporte aucun raisonnement » → ✅ « cocher une case ne demande pas de rédiger,
  donc la réponse n’explique rien »
- ❌ « des réponses qui arrivent déjà comptées », « ce taux plaide pour le format », « trois questions
  arrivent juste après »

Test: say the pair on its own. « Une case transporte. » « Un taux plaide. » The defect is a verb that
needs the noun to have something it has not. An inanimate subject is not one by itself, so leave
« une note masque un point faible », a question filters a sample, a scale produces a bias.

### A metaphor named once does not become the vocabulary

Name the model once, then talk about the real thing. An image reused as vocabulary makes the reader
translate every sentence.

- ❌ « échelle », then « chaque barreau », « le barreau précédent », « sauter des barreaux »
- ✅ « échelle » once to name the model, then « le signal suivant », « l’étape précédente »,
  « sauter des étapes »

### A metaphor borrowed from a technical field

An image taken from a research paper or a trade jargon is still jargon. A reader outside the field
stumbles on it, even when the explanation follows right after. Find the everyday image that says the
same thing.

- ❌ « Un watermark, c’est radioactif. »
- ✅ « Un watermark, c’est contagieux. »

### The common word over the trade term

When the everyday word and the trade term describe the same thing, take the everyday one.

- ❌ « l’approche en courbe », « l’encolure basse », « le premier interlocuteur »
- ✅ « le détournement du corps », « le cou bas », « commencez par votre vétérinaire »

A text written for practitioners keeps the trade term as its register.

### The plain word

Reach for the ordinary word first. A rarer word in the plain one’s place makes the sentence sound
written rather than said, and it rarely comes alone.

- ❌ « recouvre » → ✅ « désigne »
- ❌ « atterrit sur » → ✅ « s’enregistre sur »
- ❌ « le nom de » → ✅ « le terme »
- ❌ « sans rapport » → ✅ « différents »

Test: put the plainest word you know in that slot. If nothing is lost, the rarer one was decoration.

### Start the sentence from its subject

Put the thing the sentence is about in subject position, at the front. A circumstance, an attribute
or a figure placed before it leaves the reader holding words with nothing to attach them to.

- ❌ "The most generous free tier here belongs to Fathom." → ✅ "Fathom has the most generous free tier here."
- ❌ « Sur le nombre de sièges, son offre gratuite est la plus généreuse. » → ✅ « Son offre gratuite est la plus généreuse sur le nombre de sièges. »

Test: name what the sentence is about. If that word is not the subject, or arrives after a comma,
rewrite.

### Positional references

Never point at a position in the page (a row, a bullet, a paragraph, a rank). Name the thing, so the
sentence reads without going back up.

- ❌ « Les deux dernières lignes sont tout le travail. » → ✅ « Arrêter le jeu et proposer un jouet
  sont les deux réactions qui apprennent quelque chose. »
- ❌ « C’est ce troisième besoin qui compte le plus. » → ✅ « Le jeu est le besoin qui compte le plus. »
- ❌ « Une fois ce point écarté » → ✅ « Une fois la piste médicale écartée »
- ❌ "as the table above shows", « le reste s’apprend en les répétant » → name what it is

« C’est » pointing back at the sentence just before is not a positional reference: « Les gens lisent
le milieu de l’échelle comme la norme. C’est ce qui déplace le chiffre. » The rule bans pointing at a
place (a rank, a row, a paragraph), not referring to what you have just said.

### Literary enumerations

An enumeration carried by « d’abord / ensuite / enfin » (or "first / second / finally") across
consecutive paragraphs is a markdown list. Write the list, keep the ordinals out of the prose.

- ❌ « Il explore, d’abord. […] Ses dents poussent, ensuite. […] Il joue, enfin. »
- ✅ a `-` list of three items, then a paragraph for whatever needs developing

Prose keeps the enumerations that stay inside one sentence (« il explore, il joue et il mordille »).

### Headings state the point, plainly

No metaphor, no clever verb: a heading is read alone, in a summary and in search results. Cut the
sentence under it that restates it.

- ❌ "The platform fee survives bringing your own keys" → ✅ "You pay $0.05 a minute even with your own keys"
- ❌ "Debugging stops at the log line" → ✅ "You cannot debug the conversation locally"

A heading may be a question when it is the one the reader is asking, as in a FAQ or a diagnostic
section. What goes out is the rhetorical question and the bold line standing in for a heading, never
the interrogative form itself.

### A defect that bounces between a heading and its paragraph

When the same defect moves from one position to the other on two successive fixes, change register
rather than wording. A heading that repeats its paragraph’s verbs, fixed by rewriting the heading,
comes back as a paragraph that lost its antecedent, and rewriting that brings the heading back.
Reformulating on the same register oscillates.

Make the heading name the concept and leave the actions to the paragraph.

- ❌ « Crier, pincer la truffe ou tenir la gueule fermée » → ✅ « Punir un chiot qui mordille »

### A summary item is read before the text, and often instead of it

Takeaways, key points, a summary box, a card excerpt: like a heading, each one is read alone, by
someone who has not read the body and may never read it. So each states **one lesson that holds on
its own**, with nothing that only means something to whoever finished the article: no study
protocol, no researcher’s name, no set that was never named, no back-reference to another item.

- ❌ « Le pire tirage de cinq utilisateurs n’a trouvé que 55 % des problèmes. » (which draw, out of what?)
- ✅ « Cinq utilisateurs suffisent quand vous testez à nouveau au sprint suivant. Pour une étude unique, c’est risqué. »
- ❌ "Guest, Bunce and Johnson found nearly every theme within the first twelve interviews."
- ✅ "Around a dozen interviews covers a homogeneous group, because new themes stop appearing quickly."

A figure stays when it **is** the lesson and reads without its study (« 60 minutes offertes par
mois »). One that needs its protocol goes to the body with its source, while the item carries what it
teaches, as the site’s own claim rather than a citation or a « des études montrent ».

Test: cover the article. Does the item still teach something?

### Soft paragraph openings

Cut and restructure when a paragraph opens with:

- FR: « Ainsi, », « Dès lors, », « De plus, », « En outre, », « Par conséquent, », « Toutefois, »,
  « Néanmoins, », « En effet, » (as an opener), « Par ailleurs, » (soft transition), « De surcroît »,
  « Qui plus est »
- EN: "Moreover,", "Furthermore,", "Additionally,", "That said,", "Importantly,", "Notably,",
  "Interestingly,"

### Opening on « Ce que » (FR)

Never open a **heading or a table cell** with « Ce que », « Ce qui », « Ce qu’il » or « Ce à quoi ».
Name the subject.

- ❌ heading « Ce qu’est une structure » → ✅ « Une structure est »
- ❌ column « Ce qui coordonne » → ✅ column « La coordination »

In running prose the construction is fine, and « Ce qui …, c’est … » is ordinary French emphasis:
« Ce qui compte davantage, c’est le moment où le chien détourne la tête. » That is a pseudo-cleft,
not the « c’est … qui » banned under Presentatives.

### Presentatives (FR)

No « c’est … qui », « ce sont … que », « il y a … qui ». Subject, verb, object.

- ❌ « c’est l’ensemble qui porte le message » → ✅ « regardez tout le corps »
- ❌ « il y a des signaux qui reviennent souvent » → ✅ « certains signaux reviennent souvent »

### Calques from English (FR)

Write the French from French. Rewrite any construction that exists only because an English phrase was
carried over word for word.

- ❌ « Cette facilité fait aussi la limite du format » (*is also the limit of*)
- ✅ « Cette facilité a un prix »

Test: name the English sentence behind it. If you can, rewrite.

### Anglicisms (FR)

Take the French word when a clear one exists. Technical vocabulary stays welcome in French
(« échelle de Likert », « biais d’acquiescement ») : what goes out is the English word, not the
technical one.

- ❌ « l’item de questionnaire » → ✅ « la question posée »
- ✅ « cool », « deadline », « week-end », and any English term inside a quotation or a study name

Test: would a French speaker say it without thinking of English?

### False contrast / forced negation

Rewrite positively.

- ❌ « Ce n’est pas X, c’est Y » → ✅ « C’est Y »
- ❌ "Not X, but Y" → ✅ "Y"
- ❌ « X. Mais pas n’importe quel X. » → ✅ a single sentence saying what that X is

### Artificial enumerations

- « Qu’il s’agisse de X, de Y ou de Z » → list them normally
- "From X to Y" on a fake scale → list the things

### Staccato triples

« Pas ceci, ni cela, ni ça » / "not this, or this, or this" → rewrite plainly.

### Forced rule of three

Do not systematically group by three (triple adjectives, triple nouns, triple parallel clauses). List
what actually matters, even when that is two things or four.

### Balanced formulas

Never build a sentence on a symmetry: chiasmus, antithesis, two clauses of the same shape. Write the
cause, then the effect. Replacing one balanced formula with another is the same defect, not a fix.

- ❌ « Une case ne coûte rien parce qu’elle ne transporte rien. »
- ✅ « Cocher une case ne demande pas de rédiger, donc la réponse n’explique rien. »
- ❌ "A ticked box asks for no sentence and returns none."
- ✅ "Ticking a box takes no writing, so the answer explains nothing."

Spot it by the repeated construction in both halves. Check what it asserts: the shape usually
reverses the real cause.

### Elegant variation / synonym chains

Do not switch synonym every sentence to avoid repeating a word. Reuse the same noun.

- ❌ « Le CEO a partagé sa vision. Le dirigeant a détaillé la stratégie. Le patron a exposé son plan. »
- ✅ « Le CEO a partagé sa vision et détaillé la stratégie. »

### Adverbs propping up weak verbs

No « met subtilement en lumière », « démontre puissamment », « transforme fondamentalement ». Cut the
adverb and strengthen the verb if needed.

### Truncated sentence openings

Avoid opening a sentence with a subjectless past participle (advertising copywriting style). Rewrite
with an explicit subject.

- ❌ « Bossé avec une super équipe. » → ✅ « On a bossé avec une super équipe. »
- ❌ « Lancé en 2023, le produit... » → ✅ « Le produit, lancé en 2023, ... » or « On a lancé le produit
  en 2023. »
- ❌ « Conçu pour les pros, l’outil... » → ✅ « L’outil est conçu pour les pros. »

### Vague demonstrative pronouns

In written text, a bare pronoun has no shared visual to lean on. « ça », « ce truc » without a clear
antecedent make the sentence opaque. Name the referent.

- ❌ « Je tombe nez à nez avec ça à l’aéroport. » → ✅ « Je tombe nez à nez avec cette affiche à
  l’aéroport. »

When the antecedent is obvious (right before), the demonstrative is fine.

### Semicolons

Never use a semicolon, in any context. Rewrite as two sentences (full stop) or use a comma. The rule
holds for long sentences and structured enumerations too.

- ❌ « Il est arrivé en retard ; nous avons commencé sans lui. »
- ✅ « Il est arrivé en retard. Nous avons commencé sans lui. »

### Verbless sentences

Every sentence needs a conjugated verb. Cut the nominal sentences and the fragments. Very rare
exception: to land a point in a heightened register, one short verbless sentence is allowed (at most
one per text).

- ❌ « Adoptée par tous. Une référence dans le métier. »
- ✅ « Tout le monde l’adopte. Le métier en a fait une référence. »

- ❌ « Une approche radicalement nouvelle, taillée pour la décennie qui vient. »
- ✅ « Cette approche est radicalement nouvelle, taillée pour la décennie qui vient. »

This rule easily produces literary turns (« Vient ensuite X », « Reste Y », « Il y a d’abord Z »).
Run every fix through the spoken test.

### Punctuation and expressive rhythm

A light or emotional word (« fun », « cool », « génial », « top ») cannot be followed by a full stop.
The dry stop kills the energy of the word and makes the claim contradictory. Valid options:

- An exclamation mark: « C’est fun ! »
- An emoji carrying the emotion: « C’est fun 😄 »
- Rewrite so the word is not in final position: « C’est super fun à jouer même en pause. »

The broader rule: the final punctuation carries part of the tone. Choose it consciously instead of
defaulting to a full stop.

### Exact product versions

Do not give precise versions of models, software or frameworks (« GPT-5 », « Claude 4.7 », « React 19 »,
« Python 3.13 ») unless the version is central to the point. Prefer the category or the family
(« modèle frontière », « LLM récent », « framework moderne », « Python récent »). It keeps the text from
ageing in a few months, and keeps the attention on the argument rather than on the brand.

- ❌ « On a fait tourner ça sur GPT-5 avec un harness Letta v0.6.2. »
- ✅ « On a fait tourner ça sur un modèle frontière avec un harness léger. »

Family names (Mistral, Llama, Claude, GPT) without a version number stay acceptable when talking about
ecosystems.

### Nuance and objection transitions

When introducing a nuance to what was just claimed, mark the transition with a brief spoken
acknowledgement (« Bien sûr, », « Cela dit, », « Évidemment, »), then follow with a precision that
consolidates the original strong point. The typical movement: strong point, nuance acknowledged,
precision that puts the nuance back in its place. It avoids the out-of-nowhere effect of an objection
that appears unprepared, and stays more natural than the banned formulaic transitions (« Toutefois, »,
« Néanmoins, »).

- ❌ « Le télétravail rend les équipes plus efficaces. Ça ne marche pas pour tous les métiers. »
- ✅ « Le télétravail rend les équipes plus efficaces. Bien sûr, ça ne marche pas pour tous les métiers.
  Mais sur le knowledge work, les chiffres sont sans appel. »

### Spoken transitions rather than formulaic ones

To link two ideas (observation → story, example → lesson), prefer a spoken, natural transition over a
communications formula.

- ❌ « L’occasion de revenir sur la genèse du projet. » (sounds like a sales brochure)
- ✅ « Ce projet, on en est super contents, je vous raconte. » (sounds spoken)

What sounds like a comms manual also sounds a bit like AI.

### Excessive nominalisation

Prefer the direct verb.

- ❌ « la mise en place de » → ✅ « mettre en place »
- ❌ « la prise en compte de » → ✅ « prendre en compte »
- ❌ « l’accompagnement de » → ✅ « accompagner »

An infinitive or a noun sitting in subject position weighs the same. Conjugate the verb, and switch
to the imperative as soon as the sentence addresses the reader.

- ❌ « apprendre à les identifier est le plus utile » → ✅ « apprenez à les identifier »
- ❌ « répondre à un grognement consiste à écarter ce qui gêne » → ✅ « face à un grognement, écartez
  ce qui gêne »

### The "corporate therapist" voice

Avoid empty HR jargon:

- FR: « accompagner », « embarquer », « fédérer », « porter un projet », « monter en compétences »,
  « créer de la valeur »
- EN: "lean into our strengths", "foster accountability", "empower our teams"

Say what concretely happens.

### Collaborative, sycophantic and disclaimer artefacts

Cut systematically:

- « J’espère que ça aide », « Bien sûr ! », « Voici un... », « N’hésite pas à me dire... »
- "I hope this helps", "Of course!", "Certainly!", "Would you like..."
- « Excellente question ! », « Tu as totalement raison ! », "Great question!"
- « En date du... », « Sur la base des informations disponibles... », "As of [date]"

### One-size-fits-all conclusions

No conclusion that could apply to any subject: « Le futur s’annonce radieux », "Exciting times lie
ahead", « continue son chemin vers l’excellence ». Cut it, or rewrite it with something specific.

## Banned phrases: French

| Slop | Replace with |
|---|---|
| « Il convient de noter que » | say the thing directly |
| « Il est important de souligner que » | say the thing directly |
| « Il est à noter que » | cut |
| « Force est de constater que » | state the observation directly |
| « Il va sans dire que » | if it goes without saying, do not say it |
| « Dans un monde où » / « À l’ère de » | cut or be specific |
| « Dans un contexte où » | cut or be specific |
| « N’hésitez pas à » | use the imperative directly |
| « En effet » (as an opener) | cut |
| « Par ailleurs » (soft transition) | cut or rewrite the logical link |
| « De surcroît » / « Qui plus est » | cut |
| « En ce qui concerne » | « pour », « sur » |
| « Dans le cadre de » | « pour », « pendant », or be specific |
| « Mettre en lumière » | « montrer » |
| « Jouer un rôle clé » / « jouer un rôle crucial » | say what it concretely does |
| « Au cœur de » | be specific |
| « S’inscrire dans une démarche de » | say what you do |
| « Constituer un levier » | say what it concretely enables |
| « Un enjeu majeur » / « un enjeu de taille » | state the stake concretely |
| « Incontournable » | say why it matters |
| « En somme » / « En définitive » | cut or rewrite the conclusion |
| « À cet égard » | cut |
| « Dans cette optique » | cut or be specific |
| « Véritable » (intensifier) | cut |
| « Bel et bien » / « Ni plus ni moins » | cut |
| « Tout un chacun » | « chacun », « tout le monde » |
| « Se positionner comme » | « être », « devenir » |
| « Accompagner le changement » | say which change, and how |
| « Embarquer les équipes » | say how, concretely |
| « Créer de la valeur » | say which value |
| « Monter en compétences » | « apprendre », « se former à » |
| « Porter une vision » | state the vision |
| « L’avenir nous le dira » | cut, empty conclusion |
| « Seul le temps nous dira » | cut, empty conclusion |
| « À l’heure où » | cut or be specific |
| « Tant sur le plan X que sur le plan Y » | simplify |
| « Permettre de » (overused) | direct verb |
| « Il est essentiel de » | say what needs doing |
| « Il apparaît clairement que » | say the thing |
| « On ne peut que constater » | observe it directly |
| « Autant d’éléments qui » | cut, list the elements |
| « Un tournant décisif » | say what changes and why |
| « Plus que jamais » | cut |
| « pile au moment où » / « au moment précis où » | cut when the moment is nothing exceptional. A regulator always writes the next rules, there is no window. |
| « La vraie question » / « La vraie question, c’est » | ask the question directly, without announcing it is « vraie » |
| « honnête » / « honnêteté » / « honnêtement » | rewrite (« franc », « lucide », « sincère ») or cut, except in genuine opposition to « malhonnête » |
| « incumbent » (anglicism) | « acteur établi », « acteur en place », « géant du secteur ». French readers do not understand « incumbent ». |

## Banned phrases: English

| Slop | Replace with |
|---|---|
| "delve into" | "look at", "dig into", "explore" |
| "unpack" (writing context) | "break down", "explain" |
| "navigate the complexities of" | say what’s actually complex, or cut |
| "ever-changing landscape" / "the landscape of X" | cut or be specific |
| "synergies" | say what combines and why |
| "leverage" (verb) / "leverage our learnings" | "use", "use what we learned" |
| "holistic approach" | say what you mean |
| "this underscores" / "this signals that" | state the actual opinion directly |
| "it’s worth noting that" / "it bears mentioning" | just say the thing |
| "lean into" | say what you’re doing |
| "foster a culture of" | be specific |
| "in an effort to" | "to" |
| "at the end of the day" | cut |
| "ultimately, the goal is" | cut |
| "moving forward" / "in conclusion" | cut |
| "as we navigate" | cut or rewrite |
| "actionable insights" | say the actual actions |
| "robust" (unless about software) | specific adjective or cut |
| "seamlessly" | cut |
| "game-changer" / "paradigm shift" | cut or be specific |
| "let’s dive in" / "deep dive" | cut |
| "in today’s world" / "in today’s fast-paced" | cut |
| "cutting-edge" / "groundbreaking" | cut or be specific |
| "revolutionize" | say what changes |
| "empower" | say what’s enabled specifically |
| "harness the power of" | "use" |
| "unlock the potential" | say what becomes possible |
| "ecosystem" (unless biological) | say what you mean |
| "double down on" | "invest more in", "focus on" |
| "north star" | "goal", "priority" |
| "key takeaways" | "what matters", or just list them |
| "at scale" (filler) | cut or specify the scale |

## Content patterns to avoid (both languages)

### Importance inflation

"stands as", "is a testament", « moment pivot », « marque un tournant », « laisse une empreinte
indélébile » → state the fact without inflating it.

- ❌ « Ce lancement marque un tournant pivot dans l’évolution du marketing digital. »
- ✅ « L’entreprise a lancé sa première campagne programmatique en 2019. »

### Shallow -ant / -ing analysis

« mettant en avant », « soulignant », « démontrant », « assurant » / "highlighting", "underscoring",
"emphasizing", "showcasing" used as depth filler → state the real cause and effect.

- ❌ « La plateforme a grossi de 40%, démontrant l’engagement de l’équipe envers l’innovation. »
- ✅ « La plateforme a grossi de 40%. La quasi-totalité vient d’une boucle de parrainage construite au
  Q2. »

### Promotional language

« vibrant » (figurative), « riche » (figurative), « profond », « exemplifie », "commitment to",
« engagement profond envers », "must-visit", "boasts a" → replace with concrete facts and figures.

- ❌ « L’entreprise a une équipe vibrante avec un engagement profond pour la livraison. »
- ✅ « 45 personnes dans l’équipe. CA en hausse de 32% l’an dernier. »

### Vague attributions

"Industry reports", "Experts argue", "Some critics argue", « plusieurs sources », « les études
montrent » without a precise citation → name the source or cut.

### Every person named is introduced

A name alone means nothing to a reader who does not already know it. At its **first mention**, say
who the person is: their job, their institution, what they run or wrote. An apposition set off by
commas, a short lead-in phrase, or a sentence before the citation all work. Later mentions use the
bare surname.

- ❌ « Luis Garicano a donné à la chaîne sa justification la plus nette dans le *Journal of Political
  Economy* en 2000. »
- ✅ « Luis Garicano, économiste alors à l’université de Chicago, a donné à la chaîne… »
- ❌ "Tom Burns and George Stalker settled the general case in 1961."
- ✅ "Tom Burns, a sociologist at the University of Edinburgh, and the psychologist George Stalker
  settled the general case in 1961."
- ❌ « Andy Jassy demande à chaque organisation d’augmenter son ratio. »
- ✅ « son PDG Andy Jassy demande à chaque organisation… »

The same holds for an acronym naming an organisation the reader may not place (NTSB, FAA, ADP 6-0):
spell it out or say what it is, once.

The introduction stays factual and checkable, so verify the title and the institution before writing
them, and pick the one that was true **at the time of the fact being cited** rather than the person’s
best-known role.

### Claims the brand cannot back

Never hand the brand a credential, a figure or a result it does not publish: a regulated title it
does not hold, a promise of outcome or of timeline, a client count, a success rate, a service absent
from the catalogue. Check every such claim against what the brand states about itself.

### Formulaic challenges and outlook

"Despite its X, faces challenges...", "Future Outlook", « Malgré ces défis, l’entreprise continue
de... » → say what actually happened.

### Copula avoidance

« sert de », « se positionne comme », « se présente comme », « représente » / "serves as", "stands as",
"marks", "represents", "boasts", "features", "offers" standing in for a plain « est », « a », « fait ».

- ❌ « La newsletter sert de ressource précieuse pour les marketeurs. »
- ✅ « La newsletter est une ressource pour les marketeurs. 12K abonnés l’ouvrent chaque semaine. »

### Heavy relative clauses

When a relative clause boils down to a simple adjective, prefer the adjective. Cut « dans lequel »,
« pour lequel », « où », « auquel » when an adjective does the job.

- ❌ « le cadre dans lequel l’équipe produit pourrait penser »
- ✅ « le cadre habituel de l’équipe produit »
- ❌ « les outils auxquels les développeurs ont accès »
- ✅ « les outils habituels des développeurs »

### Chained hedging

« On pourrait arguer que... il est possible que... il pourrait sembler que » / "it could be argued
that, on the other hand..." → cut, state the point.

### Claims too absolute

A general rule that has exceptions is stated with its reservation, in two or three words. It is the
counterpart of chained hedging: the opposite excess costs credibility with a reader who knows a
counter-example.

- ❌ « réécrire un texte le dégrade »
- ✅ « réécrire un texte dégrade en général le résultat »

### A paragraph restating the previous one

A paragraph that repeats the previous one with different words → merge or cut. The last sentence of
a paragraph follows the same test: it earns its place by adding something, otherwise it goes.

- ❌ « Un jeu équilibré comporte des pauses. » closing a paragraph that just described those pauses
- ✅ cut it

### A conclusion that works for any subject

If the conclusion applies to any subject, rewrite it with something specific or cut it.

## What must NOT change

- The author’s ideas, opinions, arguments, examples and real data
- The sentence order and the paragraph structure (unless a rule above forces it)
- The voice and the register (casual stays casual, formal stays formal)
- Useful technical terms and precise jargon, when no everyday word says the same thing
- Short, direct sentences that are already clean
- Genuine parenthetical asides set off by commas or parentheses
