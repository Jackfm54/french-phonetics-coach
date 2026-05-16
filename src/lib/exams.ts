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

export type CriterionScale = {
  /** Nom du critère (FR) */
  name: string;
  /** Nota máxima de este criterio según la grille officielle */
  max: number;
};

export type LevelBand = {
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  /** Borne inférieure (inclusive) sur le total /totalMax */
  min: number;
  /** Borne supérieure (inclusive) sur le total /totalMax */
  max: number;
};

export type ExamScoring = {
  /** Total maximum (ex : 20 pour le TCF, 25 pour le DELF/DALF). */
  totalMax: number;
  /** Nota mínima exigida para ser "admis" (si aplica). */
  passMark?: number;
  /** Nota mínima exigida por competencia (DELF/DALF : 5/25 = 1/5 en certains critères). */
  perCriterionMin?: number;
  /** Critères officiels avec leurs barèmes. */
  criteria: CriterionScale[];
  /** Conversion du total en niveau CECRL (pour le TCF principalement). */
  bands?: LevelBand[];
  /** Note de bas de page sur l'échelle. */
  scaleNote: string;
};

export type Exam = {
  id: string;
  code: string;
  name: string;
  level: string;
  duration: string;
  description: string;
  /** @deprecated — utiliser scoring.criteria. Gardé pour compatibilité. */
  criteria: string[];
  scoring: ExamScoring;
  tasks: ExamTask[];
};

/* ──────────── Bandes officielles ──────────── */

