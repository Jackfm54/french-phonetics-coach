/**
 * Compréhension orale avancée — niveaux C1 et C2 (TEF Canada / TCF Canada).
 * 10 documents par épreuve, discours long, implicite et argumentatif.
 */

import type { ListeningTask } from "./listening-exams";

const INSTR_TEF_C =
  "Écoutez le document une seule fois puis choisissez la bonne réponse (compréhension orale avancée, TEF Canada).";
const INSTR_TCF_C =
  "Écoutez le document et choisissez la réponse correcte (compréhension orale avancée, TCF Canada).";

/* ─────────── TEF Canada — C1 ─────────── */
export const TEF_CANADA_LISTENING_C1: ListeningTask[] = [
  {
    id: "tef-c1-1",
    title: "Table ronde — pénurie de main-d'œuvre",
    instruction: INSTR_TEF_C,
    script:
      "— On répète que le marché manque de bras, mais on oublie de dire qu'il manque surtout de conditions décentes. — Vous simplifiez : dans certaines régions, même avec des salaires relevés de quinze pour cent, les postes restent vacants faute de logement abordable. — C'est exactement mon point : la pénurie n'est pas seulement salariale, elle est territoriale. — Alors financer le logement revient à financer l'emploi, ce que les budgets actuels ne reconnaissent nulle part.",
    voice: "echo",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Selon le premier intervenant, quelle est la cause principale ?", options: ["Le manque de formation", "L'absence de conditions décentes", "La démographie"], correctIndex: 1 },
      { id: "q2", question: "Quel obstacle régional est cité ?", options: ["Le logement abordable", "Les transports scolaires", "La météo"], correctIndex: 0 },
      { id: "q3", question: "Quelle conclusion est tirée ?", options: ["Financer le logement, c'est financer l'emploi", "Il faut baisser les salaires", "La pénurie est un mythe"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-2",
    title: "Chronique — économie du télétravail",
    instruction: INSTR_TEF_C,
    script:
      "Trois ans après la généralisation du travail hybride, les centres-villes canadiens n'ont retrouvé que les deux tiers de leur fréquentation d'avant. Les commerces de restauration rapide en subissent les effets les plus nets, tandis que les quartiers résidentiels périphériques enregistrent une vitalité commerciale inédite. Ce déplacement de la dépense, plus qu'une disparition, oblige les municipalités à repenser leur fiscalité, largement adossée à la valeur foncière des tours de bureaux.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Fréquentation des centres-villes ?", options: ["Deux tiers du niveau antérieur", "Totalement rétablie", "En hausse"], correctIndex: 0 },
      { id: "q2", question: "Quel phénomène est décrit ?", options: ["Une disparition de la dépense", "Un déplacement de la dépense", "Une baisse des prix"], correctIndex: 1 },
      { id: "q3", question: "Quel est l'enjeu pour les villes ?", options: ["Repenser une fiscalité liée aux tours de bureaux", "Construire des stades", "Interdire le télétravail"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-3",
    title: "Entretien — reconnaissance des acquis",
    instruction: INSTR_TEF_C,
    script:
      "— Vous dirigez un programme de reconnaissance des acquis. Qu'est-ce qui bloque encore ? — Moins la réglementation que la culture professionnelle : les ordres exigent une équivalence parfaite là où une évaluation par compétences suffirait. — Vous plaidez donc pour des stages d'adaptation ? — Pour des parcours modulaires, oui, mais surtout rémunérés. Un candidat déjà expérimenté ne peut pas se permettre dix-huit mois sans revenu, c'est là que nous perdons la moitié des dossiers.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Le principal blocage est ?", options: ["La réglementation", "La culture professionnelle des ordres", "Le niveau de langue"], correctIndex: 1 },
      { id: "q2", question: "Que propose l'invitée ?", options: ["Des parcours modulaires rémunérés", "Supprimer les diplômes", "Un examen unique"], correctIndex: 0 },
      { id: "q3", question: "Pourquoi la rémunération est-elle centrale ?", options: ["Pour attirer les jeunes", "Parce que la moitié des candidats abandonnent sans revenu", "Pour financer les ordres"], correctIndex: 1 },
    ],
  },
  {
    id: "tef-c1-4",
    title: "Reportage — transition énergétique et hydroélectricité",
    instruction: INSTR_TEF_C,
    script:
      "Longtemps présentée comme un avantage définitif, l'abondance hydroélectrique montre ses limites : l'électrification des transports et l'implantation de centres de données ont absorbé les marges disponibles plus vite que prévu. Les nouveaux projets se heurtent à des consultations territoriales longues et à des coûts d'acceptabilité sociale que les modèles économiques anciens n'intégraient pas. D'où l'intérêt renouvelé pour l'efficacité énergétique, jugée moins spectaculaire mais nettement plus rapide à déployer.",
    voice: "alloy",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Pourquoi les marges disparaissent-elles ?", options: ["Électrification et centres de données", "Exportations vers l'Europe", "Sécheresse"], correctIndex: 0 },
      { id: "q2", question: "Quel frein aux nouveaux projets ?", options: ["Manque de technologie", "Consultations et acceptabilité sociale", "Absence de main-d'œuvre"], correctIndex: 1 },
      { id: "q3", question: "Quelle solution regagne de l'intérêt ?", options: ["L'efficacité énergétique", "Le charbon", "L'importation"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-5",
    title: "Débat — encadrement des loyers",
    instruction: INSTR_TEF_C,
    script:
      "— Encadrer les loyers protège les locataires en place et décourage la construction : c'est un arbitrage, pas une solution. — Encore faudrait-il démontrer que la construction dépend d'abord du loyer plafond, et non du coût du financement, qui a doublé. — Les deux jouent, mais l'investisseur regarde le rendement net. — Alors ciblons l'encadrement sur le parc ancien et laissons le neuf respirer cinq ans : on saura enfin qui a raison.",
    voice: "echo",
    speed: 1.08,
    questions: [
      { id: "q1", question: "Comment le premier qualifie-t-il l'encadrement ?", options: ["Une solution complète", "Un arbitrage", "Une erreur totale"], correctIndex: 1 },
      { id: "q2", question: "Quel facteur oppose le second ?", options: ["Le coût du financement", "La démographie", "Le climat"], correctIndex: 0 },
      { id: "q3", question: "Quel compromis est proposé ?", options: ["Encadrer l'ancien et exempter le neuf cinq ans", "Tout encadrer", "Tout libéraliser"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-6",
    title: "Exposé — santé mentale au travail",
    instruction: INSTR_TEF_C,
    script:
      "Les programmes d'aide aux employés se multiplient, mais leur efficacité reste inégale : ils traitent l'individu là où le facteur déclenchant est souvent organisationnel. Les données recueillies dans quatre secteurs montrent que la charge de travail perçue et l'imprévisibilité des horaires expliquent davantage l'épuisement que les traits de personnalité. Autrement dit, offrir dix séances de consultation sans revoir la répartition des tâches revient à soigner une fièvre en changeant de thermomètre.",
    voice: "shimmer",
    speed: 1.08,
    questions: [
      { id: "q1", question: "Quelle limite des programmes d'aide ?", options: ["Ils coûtent cher", "Ils traitent l'individu, pas l'organisation", "Ils sont trop longs"], correctIndex: 1 },
      { id: "q2", question: "Facteurs les plus explicatifs de l'épuisement ?", options: ["Charge perçue et horaires imprévisibles", "Traits de personnalité", "L'âge"], correctIndex: 0 },
      { id: "q3", question: "Que signifie l'image du thermomètre ?", options: ["On mesure mal la fièvre", "On agit sur le symptôme sans traiter la cause", "Il faut plus d'outils"], correctIndex: 1 },
    ],
  },
  {
    id: "tef-c1-7",
    title: "Interview — journalisme local",
    instruction: INSTR_TEF_C,
    script:
      "— Vous parlez de « déserts d'information ». Que recouvre l'expression ? — Des territoires où plus aucun média ne couvre le conseil municipal. Résultat mesurable : moins de candidats aux élections, et des dépenses publiques moins contestées. — Les réseaux sociaux ne comblent-ils pas ce vide ? — Ils diffusent, ils n'enquêtent pas. Sans quelqu'un pour lire un budget ligne à ligne, il n'y a pas d'information, seulement de la rumeur bien partagée.",
    voice: "onyx",
    speed: 1.08,
    questions: [
      { id: "q1", question: "Qu'est-ce qu'un « désert d'information » ?", options: ["Un territoire sans couverture médiatique locale", "Une région sans internet", "Un journal sans lecteurs"], correctIndex: 0 },
      { id: "q2", question: "Conséquence mesurable citée ?", options: ["Moins de candidats aux élections", "Plus de taxes", "Plus de journaux"], correctIndex: 0 },
      { id: "q3", question: "Que reproche-t-il aux réseaux sociaux ?", options: ["Ils diffusent sans enquêter", "Ils sont payants", "Ils sont trop lents"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-8",
    title: "Analyse — automatisation logistique",
    instruction: INSTR_TEF_C,
    script:
      "Dans les entrepôts, l'automatisation ne remplace pas linéairement les postes : elle en supprime certains, en durcit d'autres et en crée quelques-uns, très qualifiés. Le résultat net dépend moins de la technologie que du modèle de gestion retenu. Là où les gains ont été réinvestis dans la formation, la rotation du personnel a chuté ; là où ils ont été captés par la seule productivité, les accidents et les arrêts de travail ont augmenté, annulant à terme le bénéfice attendu.",
    voice: "alloy",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Effet de l'automatisation sur l'emploi ?", options: ["Suppression pure", "Suppression, durcissement et création qualifiée", "Aucun effet"], correctIndex: 1 },
      { id: "q2", question: "Ce qui détermine le résultat net ?", options: ["Le modèle de gestion", "La marque des robots", "Le pays"], correctIndex: 0 },
      { id: "q3", question: "Quand les gains sont captés par la seule productivité ?", options: ["Les accidents augmentent", "La formation progresse", "Les salaires montent"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-9",
    title: "Conférence — langues et intégration économique",
    instruction: INSTR_TEF_C,
    script:
      "On postule souvent que la maîtrise du français conditionne l'insertion économique. Les données confirment la corrélation, mais inversent parfois la causalité : c'est l'accès à un emploi qualifié qui accélère la progression linguistique, en plaçant la personne dans des interactions exigeantes. Les dispositifs les plus efficaces combinent donc formation et mise en emploi simultanées, plutôt qu'un long préalable scolaire suivi d'une recherche d'emploi menée seule.",
    voice: "nova",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Quelle nuance sur la causalité ?", options: ["L'emploi qualifié accélère la progression linguistique", "La langue n'a aucun rôle", "Les données manquent"], correctIndex: 0 },
      { id: "q2", question: "Quels dispositifs sont les plus efficaces ?", options: ["Formation et emploi simultanés", "Cours intensifs de trois ans", "Autoformation"], correctIndex: 0 },
      { id: "q3", question: "Que critique implicitement l'oratrice ?", options: ["Le préalable scolaire long suivi d'une recherche solitaire", "Les examens de langue", "Les employeurs bilingues"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c1-10",
    title: "Éditorial — données publiques",
    instruction: INSTR_TEF_C,
    script:
      "Publier des données n'est pas rendre des comptes. Les portails ouverts se remplissent de fichiers volumineux, techniquement irréprochables et politiquement inoffensifs, tandis que les informations réellement décisives — coûts finaux des contrats, écarts aux prévisions — demeurent fragmentées entre services. La transparence utile suppose une contrainte simple : publier ce qui permet la comparaison dans le temps, quitte à publier moins.",
    voice: "echo",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Thèse de l'éditorial ?", options: ["Publier des données ne suffit pas à rendre des comptes", "Il faut fermer les portails", "Les données sont fausses"], correctIndex: 0 },
      { id: "q2", question: "Quelles informations manquent ?", options: ["Coûts finaux et écarts aux prévisions", "Les organigrammes", "Les horaires"], correctIndex: 0 },
      { id: "q3", question: "Quelle règle propose l'auteur ?", options: ["Publier ce qui permet la comparaison dans le temps", "Publier tout, sans exception", "Publier une fois par décennie"], correctIndex: 0 },
    ],
  },
];

/* ─────────── TEF Canada — C2 ─────────── */
export const TEF_CANADA_LISTENING_C2: ListeningTask[] = [
  {
    id: "tef-c2-1",
    title: "Séminaire — mesure de la productivité",
    instruction: INSTR_TEF_C,
    script:
      "L'écart de productivité que l'on impute rituellement au sous-investissement des entreprises tient aussi, pour une part difficile à chiffrer, à un artefact statistique : nos comptes nationaux mesurent mal les services non marchands et les gains de qualité. Ce n'est pas dire que le retard est illusoire, mais qu'en confondant l'indicateur et le phénomène, on prescrit des remèdes calibrés pour une maladie partiellement imaginaire, tout en négligeant les défaillances de diffusion technologique entre grandes et petites entreprises.",
    voice: "onyx",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Quel élément l'orateur ajoute-t-il à l'explication habituelle ?", options: ["Un artefact statistique", "La fiscalité", "Le climat"], correctIndex: 0 },
      { id: "q2", question: "Que reproche-t-il aux prescriptions actuelles ?", options: ["Elles confondent indicateur et phénomène", "Elles sont trop coûteuses", "Elles sont trop récentes"], correctIndex: 0 },
      { id: "q3", question: "Quelle défaillance est négligée ?", options: ["La diffusion technologique entre entreprises", "Le taux de change", "La formation initiale"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-2",
    title: "Controverse — évaluation des politiques publiques",
    instruction: INSTR_TEF_C,
    script:
      "— Vous érigez l'essai randomisé en étalon-or ; or il répond à des questions étroites dans des contextes stabilisés. — Étroites, soit, mais crédibles, ce qui vaut mieux qu'une évaluation narrative qui confirme toujours l'intuition du commanditaire. — La crédibilité interne n'est pas la validité externe : ce qui fonctionne dans deux quartiers ne se transpose pas mécaniquement. — Nous sommes d'accord sur le diagnostic ; nous divergeons sur la prudence à en tirer.",
    voice: "echo",
    speed: 1.12,
    questions: [
      { id: "q1", question: "Reproche fait à l'essai randomisé ?", options: ["Il répond à des questions étroites", "Il est illégal", "Il est trop rapide"], correctIndex: 0 },
      { id: "q2", question: "Distinction clé rappelée ?", options: ["Validité interne vs validité externe", "Coût vs bénéfice", "Public vs privé"], correctIndex: 0 },
      { id: "q3", question: "Sur quoi portent leurs divergences ?", options: ["Sur la prudence à tirer du diagnostic", "Sur les chiffres bruts", "Sur les auteurs cités"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-3",
    title: "Analyse — fédéralisme et santé",
    instruction: INSTR_TEF_C,
    script:
      "Le débat sur les transferts en santé se rejoue à chaque cycle budgétaire selon une chorégraphie prévisible : les provinces réclament des fonds inconditionnels, le fédéral exige des cibles mesurables, et l'on transige sur des indicateurs suffisamment vagues pour que chacun puisse revendiquer la victoire. Cette économie du compromis a un mérite — elle évite la crise — et un coût : elle rend presque impossible l'imputabilité, puisque nul ne peut dire, trois ans plus tard, quel palier a manqué à sa promesse.",
    voice: "alloy",
    speed: 1.12,
    questions: [
      { id: "q1", question: "Ce que réclament les provinces ?", options: ["Des fonds inconditionnels", "Moins d'argent", "Des transferts de personnel"], correctIndex: 0 },
      { id: "q2", question: "Sur quoi porte le compromis ?", options: ["Des indicateurs volontairement vagues", "Un calendrier strict", "Une réforme constitutionnelle"], correctIndex: 0 },
      { id: "q3", question: "Quel est son coût principal ?", options: ["L'impossibilité de l'imputabilité", "La hausse des impôts", "La lenteur des soins"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-4",
    title: "Conférence — épistémologie du risque climatique",
    instruction: INSTR_TEF_C,
    script:
      "Traiter l'incertitude climatique comme une raison d'attendre repose sur une confusion entre incertitude et ignorance. Nous ignorons la date exacte des seuils ; nous connaissons la direction et l'irréversibilité partielle des processus. Dans une telle configuration, la théorie de la décision recommande l'inverse de l'attentisme : plus la variance des issues est grande et les dommages asymétriques, plus la prime d'assurance rationnelle augmente. L'inaction n'est donc pas neutre, elle est un pari implicite sur l'issue la plus favorable.",
    voice: "nova",
    speed: 1.12,
    questions: [
      { id: "q1", question: "Quelle confusion est dénoncée ?", options: ["Entre incertitude et ignorance", "Entre climat et météo", "Entre coût et prix"], correctIndex: 0 },
      { id: "q2", question: "Que recommande la théorie de la décision ?", options: ["Augmenter la prime d'assurance, donc agir", "Attendre plus de données", "Ne rien changer"], correctIndex: 0 },
      { id: "q3", question: "Comment l'inaction est-elle qualifiée ?", options: ["Un pari implicite sur l'issue la plus favorable", "Une position neutre", "Une décision prudente"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-5",
    title: "Entretien — droit d'auteur et création générative",
    instruction: INSTR_TEF_C,
    script:
      "— Faut-il un droit voisin pour les corpus d'entraînement ? — Le réflexe est compréhensible, mais transposer un régime pensé pour la reproduction à un usage qui relève de l'analyse statistique risque de produire une rente sans bénéfice pour les auteurs individuels. — Que proposez-vous ? — Une obligation de traçabilité des corpus assortie d'une redevance collective indexée sur l'usage commercial. Le point décisif n'est pas d'interdire, il est de rendre l'exploitation visible et donc négociable.",
    voice: "shimmer",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Risque du droit voisin selon l'invité ?", options: ["Créer une rente sans bénéfice pour les auteurs", "Ruiner les entreprises", "Empêcher la recherche"], correctIndex: 0 },
      { id: "q2", question: "Que propose-t-il ?", options: ["Traçabilité des corpus et redevance collective", "L'interdiction pure", "Rien"], correctIndex: 0 },
      { id: "q3", question: "Quel est le point décisif ?", options: ["Rendre l'exploitation visible et négociable", "Punir les plateformes", "Accélérer les procès"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-6",
    title: "Chronique — démographie et régions",
    instruction: INSTR_TEF_C,
    script:
      "On oppose volontiers métropoles dynamiques et régions déclinantes, découpage commode et largement faux. Certaines municipalités éloignées enregistrent des soldes migratoires positifs depuis cinq ans, portés par des ménages en milieu de carrière que le coût du logement urbain a rendus mobiles. Le facteur limitant n'est plus l'attractivité mais la capacité d'accueil : services de garde, soins de première ligne, connectivité. Là où ces trois conditions sont réunies, la croissance suit ; ailleurs, l'arrivée se transforme en repartance en moins de deux ans.",
    voice: "onyx",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Que conteste la chronique ?", options: ["L'opposition métropoles/régions déclinantes", "Les statistiques d'emploi", "Le coût du logement"], correctIndex: 0 },
      { id: "q2", question: "Quel est désormais le facteur limitant ?", options: ["La capacité d'accueil", "L'attractivité", "Le climat"], correctIndex: 0 },
      { id: "q3", question: "Que se passe-t-il sans ces conditions ?", options: ["Les arrivants repartent en moins de deux ans", "La population double", "Rien ne change"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-7",
    title: "Débat — méritocratie",
    instruction: INSTR_TEF_C,
    script:
      "— La méritocratie a ceci de pervers qu'elle légitime l'inégalité qu'elle prétend corriger : ceux qui échouent intériorisent l'échec comme un verdict personnel. — Faut-il pour autant renoncer à distinguer les efforts ? — Non, mais cesser de confondre le mérite avec la position d'arrivée, qui dépend massivement du point de départ. — Vous décrivez un idéal régulateur, pas une politique. — L'idéal régulateur est précisément ce qui manque : sans lui, chaque réforme n'est qu'un ajustement technique.",
    voice: "echo",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Perversité attribuée à la méritocratie ?", options: ["Elle légitime l'inégalité qu'elle prétend corriger", "Elle récompense trop", "Elle est illégale"], correctIndex: 0 },
      { id: "q2", question: "Quelle confusion faut-il éviter ?", options: ["Confondre mérite et position d'arrivée", "Confondre effort et talent", "Confondre école et travail"], correctIndex: 0 },
      { id: "q3", question: "Objection formulée à la fin ?", options: ["C'est un idéal régulateur, pas une politique", "Les données manquent", "Le sujet est dépassé"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-8",
    title: "Exposé — patrimoine linguistique autochtone",
    instruction: INSTR_TEF_C,
    script:
      "La documentation des langues autochtones a longtemps été conçue comme un travail d'archive, mené par des chercheurs extérieurs pour des institutions extérieures. Le renversement en cours est méthodologique autant qu'éthique : ce sont les communautés qui définissent les priorités, décident du degré d'accessibilité des corpus et forment leurs propres linguistes. La revitalisation ne se mesure plus au nombre d'enregistrements déposés, mais au nombre de foyers où la transmission recommence — critère infiniment plus exigeant.",
    voice: "alloy",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Ancienne conception de la documentation ?", options: ["Un travail d'archive mené de l'extérieur", "Un projet communautaire", "Une obligation légale"], correctIndex: 0 },
      { id: "q2", question: "En quoi consiste le renversement ?", options: ["Les communautés définissent priorités et accès", "Les États financent plus", "Les archives sont fermées"], correctIndex: 0 },
      { id: "q3", question: "Nouveau critère de réussite ?", options: ["Le nombre de foyers où la transmission recommence", "Le nombre d'enregistrements", "Le nombre de publications"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-9",
    title: "Analyse — finance et transition",
    instruction: INSTR_TEF_C,
    script:
      "L'engagement des institutions financières à la carboneutralité en 2050 ressemble, en l'état, à une promesse sans mécanisme d'exécution : les cibles intermédiaires restent facultatives, les portefeuilles se « verdissent » par cession plutôt que par transformation, et l'actif vendu continue d'émettre chez un acquéreur moins scrupuleux. Une comptabilité crédible devrait donc valoriser la décarbonation réelle des entreprises financées, non la simple composition d'un portefeuille à un instant donné.",
    voice: "nova",
    speed: 1.18,
    questions: [
      { id: "q1", question: "Critique principale ?", options: ["Une promesse sans mécanisme d'exécution", "Des cibles trop strictes", "Un manque de capitaux"], correctIndex: 0 },
      { id: "q2", question: "Comment les portefeuilles se verdissent-ils ?", options: ["Par cession plutôt que transformation", "Par innovation", "Par fusion"], correctIndex: 0 },
      { id: "q3", question: "Que devrait valoriser une comptabilité crédible ?", options: ["La décarbonation réelle des entreprises financées", "La taille du portefeuille", "Le rendement annuel"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-c2-10",
    title: "Conférence — mémoire et espace public",
    instruction: INSTR_TEF_C,
    script:
      "Déboulonner ou maintenir : le débat, posé ainsi, garantit l'enlisement, car il suppose que la statue dise une vérité unique. Or un monument est moins un énoncé qu'un dispositif : il oriente les regards, hiérarchise les présences, produit un récit par ce qu'il tait. Recontextualiser suppose donc d'agir sur le dispositif — déplacement, contre-monument, dispositif interprétatif — plutôt que de trancher par oui ou par non. La difficulté est politique : ces solutions demandent du temps là où l'on exige une décision immédiate.",
    voice: "onyx",
    speed: 1.18,
    questions: [
      { id: "q1", question: "Pourquoi le débat s'enlise-t-il ?", options: ["Il suppose que la statue dise une vérité unique", "Il manque d'experts", "Il coûte trop cher"], correctIndex: 0 },
      { id: "q2", question: "Comment l'orateur définit-il un monument ?", options: ["Un dispositif qui oriente et hiérarchise", "Un simple objet d'art", "Un document juridique"], correctIndex: 0 },
      { id: "q3", question: "Principale difficulté des solutions proposées ?", options: ["Elles demandent du temps", "Elles sont interdites", "Elles sont impopulaires partout"], correctIndex: 0 },
    ],
  },
];

/* ─────────── TCF Canada — C1 ─────────── */
export const TCF_CANADA_LISTENING_C1: ListeningTask[] = [
  {
    id: "tcf-c1-1",
    title: "Reportage — formation continue",
    instruction: INSTR_TCF_C,
    script:
      "Le crédit d'impôt à la formation profite d'abord aux salariés déjà qualifiés, ceux dont l'employeur dispose d'un service des ressources humaines structuré. Les travailleurs des petites entreprises, pourtant les plus exposés aux transformations de leur métier, y recourent trois fois moins. Les experts consultés proposent un guichet unique régional, chargé de monter les dossiers à la place des employeurs, plutôt qu'une hausse du montant du crédit, jugée sans effet sur la principale barrière : la complexité administrative.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Qui profite le plus du crédit d'impôt ?", options: ["Les salariés déjà qualifiés", "Les travailleurs autonomes", "Les étudiants"], correctIndex: 0 },
      { id: "q2", question: "Quelle est la barrière principale ?", options: ["La complexité administrative", "Le montant trop faible", "Le manque de formateurs"], correctIndex: 0 },
      { id: "q3", question: "Que proposent les experts ?", options: ["Un guichet unique régional", "Doubler le crédit", "Supprimer le dispositif"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-2",
    title: "Entretien — urbanisme et mobilité douce",
    instruction: INSTR_TCF_C,
    script:
      "— Vos pistes cyclables suscitent une opposition vive des commerçants. — Elle est constante, et constamment démentie par les relevés : six mois après l'aménagement, le chiffre d'affaires moyen progresse, parce qu'on surestime toujours la part des clients venus en voiture. — Comment convainc-on alors ? — En publiant les données avant l'aménagement, pas après. Une fois le conflit installé, aucun chiffre ne change une position.",
    voice: "echo",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Que montrent les relevés après six mois ?", options: ["Le chiffre d'affaires progresse", "Il baisse fortement", "Il est stable"], correctIndex: 0 },
      { id: "q2", question: "Quelle erreur d'appréciation est citée ?", options: ["On surestime la part des clients en voiture", "On sous-estime le stationnement", "On oublie les livraisons"], correctIndex: 0 },
      { id: "q3", question: "Quelle stratégie recommande-t-elle ?", options: ["Publier les données avant l'aménagement", "Éviter la consultation", "Attendre les plaintes"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-3",
    title: "Chronique — évaluation scolaire",
    instruction: INSTR_TCF_C,
    script:
      "La multiplication des examens uniformisés visait à garantir l'équité entre établissements. Elle a surtout modifié l'enseignement lui-même : on prépare à l'épreuve, ce qui rétrécit le programme réellement enseigné. Le paradoxe est connu — dès qu'une mesure devient un objectif, elle cesse d'être une bonne mesure. Restaurer une évaluation formative suppose d'accepter une part d'hétérogénéité, prix modeste au regard de ce que l'on perd en réduisant l'apprentissage à ce qui se corrige rapidement.",
    voice: "shimmer",
    speed: 1.08,
    questions: [
      { id: "q1", question: "Effet observé des examens uniformisés ?", options: ["Le programme enseigné se rétrécit", "Les résultats chutent", "Les élèves lisent plus"], correctIndex: 0 },
      { id: "q2", question: "Quel paradoxe est évoqué ?", options: ["Une mesure devenue objectif cesse d'être fiable", "Plus d'examens, plus d'équité", "Moins de cours, plus d'acquis"], correctIndex: 0 },
      { id: "q3", question: "Que suppose l'évaluation formative ?", options: ["Accepter une part d'hétérogénéité", "Supprimer les notes", "Allonger l'année scolaire"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-4",
    title: "Débat — immigration temporaire",
    instruction: INSTR_TCF_C,
    script:
      "— Les permis liés à un seul employeur placent le travailleur dans une dépendance qui rend la plainte impossible. — Les permis ouverts existent, mais les entreprises qui ont financé le recrutement s'estiment lésées. — Alors mutualisons le coût de recrutement par secteur : l'entreprise est remboursée, le travailleur reste libre de partir. — Techniquement séduisant ; politiquement, cela suppose une coordination dont les associations patronales ne veulent pas.",
    voice: "onyx",
    speed: 1.08,
    questions: [
      { id: "q1", question: "Problème du permis lié à un employeur ?", options: ["Il crée une dépendance", "Il coûte cher", "Il est trop long à obtenir"], correctIndex: 0 },
      { id: "q2", question: "Solution proposée ?", options: ["Mutualiser le coût de recrutement par secteur", "Supprimer les permis", "Augmenter les amendes"], correctIndex: 0 },
      { id: "q3", question: "Quel obstacle est signalé ?", options: ["Le refus de coordination des associations patronales", "Le manque de budget", "Une opposition syndicale"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-5",
    title: "Exposé — désinformation",
    instruction: INSTR_TCF_C,
    script:
      "Les campagnes de vérification des faits corrigent efficacement une croyance isolée, mais peinent face aux récits, qui offrent une explication globale du monde. On ne défait pas un récit avec une correction ponctuelle : il faut lui opposer une histoire concurrente, plus économique en hypothèses et compatible avec l'expérience vécue des personnes visées. C'est un travail éditorial, lent, mal financé, et qui ne produit aucune statistique flatteuse à court terme.",
    voice: "alloy",
    speed: 1.08,
    questions: [
      { id: "q1", question: "Limite de la vérification des faits ?", options: ["Elle échoue face aux récits globaux", "Elle est trop chère", "Elle est illégale"], correctIndex: 0 },
      { id: "q2", question: "Que faut-il opposer à un récit ?", options: ["Une histoire concurrente crédible", "Plus de corrections", "Le silence"], correctIndex: 0 },
      { id: "q3", question: "Pourquoi ce travail est-il rare ?", options: ["Lent, mal financé, sans résultats immédiats", "Interdit par la loi", "Trop facile"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-6",
    title: "Interview — agriculture et relève",
    instruction: INSTR_TCF_C,
    script:
      "— Le principal frein à la relève agricole, c'est le prix des terres ? — C'est le prix rapporté au revenu possible. Un jeune peut emprunter ; il ne peut pas rembourser avec les marges actuelles. — D'où les fiducies foncières ? — Oui : la terre reste détenue collectivement, l'exploitant en paie l'usage. Ce n'est pas idéologique, c'est le seul montage qui découple l'accès à la terre de la spéculation.",
    voice: "nova",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Le vrai frein est ?", options: ["Le prix rapporté au revenu possible", "Le climat", "Le manque de formation"], correctIndex: 0 },
      { id: "q2", question: "Qu'est-ce qu'une fiducie foncière ici ?", options: ["Terre détenue collectivement, usage payé par l'exploitant", "Un prêt bancaire", "Une subvention"], correctIndex: 0 },
      { id: "q3", question: "Quel est l'argument avancé ?", options: ["Elle découple l'accès à la terre de la spéculation", "Elle réduit les impôts", "Elle augmente les rendements"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-7",
    title: "Analyse — services publics numériques",
    instruction: INSTR_TCF_C,
    script:
      "Numériser une démarche sans la simplifier revient à transposer sa complexité dans une interface, avec un inconvénient supplémentaire : l'usager perd l'interlocuteur qui savait interpréter les cas particuliers. Les services les mieux évalués ont procédé dans l'ordre inverse — refonte du processus, suppression des pièces redondantes, puis mise en ligne. Le maintien d'un canal humain n'y est pas un vestige, mais la soupape qui absorbe les situations que nul formulaire ne prévoit.",
    voice: "echo",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Défaut d'une numérisation sans simplification ?", options: ["La complexité est transposée et l'interlocuteur disparaît", "Le coût explose", "Les serveurs saturent"], correctIndex: 0 },
      { id: "q2", question: "Quel ordre suivent les meilleurs services ?", options: ["Refonte du processus, puis mise en ligne", "Mise en ligne immédiate", "Numérisation partielle"], correctIndex: 0 },
      { id: "q3", question: "Rôle du canal humain ?", options: ["Absorber les situations imprévues", "Faire de la publicité", "Réduire les coûts"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-8",
    title: "Table ronde — culture et financement",
    instruction: INSTR_TCF_C,
    script:
      "— Les subventions au projet fragilisent les compagnies : on finance des créations, jamais la permanence. — C'est le principe : éviter la rente. — Sauf que sans permanence, il n'y a ni transmission ni prise de risque, seulement des projets calibrés pour plaire au jury. — Alors indexons une part du financement sur la durée d'existence, en la conditionnant à une activité de médiation vérifiable.",
    voice: "shimmer",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Reproche fait aux subventions au projet ?", options: ["Elles ne financent pas la permanence", "Elles sont trop élevées", "Elles arrivent trop tôt"], correctIndex: 0 },
      { id: "q2", question: "Conséquence évoquée ?", options: ["Des projets calibrés pour plaire au jury", "Une hausse des billets", "Trop de créations"], correctIndex: 0 },
      { id: "q3", question: "Compromis proposé ?", options: ["Financer la durée, conditionné à la médiation", "Supprimer les jurys", "Privatiser la culture"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-9",
    title: "Chronique — sciences et confiance",
    instruction: INSTR_TCF_C,
    script:
      "La confiance envers la science ne se joue pas sur la quantité d'informations transmises, contrairement au postulat du modèle dit « du déficit ». Elle dépend de la perception d'intégrité : sait-on qui finance, que fait-on des résultats contraires, comment corrige-t-on l'erreur ? Rendre visibles les mécanismes d'autocorrection est plus efficace que multiplier les campagnes de vulgarisation, car cela répond à la question réellement posée, qui est une question de confiance et non d'ignorance.",
    voice: "onyx",
    speed: 1.12,
    questions: [
      { id: "q1", question: "Que conteste le « modèle du déficit » ?", options: ["L'idée qu'il suffit d'informer davantage", "L'existence du doute", "La méthode scientifique"], correctIndex: 0 },
      { id: "q2", question: "De quoi dépend la confiance ?", options: ["De la perception d'intégrité", "Du nombre d'articles", "Du prestige des revues"], correctIndex: 0 },
      { id: "q3", question: "Quelle stratégie est recommandée ?", options: ["Rendre visibles les mécanismes d'autocorrection", "Simplifier les résultats", "Éviter les débats publics"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c1-10",
    title: "Reportage — vieillissement et soins à domicile",
    instruction: INSTR_TCF_C,
    script:
      "Le maintien à domicile est présenté comme une préférence des aînés et une économie pour l'État. Les deux affirmations sont vraies, mais l'économie n'apparaît que si les services suivent : sans heures d'aide suffisantes, la charge glisse vers les proches aidants, majoritairement des femmes, dont le retrait partiel du marché du travail représente un coût social invisible dans les comptes publics. Comptabiliser ce transfert modifierait sensiblement l'arbitrage entre domicile et hébergement.",
    voice: "alloy",
    speed: 1.12,
    questions: [
      { id: "q1", question: "À quelle condition l'économie apparaît-elle ?", options: ["Si les services d'aide suivent", "Si les aînés paient", "Si l'on ferme les hébergements"], correctIndex: 0 },
      { id: "q2", question: "Vers qui glisse la charge ?", options: ["Les proches aidants, surtout des femmes", "Les municipalités", "Les hôpitaux"], correctIndex: 0 },
      { id: "q3", question: "Qu'entraînerait la comptabilisation de ce transfert ?", options: ["Un arbitrage sensiblement modifié", "Aucune différence", "La fin du maintien à domicile"], correctIndex: 0 },
    ],
  },
];

/* ─────────── TCF Canada — C2 ─────────── */
export const TCF_CANADA_LISTENING_C2: ListeningTask[] = [
  {
    id: "tcf-c2-1",
    title: "Conférence — normativité linguistique",
    instruction: INSTR_TCF_C,
    script:
      "Opposer norme et usage relève d'une commodité pédagogique plus que d'une réalité linguistique : toute norme est un usage stabilisé par des institutions, et tout usage suffisamment partagé finit par exercer une pression normative. Ce qui mérite discussion, ce n'est donc pas la légitimité du français d'ici, acquise depuis longtemps, mais la répartition inégale du prestige entre variétés, laquelle continue de produire, dans les entretiens d'embauche comme à l'école, des jugements qui n'ont rien de grammatical.",
    voice: "onyx",
    speed: 1.12,
    questions: [
      { id: "q1", question: "Que dit l'oratrice de l'opposition norme/usage ?", options: ["C'est une commodité pédagogique", "C'est une loi linguistique", "C'est une invention récente"], correctIndex: 0 },
      { id: "q2", question: "Quel est le vrai sujet de discussion ?", options: ["La répartition inégale du prestige entre variétés", "La grammaire du français", "L'orthographe"], correctIndex: 0 },
      { id: "q3", question: "Où ces jugements se manifestent-ils ?", options: ["Entretiens d'embauche et école", "Uniquement à la radio", "Dans les dictionnaires"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-2",
    title: "Controverse — revenu de base",
    instruction: INSTR_TCF_C,
    script:
      "— Le revenu de base a le mérite de la simplicité : il supprime le contrôle humiliant des situations. — Il supprime surtout un ciblage qui, à budget constant, protégeait davantage les plus pauvres. — Sauf que le ciblage produit un non-recours massif : trente pour cent d'éligibles n'en font jamais la demande. — Nous convenons du problème ; je conteste que l'universalité soit la seule réponse, quand l'automatisation des versements existants coûterait dix fois moins.",
    voice: "echo",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Mérite invoqué du revenu de base ?", options: ["Supprimer le contrôle humiliant", "Enrichir l'État", "Réduire les salaires"], correctIndex: 0 },
      { id: "q2", question: "Quelle objection budgétaire est faite ?", options: ["À budget constant, le ciblage protège mieux les plus pauvres", "Il coûte trop peu", "Il augmente l'emploi"], correctIndex: 0 },
      { id: "q3", question: "Quelle alternative propose le contradicteur ?", options: ["Automatiser les versements existants", "Supprimer toute aide", "Créer un impôt nouveau"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-3",
    title: "Analyse — justice prédictive",
    instruction: INSTR_TCF_C,
    script:
      "Les outils d'aide à la décision judiciaire ne se contentent pas de reproduire les biais des données passées : ils les stabilisent, en donnant à une régularité statistique l'autorité d'une prescription. Le juge conserve formellement sa liberté, mais s'en écarter exige désormais une justification, alors que s'y conformer n'en demande aucune. Cette asymétrie, purement procédurale, suffit à déplacer la norme sans qu'aucune décision explicite n'ait été prise à ce sujet.",
    voice: "alloy",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Que font ces outils selon l'analyse ?", options: ["Ils stabilisent les biais passés", "Ils suppriment les biais", "Ils remplacent le juge"], correctIndex: 0 },
      { id: "q2", question: "En quoi consiste l'asymétrie décrite ?", options: ["S'écarter exige une justification, se conformer non", "Le juge perd son statut", "Les avocats disparaissent"], correctIndex: 0 },
      { id: "q3", question: "Conséquence principale ?", options: ["La norme se déplace sans décision explicite", "Les procès s'allongent", "Les peines baissent"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-4",
    title: "Séminaire — biodiversité et compensation",
    instruction: INSTR_TCF_C,
    script:
      "La compensation écologique repose sur une équivalence postulée entre un milieu détruit et un milieu restauré ailleurs. Or les écosystèmes ne sont pas fongibles : une tourbière millénaire ne se recrée pas, et les suivis montrent qu'au-delà de cinq ans, moins d'un tiers des sites compensatoires atteignent les fonctions annoncées. Maintenir le dispositif suppose au minimum d'inverser la charge de la preuve et d'exiger la démonstration de l'équivalence avant l'autorisation, non après.",
    voice: "nova",
    speed: 1.15,
    questions: [
      { id: "q1", question: "Postulat contesté de la compensation ?", options: ["L'équivalence entre milieu détruit et milieu restauré", "Le coût des travaux", "La durée des chantiers"], correctIndex: 0 },
      { id: "q2", question: "Que montrent les suivis après cinq ans ?", options: ["Moins d'un tiers des sites atteignent les fonctions annoncées", "Tous réussissent", "Les résultats sont inconnus"], correctIndex: 0 },
      { id: "q3", question: "Quelle exigence minimale est proposée ?", options: ["Démontrer l'équivalence avant l'autorisation", "Doubler les budgets", "Interdire tout aménagement"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-5",
    title: "Entretien — souveraineté numérique",
    instruction: INSTR_TCF_C,
    script:
      "— On réduit souvent la souveraineté numérique à la localisation des serveurs. — C'est le degré zéro du raisonnement : la juridiction du fournisseur prime sur la géographie du centre de données. Une donnée hébergée ici reste accessible à une autorité étrangère si l'opérateur relève de son droit. — Que faire alors ? — Diversifier les fournisseurs, exiger la portabilité effective et, surtout, développer la compétence interne : sans équipes capables d'auditer, toute clause contractuelle est une déclaration d'intention.",
    voice: "shimmer",
    speed: 1.18,
    questions: [
      { id: "q1", question: "Qu'est-ce qui prime sur la géographie ?", options: ["La juridiction du fournisseur", "La vitesse du réseau", "Le prix du service"], correctIndex: 0 },
      { id: "q2", question: "Quelles mesures propose-t-il ?", options: ["Diversification, portabilité, compétence interne", "Interdire le nuage", "Nationaliser les réseaux"], correctIndex: 0 },
      { id: "q3", question: "Sans capacité d'audit, une clause est ?", options: ["Une déclaration d'intention", "Une garantie solide", "Un délit"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-6",
    title: "Débat — mémoire scolaire et récit national",
    instruction: INSTR_TCF_C,
    script:
      "— Enseigner l'histoire, c'est transmettre un récit commun, sans quoi il n'y a pas de société. — Ou c'est enseigner la méthode qui permet de contester tout récit, y compris celui qu'on vous transmet. — Vous formez des sceptiques sans repères. — Je forme des citoyens capables de distinguer un document d'une opinion, ce qui me paraît un repère plus solide qu'une chronologie apprise puis oubliée.",
    voice: "onyx",
    speed: 1.18,
    questions: [
      { id: "q1", question: "Position du premier intervenant ?", options: ["Transmettre un récit commun", "Supprimer l'histoire", "Enseigner uniquement les dates"], correctIndex: 0 },
      { id: "q2", question: "Que privilégie le second ?", options: ["La méthode critique", "La mémorisation", "Le silence"], correctIndex: 0 },
      { id: "q3", question: "Quel repère revendique-t-il ?", options: ["Distinguer un document d'une opinion", "Connaître la chronologie", "Aimer son pays"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-7",
    title: "Exposé — économie de l'attention",
    instruction: INSTR_TCF_C,
    script:
      "Le terme d'addiction, appliqué aux plateformes, sert de raccourci commode mais déplace la responsabilité vers l'usager. Ce qui est en cause relève plutôt d'une architecture de choix : la friction est supprimée du côté de la consommation et maximisée du côté du retrait. Une régulation cohérente ne viserait donc pas les contenus, terrain glissant, mais la symétrie des frictions — délais, réglages par défaut, coûts de sortie — c'est-à-dire la forme plutôt que le fond.",
    voice: "alloy",
    speed: 1.18,
    questions: [
      { id: "q1", question: "Problème du mot « addiction » ici ?", options: ["Il déplace la responsabilité vers l'usager", "Il est trop technique", "Il est faux médicalement"], correctIndex: 0 },
      { id: "q2", question: "Comment la friction est-elle distribuée ?", options: ["Supprimée pour consommer, maximisée pour se retirer", "Égale partout", "Supprimée partout"], correctIndex: 0 },
      { id: "q3", question: "Que devrait viser la régulation ?", options: ["La symétrie des frictions", "Le contenu publié", "Le nombre d'utilisateurs"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-8",
    title: "Chronique — coopératives et gouvernance",
    instruction: INSTR_TCF_C,
    script:
      "Les coopératives résistent mieux aux crises, c'est établi ; elles croissent plus lentement, c'est établi aussi. On y voit une faiblesse alors qu'il s'agit d'un arbitrage assumé entre rendement et pérennité. La difficulté réelle est ailleurs : la gouvernance démocratique suppose des membres informés, donc du temps, ressource que la pression concurrentielle érode en premier. Sans dispositif protégeant explicitement ce temps délibératif, la coopérative dérive vers une entreprise ordinaire dotée d'un statut particulier.",
    voice: "nova",
    speed: 1.2,
    questions: [
      { id: "q1", question: "Comment interpréter la croissance plus lente ?", options: ["Un arbitrage assumé entre rendement et pérennité", "Un échec de gestion", "Un manque de capital"], correctIndex: 0 },
      { id: "q2", question: "Quelle est la difficulté réelle ?", options: ["Le temps nécessaire à des membres informés", "Le recrutement", "La fiscalité"], correctIndex: 0 },
      { id: "q3", question: "Risque en l'absence de protection de ce temps ?", options: ["Dérive vers une entreprise ordinaire", "Faillite immédiate", "Fusion obligatoire"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-9",
    title: "Analyse — pénurie de logements et fiscalité",
    instruction: INSTR_TCF_C,
    script:
      "Taxer les logements vacants produit des effets d'annonce supérieurs à ses effets réels : la vacance mesurée est faible et souvent frictionnelle. L'enjeu se situe en amont, dans une fiscalité foncière qui taxe la construction plutôt que la rétention de terrain constructible. Déplacer la charge vers la valeur du sol pénaliserait l'attente spéculative sans décourager le bâti — proposition ancienne, techniquement documentée, et politiquement inaudible précisément parce qu'elle est efficace.",
    voice: "echo",
    speed: 1.2,
    questions: [
      { id: "q1", question: "Que dit l'analyse de la taxe sur les logements vacants ?", options: ["Ses effets réels sont limités", "Elle règle la crise", "Elle est illégale"], correctIndex: 0 },
      { id: "q2", question: "Quelle réforme est proposée ?", options: ["Taxer la valeur du sol plutôt que la construction", "Supprimer l'impôt foncier", "Geler les loyers"], correctIndex: 0 },
      { id: "q3", question: "Pourquoi serait-elle « inaudible » ?", options: ["Précisément parce qu'elle est efficace", "Parce qu'elle est nouvelle", "Parce qu'elle est coûteuse"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-c2-10",
    title: "Conférence — traduction et pouvoir",
    instruction: INSTR_TCF_C,
    script:
      "Traduire n'est jamais un transfert neutre : le choix de ce qui se traduit, et depuis quelle langue, dessine une hiérarchie mondiale des savoirs plus efficace que n'importe quelle politique déclarée. Une œuvre traduite depuis une langue dominante circule sans justification ; l'inverse exige un plaidoyer. Les programmes de soutien à la traduction ne corrigent cette asymétrie que marginalement, tant que la décision éditoriale demeure adossée à une évaluation du risque commercial qui reproduit, mécaniquement, la cartographie existante.",
    voice: "shimmer",
    speed: 1.2,
    questions: [
      { id: "q1", question: "Que révèle le choix des traductions ?", options: ["Une hiérarchie mondiale des savoirs", "Le goût des lecteurs", "La qualité des textes"], correctIndex: 0 },
      { id: "q2", question: "Quelle asymétrie est décrite ?", options: ["Depuis une langue dominante, l'œuvre circule sans justification", "Les traducteurs sont trop payés", "Les délais sont inégaux"], correctIndex: 0 },
      { id: "q3", question: "Pourquoi les programmes de soutien échouent-ils en partie ?", options: ["La décision éditoriale suit le risque commercial", "Ils manquent de traducteurs", "Ils sont récents"], correctIndex: 0 },
    ],
  },
];
