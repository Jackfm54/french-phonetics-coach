export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonCategory =
  | "Voyelles nasales"
  | "Le R français"
  | "Voyelles"
  | "Semi-voyelles"
  | "Consonnes"
  | "Liaisons"
  | "Enchaînement & E muet"
  | "Rythme & Intonation"
  | "Prosodie avancée"
  | "Registres & Style";

/** Tipos de ejercicio interactivo. */
export type Exercise =
  /** Escucha un audio (el `audio`) y elige la palabra/frase correcta. */
  | {
      type: "discrimination";
      question: string;
      audio: string; // se reproduce con speakFr
      options: string[];
      answer: string; // debe estar en `options`
      explain?: string;
    }
  /** Lee la palabra y elige la transcripción API correcta. */
  | {
      type: "transcription";
      question: string;
      word: string;
      options: string[]; // 3 transcripciones API
      answer: string;
      explain?: string;
    }
  /** Escucha y escribe (dictée). Se compara con la respuesta aceptando variantes. */
  | {
      type: "dictee";
      question: string;
      audio: string;
      answer: string; // texto esperado
      explain?: string;
    }
  /** Repite la frase en voz alta. El componente usa speech recognition. */
  | {
      type: "repeat";
      question: string;
      target: string; // lo que debe pronunciar
      ipa?: string;
      explain?: string;
    };

export type Lesson = {
  id: string;
  title: string;
  ipa: string;
  category: LessonCategory;
  level: Level;
  description: string;
  tip: string;
  examples: { fr: string; ipa: string; en: string }[];
  exercises: Exercise[];
};

