/**
 * Simulacros de COMPRENSIÓN ORAL (TCF / DELF / DALF).
 * Cada tarea = un audio en francés + preguntas de opción múltiple.
 * El audio se genera on-demand con TTS vía /api/tts.
 */

export type ListeningQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hintEs?: string;
};

export type ListeningTask = {
  id: string;
  title: string;
  instruction: string;
  script: string;
  voice?: "alloy" | "nova" | "shimmer" | "echo" | "onyx" | "fable";
  speed?: number;
  questions: ListeningQuestion[];
};

export type ListeningExam = {
  id: string;
  code: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  description: string;
  tasks: ListeningTask[];
};

const INSTR_DEFAULT = "Écoutez le document et répondez aux questions.";

/* ─────────── A1 (10 tâches) ─────────── */
const A1_TASKS: ListeningTask[] = [
  {
    id: "a1-t1",
    title: "Message sur répondeur",
    instruction: INSTR_DEFAULT,
    script:
      "Bonjour, c'est Marie. Je t'appelle pour dire que je ne peux pas venir au restaurant ce soir. Je suis malade. On peut se voir demain à midi ? Rappelle-moi. Bisous.",
    voice: "nova",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Qui appelle ?", options: ["Marc", "Marie", "Mathilde"], correctIndex: 1 },
      { id: "q2", question: "Pourquoi elle ne vient pas ?", options: ["Elle travaille", "Elle est malade", "Elle est en voyage"], correctIndex: 1 },
      { id: "q3", question: "Quand veut-elle se voir ?", options: ["Demain matin", "Demain à midi", "Ce soir"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t2",
    title: "À la boulangerie",
    instruction: INSTR_DEFAULT,
    script:
      "— Bonjour madame, je voudrais une baguette et deux croissants, s'il vous plaît. — Voilà. Ça fait quatre euros cinquante. — Voici cinq euros. — Merci, et cinquante centimes de retour. Bonne journée !",
    voice: "shimmer",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Qu'est-ce que le client achète ?", options: ["Une baguette et un croissant", "Une baguette et deux croissants", "Deux baguettes"], correctIndex: 1 },
      { id: "q2", question: "Combien ça coûte ?", options: ["4,50 €", "5,00 €", "5,50 €"], correctIndex: 0 },
    ],
  },
  {
    id: "a1-t3",
    title: "Se présenter",
    instruction: INSTR_DEFAULT,
    script:
      "Bonjour ! Je m'appelle Paul. J'ai vingt-cinq ans. Je suis français, j'habite à Toulouse. Je suis étudiant en informatique. J'aime le football et la musique.",
    voice: "onyx",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Comment s'appelle-t-il ?", options: ["Pierre", "Paul", "Patrick"], correctIndex: 1 },
      { id: "q2", question: "Où habite-t-il ?", options: ["Paris", "Toulouse", "Lyon"], correctIndex: 1 },
      { id: "q3", question: "Qu'est-ce qu'il étudie ?", options: ["Les langues", "L'informatique", "La médecine"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t4",
    title: "Au café",
    instruction: INSTR_DEFAULT,
    script:
      "— Bonjour, vous désirez ? — Un café et un jus d'orange, s'il vous plaît. — Ce sera tout ? — Oui, merci. — Ça fait six euros.",
    voice: "shimmer",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Que commande le client ?", options: ["Un thé et un café", "Un café et un jus d'orange", "Un chocolat"], correctIndex: 1 },
      { id: "q2", question: "Combien ça coûte ?", options: ["4 €", "5 €", "6 €"], correctIndex: 2 },
    ],
  },
  {
    id: "a1-t5",
    title: "L'heure du rendez-vous",
    instruction: INSTR_DEFAULT,
    script:
      "Allô Julie, c'est Thomas. Notre rendez-vous chez le dentiste est mardi à dix heures et quart. N'oublie pas ! À demain.",
    voice: "onyx",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Quel jour est le rendez-vous ?", options: ["Lundi", "Mardi", "Mercredi"], correctIndex: 1 },
      { id: "q2", question: "À quelle heure ?", options: ["10h00", "10h15", "10h30"], correctIndex: 1 },
      { id: "q3", question: "Chez qui ?", options: ["Le médecin", "Le dentiste", "Le coiffeur"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t6",
    title: "La météo",
    instruction: INSTR_DEFAULT,
    script:
      "Aujourd'hui à Paris, il fait froid et il pleut. La température est de huit degrés. Demain, il fera beau avec quinze degrés.",
    voice: "nova",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Quel temps fait-il aujourd'hui ?", options: ["Il fait beau", "Il fait froid et il pleut", "Il neige"], correctIndex: 1 },
      { id: "q2", question: "Quelle température demain ?", options: ["8 degrés", "15 degrés", "20 degrés"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t7",
    title: "Demander son chemin",
    instruction: INSTR_DEFAULT,
    script:
      "— Excusez-moi, où est la pharmacie ? — Vous allez tout droit, puis vous tournez à gauche. Elle est à côté de la boulangerie. — Merci beaucoup !",
    voice: "shimmer",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Que cherche la personne ?", options: ["La boulangerie", "La pharmacie", "La poste"], correctIndex: 1 },
      { id: "q2", question: "Où faut-il tourner ?", options: ["À droite", "À gauche", "Tout droit"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t8",
    title: "Ma famille",
    instruction: INSTR_DEFAULT,
    script:
      "J'ai une petite famille. Mon père s'appelle Jean, ma mère s'appelle Sophie. J'ai une sœur, Léa, qui a douze ans. Nous avons un chat noir.",
    voice: "nova",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Combien de sœurs a-t-il/elle ?", options: ["Une", "Deux", "Trois"], correctIndex: 0 },
      { id: "q2", question: "Quel âge a Léa ?", options: ["10 ans", "12 ans", "15 ans"], correctIndex: 1 },
      { id: "q3", question: "Quel animal ?", options: ["Un chien", "Un chat", "Un lapin"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t9",
    title: "À l'hôtel",
    instruction: INSTR_DEFAULT,
    script:
      "— Bonjour, j'ai une réservation au nom de Dupont. — Oui, une chambre double pour trois nuits. Voici votre clé, chambre numéro 205, au deuxième étage. Le petit-déjeuner est servi de sept à dix heures.",
    voice: "onyx",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Combien de nuits ?", options: ["Deux", "Trois", "Quatre"], correctIndex: 1 },
      { id: "q2", question: "Quel est le numéro de chambre ?", options: ["105", "205", "502"], correctIndex: 1 },
      { id: "q3", question: "Quand est le petit-déjeuner ?", options: ["6h-9h", "7h-10h", "8h-11h"], correctIndex: 1 },
    ],
  },
  {
    id: "a1-t10",
    title: "Invitation",
    instruction: INSTR_DEFAULT,
    script:
      "Salut Léo ! C'est mon anniversaire samedi. Je fais une petite fête chez moi à partir de vingt heures. Tu viens ? Réponds-moi vite !",
    voice: "shimmer",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Quelle est l'occasion ?", options: ["Un mariage", "Un anniversaire", "Un dîner"], correctIndex: 1 },
      { id: "q2", question: "Quel jour ?", options: ["Vendredi", "Samedi", "Dimanche"], correctIndex: 1 },
      { id: "q3", question: "À quelle heure ?", options: ["18h", "19h", "20h"], correctIndex: 2 },
    ],
  },
];

/* ─────────── A2 (10 tâches) ─────────── */
const A2_TASKS: ListeningTask[] = [
  {
    id: "a2-t1",
    title: "Annonce en gare",
    instruction: INSTR_DEFAULT,
    script:
      "Mesdames et messieurs, votre attention s'il vous plaît. Le train numéro huit mille cinq cent trente-deux à destination de Lyon Part-Dieu, prévu à quatorze heures vingt, partira avec un retard de quinze minutes. Nous vous prions de nous excuser pour la gêne occasionnée.",
    voice: "onyx",
    speed: 0.95,
    questions: [
      { id: "q1", question: "Où va le train ?", options: ["Paris", "Lyon", "Marseille"], correctIndex: 1 },
      { id: "q2", question: "Quel est le problème ?", options: ["Le train est annulé", "Le train a 15 minutes de retard", "Le train a changé de quai"], correctIndex: 1 },
      { id: "q3", question: "À quelle heure devait partir le train ?", options: ["14h20", "14h15", "15h20"], correctIndex: 0 },
    ],
  },
  {
    id: "a2-t2",
    title: "Message à un ami",
    instruction: INSTR_DEFAULT,
    script:
      "Salut Antoine ! Je t'appelle pour organiser le week-end. Samedi matin on peut aller au marché, puis déjeuner au restaurant italien de la place. L'après-midi, ça te dit d'aller au cinéma ? Il y a un nouveau film français. Rappelle-moi ce soir.",
    voice: "nova",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Quand veut-il aller au marché ?", options: ["Samedi matin", "Samedi après-midi", "Dimanche matin"], correctIndex: 0 },
      { id: "q2", question: "Où va-t-il déjeuner ?", options: ["Chez lui", "Au restaurant italien", "Dans un café"], correctIndex: 1 },
      { id: "q3", question: "Que propose-t-il l'après-midi ?", options: ["Le cinéma", "Le théâtre", "Un concert"], correctIndex: 0 },
    ],
  },
  {
    id: "a2-t3",
    title: "Chez le médecin",
    instruction: INSTR_DEFAULT,
    script:
      "— Bonjour docteur, j'ai mal à la tête depuis trois jours et je suis très fatiguée. — Avez-vous de la fièvre ? — Un peu, oui, trente-huit degrés ce matin. — Je vais vous prescrire des médicaments. Reposez-vous et buvez beaucoup d'eau.",
    voice: "shimmer",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Depuis combien de temps a-t-elle mal ?", options: ["Un jour", "Trois jours", "Une semaine"], correctIndex: 1 },
      { id: "q2", question: "Quelle est sa température ?", options: ["37°C", "38°C", "39°C"], correctIndex: 1 },
      { id: "q3", question: "Que conseille le médecin ?", options: ["Faire du sport", "Se reposer et boire de l'eau", "Aller à l'hôpital"], correctIndex: 1 },
    ],
  },
  {
    id: "a2-t4",
    title: "Publicité — supermarché",
    instruction: INSTR_DEFAULT,
    script:
      "Cette semaine chez Superprix, profitez de nos promotions ! Fruits et légumes à moins trente pour cent, un poulet acheté, un offert, et sur toute la papeterie, moins vingt pour cent. Offres valables jusqu'à dimanche.",
    voice: "onyx",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Quelle réduction sur les fruits ?", options: ["-20%", "-30%", "-50%"], correctIndex: 1 },
      { id: "q2", question: "Que propose-t-on sur le poulet ?", options: ["Un acheté = un offert", "-50%", "Rien"], correctIndex: 0 },
      { id: "q3", question: "Jusqu'à quand ?", options: ["Vendredi", "Samedi", "Dimanche"], correctIndex: 2 },
    ],
  },
  {
    id: "a2-t5",
    title: "Réserver un billet",
    instruction: INSTR_DEFAULT,
    script:
      "— Bonjour, je voudrais un billet pour Bordeaux samedi matin. — Il y a un TGV à huit heures dix. — Parfait. En seconde classe. — Ça fait soixante-douze euros. Voici votre billet.",
    voice: "shimmer",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Destination ?", options: ["Bordeaux", "Toulouse", "Nantes"], correctIndex: 0 },
      { id: "q2", question: "Heure du train ?", options: ["8h10", "8h50", "9h10"], correctIndex: 0 },
      { id: "q3", question: "Prix du billet ?", options: ["62 €", "72 €", "82 €"], correctIndex: 1 },
    ],
  },
  {
    id: "a2-t6",
    title: "Météo du week-end",
    instruction: INSTR_DEFAULT,
    script:
      "Ce week-end, le temps sera très variable. Samedi, un ciel nuageux au nord avec quelques averses, et du soleil au sud. Dimanche, retour du beau temps partout avec des températures autour de vingt-deux degrés.",
    voice: "nova",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Quel temps samedi au nord ?", options: ["Ensoleillé", "Nuageux avec averses", "Neige"], correctIndex: 1 },
      { id: "q2", question: "Et dimanche ?", options: ["Pluvieux", "Beau temps partout", "Orageux"], correctIndex: 1 },
      { id: "q3", question: "Températures dimanche ?", options: ["Environ 15°C", "Environ 22°C", "Environ 30°C"], correctIndex: 1 },
    ],
  },
  {
    id: "a2-t7",
    title: "Voyage scolaire",
    instruction: INSTR_DEFAULT,
    script:
      "Chers parents, la classe de sixième B partira en voyage scolaire à Strasbourg du lundi quinze au vendredi dix-neuf mai. Le prix est de deux cent vingt euros, transport et hébergement inclus. Merci de rendre l'autorisation avant le trente avril.",
    voice: "onyx",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Où vont-ils ?", options: ["Paris", "Strasbourg", "Marseille"], correctIndex: 1 },
      { id: "q2", question: "Prix du voyage ?", options: ["120 €", "220 €", "320 €"], correctIndex: 1 },
      { id: "q3", question: "Date limite de l'autorisation ?", options: ["15 avril", "30 avril", "15 mai"], correctIndex: 1 },
    ],
  },
  {
    id: "a2-t8",
    title: "Location d'appartement",
    instruction: INSTR_DEFAULT,
    script:
      "— Allô, je vous appelle pour l'appartement à louer. — Oui, c'est un deux-pièces meublé, quarante mètres carrés, au troisième étage avec ascenseur. Le loyer est de six cent cinquante euros charges comprises. Il est libre à partir du premier juin.",
    voice: "shimmer",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Type d'appartement ?", options: ["Studio", "Deux-pièces meublé", "Trois-pièces"], correctIndex: 1 },
      { id: "q2", question: "À quel étage ?", options: ["1er", "2e", "3e"], correctIndex: 2 },
      { id: "q3", question: "Loyer ?", options: ["550 € CC", "650 € CC", "750 € CC"], correctIndex: 1 },
    ],
  },
  {
    id: "a2-t9",
    title: "Interview courte — un chef",
    instruction: INSTR_DEFAULT,
    script:
      "— Chef, pourquoi avez-vous choisi ce métier ? — Depuis l'enfance, j'aidais ma grand-mère à cuisiner. J'ai su très tôt que je voulais en faire mon métier. J'ai commencé comme apprenti à seize ans et j'ai ouvert mon restaurant à trente ans.",
    voice: "onyx",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Qui l'a inspiré ?", options: ["Sa mère", "Sa grand-mère", "Un ami chef"], correctIndex: 1 },
      { id: "q2", question: "À quel âge est-il devenu apprenti ?", options: ["14 ans", "16 ans", "18 ans"], correctIndex: 1 },
      { id: "q3", question: "À quel âge a-t-il ouvert son restaurant ?", options: ["25 ans", "30 ans", "35 ans"], correctIndex: 1 },
    ],
  },
  {
    id: "a2-t10",
    title: "Perdu au musée",
    instruction: INSTR_DEFAULT,
    script:
      "Attention s'il vous plaît. Un enfant de six ans, prénommé Lucas, cheveux bruns et blouson rouge, a été retrouvé au deuxième étage. Nous demandons à ses parents de venir le chercher à l'accueil principal.",
    voice: "nova",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Quel âge a l'enfant ?", options: ["4 ans", "6 ans", "8 ans"], correctIndex: 1 },
      { id: "q2", question: "Couleur du blouson ?", options: ["Bleu", "Rouge", "Vert"], correctIndex: 1 },
      { id: "q3", question: "Où doivent aller les parents ?", options: ["Au deuxième étage", "À la sortie", "À l'accueil principal"], correctIndex: 2 },
    ],
  },
];