// TCF (et TCF Canada) — Expression Orale : note sur 20 → niveau CECRL
// Source : France Éducation International, grille officielle TCF
const TCF_BANDS: LevelBand[] = [
  { level: "A1", min: 0, max: 3 },
  { level: "A2", min: 4, max: 6 },
  { level: "B1", min: 7, max: 9 },
  { level: "B2", min: 10, max: 13 },
  { level: "C1", min: 14, max: 16 },
  { level: "C2", min: 17, max: 20 },
];

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
    scoring: {
      totalMax: 20,
      criteria: [
        { name: "Capacité à réaliser la tâche", max: 4 },
        { name: "Aisance et fluidité", max: 4 },
        { name: "Étendue du lexique", max: 4 },
        { name: "Correction morphosyntaxique", max: 4 },
        { name: "Maîtrise du système phonologique", max: 4 },
      ],
      bands: TCF_BANDS,
      scaleNote:
        "Note sur 20 convertie en niveau CECRL : 0-3 = A1 · 4-6 = A2 · 7-9 = B1 · 10-13 = B2 · 14-16 = C1 · 17-20 = C2.",
    },
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
    id: "dalf-c2",
    code: "DALF C2",
    name: "Production Orale",
    level: "C2",
    duration: "~30 min (+1h prep)",
    description:
      "Compte rendu d'un dossier (audio + écrit), puis développement personnel et débat avec le jury.",
    criteria: [
      "Compte rendu fidèle et structuré",
      "Développement personnel argumenté",
      "Capacité de débat",
      "Maîtrise lexicale et idiomatique",
      "Maîtrise grammaticale et phonologique",
    ],
    scoring: {
      totalMax: 25,
      passMark: 12.5,
      perCriterionMin: 1,
      criteria: [
        { name: "Peut faire un compte rendu fidèle et bien structuré", max: 5 },
        { name: "Peut présenter une argumentation claire et nuancée", max: 5 },
        { name: "Peut interagir et débattre avec aisance", max: 5 },
        { name: "Étendue et maîtrise du vocabulaire", max: 5 },
        { name: "Maîtrise grammaticale et phonologique", max: 5 },
      ],
      scaleNote:
        "Production orale notée sur 25. Admis si total ≥ 12,5/25 ET aucune note inférieure à 1/5 par critère (seuil éliminatoire).",
    },
    tasks: [
      {
        id: "exposé",
        title: "Exposé + débat sur dossier",
        instruction:
          "Haz una síntesis del dossier (puntos clave, posiciones), luego desarrolla tu opinión personal de forma matizada y prepárate para debatir.",
        prepSeconds: 3600,
        speakSeconds: 1500,
        prompts: [
          "Dossier : « L'intelligence artificielle générative dans l'éducation supérieure ». Faites le compte rendu puis défendez une thèse nuancée.",
          "Dossier : « Décroissance économique : utopie ou nécessité ? ». Synthétisez les positions et prenez parti.",
          "Dossier : « La place du français face à l'anglais global ». Compte rendu et point de vue argumenté.",
        ],
      },
    ],
  },
  {
    id: "dalf-c1",
    code: "DALF C1",
    name: "Production Orale",
    level: "C1",
    duration: "~30 min (+1h prep)",
    description:
      "Exposé à partir de plusieurs documents écrits, puis entretien avec le jury.",
    criteria: [
      "Presentación clara del dossier",
      "Reflexión personal estructurada",
      "Defensa de un punto de vista",
      "Léxico amplio y preciso",
      "Corrección gramatical y fonológica",
    ],
    scoring: {
      totalMax: 25,
      passMark: 12.5,
      perCriterionMin: 1,
      criteria: [
        { name: "Peut présenter le contenu du dossier", max: 4 },
        { name: "Peut dégager le thème de réflexion", max: 4 },
        { name: "Peut présenter et défendre son point de vue", max: 4 },
        { name: "Étendue et maîtrise du vocabulaire", max: 4 },
        { name: "Morphosyntaxe", max: 4 },
        { name: "Maîtrise du système phonologique", max: 5 },
      ],
      scaleNote:
        "Production orale notée sur 25. Admis si total ≥ 12,5/25 ET aucune note inférieure à 1/5 (ou 1/4) par critère.",
    },
    tasks: [
      {
        id: "exposé",
        title: "Exposé sur dossier + entretien",
        instruction:
          "Présente le thème commun aux documents, dégage la problématique et défends une position argumentée. Anticipe les questions du jury.",
        prepSeconds: 3600,
        speakSeconds: 1200,
        prompts: [
          "Dossier : « Le télétravail : transformation durable ou parenthèse ? ». Exposez et défendez votre thèse.",
          "Dossier : « Patrimoine culturel à l'ère numérique ». Présentez la problématique et votre position.",
          "Dossier : « Mobilité urbaine et transition écologique ». Faites l'exposé puis défendez un point de vue.",
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
    scoring: {
      totalMax: 25,
      passMark: 12.5,
      perCriterionMin: 1,
      criteria: [
        { name: "Peut présenter et défendre un point de vue", max: 4 },
        { name: "Peut mettre en valeur des arguments et exemples", max: 4 },
        { name: "Peut réagir, débattre et nuancer", max: 4 },
        { name: "Étendue du vocabulaire", max: 4 },
        { name: "Morphosyntaxe", max: 4 },
        { name: "Maîtrise du système phonologique", max: 5 },
      ],
      scaleNote:
        "Production orale notée sur 25. Admis si total DELF ≥ 50/100 (toutes épreuves) ET aucune note < 5/25 par compétence.",
    },
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
    scoring: {
      totalMax: 25,
      passMark: 12.5,
      perCriterionMin: 1,
      criteria: [
        { name: "Entretien dirigé — se présenter", max: 4 },
        { name: "Exercice en interaction", max: 4 },
        { name: "Expression d'un point de vue", max: 5 },
        { name: "Lexique / correction lexicale", max: 4 },
        { name: "Morphosyntaxe / correction grammaticale", max: 4 },
        { name: "Maîtrise du système phonologique", max: 4 },
      ],
      scaleNote:
        "Production orale notée sur 25. Admis si total DELF ≥ 50/100 ET aucune compétence < 5/25.",
    },
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
    scoring: {
      totalMax: 25,
      passMark: 12.5,
      perCriterionMin: 1,
      criteria: [
        { name: "Entretien dirigé", max: 4 },
        { name: "Monologue suivi", max: 5 },
        { name: "Exercice en interaction", max: 4 },
        { name: "Lexique / correction lexicale", max: 4 },
        { name: "Morphosyntaxe / correction grammaticale", max: 4 },
        { name: "Maîtrise du système phonologique", max: 4 },
      ],
      scaleNote:
        "Production orale notée sur 25. Admis si total DELF ≥ 50/100 ET aucune compétence < 5/25.",
    },
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
    scoring: {
      totalMax: 25,
      passMark: 12.5,
      perCriterionMin: 1,
      criteria: [
        { name: "Entretien dirigé", max: 4 },
        { name: "Échange d'informations", max: 4 },
        { name: "Dialogue simulé / jeu de rôle", max: 5 },
        { name: "Lexique", max: 4 },
        { name: "Morphosyntaxe", max: 4 },
        { name: "Maîtrise du système phonologique", max: 4 },
      ],
      scaleNote:
        "Production orale notée sur 25. Admis si total DELF ≥ 50/100 ET aucune compétence < 5/25.",
    },
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

/** Convertit un total selon les bandes (TCF principalement) en niveau CECRL. */
export const bandFor = (
  total: number,
  bands?: LevelBand[],
): LevelBand["level"] | null => {
  if (!bands) return null;
  const b = bands.find((x) => total >= x.min && total <= x.max);
  return b?.level ?? null;
};
