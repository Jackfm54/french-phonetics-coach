/**
 * Compréhension orale — TEF Canada y TCF Canada.
 * 10 documentos audio por prueba, en progresión de dificultad,
 * con preguntas de opción múltiple al estilo oficial.
 */

import type { ListeningTask } from "./listening-exams";

const INSTR_TEF =
  "Écoutez le document une seule fois puis choisissez la bonne réponse (épreuve de compréhension orale du TEF Canada).";
const INSTR_TCF =
  "Écoutez le document et choisissez la réponse correcte (épreuve de compréhension orale du TCF Canada).";

/* ─────────── TEF Canada (10 tâches) ─────────── */
export const TEF_CANADA_LISTENING: ListeningTask[] = [
  {
    id: "tef-co-1",
    title: "Section A — Image sonore : au guichet",
    instruction: INSTR_TEF,
    script:
      "Bonjour, un billet aller-retour pour Québec, s'il vous plaît. — Pour aujourd'hui ? — Non, pour demain matin, le plus tôt possible. — Il y a un départ à six heures quinze, quarante-deux dollars.",
    voice: "nova",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Où se passe la scène ?", options: ["À la banque", "À un guichet de transport", "Au restaurant"], correctIndex: 1 },
      { id: "q2", question: "Quand part le client ?", options: ["Aujourd'hui", "Demain matin", "Demain soir"], correctIndex: 1 },
      { id: "q3", question: "Combien coûte le billet ?", options: ["42 dollars", "24 dollars", "62 dollars"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-co-2",
    title: "Section A — Annonce en magasin",
    instruction: INSTR_TEF,
    script:
      "Chers clients, votre attention s'il vous plaît. Le rayon électroménager propose aujourd'hui seulement une réduction de trente pour cent sur tous les réfrigérateurs. L'offre se termine à la fermeture, à vingt et une heures.",
    voice: "shimmer",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Quel rayon est concerné ?", options: ["L'alimentation", "L'électroménager", "Le textile"], correctIndex: 1 },
      { id: "q2", question: "Quelle est la réduction ?", options: ["13 %", "30 %", "40 %"], correctIndex: 1 },
      { id: "q3", question: "Jusqu'à quand dure l'offre ?", options: ["Jusqu'à 21 h aujourd'hui", "Toute la semaine", "Jusqu'à demain midi"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-co-3",
    title: "Section B — Message sur répondeur professionnel",
    instruction: INSTR_TEF,
    script:
      "Bonjour, ici le cabinet dentaire Lavoie. Nous vous rappelons votre rendez-vous du jeudi quatorze, à quinze heures trente. Merci de vous présenter dix minutes à l'avance avec votre carte d'assurance. En cas d'empêchement, prévenez-nous au moins vingt-quatre heures avant.",
    voice: "alloy",
    speed: 1,
    questions: [
      { id: "q1", question: "Qui laisse le message ?", options: ["Une pharmacie", "Un cabinet dentaire", "Une clinique vétérinaire"], correctIndex: 1 },
      { id: "q2", question: "À quelle heure est le rendez-vous ?", options: ["14 h 30", "15 h 30", "15 h 15"], correctIndex: 1 },
      { id: "q3", question: "Que faut-il apporter ?", options: ["Sa carte d'assurance", "Une ordonnance", "Un chèque"], correctIndex: 0 },
      { id: "q4", question: "Délai pour annuler ?", options: ["24 heures avant", "10 minutes avant", "Une semaine avant"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-co-4",
    title: "Section B — Conversation entre collègues",
    instruction: INSTR_TEF,
    script:
      "— Tu as vu la note de la direction ? On passe au télétravail deux jours par semaine. — Ah oui ? Lesquels ? — C'est nous qui choisissons, sauf le mardi : réunion d'équipe obligatoire au bureau. — Parfait, je prendrai le lundi et le vendredi.",
    voice: "echo",
    speed: 1,
    questions: [
      { id: "q1", question: "De quoi parlent-ils ?", options: ["D'une augmentation", "Du télétravail", "Des vacances"], correctIndex: 1 },
      { id: "q2", question: "Combien de jours de télétravail ?", options: ["Un jour", "Deux jours", "Trois jours"], correctIndex: 1 },
      { id: "q3", question: "Quel jour faut-il être au bureau ?", options: ["Le lundi", "Le mardi", "Le vendredi"], correctIndex: 1 },
    ],
  },
  {
    id: "tef-co-5",
    title: "Section B — Bulletin météo canadien",
    instruction: INSTR_TEF,
    script:
      "Voici la météo pour la région de Montréal. Cette nuit, chute de neige importante : quinze à vingt centimètres attendus. Les températures descendront jusqu'à moins dix-huit degrés avec un refroidissement éolien de moins vingt-cinq. Les autorités recommandent d'éviter les déplacements non essentiels demain matin.",
    voice: "onyx",
    speed: 1,
    questions: [
      { id: "q1", question: "Quel phénomène est annoncé ?", options: ["De la pluie verglaçante", "Une chute de neige", "Du brouillard"], correctIndex: 1 },
      { id: "q2", question: "Quelle quantité de neige ?", options: ["5 à 10 cm", "15 à 20 cm", "50 cm"], correctIndex: 1 },
      { id: "q3", question: "Que recommandent les autorités ?", options: ["Éviter les déplacements non essentiels", "Fermer les écoles une semaine", "Rester sur les routes principales"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-co-6",
    title: "Section C — Interview : arriver au Québec",
    instruction: INSTR_TEF,
    script:
      "— Sophie, vous êtes arrivée de Colombie il y a trois ans. Qu'est-ce qui a été le plus difficile ? — Sans hésiter, l'hiver et surtout la reconnaissance de mes diplômes. J'étais ingénieure civile, mais j'ai dû suivre une formation d'appoint de dix-huit mois avant d'obtenir mon permis d'exercer. — Et aujourd'hui ? — Aujourd'hui je travaille dans mon domaine, mais je conseille à tout le monde de préparer ce dossier avant même de partir.",
    voice: "nova",
    speed: 1,
    questions: [
      { id: "q1", question: "Quelle était sa profession ?", options: ["Enseignante", "Ingénieure civile", "Infirmière"], correctIndex: 1 },
      { id: "q2", question: "Quelle a été la principale difficulté professionnelle ?", options: ["La langue", "La reconnaissance des diplômes", "Le manque d'offres"], correctIndex: 1 },
      { id: "q3", question: "Combien a duré la formation d'appoint ?", options: ["6 mois", "18 mois", "3 ans"], correctIndex: 1 },
      { id: "q4", question: "Que conseille-t-elle ?", options: ["De préparer le dossier avant de partir", "D'arriver en été", "De changer de métier"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-co-7",
    title: "Section C — Reportage : transports urbains",
    instruction: INSTR_TEF,
    script:
      "La société de transport annonce une refonte de son réseau d'autobus. Douze lignes seront prolongées vers les banlieues nord, et la fréquence passera de vingt à douze minutes aux heures de pointe. Le projet, financé à soixante pour cent par la province, entrera en vigueur au printemps prochain. Les usagers interrogés saluent l'initiative, mais s'inquiètent d'une hausse tarifaire que la société dit exclure pour l'instant.",
    voice: "echo",
    speed: 1.02,
    questions: [
      { id: "q1", question: "Quel est le sujet ?", options: ["La refonte du réseau d'autobus", "Une grève des chauffeurs", "L'ouverture d'un métro"], correctIndex: 0 },
      { id: "q2", question: "Nouvelle fréquence aux heures de pointe ?", options: ["Toutes les 20 minutes", "Toutes les 12 minutes", "Toutes les 5 minutes"], correctIndex: 1 },
      { id: "q3", question: "Qui finance majoritairement ?", options: ["La province, à 60 %", "La ville, à 60 %", "Le fédéral, en totalité"], correctIndex: 0 },
      { id: "q4", question: "Quelle est l'inquiétude des usagers ?", options: ["La suppression de lignes", "Une hausse des tarifs", "La sécurité la nuit"], correctIndex: 1 },
    ],
  },
  {
    id: "tef-co-8",
    title: "Section C — Débat : semaine de quatre jours",
    instruction: INSTR_TEF,
    script:
      "— Réduire la semaine à quatre jours sans baisse de salaire, c'est une utopie coûteuse. — Les entreprises qui l'ont testée constatent pourtant une productivité stable et un absentéisme en net recul. — Stable, oui, dans les secteurs de bureau. Mais dans la santé ou la restauration, il faut embaucher, et personne ne finance ces postes. — C'est justement là que l'État pourrait intervenir, plutôt que de subventionner des heures supplémentaires.",
    voice: "onyx",
    speed: 1.02,
    questions: [
      { id: "q1", question: "Position du premier intervenant ?", options: ["Favorable", "Sceptique sur le coût", "Neutre"], correctIndex: 1 },
      { id: "q2", question: "Quel effet observé selon le second ?", options: ["Baisse de la productivité", "Baisse de l'absentéisme", "Hausse des démissions"], correctIndex: 1 },
      { id: "q3", question: "Quel secteur pose problème ?", options: ["Les bureaux", "La santé et la restauration", "L'informatique"], correctIndex: 1 },
      { id: "q4", question: "Quelle solution est évoquée ?", options: ["Une intervention de l'État", "Une baisse des salaires", "Un retour aux cinq jours"], correctIndex: 0 },
    ],
  },
  {
    id: "tef-co-9",
    title: "Section C — Chronique : logement étudiant",
    instruction: INSTR_TEF,
    script:
      "La pénurie de logements étudiants atteint un niveau critique dans les grandes villes universitaires. Le loyer moyen d'un studio a bondi de vingt-deux pour cent en trois ans, tandis que les bourses n'ont progressé que de quatre pour cent. Conséquence : un étudiant sur cinq déclare avoir renoncé à une formation en raison du coût du logement. Les universités multiplient les partenariats avec des résidences privées, une réponse jugée insuffisante par les associations étudiantes.",
    voice: "shimmer",
    speed: 1.02,
    questions: [
      { id: "q1", question: "Hausse du loyer moyen ?", options: ["4 % en trois ans", "22 % en trois ans", "50 % en un an"], correctIndex: 1 },
      { id: "q2", question: "Progression des bourses ?", options: ["4 %", "22 %", "Aucune"], correctIndex: 0 },
      { id: "q3", question: "Combien d'étudiants ont renoncé à une formation ?", options: ["Un sur dix", "Un sur cinq", "Un sur deux"], correctIndex: 1 },
      { id: "q4", question: "Que pensent les associations des partenariats ?", options: ["Réponse suffisante", "Réponse insuffisante", "Elles n'en parlent pas"], correctIndex: 1 },
    ],
  },
  {
    id: "tef-co-10",
    title: "Section C — Analyse : intelligence artificielle au travail",
    instruction: INSTR_TEF,
    script:
      "L'automatisation ne détruira pas les emplois en bloc ; elle en recomposera le contenu. Selon l'étude publiée ce matin, près de quarante pour cent des tâches administratives pourraient être assistées par des outils d'intelligence artificielle d'ici cinq ans, sans pour autant supprimer les postes correspondants. Le véritable enjeu, insistent les auteurs, est celui de la formation continue : sans plan massif de requalification, les gains de productivité profiteront à une minorité qualifiée, creusant les inégalités déjà existantes.",
    voice: "alloy",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Thèse principale ?", options: ["L'IA détruira les emplois", "L'IA recomposera le contenu des emplois", "L'IA n'aura aucun effet"], correctIndex: 1 },
      { id: "q2", question: "Quelle proportion de tâches administratives ?", options: ["14 %", "40 %", "70 %"], correctIndex: 1 },
      { id: "q3", question: "Quel est le véritable enjeu selon les auteurs ?", options: ["La formation continue", "Le prix des logiciels", "La réglementation"], correctIndex: 0 },
      { id: "q4", question: "Risque en l'absence de requalification ?", options: ["Une pénurie de machines", "Un creusement des inégalités", "Une baisse de la productivité"], correctIndex: 1 },
    ],
  },
];

/* ─────────── TCF Canada (10 tâches) ─────────── */
export const TCF_CANADA_LISTENING: ListeningTask[] = [
  {
    id: "tcf-co-1",
    title: "Consigne courte",
    instruction: INSTR_TCF,
    script:
      "Les passagers du vol Air Canada huit cent douze à destination de Vancouver sont priés de se présenter porte vingt-deux. L'embarquement commence dans dix minutes.",
    voice: "nova",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Quelle est la destination ?", options: ["Vancouver", "Montréal", "Ottawa"], correctIndex: 0 },
      { id: "q2", question: "Quelle porte ?", options: ["12", "22", "20"], correctIndex: 1 },
      { id: "q3", question: "Quand commence l'embarquement ?", options: ["Dans 10 minutes", "Immédiatement", "Dans une heure"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-co-2",
    title: "Dialogue quotidien : chez le voisin",
    instruction: INSTR_TCF,
    script:
      "— Bonjour, je peux vous demander un service ? Je pars trois jours à Ottawa, pourriez-vous arroser mes plantes ? — Bien sûr, pas de problème. Vous partez quand ? — Vendredi soir, je reviens lundi. Je vous laisse la clé jeudi.",
    voice: "shimmer",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Quel service demande-t-il ?", options: ["Garder le chat", "Arroser les plantes", "Relever le courrier"], correctIndex: 1 },
      { id: "q2", question: "Quand part-il ?", options: ["Jeudi soir", "Vendredi soir", "Lundi matin"], correctIndex: 1 },
      { id: "q3", question: "Quand donne-t-il la clé ?", options: ["Jeudi", "Vendredi", "Lundi"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-co-3",
    title: "Message d'information : bibliothèque",
    instruction: INSTR_TCF,
    script:
      "En raison de travaux, la bibliothèque municipale fermera ses portes du trois au dix-sept août. Les documents empruntés pourront être rendus dans la boîte extérieure, sans pénalité de retard. Le service de prêt numérique reste accessible en ligne pendant toute la durée des travaux.",
    voice: "alloy",
    speed: 1,
    questions: [
      { id: "q1", question: "Pourquoi la fermeture ?", options: ["Des travaux", "Les vacances du personnel", "Un déménagement"], correctIndex: 0 },
      { id: "q2", question: "Combien de temps ?", options: ["Deux semaines en août", "Tout l'été", "Trois jours"], correctIndex: 0 },
      { id: "q3", question: "Que se passe-t-il pour les retards ?", options: ["Pénalité doublée", "Aucune pénalité", "Pénalité habituelle"], correctIndex: 1 },
      { id: "q4", question: "Quel service reste disponible ?", options: ["La salle de lecture", "Le prêt numérique", "Les ateliers enfants"], correctIndex: 1 },
    ],
  },
  {
    id: "tcf-co-4",
    title: "Conversation : recherche d'emploi",
    instruction: INSTR_TCF,
    script:
      "— Alors, cet entretien ? — Plutôt bien. Le poste est à temps plein, mais il faut accepter de travailler un samedi sur deux. — Et le salaire ? — Correct, un peu au-dessus de ce que je gagne, avec une assurance collective. Je dois donner ma réponse avant mercredi.",
    voice: "echo",
    speed: 1,
    questions: [
      { id: "q1", question: "Quelle contrainte du poste ?", options: ["Travailler un samedi sur deux", "Beaucoup de voyages", "Horaires de nuit"], correctIndex: 0 },
      { id: "q2", question: "Que dit-elle du salaire ?", options: ["Plus bas qu'avant", "Un peu supérieur", "Identique"], correctIndex: 1 },
      { id: "q3", question: "Quand doit-elle répondre ?", options: ["Avant mercredi", "Avant samedi", "Dans un mois"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-co-5",
    title: "Interview : bénévolat",
    instruction: INSTR_TCF,
    script:
      "— Vous êtes bénévole depuis cinq ans dans cette banque alimentaire. Pourquoi ? — Au départ, pour occuper ma retraite. Puis j'ai compris que le besoin était énorme : nous servons trois cents familles par semaine, contre cent quatre-vingts il y a deux ans. — Ce qui vous manque le plus ? — Des bénévoles le samedi, et des camions pour la collecte.",
    voice: "onyx",
    speed: 1,
    questions: [
      { id: "q1", question: "Depuis quand est-il bénévole ?", options: ["Deux ans", "Cinq ans", "Dix ans"], correctIndex: 1 },
      { id: "q2", question: "Motivation initiale ?", options: ["Occuper sa retraite", "Une obligation", "Un projet scolaire"], correctIndex: 0 },
      { id: "q3", question: "Combien de familles servies par semaine ?", options: ["180", "300", "500"], correctIndex: 1 },
      { id: "q4", question: "Quels sont les besoins ?", options: ["De l'argent seulement", "Des bénévoles le samedi et des camions", "Un local plus grand"], correctIndex: 1 },
    ],
  },
  {
    id: "tcf-co-6",
    title: "Reportage : francisation des nouveaux arrivants",
    instruction: INSTR_TCF,
    script:
      "Les cours de francisation affichent complet dans la plupart des centres de la province. Les inscriptions ont augmenté de trente-cinq pour cent en un an, portées par l'arrivée de travailleurs qualifiés. Le ministère annonce l'ouverture de deux cents groupes supplémentaires et le versement d'une allocation hebdomadaire aux participants à temps plein. Les organismes communautaires réclament, eux, davantage de places en garderie, faute de quoi de nombreux parents restent sur les listes d'attente.",
    voice: "nova",
    speed: 1.02,
    questions: [
      { id: "q1", question: "Hausse des inscriptions ?", options: ["15 %", "35 %", "50 %"], correctIndex: 1 },
      { id: "q2", question: "Que fait le ministère ?", options: ["Il ferme des groupes", "Il ouvre 200 groupes et verse une allocation", "Il augmente les frais"], correctIndex: 1 },
      { id: "q3", question: "Que réclament les organismes ?", options: ["Plus de places en garderie", "Des cours en anglais", "Des examens plus faciles"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-co-7",
    title: "Chronique : consommation locale",
    instruction: INSTR_TCF,
    script:
      "Acheter local coûte-t-il plus cher ? L'étude parue cette semaine nuance l'idée reçue. Sur les fruits et légumes de saison, l'écart de prix avec les produits importés est quasi nul, voire favorable au local. En revanche, pour les produits transformés, la différence atteint dix-huit pour cent, en raison de volumes de production plus faibles. Les auteurs estiment qu'un soutien ciblé aux petites transformations réduirait cet écart en moins de cinq ans.",
    voice: "shimmer",
    speed: 1.02,
    questions: [
      { id: "q1", question: "Pour les fruits et légumes de saison ?", options: ["Le local est bien plus cher", "L'écart est quasi nul", "L'importé est introuvable"], correctIndex: 1 },
      { id: "q2", question: "Écart pour les produits transformés ?", options: ["5 %", "18 %", "30 %"], correctIndex: 1 },
      { id: "q3", question: "Cause de cet écart ?", options: ["Des volumes de production plus faibles", "Le transport", "Les taxes"], correctIndex: 0 },
      { id: "q4", question: "Solution proposée ?", options: ["Interdire l'importation", "Soutenir les petites transformations", "Augmenter les prix importés"], correctIndex: 1 },
    ],
  },
  {
    id: "tcf-co-8",
    title: "Débat : voiture électrique",
    instruction: INSTR_TCF,
    script:
      "— Subventionner la voiture électrique, c'est aider ceux qui pouvaient déjà s'acheter une voiture neuve. — Peut-être, mais il faut bien amorcer la transition, et le marché de l'occasion électrique se développe justement grâce à ces achats. — Sauf que dans les régions éloignées, sans bornes de recharge, la subvention ne change rien. — Alors conditionnons-la au déploiement du réseau de bornes plutôt que de l'abandonner.",
    voice: "echo",
    speed: 1.02,
    questions: [
      { id: "q1", question: "Critique du premier intervenant ?", options: ["La subvention profite surtout aux plus aisés", "Les voitures polluent trop", "Le prix de l'essence baisse"], correctIndex: 0 },
      { id: "q2", question: "Argument en faveur de la subvention ?", options: ["Elle nourrit le marché de l'occasion électrique", "Elle réduit les impôts", "Elle crée des usines"], correctIndex: 0 },
      { id: "q3", question: "Problème dans les régions éloignées ?", options: ["Le manque de bornes de recharge", "Le manque de garages", "Les routes"], correctIndex: 0 },
      { id: "q4", question: "Compromis proposé ?", options: ["Supprimer la subvention", "La conditionner au déploiement des bornes", "La doubler"], correctIndex: 1 },
    ],
  },
  {
    id: "tcf-co-9",
    title: "Exposé : télémédecine",
    instruction: INSTR_TCF,
    script:
      "La télémédecine s'est imposée en quelques mois là où elle peinait depuis dix ans. Les consultations à distance représentent aujourd'hui près d'un quart des rendez-vous en médecine générale. Les bénéfices sont réels pour le suivi de maladies chroniques et pour les patients éloignés des centres urbains. Mais les praticiens alertent sur les limites du diagnostic sans examen physique et sur la fracture numérique : les personnes âgées, premières concernées par le suivi, sont aussi les moins équipées.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Part des consultations à distance ?", options: ["Un dixième", "Un quart", "La moitié"], correctIndex: 1 },
      { id: "q2", question: "Pour qui est-ce particulièrement utile ?", options: ["Les patients éloignés et les maladies chroniques", "Les urgences vitales", "La chirurgie"], correctIndex: 0 },
      { id: "q3", question: "Quelle limite médicale ?", options: ["Le coût", "L'absence d'examen physique", "La durée des rendez-vous"], correctIndex: 1 },
      { id: "q4", question: "Quel paradoxe est souligné ?", options: ["Les personnes âgées sont les moins équipées", "Les jeunes refusent la télémédecine", "Les médecins manquent d'internet"], correctIndex: 0 },
    ],
  },
  {
    id: "tcf-co-10",
    title: "Analyse : bilinguisme au Canada",
    instruction: INSTR_TCF,
    script:
      "Le bilinguisme officiel reste un pilier de l'identité canadienne, mais sa pratique évolue. Hors du Québec et du Nouveau-Brunswick, la proportion de locuteurs français a légèrement reculé, alors même que les inscriptions en immersion française battent des records chez les jeunes. Cette apparente contradiction s'explique par une transmission familiale affaiblie que l'école compense partiellement. Les chercheurs plaident pour des espaces d'usage réels — culture, travail, services — sans lesquels une langue apprise reste, disent-ils, une langue scolaire.",
    voice: "alloy",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Que se passe-t-il hors Québec et Nouveau-Brunswick ?", options: ["La proportion de francophones recule légèrement", "Elle explose", "Elle reste identique"], correctIndex: 0 },
      { id: "q2", question: "Que fait l'immersion française ?", options: ["Elle disparaît", "Elle bat des records d'inscription", "Elle est interdite"], correctIndex: 1 },
      { id: "q3", question: "Explication de la contradiction ?", options: ["Une transmission familiale affaiblie", "Un manque d'enseignants", "L'immigration"], correctIndex: 0 },
      { id: "q4", question: "Que réclament les chercheurs ?", options: ["Des espaces d'usage réels de la langue", "Plus d'examens", "Moins d'heures de cours"], correctIndex: 0 },
    ],
  },
];