/* ─────────── B1 (10 tâches) ─────────── */
const B1_TASKS: ListeningTask[] = [
  {
    id: "b1-t1",
    title: "Interview radio — bénévolat",
    instruction: INSTR_DEFAULT,
    script:
      "— Bonjour Camille, vous êtes bénévole dans une association qui aide les personnes âgées. Pouvez-vous nous expliquer ce que vous faites ? — Oui, bien sûr. Deux fois par semaine, je rends visite à des personnes seules dans mon quartier. On discute, on prend un café, parfois je les aide à faire leurs courses ou à remplir des papiers administratifs. — Et qu'est-ce qui vous a motivée à commencer ? — Après mes études, j'avais du temps libre et je voulais faire quelque chose d'utile. Le contact humain me manquait aussi.",
    voice: "shimmer",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Combien de fois par semaine visite-t-elle ?", options: ["Une fois", "Deux fois", "Trois fois"], correctIndex: 1 },
      { id: "q2", question: "Que fait-elle avec les personnes ?", options: ["Seulement discuter", "Discuter, café et aider aux courses", "Faire le ménage"], correctIndex: 1 },
      { id: "q3", question: "Pourquoi a-t-elle commencé ?", options: ["Pour l'argent", "Pour son travail", "Temps libre et vouloir être utile"], correctIndex: 2 },
    ],
  },
  {
    id: "b1-t2",
    title: "Bulletin — transports",
    instruction: INSTR_DEFAULT,
    script:
      "En raison d'une grève des conducteurs, le trafic sur la ligne 4 du métro sera fortement perturbé toute la journée. Un train sur trois circulera aux heures de pointe. La RATP recommande aux usagers de privilégier les lignes 6 et 12, ou d'utiliser le vélo en libre-service.",
    voice: "onyx",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Quelle ligne est perturbée ?", options: ["Ligne 2", "Ligne 4", "Ligne 6"], correctIndex: 1 },
      { id: "q2", question: "Pourquoi ?", options: ["Un accident", "Des travaux", "Une grève des conducteurs"], correctIndex: 2 },
      { id: "q3", question: "Que recommande la RATP ?", options: ["Rester chez soi", "Prendre les lignes 6 et 12 ou le vélo", "Prendre le taxi"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t3",
    title: "Témoignage — étudiant Erasmus",
    instruction: INSTR_DEFAULT,
    script:
      "Je m'appelle Marco, je suis italien et j'ai fait mon Erasmus à Lyon pendant six mois. Au début, c'était difficile : la langue, les cours, trouver un logement... Mais très vite, j'ai rencontré des étudiants de toute l'Europe. Aujourd'hui, mon français est fluide et j'ai des amis partout. Je recommande cette expérience à tout le monde.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "D'où vient Marco ?", options: ["Espagne", "Italie", "Portugal"], correctIndex: 1 },
      { id: "q2", question: "Durée du séjour ?", options: ["3 mois", "6 mois", "1 an"], correctIndex: 1 },
      { id: "q3", question: "Quelles difficultés au début ?", options: ["Le climat", "La langue, les cours, le logement", "La nourriture"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t4",
    title: "Reportage — marchés bio",
    instruction: INSTR_DEFAULT,
    script:
      "Les marchés bio séduisent de plus en plus de familles françaises. Selon une étude récente, quarante-cinq pour cent des Français consomment des produits biologiques au moins une fois par semaine. Les raisons invoquées : la santé, le goût et le respect de l'environnement. Cependant, le prix reste un frein important pour beaucoup de foyers.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Quel pourcentage consomme bio chaque semaine ?", options: ["25%", "45%", "65%"], correctIndex: 1 },
      { id: "q2", question: "Raisons principales ?", options: ["Prix bas", "Santé, goût, environnement", "Publicité"], correctIndex: 1 },
      { id: "q3", question: "Quel est le frein principal ?", options: ["Le goût", "Le prix", "La disponibilité"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t5",
    title: "Conversation — projet vacances",
    instruction: INSTR_DEFAULT,
    script:
      "— Alors, tu pars où cet été ? — On hésite entre la Corse et le Portugal. Ma femme préfère la mer, moi je préférerais visiter des villes. — Pourquoi pas les deux ? Lisbonne est près de la mer. — C'est vrai, tu as raison. On va y réfléchir.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Entre quelles destinations hésitent-ils ?", options: ["Corse et Portugal", "Espagne et Italie", "France et Grèce"], correctIndex: 0 },
      { id: "q2", question: "Que préfère la femme ?", options: ["La montagne", "La mer", "Les villes"], correctIndex: 1 },
      { id: "q3", question: "Quelle solution propose l'ami ?", options: ["Rester en France", "Aller à Lisbonne (ville + mer)", "Partir en croisière"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t6",
    title: "Publicité — cours du soir",
    instruction: INSTR_DEFAULT,
    script:
      "Vous voulez apprendre une nouvelle langue ? L'école Polyglotte ouvre ses inscriptions ! Cours d'anglais, espagnol, allemand et chinois, en petits groupes de huit personnes maximum. Deux heures par semaine, le soir ou le samedi. Premier cours d'essai gratuit. Inscrivez-vous avant le quinze septembre.",
    voice: "nova",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Combien de personnes par groupe ?", options: ["5", "8", "12"], correctIndex: 1 },
      { id: "q2", question: "Quand ont lieu les cours ?", options: ["Le matin", "Le soir ou samedi", "Le dimanche"], correctIndex: 1 },
      { id: "q3", question: "Que propose-t-on ?", options: ["Un cours d'essai gratuit", "Une réduction de 50%", "Un livre offert"], correctIndex: 0 },
    ],
  },
  {
    id: "b1-t7",
    title: "Interview — sportif amateur",
    instruction: INSTR_DEFAULT,
    script:
      "— Julien, vous courez le marathon dimanche. Comment vous êtes-vous préparé ? — J'ai suivi un plan d'entraînement pendant quatre mois : trois sorties par semaine, plus une longue le dimanche. J'ai aussi fait attention à mon alimentation et à mon sommeil. — Quel est votre objectif ? — Terminer en moins de trois heures et trente minutes.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Combien de mois de préparation ?", options: ["2", "4", "6"], correctIndex: 1 },
      { id: "q2", question: "Combien de sorties par semaine ?", options: ["2", "3", "4"], correctIndex: 1 },
      { id: "q3", question: "Quel est son objectif ?", options: ["Moins de 3h", "Moins de 3h30", "Moins de 4h"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t8",
    title: "Reportage — colocation",
    instruction: INSTR_DEFAULT,
    script:
      "De plus en plus de jeunes actifs choisissent la colocation, même après trente ans. Les raisons sont d'abord économiques : dans les grandes villes, un loyer peut représenter la moitié du salaire. Mais c'est aussi un choix de vie : partager les tâches, éviter la solitude, rencontrer de nouvelles personnes.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Quel public choisit la colocation ?", options: ["Seulement les étudiants", "Les jeunes actifs, même après 30 ans", "Les retraités"], correctIndex: 1 },
      { id: "q2", question: "Raison économique ?", options: ["Loyer = moitié du salaire", "Loyer trop bas", "Prix des courses"], correctIndex: 0 },
      { id: "q3", question: "Autres avantages ?", options: ["Aucun", "Partager les tâches, éviter la solitude", "Voyager"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t9",
    title: "Message au travail",
    instruction: INSTR_DEFAULT,
    script:
      "Bonjour à tous, la réunion de service prévue jeudi à quatorze heures est reportée à vendredi neuf heures, salle B. Merci de préparer un court résumé de vos projets en cours et d'envoyer vos questions par mail avant jeudi soir.",
    voice: "nova",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Nouveau jour de la réunion ?", options: ["Jeudi", "Vendredi", "Lundi"], correctIndex: 1 },
      { id: "q2", question: "Nouvelle heure ?", options: ["9h", "14h", "16h"], correctIndex: 0 },
      { id: "q3", question: "Que faut-il envoyer avant ?", options: ["Un rapport complet", "Ses questions par mail", "Un CV"], correctIndex: 1 },
    ],
  },
  {
    id: "b1-t10",
    title: "Chronique — bien-être",
    instruction: INSTR_DEFAULT,
    script:
      "Pour mieux dormir, les spécialistes recommandent plusieurs habitudes simples : se coucher à heure régulière, éviter les écrans une heure avant, ne pas boire de café après quinze heures, et pratiquer une activité physique dans la journée. Un bon sommeil, c'est la clé d'une meilleure concentration au travail.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Que faut-il éviter avant de dormir ?", options: ["La lecture", "Les écrans", "La musique"], correctIndex: 1 },
      { id: "q2", question: "Jusqu'à quelle heure boire du café ?", options: ["12h", "15h", "18h"], correctIndex: 1 },
      { id: "q3", question: "Bénéfice principal cité ?", options: ["Perdre du poids", "Meilleure concentration au travail", "Plus d'énergie sportive"], correctIndex: 1 },
    ],
  },
];

/* ─────────── B2 (10 tâches) ─────────── */
const B2_TASKS: ListeningTask[] = [
  {
    id: "b2-t1",
    title: "Reportage — télétravail",
    instruction: INSTR_DEFAULT,
    script:
      "Le télétravail s'est massivement développé depuis la pandémie et transforme profondément le monde du travail. Selon une récente étude de l'INSEE, près de 40% des salariés français bénéficient aujourd'hui d'au moins un jour de télétravail par semaine, contre seulement 7% avant 2020. Si les employés apprécient la flexibilité et l'économie de temps de transport, les employeurs, eux, s'inquiètent d'une possible baisse de la cohésion d'équipe et d'une communication moins fluide. Certaines entreprises reviennent d'ailleurs à un modèle hybride, imposant deux ou trois jours de présence obligatoire au bureau.",
    voice: "onyx",
    speed: 1.0,
    questions: [
      { id: "q1", question: "% de salariés en télétravail aujourd'hui ?", options: ["7%", "environ 40%", "près de 70%"], correctIndex: 1 },
      { id: "q2", question: "Ce qu'apprécient les employés ?", options: ["Un meilleur salaire", "La flexibilité et l'économie de transport", "Plus de responsabilités"], correctIndex: 1 },
      { id: "q3", question: "Inquiétude des employeurs ?", options: ["Le coût du matériel", "Baisse de cohésion et communication", "Le respect des horaires"], correctIndex: 1 },
      { id: "q4", question: "Réaction de certaines entreprises ?", options: ["Suppression du télétravail", "100% à distance", "Modèle hybride obligatoire"], correctIndex: 2 },
    ],
  },
  {
    id: "b2-t2",
    title: "Débat — voitures électriques",
    instruction: INSTR_DEFAULT,
    script:
      "Les voitures électriques sont présentées comme la solution miracle face au dérèglement climatique. Pourtant, leur bilan écologique reste discuté. La fabrication des batteries nécessite des métaux rares dont l'extraction est polluante et souvent réalisée dans des conditions sociales préoccupantes. De plus, l'électricité utilisée n'est pas partout décarbonée. Néanmoins, sur la durée de vie du véhicule, l'impact reste globalement inférieur à celui d'une voiture thermique, notamment en Europe.",
    voice: "shimmer",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Quel problème lié aux batteries ?", options: ["Elles sont trop lourdes", "Extraction polluante de métaux rares", "Elles durent peu"], correctIndex: 1 },
      { id: "q2", question: "L'électricité utilisée est-elle propre partout ?", options: ["Oui, partout", "Non, pas partout", "On ne sait pas"], correctIndex: 1 },
      { id: "q3", question: "Bilan global en Europe ?", options: ["Pire que le thermique", "Équivalent", "Globalement meilleur"], correctIndex: 2 },
    ],
  },
  {
    id: "b2-t3",
    title: "Chronique — livre",
    instruction: INSTR_DEFAULT,
    script:
      "Le nouveau roman de Léa Marchand, « Les Silences du fleuve », séduit la critique. L'auteure y explore la relation entre une mère et sa fille, séparées par vingt ans de non-dits. L'écriture est sobre, presque minimaliste, mais chaque phrase résonne. Certains lui reprochent une intrigue trop lente ; d'autres y voient précisément la force du livre : une lenteur qui laisse le temps aux émotions.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Thème central du roman ?", options: ["Une histoire d'amour", "Relation mère-fille marquée par les non-dits", "Une enquête policière"], correctIndex: 1 },
      { id: "q2", question: "Comment est décrite l'écriture ?", options: ["Baroque", "Sobre, minimaliste", "Humoristique"], correctIndex: 1 },
      { id: "q3", question: "Reproche fait au livre ?", options: ["Trop court", "Intrigue trop lente", "Trop de personnages"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t4",
    title: "Interview — nutritionniste",
    instruction: INSTR_DEFAULT,
    script:
      "— Les régimes à la mode sont-ils efficaces ? — Franchement, non. Les études montrent que 80% des personnes reprennent le poids perdu dans les deux ans. Le problème, c'est qu'un régime restrictif n'est pas tenable sur le long terme. Ce qui fonctionne, c'est un changement progressif d'habitudes : plus de légumes, moins de produits ultra-transformés, une activité physique régulière. Pas de miracle, mais des résultats durables.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Combien reprennent le poids ?", options: ["30%", "50%", "80%"], correctIndex: 2 },
      { id: "q2", question: "Pourquoi les régimes échouent ?", options: ["Ils sont trop chers", "Restrictifs, non tenables", "Trop médiatisés"], correctIndex: 1 },
      { id: "q3", question: "Que recommande-t-elle ?", options: ["Un régime strict", "Changement progressif d'habitudes", "Rien du tout"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t5",
    title: "Reportage — logement étudiant",
    instruction: INSTR_DEFAULT,
    script:
      "La crise du logement étudiant s'aggrave d'année en année. Dans les grandes villes universitaires, trouver une chambre à moins de six cents euros relève du parcours du combattant. Les CROUS ne peuvent loger qu'un étudiant sur dix, et le parc privé explose. Résultat : de plus en plus de jeunes renoncent à leur université de premier choix, ou vivent chez leurs parents pendant leurs études.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Loyer difficile à trouver en dessous de ?", options: ["400 €", "600 €", "800 €"], correctIndex: 1 },
      { id: "q2", question: "Part des étudiants logés au CROUS ?", options: ["1 sur 10", "1 sur 3", "1 sur 2"], correctIndex: 0 },
      { id: "q3", question: "Conséquence pour les jeunes ?", options: ["Rien ne change", "Renoncer à leur université ou rester chez leurs parents", "Partir à l'étranger"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t6",
    title: "Débat — semaine de 4 jours",
    instruction: INSTR_DEFAULT,
    script:
      "L'expérimentation de la semaine de quatre jours suscite un intérêt croissant. Les entreprises qui l'ont testée rapportent souvent une hausse de la productivité et une nette amélioration du bien-être des salariés. Cependant, tous les métiers ne s'y prêtent pas : dans le commerce, la santé ou l'hôtellerie, la question de la continuité du service reste entière. Le débat oppose donc les partisans d'une révolution du temps de travail aux tenants d'une organisation plus classique.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Effets rapportés ?", options: ["Baisse de productivité", "Hausse de productivité et bien-être", "Aucun changement"], correctIndex: 1 },
      { id: "q2", question: "Secteurs difficiles ?", options: ["Bureau/IT", "Commerce, santé, hôtellerie", "Recherche"], correctIndex: 1 },
      { id: "q3", question: "Ton du débat ?", options: ["Consensus général", "Partisans vs tenants du classique", "Rejet total"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t7",
    title: "Interview — architecte",
    instruction: INSTR_DEFAULT,
    script:
      "— Comment construire des villes plus durables ? — Il faut penser autrement. Densifier plutôt qu'étaler, végétaliser massivement, favoriser la mixité des usages dans un même quartier : logements, commerces, bureaux, écoles. Il faut aussi rénover l'existant plutôt que de démolir systématiquement. Le bâtiment le plus écologique, c'est celui qu'on n'a pas construit.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Principe proposé ?", options: ["Étaler la ville", "Densifier et végétaliser", "Détruire l'ancien"], correctIndex: 1 },
      { id: "q2", question: "Mixité des usages signifie ?", options: ["Un seul type de bâtiment", "Logements, commerces, bureaux, écoles ensemble", "Uniquement des logements"], correctIndex: 1 },
      { id: "q3", question: "Formule clé ?", options: ["Le plus haut est le mieux", "Le bâtiment le plus écologique est celui qu'on n'a pas construit", "Détruire pour reconstruire"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t8",
    title: "Chronique — réseaux sociaux",
    instruction: INSTR_DEFAULT,
    script:
      "Les réseaux sociaux transforment notre rapport à l'information. En quelques années, des plateformes comme TikTok sont devenues, pour les moins de vingt-cinq ans, une source d'actualité au même titre que la télévision. Mais cette évolution pose problème : les algorithmes valorisent l'émotion plus que la vérification des faits, et la brièveté des contenus laisse peu de place à la nuance. Les journalistes doivent réinventer leur métier pour rester crédibles auprès de ces nouveaux publics.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Quel public utilise TikTok pour l'actualité ?", options: ["Les seniors", "Les moins de 25 ans", "Personne"], correctIndex: 1 },
      { id: "q2", question: "Problème des algorithmes ?", options: ["Trop de textes longs", "Émotion valorisée sur la vérification", "Pas assez de vidéos"], correctIndex: 1 },
      { id: "q3", question: "Que doivent faire les journalistes ?", options: ["Ignorer ces plateformes", "Réinventer leur métier", "Réclamer une interdiction"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t9",
    title: "Reportage — tourisme responsable",
    instruction: INSTR_DEFAULT,
    script:
      "Le tourisme de masse commence à montrer ses limites. Venise, Barcelone ou Kyoto peinent à absorber les flux de visiteurs et cherchent à limiter les arrivées. En parallèle, une nouvelle génération de voyageurs se tourne vers un tourisme plus lent : séjours plus longs, moins de destinations, contact réel avec les habitants. Ce « slow tourism » ne représente encore qu'une minorité, mais il grandit rapidement.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Villes citées comme saturées ?", options: ["Paris, Londres, Rome", "Venise, Barcelone, Kyoto", "New York, Berlin, Tokyo"], correctIndex: 1 },
      { id: "q2", question: "Que fait le slow tourism ?", options: ["Multiplie les destinations", "Privilégie séjours longs, contact local", "Voyages rapides et intensifs"], correctIndex: 1 },
      { id: "q3", question: "Sa place actuelle ?", options: ["Majoritaire", "Minoritaire mais en croissance", "En déclin"], correctIndex: 1 },
    ],
  },
  {
    id: "b2-t10",
    title: "Interview — start-up verte",
    instruction: INSTR_DEFAULT,
    script:
      "Notre start-up développe des emballages alimentaires à base d'algues, entièrement compostables en moins de trente jours. L'objectif est clair : remplacer une partie du plastique à usage unique. Nous travaillons déjà avec plusieurs enseignes de restauration rapide en France. Notre défi principal reste le coût : notre produit est encore 30% plus cher que le plastique classique, mais nous visons la parité d'ici trois ans grâce à la montée en volume.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Matériau utilisé ?", options: ["Bois", "Algues", "Papier recyclé"], correctIndex: 1 },
      { id: "q2", question: "Temps de compostage ?", options: ["Moins de 30 jours", "6 mois", "1 an"], correctIndex: 0 },
      { id: "q3", question: "Défi principal ?", options: ["Le goût", "Le coût 30% plus élevé", "La disponibilité des algues"], correctIndex: 1 },
    ],
  },
];

/* ─────────── C1 (10 tâches) ─────────── */
const C1_TASKS: ListeningTask[] = [
  {
    id: "c1-t1",
    title: "Conférence — intelligence artificielle",
    instruction: INSTR_DEFAULT,
    script:
      "L'intelligence artificielle générative bouleverse aujourd'hui de nombreux secteurs, mais elle soulève également des questions éthiques fondamentales. D'un côté, ces technologies promettent d'augmenter considérablement la productivité, d'accélérer la recherche scientifique et de démocratiser l'accès à l'expertise. De l'autre, elles interrogent notre rapport à la vérité, puisqu'elles peuvent produire des contenus faux d'une extrême vraisemblance, et menacent potentiellement des millions d'emplois qualifiés. La véritable question n'est donc plus de savoir si nous devons utiliser ces outils, mais comment encadrer leur usage sans étouffer l'innovation. L'Union européenne a proposé un cadre réglementaire ambitieux, l'AI Act, qui classe les usages selon leur niveau de risque.",
    voice: "onyx",
    speed: 1.0,
    questions: [
      { id: "q1", question: "Véritable question posée ?", options: ["Faut-il interdire l'IA ?", "Comment encadrer sans étouffer l'innovation", "Qui doit financer la recherche"], correctIndex: 1 },
      { id: "q2", question: "Risques mentionnés ?", options: ["Uniquement économiques", "Contenus faux crédibles + emplois qualifiés", "Aucun"], correctIndex: 1 },
      { id: "q3", question: "Que fait l'UE ?", options: ["Interdit l'IA", "Propose l'AI Act par niveau de risque", "Pas de position"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t2",
    title: "Débat — universités",
    instruction: INSTR_DEFAULT,
    script:
      "La question de la sélection à l'université revient périodiquement dans le débat public français. Les partisans y voient un moyen de lutter contre l'échec massif en première année et d'orienter les étudiants vers des filières adaptées à leur profil. Les opposants dénoncent une logique de tri social qui pénaliserait les élèves issus de milieux modestes, déjà désavantagés par un système scolaire inégalitaire. Entre ces deux positions, plusieurs voix appellent à une réforme plus globale du lycée et de l'orientation, en amont même de l'entrée dans le supérieur.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Argument des partisans ?", options: ["Réduire les coûts", "Lutter contre l'échec en L1 et mieux orienter", "Attirer les étrangers"], correctIndex: 1 },
      { id: "q2", question: "Argument des opposants ?", options: ["Coût trop élevé", "Tri social pénalisant les milieux modestes", "Baisse de niveau"], correctIndex: 1 },
      { id: "q3", question: "Position intermédiaire ?", options: ["Réformer plus globalement lycée et orientation", "Fermer les universités", "Généraliser les concours"], correctIndex: 0 },
    ],
  },
  {
    id: "c1-t3",
    title: "Conférence — biodiversité",
    instruction: INSTR_DEFAULT,
    script:
      "L'effondrement de la biodiversité constitue, avec le climat, l'une des deux grandes crises environnementales de notre époque, souvent moins médiatisée que la seconde. Or, la disparition rapide des insectes pollinisateurs, la déforestation tropicale ou l'acidification des océans menacent directement les services écosystémiques dont dépendent nos économies. Contrairement à une idée reçue, il ne s'agit pas seulement d'un enjeu esthétique ou moral : la sécurité alimentaire, la santé publique et même la stabilité géopolitique sont en jeu.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Rang de la crise biodiversité ?", options: ["Mineure", "Une des deux grandes, moins médiatisée", "La plus médiatisée"], correctIndex: 1 },
      { id: "q2", question: "Exemples de menaces ?", options: ["Uniquement les forêts", "Pollinisateurs, déforestation, acidification océans", "Rien de précis"], correctIndex: 1 },
      { id: "q3", question: "Enjeux réels ?", options: ["Seulement esthétiques", "Sécurité alimentaire, santé, géopolitique", "Uniquement touristiques"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t4",
    title: "Analyse — cinéma français",
    instruction: INSTR_DEFAULT,
    script:
      "Le cinéma français traverse une période paradoxale. Jamais autant de films n'ont été produits — près de trois cents longs métrages par an — mais la fréquentation en salle reste inférieure à celle d'avant la pandémie. Les plateformes captent une partie du public, tandis que les grosses productions américaines écrasent les box-offices. Pour autant, le modèle français, soutenu par un système d'aides original, continue de nourrir une diversité créative que beaucoup de pays nous envient.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Production annuelle française ?", options: ["Environ 100 films", "Près de 300 longs métrages", "Plus de 500"], correctIndex: 1 },
      { id: "q2", question: "Situation en salle ?", options: ["Meilleure qu'avant", "Inférieure à l'avant-pandémie", "Identique"], correctIndex: 1 },
      { id: "q3", question: "Force du modèle français ?", options: ["Sa langue", "Un système d'aides et une diversité créative", "Ses acteurs"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t5",
    title: "Table ronde — santé mentale au travail",
    instruction: INSTR_DEFAULT,
    script:
      "Longtemps taboue, la santé mentale au travail s'impose enfin comme un enjeu de gestion à part entière. Les entreprises prennent conscience du coût considérable du burn-out et du bore-out, aussi bien humain qu'économique. Toutefois, les dispositifs mis en place — cellules d'écoute, ateliers de bien-être — restent souvent superficiels. Les experts appellent à s'attaquer aux causes structurelles : surcharge chronique, management vertical, absence de sens dans les missions.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Comment était perçu le sujet auparavant ?", options: ["Prioritaire", "Tabou", "Résolu"], correctIndex: 1 },
      { id: "q2", question: "Limite des dispositifs actuels ?", options: ["Trop coûteux", "Souvent superficiels", "Trop nombreux"], correctIndex: 1 },
      { id: "q3", question: "Causes structurelles à traiter ?", options: ["Salaires bas", "Surcharge, management vertical, manque de sens", "Bureau mal aménagé"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t6",
    title: "Conférence — langues régionales",
    instruction: INSTR_DEFAULT,
    script:
      "La question des langues régionales illustre la tension entre l'unité linguistique héritée de la Révolution et la reconnaissance d'un patrimoine plurilingue. Le breton, l'occitan ou le corse comptent encore des locuteurs, mais leur transmission intergénérationnelle s'effondre. Les écoles bilingues obtiennent de bons résultats scolaires, ce qui contredit l'idée reçue selon laquelle deux langues nuiraient à l'apprentissage. Reste à savoir si une politique publique volontariste peut inverser une tendance déjà installée depuis un siècle.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Tension centrale ?", options: ["Ville vs campagne", "Unité linguistique vs patrimoine plurilingue", "Public vs privé"], correctIndex: 1 },
      { id: "q2", question: "Idée reçue contredite ?", options: ["Le bilinguisme nuit à l'apprentissage — non", "Les langues régionales sont mortes", "Les enfants n'apprennent pas"], correctIndex: 0 },
      { id: "q3", question: "Question posée à la fin ?", options: ["Faut-il interdire ces langues ?", "Une politique publique peut-elle inverser la tendance ?", "Faut-il changer d'école ?"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t7",
    title: "Analyse économique — inflation",
    instruction: INSTR_DEFAULT,
    script:
      "L'inflation récente ne se réduit pas à un simple choc énergétique. Elle combine des facteurs conjoncturels — tensions géopolitiques, rupture d'approvisionnements — et des dynamiques structurelles plus profondes : réorganisation des chaînes de valeur, transition écologique coûteuse à court terme, vieillissement démographique. Les banques centrales, en relevant leurs taux, freinent la demande, mais elles n'ont pas de prise directe sur ces déterminants structurels. Le risque est donc de casser la croissance sans venir à bout durablement des prix.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "L'inflation est-elle uniquement énergétique ?", options: ["Oui", "Non, plusieurs facteurs", "Uniquement démographique"], correctIndex: 1 },
      { id: "q2", question: "Que font les banques centrales ?", options: ["Baissent les taux", "Relèvent les taux", "Ne font rien"], correctIndex: 1 },
      { id: "q3", question: "Risque identifié ?", options: ["Explosion des salaires", "Casser la croissance sans stopper durablement les prix", "Baisse de la population"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t8",
    title: "Chronique — musées",
    instruction: INSTR_DEFAULT,
    script:
      "Les musées cherchent leur place dans un paysage culturel bouleversé par le numérique. Longtemps sanctuaires du savoir, ils deviennent des lieux de médiation, d'expérience, parfois de spectacle. Les expositions immersives font recette, mais divisent les conservateurs : certains y voient une trahison de la mission scientifique, d'autres, une porte d'entrée nécessaire pour toucher des publics qui n'auraient jamais franchi le seuil d'un musée classique.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Comment évolue le rôle des musées ?", options: ["Sanctuaires uniquement", "Médiation, expérience, spectacle", "Ils disparaissent"], correctIndex: 1 },
      { id: "q2", question: "Que sont les expositions immersives ?", options: ["Un échec", "Populaires mais controversées", "Interdites"], correctIndex: 1 },
      { id: "q3", question: "Argument favorable ?", options: ["Elles trahissent la science", "Elles ouvrent la porte à de nouveaux publics", "Elles coûtent moins cher"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t9",
    title: "Conférence — alimentation du futur",
    instruction: INSTR_DEFAULT,
    script:
      "Nourrir dix milliards d'humains à l'horizon 2050 sans détruire la planète : voilà l'équation. Les pistes se multiplient : protéines végétales, insectes, viande cellulaire, agriculture urbaine. Chacune soulève ses propres questions d'acceptabilité culturelle, de coût et d'impact environnemental réel. Aucune solution unique ne s'impose ; la transformation viendra probablement d'un bouquet de réponses combinées, différentes selon les régions du monde.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Population visée à 2050 ?", options: ["6 milliards", "8 milliards", "10 milliards"], correctIndex: 2 },
      { id: "q2", question: "Pistes citées ?", options: ["Seulement les insectes", "Protéines végétales, insectes, viande cellulaire, agriculture urbaine", "Aucune"], correctIndex: 1 },
      { id: "q3", question: "Solution attendue ?", options: ["Une unique solution mondiale", "Un bouquet combiné selon les régions", "Le retour à l'autarcie"], correctIndex: 1 },
    ],
  },
  {
    id: "c1-t10",
    title: "Débat — sport et politique",
    instruction: INSTR_DEFAULT,
    script:
      "L'idée selon laquelle le sport doit rester à l'écart de la politique s'effrite d'année en année. L'attribution de grandes compétitions à des régimes autoritaires, les prises de position d'athlètes engagés ou encore les enjeux climatiques transforment chaque événement majeur en scène politique. Les fédérations, longtemps silencieuses, doivent désormais assumer des choix explicites, sous le regard critique d'une opinion publique de plus en plus mobilisée.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Que devient l'idée de neutralité du sport ?", options: ["Elle se renforce", "Elle s'effrite", "Elle reste identique"], correctIndex: 1 },
      { id: "q2", question: "Facteurs cités ?", options: ["Uniquement l'argent", "Régimes autoritaires, athlètes engagés, climat", "Rien"], correctIndex: 1 },
      { id: "q3", question: "Position des fédérations ?", options: ["Elles peuvent rester silencieuses", "Elles doivent assumer des choix explicites", "Elles disparaissent"], correctIndex: 1 },
    ],
  },
];

/* ─────────── C2 (10 tâches) ─────────── */
const C2_TASKS: ListeningTask[] = [
  {
    id: "c2-t1",
    title: "Débat — culture et mondialisation",
    instruction: INSTR_DEFAULT,
    script:
      "La mondialisation culturelle est souvent présentée comme une menace pour la diversité, notamment à travers l'hégémonie supposée des industries anglo-saxonnes. Or, cette vision mérite d'être nuancée. Si Hollywood ou les plateformes de streaming diffusent effectivement une esthétique dominante, on observe simultanément un mouvement inverse : jamais autant de séries coréennes, de films iraniens ou de musiques latino-américaines n'ont conquis d'audiences mondiales. La mondialisation, loin d'être un rouleau compresseur uniforme, fonctionne comme un carrefour où les influences se croisent, se réinterprètent et se recomposent. Le véritable enjeu n'est peut-être pas la préservation d'une pureté culturelle illusoire, mais la capacité des créateurs locaux à négocier leur place dans ces flux transnationaux.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Position centrale de l'intervenant ?", options: ["La mondialisation détruit tout", "Carrefour d'influences, pas un rouleau compresseur", "Protéger les cultures par la loi"], correctIndex: 1 },
      { id: "q2", question: "Exemple contredisant l'hégémonie ?", options: ["Séries coréennes, films iraniens, musiques latino", "Cinéma français", "Fin d'Hollywood"], correctIndex: 0 },
      { id: "q3", question: "Véritable enjeu ?", options: ["Pureté culturelle", "Interdire les plateformes", "Créateurs locaux dans les flux transnationaux"], correctIndex: 2 },
    ],
  },
  {
    id: "c2-t2",
    title: "Analyse littéraire — Proust",
    instruction: INSTR_DEFAULT,
    script:
      "Relire Proust aujourd'hui, c'est mesurer combien sa révolution reste étrangère aux catégories habituelles du roman. Il ne raconte pas une histoire au sens classique, il déplie une conscience. Chaque phrase, avec ses circonvolutions, épouse la trajectoire d'une pensée qui se cherche. Cette lenteur assumée, longtemps perçue comme un obstacle, apparaît désormais comme une invitation salutaire à sortir de nos rythmes de lecture fragmentés, dictés par l'écran. Proust, paradoxalement, n'a jamais été aussi contemporain.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Que fait Proust selon le critique ?", options: ["Il raconte une histoire linéaire", "Il déplie une conscience", "Il écrit du théâtre"], correctIndex: 1 },
      { id: "q2", question: "Comment perçoit-on désormais sa lenteur ?", options: ["Un obstacle", "Une invitation salutaire face aux écrans", "Un défaut"], correctIndex: 1 },
      { id: "q3", question: "Paradoxe final ?", options: ["Il est dépassé", "Jamais aussi contemporain", "Il devient illisible"], correctIndex: 1 },
    ],
  },
  {
    id: "c2-t3",
    title: "Table ronde — démocratie numérique",
    instruction: INSTR_DEFAULT,
    script:
      "Le numérique promettait une revitalisation démocratique par la circulation horizontale de l'information et la participation directe des citoyens. Le bilan, une génération plus tard, oblige à plus de prudence. Si les plateformes ont bien élargi l'espace public, elles l'ont aussi fragmenté en bulles algorithmiques, favorisant la polarisation et affaiblissant les cadres communs de délibération. Refonder une démocratie numérique suppose sans doute moins d'ajouter des outils que de repenser les règles du jeu : régulation des plateformes, éducation critique aux médias, et redéfinition du service public de l'information.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Promesse initiale du numérique ?", options: ["Contrôle centralisé", "Revitalisation démocratique horizontale", "Fin des médias"], correctIndex: 1 },
      { id: "q2", question: "Effet observé ?", options: ["Uniformité de l'information", "Fragmentation en bulles et polarisation", "Consensus général"], correctIndex: 1 },
      { id: "q3", question: "Piste proposée ?", options: ["Ajouter plus d'outils", "Repenser les règles : régulation, éducation, service public", "Interdire Internet"], correctIndex: 1 },
    ],
  },
  {
    id: "c2-t4",
    title: "Conférence — philosophie du temps",
    instruction: INSTR_DEFAULT,
    script:
      "Notre rapport au temps s'est profondément transformé. Le temps kairotique des Anciens, ce temps qualitatif fait d'occasions et de moments justes, s'est vu écrasé par le temps chronologique, mesurable, comptable, monnayable. L'accélération technologique n'a fait qu'aggraver cette réduction, au point que le simple fait de « prendre son temps » relève aujourd'hui d'un acte presque subversif. Redonner épaisseur au présent, c'est peut-être là l'un des grands défis philosophiques et politiques de notre époque.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Quel temps a été écrasé ?", options: ["Le temps chronologique", "Le temps kairotique qualitatif", "Le temps sacré"], correctIndex: 1 },
      { id: "q2", question: "« Prendre son temps » est perçu comme ?", options: ["Normal", "Un acte presque subversif", "Une perte"], correctIndex: 1 },
      { id: "q3", question: "Défi identifié ?", options: ["Accélérer davantage", "Redonner épaisseur au présent", "Supprimer les horloges"], correctIndex: 1 },
    ],
  },
  {
    id: "c2-t5",
    title: "Analyse — post-vérité",
    instruction: INSTR_DEFAULT,
    script:
      "L'expression « post-vérité » ne signifie pas que la vérité aurait disparu, mais qu'elle a cessé, dans le débat public, d'être un critère décisif face à l'émotion et à l'adhésion tribale. Cette bascule n'est pas seulement technologique : elle traduit une crise de confiance envers les institutions productrices de savoir — médias, universités, expertise scientifique. Restaurer cette confiance ne pourra pas se faire par la seule pédagogie ; il faudra réinterroger les asymétries de pouvoir et de représentation qui alimentent ce discrédit.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Sens de « post-vérité » ici ?", options: ["La vérité a disparu", "Elle n'est plus un critère décisif face à l'émotion", "Elle triomphe"], correctIndex: 1 },
      { id: "q2", question: "Cause profonde ?", options: ["Technologie seule", "Crise de confiance envers médias/universités/science", "Manque d'écoles"], correctIndex: 1 },
      { id: "q3", question: "Que faut-il faire ?", options: ["Uniquement de la pédagogie", "Interroger les asymétries de pouvoir", "Ne rien faire"], correctIndex: 1 },
    ],
  },
  {
    id: "c2-t6",
    title: "Débat — écologie et libertés",
    instruction: INSTR_DEFAULT,
    script:
      "Concilier ambition écologique et libertés individuelles est l'un des dilemmes politiques majeurs de la décennie. Les mesures les plus efficaces — restrictions de mobilité, régulation des consommations, fiscalité carbone — heurtent frontalement une culture de la liberté individuelle profondément enracinée. À l'inverse, s'en remettre uniquement aux comportements volontaires condamne à l'inaction. La véritable question est peut-être celle du récit politique capable de transformer la contrainte en projet collectif désirable.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Dilemme central ?", options: ["Économie vs technologie", "Écologie vs libertés individuelles", "Ville vs campagne"], correctIndex: 1 },
      { id: "q2", question: "Limite de la seule volonté individuelle ?", options: ["Elle suffit", "Elle condamne à l'inaction", "Elle est excessive"], correctIndex: 1 },
      { id: "q3", question: "Enjeu final ?", options: ["Récit politique transformant la contrainte en projet désirable", "Interdire tout usage", "Aucun changement"], correctIndex: 0 },
    ],
  },
  {
    id: "c2-t7",
    title: "Chronique — architecture contemporaine",
    instruction: INSTR_DEFAULT,
    script:
      "L'architecture contemporaine se cherche entre deux tentations opposées : le geste spectaculaire, souvent au service d'une stratégie de marque territoriale, et une architecture plus discrète, attentive au contexte et aux usages. La première produit des icônes photographiables, la seconde des lieux à vivre. Or, ces deux logiques ne s'excluent pas nécessairement ; les projets les plus intéressants parviennent à conjuguer une présence forte dans le paysage avec une attention fine à l'échelle humaine.",
    voice: "onyx",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Deux tentations opposées ?", options: ["Ancien vs moderne", "Geste spectaculaire vs architecture discrète", "Nord vs sud"], correctIndex: 1 },
      { id: "q2", question: "Que produit la première ?", options: ["Des lieux à vivre", "Des icônes photographiables", "Des ruines"], correctIndex: 1 },
      { id: "q3", question: "Projets les plus intéressants ?", options: ["Uniquement discrets", "Conjuguent présence forte et échelle humaine", "Uniquement spectaculaires"], correctIndex: 1 },
    ],
  },
  {
    id: "c2-t8",
    title: "Analyse — géopolitique de l'eau",
    instruction: INSTR_DEFAULT,
    script:
      "L'eau devient, à mesure que les crises climatiques s'intensifient, un facteur géopolitique de premier plan. Les bassins transfrontaliers — Nil, Mékong, Tigre-Euphrate — cristallisent des tensions durables entre États riverains. Contrairement au pétrole, l'eau ne se substitue pas : sa rareté relative dicte des choix stratégiques majeurs. La coopération régionale, longtemps considérée comme un idéal fragile, s'impose désormais comme la seule alternative crédible à des conflits potentiellement dévastateurs.",
    voice: "shimmer",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Statut nouveau de l'eau ?", options: ["Ressource abondante", "Facteur géopolitique de premier plan", "Ressource marginale"], correctIndex: 1 },
      { id: "q2", question: "Différence avec le pétrole ?", options: ["Elle est illimitée", "Elle ne se substitue pas", "Elle est plus chère"], correctIndex: 1 },
      { id: "q3", question: "Alternative aux conflits ?", options: ["Coopération régionale", "Nationalisme accru", "Ne rien faire"], correctIndex: 0 },
    ],
  },
  {
    id: "c2-t9",
    title: "Conférence — arts et intelligence artificielle",
    instruction: INSTR_DEFAULT,
    script:
      "L'irruption des IA génératives dans les pratiques artistiques suscite des réactions vives, souvent polarisées entre enthousiasme prométhéen et rejet nostalgique. Or, l'histoire de l'art enseigne que chaque grande rupture technique — photographie, cinéma, numérique — a d'abord provoqué de telles paniques, avant d'être intégrée et de renouveler les langages. La vraie question n'est pas de savoir si l'IA « fait » de l'art, mais de comprendre comment les artistes vont s'en emparer pour formuler des propositions inédites.",
    voice: "nova",
    speed: 1.05,
    questions: [
      { id: "q1", question: "Types de réactions face aux IA ?", options: ["Consensus", "Polarisées : enthousiasme vs rejet", "Indifférence"], correctIndex: 1 },
      { id: "q2", question: "Enseignement historique ?", options: ["Aucune rupture n'a été acceptée", "Chaque rupture technique a d'abord fait peur puis renouvelé les langages", "Rien à retenir"], correctIndex: 1 },
      { id: "q3", question: "Vraie question ?", options: ["L'IA fait-elle de l'art ?", "Comment les artistes s'en empareront", "Faut-il interdire l'IA"], correctIndex: 1 },
    ],
  },
  {
    id: "c2-t10",
    title: "Débat — universalisme",
    instruction: INSTR_DEFAULT,
    script:
      "L'universalisme, longtemps porté comme un horizon émancipateur, est aujourd'hui contesté pour son ancrage historique particulier : celui d'une Europe qui a projeté ses catégories comme universelles. Cette critique légitime ne doit cependant pas conduire à une fragmentation identitaire où chaque groupe se replierait sur sa propre vérité. Le défi consiste à reformuler un universel dialogique, construit à partir des expériences plurielles et non imposé d'en haut. Renoncer à toute visée universelle serait, en réalité, laisser le champ libre aux relations de pure force.",
    voice: "onyx",
    speed: 1.1,
    questions: [
      { id: "q1", question: "Critique de l'universalisme ?", options: ["Il est trop moderne", "Ancrage historique européen imposé comme universel", "Il n'existe pas"], correctIndex: 1 },
      { id: "q2", question: "Risque du repli identitaire ?", options: ["Aucun", "Fragmentation où chaque groupe s'enferme dans sa vérité", "Union renforcée"], correctIndex: 1 },
      { id: "q3", question: "Proposition finale ?", options: ["Renoncer à tout universel", "Un universel dialogique construit à partir des expériences plurielles", "Retour à l'ordre ancien"], correctIndex: 1 },
    ],
  },
];

