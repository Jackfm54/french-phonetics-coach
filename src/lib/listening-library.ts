/**
 * Curación de clips de escucha auténticos generados con TTS profesional
 * (openai/gpt-4o-mini-tts vía /api/tts). Cada clip incluye transcripción
 * palabra por palabra para hacerla clicable en el player.
 */

export type ListeningClip = {
  id: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  category: "actualité" | "culture" | "société" | "sciences" | "vie quotidienne" | "littérature";
  title: string;
  source: string;
  duration: string;
  /** Texto completo para TTS + transcripción */
  transcript: string;
  /** Voz TTS: alloy, echo, fable, onyx, nova, shimmer */
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  /** Preguntas de comprensión */
  questions: {
    q: string;
    options: string[];
    /** Índice 0-based */
    answer: number;
  }[];
};

export const listeningLibrary: ListeningClip[] = [
  {
    id: "a1-boulangerie",
    level: "A1",
    category: "vie quotidienne",
    title: "À la boulangerie",
    source: "Dialogue quotidien",
    duration: "~30 s",
    voice: "nova",
    transcript:
      "Bonjour Madame ! Je voudrais une baguette, s'il vous plaît. Bien sûr, tradition ou classique ? Tradition, merci. Et avec ceci ? Deux croissants, s'il vous plaît. Cela fait quatre euros vingt, s'il vous plaît. Voilà. Merci, bonne journée !",
    questions: [
      {
        q: "Que commande le client ?",
        options: ["Une baguette et deux croissants", "Un pain et un gâteau", "Trois croissants"],
        answer: 0,
      },
      {
        q: "Combien coûte la commande ?",
        options: ["4,20 €", "2,40 €", "14 €"],
        answer: 0,
      },
    ],
  },
  {
    id: "a1-meteo",
    level: "A1",
    category: "vie quotidienne",
    title: "La météo à Paris",
    source: "Bulletin météo",
    duration: "~25 s",
    voice: "shimmer",
    transcript:
      "Bonjour ! Voici la météo pour aujourd'hui à Paris. Le matin, il fait froid, dix degrés, avec un peu de pluie. L'après-midi, le soleil revient, avec quinze degrés. Ce soir, il fait doux, mais le vent souffle. Bonne journée !",
    questions: [
      {
        q: "Quelle est la température le matin ?",
        options: ["10 °C", "15 °C", "5 °C"],
        answer: 0,
      },
      {
        q: "Que fait-il l'après-midi ?",
        options: ["Il pleut", "Il neige", "Il y a du soleil"],
        answer: 2,
      },
    ],
  },
  {
    id: "a2-rendezvous",
    level: "A2",
    category: "vie quotidienne",
    title: "Un rendez-vous chez le médecin",
    source: "Conversation téléphonique",
    duration: "~40 s",
    voice: "fable",
    transcript:
      "Cabinet du docteur Martin, bonjour. Bonjour, je voudrais prendre rendez-vous, s'il vous plaît. Bien sûr, c'est pour quel motif ? J'ai mal à la gorge depuis trois jours. D'accord. Vous pouvez venir demain à quinze heures ? Oui, parfait. À demain, alors. Merci beaucoup.",
    questions: [
      {
        q: "Pourquoi le patient appelle-t-il ?",
        options: ["Il a mal à la tête", "Il a mal à la gorge", "Il a de la fièvre"],
        answer: 1,
      },
      {
        q: "Quand est le rendez-vous ?",
        options: ["Aujourd'hui à 15 h", "Demain à 15 h", "Demain à 5 h"],
        answer: 1,
      },
    ],
  },
  {
    id: "a2-vacances",
    level: "A2",
    category: "vie quotidienne",
    title: "Mes prochaines vacances",
    source: "Témoignage",
    duration: "~35 s",
    voice: "nova",
    transcript:
      "Cet été, je vais en Bretagne avec ma famille. Nous partons en train le douze juillet et nous restons deux semaines. J'adore la mer, les crêpes et les vieilles villes. Ma sœur préfère la campagne, alors nous allons aussi visiter des fermes. J'espère qu'il fera beau !",
    questions: [
      {
        q: "Où va la personne en vacances ?",
        options: ["En Bretagne", "En Provence", "En Normandie"],
        answer: 0,
      },
      {
        q: "Combien de temps reste-t-elle ?",
        options: ["Deux semaines", "Un mois", "Trois jours"],
        answer: 0,
      },
    ],
  },
  {
    id: "b1-teletravail",
    level: "B1",
    category: "société",
    title: "Le télétravail en France",
    source: "Reportage court",
    duration: "~50 s",
    voice: "onyx",
    transcript:
      "Depuis la pandémie, le télétravail s'est installé durablement en France. Aujourd'hui, environ un salarié sur trois travaille au moins un jour par semaine depuis chez lui. Les employés apprécient la flexibilité et le temps gagné dans les transports. Mais certains regrettent le contact humain et se sentent isolés. Les entreprises, elles, cherchent un équilibre entre présentiel et distanciel.",
    questions: [
      {
        q: "Combien de salariés télétravaillent au moins un jour par semaine ?",
        options: ["Un sur cinq", "Un sur trois", "La moitié"],
        answer: 1,
      },
      {
        q: "Quel est un inconvénient mentionné ?",
        options: ["Le coût élevé", "L'isolement", "Le manque de matériel"],
        answer: 1,
      },
    ],
  },
  {
    id: "b1-alimentation",
    level: "B1",
    category: "société",
    title: "Manger local, une tendance",
    source: "Reportage court",
    duration: "~55 s",
    voice: "shimmer",
    transcript:
      "De plus en plus de Français choisissent de manger local. Cela signifie acheter des produits cultivés à moins de cent cinquante kilomètres de chez eux. Les avantages sont nombreux : soutenir les agriculteurs de la région, réduire la pollution liée au transport, et retrouver le goût des vraies saisons. Le mouvement des AMAP, ces associations qui livrent des paniers de légumes, compte plus de deux mille groupes dans tout le pays.",
    questions: [
      {
        q: "Que veut dire « manger local » ?",
        options: [
          "Manger au restaurant du quartier",
          "Acheter des produits cultivés près de chez soi",
          "Manger uniquement des légumes",
        ],
        answer: 1,
      },
      {
        q: "Combien de groupes AMAP existent en France ?",
        options: ["200", "Plus de 2000", "500"],
        answer: 1,
      },
    ],
  },
  {
    id: "b2-ia",
    level: "B2",
    category: "sciences",
    title: "L'intelligence artificielle au travail",
    source: "Chronique",
    duration: "~1 min",
    voice: "echo",
    transcript:
      "L'intelligence artificielle transforme le monde du travail à une vitesse inédite. Selon une étude récente, près de quarante pour cent des tâches actuelles pourraient être automatisées d'ici dix ans. Loin de disparaître, la plupart des métiers vont évoluer : les professionnels devront collaborer avec des outils intelligents plutôt que de les subir. Cela suppose de nouvelles compétences, notamment l'esprit critique et la capacité à formuler des instructions précises. Les entreprises qui investiront dans la formation continue prendront une longueur d'avance.",
    questions: [
      {
        q: "Quelle proportion des tâches pourrait être automatisée ?",
        options: ["10 %", "40 %", "80 %"],
        answer: 1,
      },
      {
        q: "Quelle compétence est mise en avant ?",
        options: ["La force physique", "L'esprit critique", "La rapidité de frappe"],
        answer: 1,
      },
      {
        q: "Que doivent faire les entreprises ?",
        options: [
          "Licencier leurs employés",
          "Investir dans la formation continue",
          "Supprimer les ordinateurs",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "b2-culture",
    level: "B2",
    category: "culture",
    title: "Le festival d'Avignon",
    source: "Chronique culturelle",
    duration: "~1 min",
    voice: "fable",
    transcript:
      "Chaque été, la ville d'Avignon se transforme en capitale mondiale du théâtre. Fondé en mille neuf cent quarante-sept par Jean Vilar, le festival propose aujourd'hui plus de mille cinq cents spectacles pendant trois semaines. Le « In », programmation officielle, côtoie le « Off », immense marché ouvert aux compagnies indépendantes. Les rues, les cloîtres et la célèbre cour d'honneur du Palais des Papes deviennent alors autant de scènes. C'est un rendez-vous incontournable pour les professionnels comme pour le grand public.",
    questions: [
      {
        q: "Quand le festival a-t-il été fondé ?",
        options: ["1947", "1957", "1977"],
        answer: 0,
      },
      {
        q: "Que désigne le « Off » ?",
        options: [
          "La programmation officielle",
          "Le marché ouvert aux compagnies indépendantes",
          "Un concours de mise en scène",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "c1-climat",
    level: "C1",
    category: "actualité",
    title: "Transition énergétique : où en est la France ?",
    source: "Analyse",
    duration: "~1 min 15",
    voice: "onyx",
    transcript:
      "La transition énergétique française avance à un rythme inégal. Si le pays a réduit ses émissions de gaz à effet de serre de vingt pour cent depuis mille neuf cent quatre-vingt-dix, la trajectoire reste insuffisante pour atteindre la neutralité carbone en deux mille cinquante. Le secteur des transports demeure le premier émetteur, tandis que la rénovation thermique des bâtiments patine, faute de main-d'œuvre qualifiée. Paradoxalement, la France dispose d'atouts considérables : un mix électrique très décarboné grâce au nucléaire, un potentiel éolien et solaire encore sous-exploité, et une expertise industrielle reconnue. L'enjeu, désormais, consiste à convertir ces atouts en résultats mesurables.",
    questions: [
      {
        q: "Quelle est la baisse d'émissions depuis 1990 ?",
        options: ["10 %", "20 %", "40 %"],
        answer: 1,
      },
      {
        q: "Quel secteur émet le plus ?",
        options: ["Les transports", "L'agriculture", "Le numérique"],
        answer: 0,
      },
      {
        q: "Quel atout français est cité ?",
        options: [
          "Un mix électrique très décarboné",
          "Une abondance de charbon",
          "Un vaste réseau de pipelines",
        ],
        answer: 0,
      },
    ],
  },
  {
    id: "c2-litterature",
    level: "C2",
    category: "littérature",
    title: "Proust et la mémoire involontaire",
    source: "Chronique littéraire",
    duration: "~1 min 30",
    voice: "echo",
    transcript:
      "Chez Proust, la mémoire ne se convoque pas : elle surgit. C'est le principe même de la mémoire involontaire, cette réminiscence qui, à la faveur d'une sensation fortuite — le goût d'une madeleine trempée dans le thé, l'inégalité de deux pavés sous le pied — restitue tout un pan du passé avec une intensité que la volonté ne saurait égaler. Contre l'intelligence, qui abstrait et dessèche, Proust valorise l'impression brute, dont l'écrivain a pour mission de tirer la loi cachée. La Recherche devient ainsi une entreprise proprement archéologique : exhumer, sous les strates du temps perdu, l'essence même de nos existences. Loin d'un simple exercice nostalgique, cette quête inaugure une esthétique où l'art seul permet de racheter le temps.",
    questions: [
      {
        q: "Qu'est-ce que la mémoire involontaire ?",
        options: [
          "Une souvenance provoquée par une sensation fortuite",
          "Un effort conscient de rappel",
          "Un rêve nocturne",
        ],
        answer: 0,
      },
      {
        q: "Quelle faculté Proust juge-t-il insuffisante ?",
        options: ["L'imagination", "L'intelligence", "La sensibilité"],
        answer: 1,
      },
      {
        q: "Quelle est la mission de l'art selon ce passage ?",
        options: [
          "Divertir le lecteur",
          "Racheter le temps",
          "Documenter l'histoire",
        ],
        answer: 1,
      },
    ],
  },
];

export function clipsByLevel(level: ListeningClip["level"]) {
  return listeningLibrary.filter((c) => c.level === level);
}