export const levels: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const lessons: Lesson[] = [
  /* ───────────────────────── A1 ───────────────────────── */
  {
    id: "nasale-an",
    title: "La nasale « an / en »",
    ipa: "/ɑ̃/",
    category: "Voyelles nasales",
    level: "A1",
    description:
      "Sonido nasal abierto. La boca queda relajada y el aire pasa por la nariz.",
    tip: "Imagina decir 'aa' mientras tapas suavemente la salida del aire por la boca.",
    examples: [
      { fr: "enfant", ipa: "/ɑ̃.fɑ̃/", en: "niño" },
      { fr: "chanson", ipa: "/ʃɑ̃.sɔ̃/", en: "canción" },
      { fr: "France", ipa: "/fʁɑ̃s/", en: "Francia" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Écoute et choisis le mot que tu entends.",
        audio: "enfant",
        options: ["enfant", "infant", "onffant"],
        answer: "enfant",
        explain: "« en » se prononce /ɑ̃/, jamais /in/ ni /on/.",
      },
      {
        type: "transcription",
        question: "Quelle est la bonne transcription API de « France » ?",
        word: "France",
        options: ["/fʁɑ̃s/", "/fʁɔ̃s/", "/fʁans/"],
        answer: "/fʁɑ̃s/",
      },
      {
        type: "repeat",
        question: "Répète à voix haute :",
        target: "Mon enfant chante en France.",
        ipa: "/mɔ̃.n‿ɑ̃.fɑ̃ ʃɑ̃t ɑ̃ fʁɑ̃s/",
      },
    ],
  },
  {
    id: "nasale-on",
    title: "La nasale « on »",
    ipa: "/ɔ̃/",
    category: "Voyelles nasales",
    level: "A1",
    description: "Sonido nasal redondeado. Labios en forma de 'o' cerrada.",
    tip: "Redondea bien los labios, como un beso, y deja salir el aire por la nariz.",
    examples: [
      { fr: "bonjour", ipa: "/bɔ̃.ʒuʁ/", en: "buenos días" },
      { fr: "maison", ipa: "/mɛ.zɔ̃/", en: "casa" },
      { fr: "mon nom", ipa: "/mɔ̃ nɔ̃/", en: "mi nombre" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Écoute : quel mot entends-tu ?",
        audio: "mon",
        options: ["mon", "main", "ment"],
        answer: "mon",
      },
      {
        type: "dictee",
        question: "Écoute et écris la phrase :",
        audio: "Bonjour mon nom est Léon.",
        answer: "Bonjour mon nom est Léon",
      },
    ],
  },
  {
    id: "r-francais",
    title: "Le « R » français",
    ipa: "/ʁ/",
    category: "Le R français",
    level: "A1",
    description:
      "La R uvular, producida con la parte trasera de la lengua cerca de la úvula.",
    tip: "Practica haciendo gárgaras suavemente con saliva. Ese punto es donde nace la R.",
    examples: [
      { fr: "Paris", ipa: "/pa.ʁi/", en: "París" },
      { fr: "rouge", ipa: "/ʁuʒ/", en: "rojo" },
      { fr: "merci", ipa: "/mɛʁ.si/", en: "gracias" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Répète en gardant le R uvulaire :",
        target: "Paris est une grande rue rouge.",
        ipa: "/pa.ʁi ɛ.t‿yn ɡʁɑ̃d ʁy ʁuʒ/",
      },
      {
        type: "discrimination",
        question: "Quel mot entends-tu ?",
        audio: "rouge",
        options: ["rouge", "luge", "bouge"],
        answer: "rouge",
      },
    ],
  },
  {
    id: "voyelle-u",
    title: "La voyelle « u »",
    ipa: "/y/",
    category: "Voyelles",
    level: "A1",
    description:
      "Sonido entre 'i' y 'u'. No existe en español: labios de 'u', lengua de 'i'.",
    tip: "Di 'i' y, sin mover la lengua, redondea los labios como para silbar.",
    examples: [
      { fr: "tu", ipa: "/ty/", en: "tú" },
      { fr: "rue", ipa: "/ʁy/", en: "calle" },
      { fr: "musique", ipa: "/my.zik/", en: "música" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Paire minimale : /y/ vs /u/. Quel mot entends-tu ?",
        audio: "rue",
        options: ["rue", "roue"],
        answer: "rue",
        explain: "« rue » /ʁy/ avec lèvres serrées ; « roue » /ʁu/ avec lèvres rondes.",
      },
      {
        type: "transcription",
        question: "Transcription correcte de « tu » ?",
        word: "tu",
        options: ["/ty/", "/tu/", "/tju/"],
        answer: "/ty/",
      },
    ],
  },

  /* ───────────────────────── A2 ───────────────────────── */
  {
    id: "nasale-in",
    title: "La nasale « in / ain »",
    ipa: "/ɛ̃/",
    category: "Voyelles nasales",
    level: "A2",
    description: "Sonido nasal abierto delantero, similar a un 'eh' nasal.",
    tip: "Sonríe ligeramente y deja vibrar la nariz al pronunciar 'eh'.",
    examples: [
      { fr: "vin", ipa: "/vɛ̃/", en: "vino" },
      { fr: "matin", ipa: "/ma.tɛ̃/", en: "mañana" },
      { fr: "pain", ipa: "/pɛ̃/", en: "pan" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "/ɛ̃/ vs /ɑ̃/ : quel mot ?",
        audio: "vin",
        options: ["vin", "vent"],
        answer: "vin",
      },
      {
        type: "dictee",
        question: "Dictée :",
        audio: "Ce matin j'ai mangé du pain.",
        answer: "Ce matin j'ai mangé du pain",
      },
    ],
  },
  {
    id: "voyelle-eu",
    title: "La voyelle « eu »",
    ipa: "/ø/",
    category: "Voyelles",
    level: "A2",
    description: "Vocal redondeada de timbre suave, entre 'e' y 'o'.",
    tip: "Di 'e' y poco a poco redondea los labios sin cambiar la lengua.",
    examples: [
      { fr: "deux", ipa: "/dø/", en: "dos" },
      { fr: "bleu", ipa: "/blø/", en: "azul" },
      { fr: "heureux", ipa: "/ø.ʁø/", en: "feliz" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "/ø/ vs /œ/ : quel mot ?",
        audio: "jeûne",
        options: ["jeûne", "jeune"],
        answer: "jeûne",
        explain: "« jeûne » /ʒøn/ fermé ; « jeune » /ʒœn/ ouvert.",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Deux amis heureux jouent au jeu bleu.",
        ipa: "/dø.z‿a.mi ø.ʁø ʒu o ʒø blø/",
      },
    ],
  },
  {
    id: "semi-voyelles",
    title: "Les semi-voyelles « j · w · ɥ »",
    ipa: "/j w ɥ/",
    category: "Semi-voyelles",
    level: "A2",
    description:
      "Tres semi-vocales: /j/ como en 'fille', /w/ como en 'oui', /ɥ/ como en 'huit' (única del francés).",
    tip: "Para /ɥ/ : empieza la /y/ francesa y desliza muy rápido a la vocal siguiente.",
    examples: [
      { fr: "fille", ipa: "/fij/", en: "hija" },
      { fr: "oui", ipa: "/wi/", en: "sí" },
      { fr: "huit", ipa: "/ɥit/", en: "ocho" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Quel son ?",
        audio: "huit",
        options: ["huit", "ouïe", "uit"],
        answer: "huit",
      },
      {
        type: "transcription",
        question: "API correcte de « lui » ?",
        word: "lui",
        options: ["/lwi/", "/lɥi/", "/lji/"],
        answer: "/lɥi/",
      },
    ],
  },

  /* ───────────────────────── B1 ───────────────────────── */
  {
    id: "liaison",
    title: "Les liaisons obligatoires",
    ipa: "—",
    category: "Liaisons",
    level: "B1",
    description:
      "Conexión obligatoria entre palabras: una consonante muda se pronuncia ante vocal.",
    tip: "Lee como si fuera una sola palabra. 'Les amis' suena /le.za.mi/.",
    examples: [
      { fr: "les amis", ipa: "/le.za.mi/", en: "los amigos" },
      { fr: "nous avons", ipa: "/nu.za.vɔ̃/", en: "tenemos" },
      { fr: "un grand homme", ipa: "/œ̃ ɡʁɑ̃.tɔm/", en: "un gran hombre" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "Liaison correcte pour « les enfants » ?",
        word: "les enfants",
        options: ["/le.zɑ̃.fɑ̃/", "/lez.ɑ̃.fɑ̃/", "/le.ɑ̃.fɑ̃/"],
        answer: "/le.zɑ̃.fɑ̃/",
        explain: "Liaison en /z/ obligatoire entre article et nom au pluriel.",
      },
      {
        type: "repeat",
        question: "Répète avec toutes les liaisons :",
        target: "Nous avons un grand ami à Paris.",
        ipa: "/nu.z‿a.vɔ̃.z‿œ̃ ɡʁɑ̃.t‿a.mi a pa.ʁi/",
      },
    ],
  },
  {
    id: "e-muet",
    title: "Le « e » muet",
    ipa: "/ə/",
    category: "Enchaînement & E muet",
    level: "B1",
    description:
      "El schwa /ə/ que aparece y desaparece según el ritmo y el registro.",
    tip: "Regla de las 3 consonnes : on garde le e si le supprimer crée 3 consonnes de suite (« vendredi », pas « vendrdi »).",
    examples: [
      { fr: "je ne sais pas", ipa: "/ʒə.n.sɛ.pa/", en: "no sé (oral)" },
      { fr: "samedi", ipa: "/sam.di/", en: "sábado (e muet chute)" },
      { fr: "petit", ipa: "/p(ə).ti/", en: "pequeño" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Registre familier : « je ne sais pas » se prononce souvent…",
        audio: "chais pas",
        options: ["/ʃɛ.pa/", "/ʒə.nə.sɛ.pa/", "/ʒə.nɛ.sɛ.pa/"],
        answer: "/ʃɛ.pa/",
        explain: "À l'oral familier : chute du « e » et de « ne ».",
      },
      {
        type: "repeat",
        question: "Répète sans le e muet :",
        target: "Je te le dis demain.",
        ipa: "/ʃtəl.di d(ə).mɛ̃/",
      },
    ],
  },
  {
    id: "enchainement",
    title: "L'enchaînement consonantique",
    ipa: "—",
    category: "Enchaînement & E muet",
    level: "B1",
    description:
      "Une consonne finale prononcée se rattache à la voyelle initiale du mot suivant.",
    tip: "Différent de la liaison : ici la consonne se prononce déjà toute seule.",
    examples: [
      { fr: "il a", ipa: "/i.la/", en: "él tiene" },
      { fr: "avec elle", ipa: "/a.vɛ.kɛl/", en: "con ella" },
      { fr: "une amie", ipa: "/y.na.mi/", en: "una amiga" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "Comment prononce-t-on « pour aller » ?",
        word: "pour aller",
        options: ["/pu.ʁa.le/", "/puʁ.a.le/", "/pu.aʁ.le/"],
        answer: "/pu.ʁa.le/",
      },
      {
        type: "repeat",
        question: "Enchaîne sans pause :",
        target: "Elle habite avec un ami.",
        ipa: "/ɛ.la.bi.t‿a.vɛ.k‿œ̃.n‿a.mi/",
      },
    ],
  },

  /* ───────────────────────── B2 ───────────────────────── */
  {
    id: "h-aspire",
    title: "« H » muet vs « H » aspiré",
    ipa: "—",
    category: "Liaisons",
    level: "B2",
    description:
      "El « h aspiré » bloquea la liaison y la elisión. El « h muet » se comporta como vocal.",
    tip: "No hay regla audible: hay que memorizar (los diccionarios marcan † o ’).",
    examples: [
      { fr: "les hommes (muet)", ipa: "/le.zɔm/", en: "los hombres → liaison" },
      { fr: "les haricots (aspiré)", ipa: "/le a.ʁi.ko/", en: "sin liaison" },
      { fr: "le héros (aspiré)", ipa: "/lə e.ʁo/", en: "sin elisión" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Quel énoncé est correct ?",
        audio: "les haricots",
        options: ["/le.za.ʁi.ko/", "/le a.ʁi.ko/"],
        answer: "/le a.ʁi.ko/",
        explain: "« haricot » a un h aspiré : pas de liaison.",
      },
      {
        type: "transcription",
        question: "« les hôtels » se prononce :",
        word: "les hôtels",
        options: ["/le.zo.tɛl/", "/le o.tɛl/"],
        answer: "/le.zo.tɛl/",
        explain: "« hôtel » : h muet → liaison en /z/.",
      },
    ],
  },
  {
    id: "rythme-groupe",
    title: "Le groupe rythmique et l'accent",
    ipa: "—",
    category: "Rythme & Intonation",
    level: "B2",
    description:
      "El francés tiene un acento fijo sobre la última sílaba pronunciada del grupo rítmico (no sobre la palabra).",
    tip: "Cuenta el grupo entero, no las palabras. « Je vais à Paris » = 1 grupo, acento sobre « -ri ».",
    examples: [
      { fr: "Je vais à Paris", ipa: "/ʒə.vɛ.za.pa.ʁi↑/", en: "ascendente non-final" },
      { fr: "Il pleut.", ipa: "/il.plø↓/", en: "descendente final" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Marque bien l'accent sur la dernière syllabe :",
        target: "Demain je pars en vacances en Italie.",
        ipa: "/d(ə).mɛ̃↑ ʒə.paʁ.z‿ɑ̃.va.kɑ̃s↑ ɑ̃.n‿i.ta.LI↓/",
      },
      {
        type: "discrimination",
        question: "Quelle phrase est une question (intonation montante) ?",
        audio: "Tu viens ?",
        options: ["Tu viens ?", "Tu viens."],
        answer: "Tu viens ?",
      },
    ],
  },
  {
    id: "intonation",
    title: "L'intonation déclarative, interrogative, expressive",
    ipa: "—",
    category: "Rythme & Intonation",
    level: "B2",
    description:
      "Cuatro patrones básicos: continuation (↑), finalidad (↓), pregunta total (↑↑), expresividad.",
    tip: "Sin signo de interrogación escrito, sólo la entonación distingue la pregunta.",
    examples: [
      { fr: "C'est vrai.", ipa: "/sɛ.vʁɛ↓/", en: "afirmación" },
      { fr: "C'est vrai ?", ipa: "/sɛ.vʁɛ↑↑/", en: "duda" },
      { fr: "C'est vrai !", ipa: "/sɛ.vʁɛ↑↓/", en: "asombro" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Quelle intention entends-tu ?",
        audio: "C'est vrai ?",
        options: ["Affirmation", "Question", "Surprise"],
        answer: "Question",
      },
      {
        type: "repeat",
        question: "Lis avec intonation montante :",
        target: "Tu pars demain matin ?",
      },
    ],
  },

  /* ───────────────────────── C1 ───────────────────────── */
  {
    id: "denasalisation",
    title: "Dénasalisation et coarticulation",
    ipa: "—",
    category: "Prosodie avancée",
    level: "C1",
    description:
      "En liaison, la voyelle nasale peut perdre sa nasalité : « bon ami » → /bɔ.na.mi/ (et non /bɔ̃.na.mi/).",
    tip: "Sólo ciertos adjetivos antepuestos (bon, ancien, plein, divin, certain) sufren dénasalisation.",
    examples: [
      { fr: "bon ami", ipa: "/bɔ.na.mi/", en: "(dénasalisé)" },
      { fr: "un bon homme", ipa: "/œ̃ bɔ.nɔm/", en: "" },
      { fr: "ancien élève", ipa: "/ɑ̃.sjɛ.ne.lɛv/", en: "" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "Prononciation soignée de « bon ami » ?",
        word: "bon ami",
        options: ["/bɔ̃.na.mi/", "/bɔ.na.mi/", "/bɔn.a.mi/"],
        answer: "/bɔ.na.mi/",
      },
      {
        type: "repeat",
        question: "Répète sans nasalité sur « bon » :",
        target: "C'est un bon ami de mon ancien élève.",
      },
    ],
  },
  {
    id: "geminees",
    title: "Les géminées expressives",
    ipa: "—",
    category: "Prosodie avancée",
    level: "C1",
    description:
      "En registre soutenu o expresivo, ciertas consonantes se duplican fonéticamente para marcar énfasis.",
    tip: "Frecuente en « il l'a dit » /il.la.di/, « elle l'aime » /ɛl.lɛm/, o expresivo : « c'est ssuper ! ».",
    examples: [
      { fr: "il l'a vu", ipa: "/il.la.vy/", en: "geminada /l/" },
      { fr: "une nnouvelle idée", ipa: "/yn.nu.vɛ.li.de/", en: "énfasis" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Marque bien la géminée :",
        target: "Il l'a dit, elle l'a entendu.",
        ipa: "/il.la.di ɛl.la.ɑ̃.tɑ̃.dy/",
      },
    ],
  },
  {
    id: "liaisons-interdites",
    title: "Liaisons interdites et facultatives",
    ipa: "—",
    category: "Liaisons",
    level: "C1",
    description:
      "Distingue las tres categorías: obligatorias, facultativas (estilo soutenu) e interdites (faltas).",
    tip: "Jamais après un nom singulier (« un soldat | anglais »), après « et », ni devant h aspiré.",
    examples: [
      { fr: "et après", ipa: "/e a.pʁɛ/", en: "interdite après et" },
      { fr: "un étudiant intelligent", ipa: "/œ̃.n‿e.ty.djɑ̃ ɛ̃.te.li.ʒɑ̃/", en: "interdite après nom sg." },
      { fr: "vous êtes arrivés (facultative)", ipa: "/vu.z‿ɛt(.z)‿a.ʁi.ve/", en: "" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Quelle prononciation est correcte (registre standard) ?",
        audio: "un soldat anglais",
        options: ["/œ̃ sɔl.da ɑ̃.ɡlɛ/", "/œ̃ sɔl.da.t‿ɑ̃.ɡlɛ/"],
        answer: "/œ̃ sɔl.da ɑ̃.ɡlɛ/",
        explain: "Liaison interdite après un nom singulier.",
      },
      {
        type: "transcription",
        question: "« Et alors » (jamais de liaison après et) :",
        word: "et alors",
        options: ["/e a.lɔʁ/", "/e.t‿a.lɔʁ/"],
        answer: "/e a.lɔʁ/",
      },
    ],
  },

  /* ───────────────────────── C2 ───────────────────────── */
  {
    id: "schwa-soutenu",
    title: "Le « e » caduc en registre soutenu",
    ipa: "/ə/",
    category: "Registres & Style",
    level: "C2",
    description:
      "En lectura formal, poesía o teatro clásico, el schwa se mantiene incluso donde el oral lo elide.",
    tip: "En vers classique, chaque e muet final compte comme une syllabe devant consonne.",
    examples: [
      { fr: "« Demain dès l'aube » (Hugo)", ipa: "/də.mɛ̃ dɛ lobə/", en: "e final prononcé" },
      { fr: "une petite fenêtre", ipa: "/y.nə pə.ti.tə fə.nɛ.tʁə/", en: "registre soutenu" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Lis avec tous les e muets (style classique) :",
        target: "Une petite fleur de printemps tendre et belle.",
        ipa: "/y.nə pə.ti.tə flœ.ʁə də pʁɛ̃.tɑ̃ tɑ̃.dʁə e bɛ.lə/",
      },
      {
        type: "discrimination",
        question: "Dans « une petite fenêtre », combien de syllabes en lecture soutenue ?",
        audio: "une petite fenêtre",
        options: ["5", "6", "7"],
        answer: "7",
        explain: "u-ne-pe-ti-te-fe-nê-tre → 7 syllabes (le -e final compte).",
      },
    ],
  },
  {
    id: "allophones-r",
    title: "Allophones du /ʁ/",
    ipa: "/ʁ ʀ ɣ χ/",
    category: "Prosodie avancée",
    level: "C2",
    description:
      "El /ʁ/ tiene variantes según contexto y registro: sonora /ʁ/, ensordecida [χ] (après sourde), apicale [r] (Midi, théâtre classique), uvulaire roulée [ʀ].",
    tip: "« trop » → /tχo/ avec R ensordecida après /t/ sourde.",
    examples: [
      { fr: "trop", ipa: "/tχo/", en: "R ensordecida" },
      { fr: "rare", ipa: "[ʁaʁ]", en: "standard" },
      { fr: "rare (Midi/classique)", ipa: "[raɾ]", en: "R apicale" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Quelle variante entends-tu ?",
        audio: "trop",
        options: ["[tʁo] sonore", "[tχo] sourde"],
        answer: "[tχo] sourde",
        explain: "Après une consonne sourde /t/, le R s'assourdit en [χ].",
      },
      {
        type: "repeat",
        question: "Articule en variant la R :",
        target: "Trois rares trains traversent Paris.",
      },
    ],
  },
  {
    id: "prosodie-discours",
    title: "Prosodie du discours : focus et emphase",
    ipa: "—",
    category: "Prosodie avancée",
    level: "C2",
    description:
      "El francés marca el énfasis no por acento léxico sino por dislocación + acento sur la première syllabe : « C'EST Marie qui l'a dit ».",
    tip: "Utiliza c'est… qui / c'est… que para focalizar, con un acento melódico sobre la sílaba destacada.",
    examples: [
      { fr: "C'est MARIE qui l'a dit.", ipa: "—", en: "focus sur Marie" },
      { fr: "Moi, je préfère le thé.", ipa: "—", en: "dislocation à gauche" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Mets l'accent emphatique sur MARIE :",
        target: "C'est Marie qui l'a dit, pas Paul.",
      },
      {
        type: "discrimination",
        question: "Quelle structure focalise le sujet ?",
        audio: "C'est Marie qui l'a dit.",
        options: [
          "Marie l'a dit.",
          "C'est Marie qui l'a dit.",
          "L'a-t-elle dit, Marie ?",
        ],
        answer: "C'est Marie qui l'a dit.",
      },
    ],
  },
  {
    id: "registres-phon",
    title: "Registres phoniques : soutenu, standard, familier",
    ipa: "—",
    category: "Registres & Style",
    level: "C2",
    description:
      "Una misma frase cambia de fonética según el registro: chutes du « ne », du « e », du « il » impersonnel, assimilations.",
    tip: "Soutenu garde tout ; familier supprime tout ce qui peut l'être.",
    examples: [
      { fr: "Il ne faut pas qu'il le sache. (soutenu)", ipa: "/il.nə.fo.pa.kil.lə.saʃ/", en: "" },
      { fr: "Faut pas qu'i'l'sache. (familier)", ipa: "/fo.pa.kil.saʃ/", en: "" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "Quel registre ?",
        audio: "Faut pas qu'i'l'sache.",
        options: ["Soutenu", "Standard", "Familier"],
        answer: "Familier",
      },
      {
        type: "repeat",
        question: "Lis la version familière :",
        target: "Chais pas c'qu'i' veut, lui.",
        ipa: "/ʃɛ.pa.s.ki.vø lɥi/",
      },
    ],
  },
];

export const getLesson = (id: string) => lessons.find((l) => l.id === id);

export const lessonsByLevel = (level: Level) =>
  lessons.filter((l) => l.level === level);