import { TEF_CANADA_LISTENING, TCF_CANADA_LISTENING } from "./listening-canada";
import {
  TEF_CANADA_LISTENING_C1,
  TEF_CANADA_LISTENING_C2,
  TCF_CANADA_LISTENING_C1,
  TCF_CANADA_LISTENING_C2,
} from "./listening-canada-advanced";

export const listeningExams: ListeningExam[] = [
  {
    id: "tef-canada-comprehension",
    code: "TEF Canada",
    name: "Compréhension orale — TEF Canada",
    level: "B2",
    description:
      "Prueba oficial TEF Canada: 10 documentos audio en progresión (anuncios, conversaciones, reportajes y análisis).",
    tasks: TEF_CANADA_LISTENING,
  },
  {
    id: "tef-canada-comprehension-c1",
    code: "TEF Canada C1",
    name: "Compréhension orale — TEF Canada (C1)",
    level: "C1",
    description:
      "Nivel C1: 10 documentos largos (mesas redondas, crónicas, entrevistas y análisis) con implícitos y argumentación.",
    tasks: TEF_CANADA_LISTENING_C1,
  },
  {
    id: "tef-canada-comprehension-c2",
    code: "TEF Canada C2",
    name: "Compréhension orale — TEF Canada (C2)",
    level: "C2",
    description:
      "Nivel C2: 10 documentos de alta densidad (seminarios, controversias, conferencias) con ironía y matices.",
    tasks: TEF_CANADA_LISTENING_C2,
  },
  {
    id: "tcf-canada-comprehension",
    code: "TCF Canada",
    name: "Compréhension orale — TCF Canada",
    level: "B2",
    description:
      "Prueba oficial TCF Canada: 10 documentos audio de dificultad creciente, del mensaje corto al análisis argumentado.",
    tasks: TCF_CANADA_LISTENING,
  },
  {
    id: "tcf-canada-comprehension-c1",
    code: "TCF Canada C1",
    name: "Compréhension orale — TCF Canada (C1)",
    level: "C1",
    description:
      "Nivel C1: 10 documentos argumentativos sobre sociedad, economía y educación en contexto canadiense.",
    tasks: TCF_CANADA_LISTENING_C1,
  },
  {
    id: "tcf-canada-comprehension-c2",
    code: "TCF Canada C2",
    name: "Compréhension orale — TCF Canada (C2)",
    level: "C2",
    description:
      "Nivel C2: 10 documentos expertos (derecho, ecología, lingüística, digital) con razonamiento abstracto.",
    tasks: TCF_CANADA_LISTENING_C2,
  },

  {
    id: "delf-a1-comprehension",
    code: "DELF A1",
    name: "Compréhension orale — DELF A1",
    level: "A1",
    description:
      "Mensajes cortos: presentaciones, compras, direcciones, horas. 10 audios para principiantes.",
    tasks: A1_TASKS,
  },
  {
    id: "delf-a2-comprehension",
    code: "DELF A2",
    name: "Compréhension orale — DELF A2",
    level: "A2",
    description:
      "Anuncios, mensajes cotidianos y conversaciones sencillas. 10 audios de nivel A2.",
    tasks: A2_TASKS,
  },
  {
    id: "delf-b1-comprehension",
    code: "DELF B1",
    name: "Compréhension orale — DELF B1",
    level: "B1",
    description:
      "Interviews, boletines y conversaciones sobre temas de la vida diaria. 10 audios B1.",
    tasks: B1_TASKS,
  },
  {
    id: "delf-b2-comprehension",
    code: "DELF B2",
    name: "Compréhension orale — DELF B2",
    level: "B2",
    description:
      "Reportajes, debates y discursos con argumentos matizados. 10 audios B2.",
    tasks: B2_TASKS,
  },
  {
    id: "dalf-c1-comprehension",
    code: "DALF C1",
    name: "Compréhension orale — DALF C1",
    level: "C1",
    description:
      "Conferencias, análisis y debates académicos. Vocabulario especializado. 10 audios C1.",
    tasks: C1_TASKS,
  },
  {
    id: "dalf-c2-comprehension",
    code: "DALF C2",
    name: "Compréhension orale — DALF C2",
    level: "C2",
    description:
      "Debates de expertos, análisis literarios y filosóficos. Nivel de dominio. 10 audios C2.",
    tasks: C2_TASKS,
  },
];

import { withExtraQuestions } from "./listening-extra-questions";

function enrichTasks(tasks: ListeningTask[]): ListeningTask[] {
  return tasks.map((t) => withExtraQuestions(t, 5));
}

export function getListeningExam(id: string): ListeningExam | undefined {
  const exam = listeningExams.find((e) => e.id === id);
  if (!exam) return undefined;
  return { ...exam, tasks: enrichTasks(exam.tasks) };
}

/** Devuelve el examen con las tareas mezcladas aleatoriamente. */
export function getShuffledListeningExam(id: string): ListeningExam | undefined {
  const exam = getListeningExam(id);
  if (!exam) return undefined;
  const tasks = exam.tasks.slice();
  for (let i = tasks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
  }
  return { ...exam, tasks };
}
