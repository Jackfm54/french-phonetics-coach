export type ExamTask = {
  id: string;
  title: string;
  instruction: string;
  /** Prep time in seconds (0 = no prep). */
  prepSeconds: number;
  /** Response time in seconds. */
  speakSeconds: number;
  /** A few rotating prompts. */
  prompts: string[];
};

export type Exam = {
  id: string;
  code: string;
  name: string;
  level: string;
  duration: string;
  description: string;
  criteria: string[];
  tasks: ExamTask[];
};

export const exams: Exam[] = [
  {
    id: "tcf-canada",
    code: "TCF Canada",
    name: "Expression Orale",
    level: "Tous niveaux",
    duration: "~12 min",
    description:
      "Tres tareas: pedir información, dar información sobre una experiencia, y defender una opinión.",
    criteria: [
      "Capacidad para realizar la tarea",
      "Fluidez y ritmo",
      "Riqueza léxica",
      "Corrección morfosintáctica",
      "Pronunciación e inteligibilidad",
    ],
    tasks: [
      {
        id: "t1",
        title: "Tâche 1 — Demander des informations",
        instruction:
          "Plantea 4-5 preguntas claras a tu interlocutor sobre el tema indicado. Usa formas variadas (est-ce que, inversión, qu'est-ce que…).",
        prepSeconds: 0,
        speakSeconds: 150,
        prompts: [
          "Vous voulez vous inscrire à un cours de cuisine. Posez des questions à l'organisateur.",
          "Vous cherchez un appartement à louer. Posez des questions au propriétaire.",
          "Vous voulez vous abonner à une salle de sport. Posez des questions au réceptionniste.",
        ],
      },
      {
        id: "t2",
        title: "Tâche 2 — Présenter / Donner des informations",
        instruction:
          "Describe la experiencia o situación pedida con detalles, conectores y ejemplos concretos.",
        prepSeconds: 0,
        speakSeconds: 240,
        prompts: [
          "Parlez d'un voyage qui vous a marqué : où, quand, avec qui, et pourquoi vous vous en souvenez.",
          "Présentez votre ville à un visiteur étranger : ce qu'il faut voir, manger, éviter.",
          "Décrivez une tradition importante de votre pays.",
        ],
      },
      {
        id: "t3",
        title: "Tâche 3 — Exprimer un point de vue",
        instruction:
          "Defiende tu opinión con argumentos estructurados (d'abord, ensuite, en revanche, donc). Da ejemplos.",
        prepSeconds: 120,
        speakSeconds: 300,
        prompts: [
          "Faut-il interdire les téléphones portables à l'école ? Justifiez votre position.",
          "Le télétravail est-il un progrès ou un recul pour la société ? Argumentez.",
          "Vivre dans une grande ville ou à la campagne : que choisissez-vous et pourquoi ?",
        ],
      },
    ],
  },
  {
    id: "delf-b2",
    code: "DELF B2",
    name: "Production Orale",
    level: "B2",
    duration: "~20 min (+30 min prep)",
    description:
      "Defensa de un punto de vista argumentado a partir de un documento corto, seguido de debate con el examinador.",
    criteria: [
      "Presentación clara y estructurada",
      "Calidad de la argumentación",
      "Interacción y reacción al debate",
      "Léxico preciso y variado",
      "Corrección gramatical y fonológica",
    ],
    tasks: [
      {
        id: "monologue",
        title: "Monologue suivi — Défense d'un point de vue",
        instruction:
          "Presenta tu opinión estructurada (introducción, 2-3 argumentos con ejemplos, conclusión).",
        prepSeconds: 600,
        speakSeconds: 600,
        prompts: [
          "« L'intelligence artificielle va-t-elle remplacer les enseignants ? » Défendez votre point de vue.",
          "« Faut-il rendre le vote obligatoire ? » Présentez et défendez votre opinion.",
          "« Les réseaux sociaux : opportunité ou danger pour la démocratie ? » Argumentez.",
        ],
      },
    ],
  },
  {
    id: "delf-b1",
    code: "DELF B1",
    name: "Production Orale",
    level: "B1",
    duration: "~15 min (+10 min prep)",
    description:
      "Entrevista dirigida, ejercicio en interacción (juego de rol) y expresión de un punto de vista.",
    criteria: [
      "Capacidad para comunicar en interacción",
      "Coherencia del discurso",
      "Léxico adaptado al contexto",
      "Morfosintaxis básica correcta",
      "Pronunciación clara",
    ],
    tasks: [
      {
        id: "entretien",
        title: "Entretien dirigé",
        instruction:
          "Preséntate brevemente y responde a las preguntas habituales sobre ti.",
        prepSeconds: 0,
        speakSeconds: 180,
        prompts: [
          "Présentez-vous : vos études, votre travail, vos loisirs, vos projets.",
          "Parlez de votre famille et de votre vie quotidienne.",
        ],
      },
      {
        id: "monologue",
        title: "Expression d'un point de vue",
        instruction:
          "Da tu opinión sobre el tema con 2-3 argumentos y ejemplos.",
        prepSeconds: 600,
        speakSeconds: 300,
        prompts: [
          "« Les jeunes lisent de moins en moins. » Qu'en pensez-vous ?",
          "« Voyager forme la jeunesse. » Êtes-vous d'accord ?",
          "« Le sport est essentiel pour bien vivre. » Donnez votre avis.",
        ],
      },
    ],
  },
  {
    id: "delf-a2",
    code: "DELF A2",
    name: "Production Orale",
    level: "A2",
    duration: "~6-8 min",
    description:
      "Entrevista dirigida, monólogo suivi (describir una experiencia) y ejercicio en interacción.",
    criteria: [
      "Capacidad para presentarse y describir",
      "Uso de tiempos pasado / futuro simple",
      "Léxico de la vida cotidiana",
      "Pronunciación inteligible",
    ],
    tasks: [
      {
        id: "entretien",
        title: "Entretien dirigé",
        instruction: "Preséntate y habla de ti, tu familia y tus aficiones.",
        prepSeconds: 0,
        speakSeconds: 90,
        prompts: [
          "Présentez-vous : nom, âge, nationalité, profession, famille.",
        ],
      },
      {
        id: "monologue",
        title: "Monologue suivi",
        instruction: "Describe la situación pedida usando frases simples y conectores.",
        prepSeconds: 0,
        speakSeconds: 120,
        prompts: [
          "Racontez vos dernières vacances : où, quand, avec qui, qu'avez-vous fait ?",
          "Décrivez votre journée typique.",
          "Parlez de votre plat préféré et expliquez comment on le prépare.",
        ],
      },
    ],
  },
  {
    id: "delf-a1",
    code: "DELF A1",
    name: "Production Orale",
    level: "A1",
    duration: "~5-7 min",
    description:
      "Entretien dirigé, échange d'informations y dialogue simulé. Frases muy simples.",
    criteria: [
      "Capacidad para presentarse",
      "Vocabulario básico",
      "Pronunciación reconocible",
    ],
    tasks: [
      {
        id: "entretien",
        title: "Entretien dirigé",
        instruction:
          "Preséntate de forma simple: nombre, edad, nacionalidad, dónde vives.",
        prepSeconds: 0,
        speakSeconds: 60,
        prompts: [
          "Présentez-vous en quelques phrases simples.",
        ],
      },
      {
        id: "echange",
        title: "Échange d'informations",
        instruction:
          "Haz 3-4 preguntas simples sobre el tema (¿qué? ¿dónde? ¿cuándo? ¿con quién?).",
        prepSeconds: 0,
        speakSeconds: 90,
        prompts: [
          "Posez des questions sur : famille, travail, loisirs, voyage.",
        ],
      },
    ],
  },
];

export const getExam = (id: string) => exams.find((e) => e.id === id);
