export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonCategory =
  | "Alphabet & Chiffres"
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

  /* ───────────────── A1 — Alphabet & bases ───────────────── */
  {
    id: "alphabet",
    title: "L'alphabet français",
    ipa: "A–Z",
    category: "Alphabet & Chiffres",
    level: "A1",
    description:
      "Las 26 letras del francés. Útil para deletrear nombres, correos y direcciones.",
    tip: "Cuidado con E /ə/, G /ʒe/, H /aʃ/, I /i/, J /ʒi/, W /dubləve/, Y /iɡʁɛk/.",
    examples: [
      { fr: "A B C D E F G", ipa: "/a be se de ə ɛf ʒe/", en: "primeras letras" },
      { fr: "H I J K L M N", ipa: "/aʃ i ʒi ka ɛl ɛm ɛn/", en: "letras medias" },
      { fr: "O P Q R S T U", ipa: "/o pe ky ɛʁ ɛs te y/", en: "siguientes" },
      { fr: "V W X Y Z", ipa: "/ve dubləve iks iɡʁɛk zɛd/", en: "finales" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué letra escuchas?",
        audio: "J",
        options: ["G", "J", "I"],
        answer: "J",
        explain: "J se dice /ʒi/, G se dice /ʒe/.",
      },
      {
        type: "discrimination",
        question: "¿Qué letra escuchas?",
        audio: "Y",
        options: ["I", "Y", "U"],
        answer: "Y",
        explain: "Y se dice « i grec » /iɡʁɛk/.",
      },
      {
        type: "repeat",
        question: "Deletrea tu nombre o esta palabra :",
        target: "L O V A B L E",
        ipa: "/ɛl o ve a be ɛl ə/",
      },
    ],
  },
  {
    id: "chiffres",
    title: "Les chiffres 0–20",
    ipa: "0–20",
    category: "Alphabet & Chiffres",
    level: "A1",
    description:
      "Los números básicos con sus liaisons (« deux_ans », « trois_heures »).",
    tip: "Cinq, six, huit, dix pierden /k, s, t, s/ delante de consonante : « six livres » /si livʁ/.",
    examples: [
      { fr: "un, deux, trois", ipa: "/œ̃ dø tʁwa/", en: "1, 2, 3" },
      { fr: "quatre, cinq, six", ipa: "/katʁ sɛ̃k sis/", en: "4, 5, 6" },
      { fr: "sept, huit, neuf, dix", ipa: "/sɛt ɥit nœf dis/", en: "7, 8, 9, 10" },
      { fr: "vingt", ipa: "/vɛ̃/", en: "20 (t muda salvo en liaison)" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "« six livres » se prononce…",
        word: "six livres",
        options: ["/sis livʁ/", "/si livʁ/", "/siks livʁ/"],
        answer: "/si livʁ/",
        explain: "Devant consonne, le « x » de six tombe.",
      },
      {
        type: "dictee",
        question: "Écris le chiffre que tu entends :",
        audio: "dix-sept",
        answer: "dix-sept",
        explain: "/di.sɛt/ — le « x » devient /s/ en liaison interne.",
      },
    ],
  },

  /* ───────────────── A1 — Nasale /œ̃/ ───────────────── */
  {
    id: "nasale-un",
    title: "La nasale « un / um »",
    ipa: "/œ̃/",
    category: "Voyelles nasales",
    level: "A1",
    description:
      "Nasal redondeada, cada vez más cercana a /ɛ̃/ en el francés estándar moderno.",
    tip: "Boca como para /œ/ (œuf) + aire por la nariz. Muchos hablantes la fusionan con /ɛ̃/.",
    examples: [
      { fr: "un", ipa: "/œ̃/", en: "uno / un" },
      { fr: "lundi", ipa: "/lœ̃.di/", en: "lunes" },
      { fr: "parfum", ipa: "/paʁ.fœ̃/", en: "perfume" },
      { fr: "brun", ipa: "/bʁœ̃/", en: "moreno" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "brun",
        options: ["brin", "brun", "bron"],
        answer: "brun",
        explain: "« brin » /bʁɛ̃/ vs « brun » /bʁœ̃/ — distinción cada vez más débil.",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Un parfum brun.",
        ipa: "/œ̃ paʁ.fœ̃ bʁœ̃/",
      },
    ],
  },

  /* ───────────────── A1 — Voyelles e / o ───────────────── */
  {
    id: "voyelles-e",
    title: "Le « é » /e/ vs « è/ê » /ɛ/",
    ipa: "/e/ ↔ /ɛ/",
    category: "Voyelles",
    level: "A1",
    description:
      "Distinción esencial : /e/ cerrado (été) vs /ɛ/ abierto (mère, fête).",
    tip: "/e/ : sonrisa amplia, boca cerrada. /ɛ/ : boca más abierta, como en « español ».",
    examples: [
      { fr: "été", ipa: "/e.te/", en: "verano" },
      { fr: "mère", ipa: "/mɛʁ/", en: "madre" },
      { fr: "fête", ipa: "/fɛt/", en: "fiesta" },
      { fr: "parler", ipa: "/paʁ.le/", en: "hablar" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué palabra oyes?",
        audio: "mère",
        options: ["mer", "mère", "maire"],
        answer: "mère",
        explain: "Las tres se pronuncian /mɛʁ/ — son homófonas.",
      },
      {
        type: "transcription",
        question: "« parler » se prononce…",
        word: "parler",
        options: ["/paʁ.le/", "/paʁ.lɛ/", "/paʁ.lɛʁ/"],
        answer: "/paʁ.le/",
        explain: "-er en infinitivo = /e/ cerrado.",
      },
    ],
  },
  {
    id: "voyelles-o",
    title: "Le « o » /o/ vs /ɔ/",
    ipa: "/o/ ↔ /ɔ/",
    category: "Voyelles",
    level: "A2",
    description:
      "/o/ cerrado (sílaba abierta o « ô »); /ɔ/ abierto (sílaba cerrada).",
    tip: "« mot » /mo/ — sílaba abierta. « porte » /pɔʁt/ — sílaba cerrada.",
    examples: [
      { fr: "mot", ipa: "/mo/", en: "palabra" },
      { fr: "porte", ipa: "/pɔʁt/", en: "puerta" },
      { fr: "rôle", ipa: "/ʁol/", en: "rol (ô = cerrado)" },
      { fr: "homme", ipa: "/ɔm/", en: "hombre" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "paume",
        options: ["pomme", "paume"],
        answer: "paume",
        explain: "« pomme » /pɔm/ vs « paume » /pom/.",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "L'homme a un beau rôle.",
        ipa: "/lɔm a œ̃ bo ʁol/",
      },
    ],
  },

  /* ───────────────── A2 — Consonnes spécifiques ───────────────── */
  {
    id: "consonnes-ch-j",
    title: "« ch » /ʃ/ vs « j / ge » /ʒ/",
    ipa: "/ʃ/ ↔ /ʒ/",
    category: "Consonnes",
    level: "A2",
    description:
      "Dos consonantes fricativas postalveolares; /ʃ/ sorda, /ʒ/ sonora.",
    tip: "/ʃ/ como « show » en inglés. /ʒ/ como la « g » de « rouge » : vibran las cuerdas vocales.",
    examples: [
      { fr: "chat", ipa: "/ʃa/", en: "gato" },
      { fr: "jardin", ipa: "/ʒaʁ.dɛ̃/", en: "jardín" },
      { fr: "geler", ipa: "/ʒə.le/", en: "congelar" },
      { fr: "chercher", ipa: "/ʃɛʁ.ʃe/", en: "buscar" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "joue",
        options: ["chou", "joue"],
        answer: "joue",
        explain: "« chou » /ʃu/ vs « joue » /ʒu/.",
      },
      {
        type: "repeat",
        question: "Trabalenguas :",
        target: "Je cherche un chat dans le jardin.",
        ipa: "/ʒə ʃɛʁʃ œ̃ ʃa dɑ̃ lə ʒaʁ.dɛ̃/",
      },
    ],
  },
  {
    id: "consonne-gn",
    title: "« gn » /ɲ/",
    ipa: "/ɲ/",
    category: "Consonnes",
    level: "A2",
    description: "Consonante nasal palatal, como la « ñ » del español.",
    tip: "Lengua bien apoyada en el paladar : « montagne » suena casi como « montaña ».",
    examples: [
      { fr: "montagne", ipa: "/mɔ̃.taɲ/", en: "montaña" },
      { fr: "Espagne", ipa: "/ɛs.paɲ/", en: "España" },
      { fr: "agneau", ipa: "/a.ɲo/", en: "cordero" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "« montagne » se prononce…",
        word: "montagne",
        options: ["/mɔ̃.taɲ/", "/mɔ̃.tan/", "/mɔ̃.taɡn/"],
        answer: "/mɔ̃.taɲ/",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "L'agneau dort dans la montagne d'Espagne.",
        ipa: "/la.ɲo dɔʁ dɑ̃ la mɔ̃.taɲ dɛs.paɲ/",
      },
    ],
  },

  /* ───────────────── B2 — Voyelles ouvertes/fermées ───────────────── */
  {
    id: "loi-position",
    title: "La loi de position",
    ipa: "ouvert ↔ fermé",
    category: "Voyelles",
    level: "B2",
    description:
      "Regla general : sílaba abierta → vocal cerrada (/e o ø/); sílaba cerrada → vocal abierta (/ɛ ɔ œ/).",
    tip: "Excepciones : -ose, -ase → cerrada (« rose » /ʁoz/). El acento circunflejo fuerza cerrada.",
    examples: [
      { fr: "rose", ipa: "/ʁoz/", en: "rosa (excepción : cerrada)" },
      { fr: "sotte", ipa: "/sɔt/", en: "tonta (abierta)" },
      { fr: "jeûne", ipa: "/ʒøn/", en: "ayuno (cerrada por ^)" },
      { fr: "jeune", ipa: "/ʒœn/", en: "joven (abierta)" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "jeûne",
        options: ["jeune", "jeûne"],
        answer: "jeûne",
        explain: "« jeune » /ʒœn/ vs « jeûne » /ʒøn/ — minimal pair clave en B2/C1.",
      },
      {
        type: "transcription",
        question: "« rose » suit-elle la loi de position ?",
        word: "rose",
        options: ["/ʁɔz/", "/ʁoz/", "/ʁos/"],
        answer: "/ʁoz/",
        explain: "Non : -ose force la voyelle fermée /o/.",
      },
    ],
  },

  /* ───────────────── A1 — Voyelles orales de base ───────────────── */
  {
    id: "voyelle-a",
    title: "La voyelle « a »",
    ipa: "/a/",
    category: "Voyelles",
    level: "A1",
    description:
      "Vocal central abierta, muy parecida a la « a » del español. Grafías : a, à, â.",
    tip: "Boca bien abierta, lengua plana en el centro. No la oscurezcas hacia « o ».",
    examples: [
      { fr: "papa", ipa: "/pa.pa/", en: "papá" },
      { fr: "là", ipa: "/la/", en: "allí" },
      { fr: "théâtre", ipa: "/te.atʁ/", en: "teatro" },
      { fr: "chat", ipa: "/ʃa/", en: "gato" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "chat",
        options: ["chat", "chaud", "chou"],
        answer: "chat",
        explain: "« chat » /ʃa/ vs « chaud » /ʃo/ vs « chou » /ʃu/.",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Papa va à La Havane.",
        ipa: "/pa.pa va a la a.van/",
      },
    ],
  },
  {
    id: "voyelle-i",
    title: "La voyelle « i »",
    ipa: "/i/",
    category: "Voyelles",
    level: "A1",
    description:
      "Vocal cerrada anterior estirada. Grafías : i, î, ï, y.",
    tip: "Sonríe ampliamente, lengua adelantada y arriba. Más tensa que la « i » española.",
    examples: [
      { fr: "lit", ipa: "/li/", en: "cama" },
      { fr: "île", ipa: "/il/", en: "isla" },
      { fr: "maïs", ipa: "/ma.is/", en: "maíz" },
      { fr: "cycle", ipa: "/sikl/", en: "ciclo" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "« cycle » se prononce…",
        word: "cycle",
        options: ["/sikl/", "/sajkl/", "/kikl/"],
        answer: "/sikl/",
        explain: "« y » = /i/ en francés.",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Il lit dans son lit, ici.",
        ipa: "/il li dɑ̃ sɔ̃ li i.si/",
      },
    ],
  },
  {
    id: "voyelle-ou",
    title: "La voyelle « ou »",
    ipa: "/u/",
    category: "Voyelles",
    level: "A1",
    description:
      "Vocal cerrada posterior redondeada, igual que la « u » del español. Grafías : ou, où, oû.",
    tip: "No confundir con « u » /y/. « ou » = labios redondos + lengua atrás.",
    examples: [
      { fr: "loup", ipa: "/lu/", en: "lobo" },
      { fr: "où", ipa: "/u/", en: "dónde" },
      { fr: "goût", ipa: "/ɡu/", en: "sabor" },
      { fr: "vous", ipa: "/vu/", en: "vosotros / usted" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "/y/ vs /u/ : ¿qué oyes?",
        audio: "roue",
        options: ["rue", "roue"],
        answer: "roue",
        explain: "« rue » /ʁy/ (lengua adelante) vs « roue » /ʁu/ (lengua atrás).",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Vous voulez où ?",
        ipa: "/vu vu.le u/",
      },
    ],
  },
  {
    id: "voyelle-oe",
    title: "La voyelle « œ » ouverte",
    ipa: "/œ/",
    category: "Voyelles",
    level: "A2",
    description:
      "Vocal anterior redondeada abierta. Grafías : eu/œu en sílaba cerrada, œ inicial.",
    tip: "Como /ø/ pero con la boca más abierta. « sœur », « cœur », « fleur ».",
    examples: [
      { fr: "sœur", ipa: "/sœʁ/", en: "hermana" },
      { fr: "fleur", ipa: "/flœʁ/", en: "flor" },
      { fr: "cœur", ipa: "/kœʁ/", en: "corazón" },
      { fr: "œuvre", ipa: "/œvʁ/", en: "obra" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "/ø/ vs /œ/ : ¿qué oyes?",
        audio: "fleur",
        options: ["feu", "fleur"],
        answer: "fleur",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Ma sœur a un cœur en fleur.",
        ipa: "/ma sœʁ a œ̃ kœʁ ɑ̃ flœʁ/",
      },
    ],
  },
  {
    id: "voyelle-schwa",
    title: "Le schwa « ə »",
    ipa: "/ə/",
    category: "Voyelles",
    level: "A2",
    description:
      "Vocal central neutra muy breve, en monosílabos y sílabas internas (le, de, ce, me).",
    tip: "Boca apenas redondeada, sin tensión. Suele caer en habla rápida.",
    examples: [
      { fr: "le", ipa: "/lə/", en: "el" },
      { fr: "de", ipa: "/də/", en: "de" },
      { fr: "ce", ipa: "/sə/", en: "este" },
      { fr: "premier", ipa: "/pʁə.mje/", en: "primero" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "« premier » se prononce…",
        word: "premier",
        options: ["/pʁe.mje/", "/pʁə.mje/", "/pʁɛ.mje/"],
        answer: "/pʁə.mje/",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Je te le redis.",
        ipa: "/ʒə tə lə ʁə.di/",
      },
    ],
  },

  /* ───────────────── A1 — Consonnes occlusives ───────────────── */
  {
    id: "consonnes-p-b",
    title: "« p » /p/ vs « b » /b/",
    ipa: "/p/ ↔ /b/",
    category: "Consonnes",
    level: "A1",
    description:
      "Oclusivas bilabiales: /p/ sorda, /b/ sonora. Grafías : p/pp, b/bb.",
    tip: "/p/ francesa es seca, sin aspiración (a diferencia del inglés).",
    examples: [
      { fr: "père", ipa: "/pɛʁ/", en: "padre" },
      { fr: "appel", ipa: "/a.pɛl/", en: "llamada" },
      { fr: "ballon", ipa: "/ba.lɔ̃/", en: "pelota" },
      { fr: "abbé", ipa: "/a.be/", en: "abad" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "pain",
        options: ["pain", "bain"],
        answer: "pain",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Papa porte un beau ballon.",
        ipa: "/pa.pa pɔʁt œ̃ bo ba.lɔ̃/",
      },
    ],
  },
  {
    id: "consonnes-t-d",
    title: "« t » /t/ vs « d » /d/",
    ipa: "/t/ ↔ /d/",
    category: "Consonnes",
    level: "A1",
    description:
      "Oclusivas dentales: lengua contra los dientes superiores (no contra los alvéolos como en inglés).",
    tip: "/t/ sin aspiración. Grafías : t/tt/th ; d/dd/dh.",
    examples: [
      { fr: "table", ipa: "/tabl/", en: "mesa" },
      { fr: "thé", ipa: "/te/", en: "té" },
      { fr: "donner", ipa: "/dɔ.ne/", en: "dar" },
      { fr: "addition", ipa: "/a.di.sjɔ̃/", en: "suma / cuenta" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "ton",
        options: ["ton", "don"],
        answer: "ton",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Tu donnes ta table à Daniel.",
        ipa: "/ty dɔn ta tabl a da.njɛl/",
      },
    ],
  },
  {
    id: "consonnes-k-g",
    title: "« k » /k/ vs « g » /g/",
    ipa: "/k/ ↔ /ɡ/",
    category: "Consonnes",
    level: "A1",
    description:
      "Oclusivas velares. /k/ : c+a/o/u, qu, k, ch (griego), x [ks]. /ɡ/ : g+a/o/u, gu+vocal.",
    tip: "« qu » siempre = /k/ : « quand » /kɑ̃/, no /kw/.",
    examples: [
      { fr: "cas", ipa: "/ka/", en: "caso" },
      { fr: "quand", ipa: "/kɑ̃/", en: "cuándo" },
      { fr: "kilo", ipa: "/ki.lo/", en: "kilo" },
      { fr: "garder", ipa: "/ɡaʁ.de/", en: "guardar" },
    ],
    exercises: [
      {
        type: "transcription",
        question: "« orchestre » se prononce…",
        word: "orchestre",
        options: ["/ɔʁ.kɛstʁ/", "/ɔʁ.ʃɛstʁ/", "/ɔʁ.tʃɛstʁ/"],
        answer: "/ɔʁ.kɛstʁ/",
        explain: "« ch » de origen griego = /k/.",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Quand le grand garçon casse le kilo.",
      },
    ],
  },

  /* ───────────────── A1/A2 — Fricatives ───────────────── */
  {
    id: "consonnes-f-v",
    title: "« f » /f/ vs « v » /v/",
    ipa: "/f/ ↔ /v/",
    category: "Consonnes",
    level: "A1",
    description:
      "Fricativas labiodentales. /v/ NO existe en español : dientes superiores sobre el labio inferior vibrando.",
    tip: "« w » en préstamos también suena /v/ : « wagon » /va.ɡɔ̃/.",
    examples: [
      { fr: "café", ipa: "/ka.fe/", en: "café" },
      { fr: "physique", ipa: "/fi.zik/", en: "física" },
      { fr: "venir", ipa: "/və.niʁ/", en: "venir" },
      { fr: "wagon", ipa: "/va.ɡɔ̃/", en: "vagón" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "vous",
        options: ["fou", "vous"],
        answer: "vous",
      },
      {
        type: "repeat",
        question: "Répète en vibrant bien le /v/ :",
        target: "Vincent vient voir un vieux film.",
        ipa: "/vɛ̃.sɑ̃ vjɛ̃ vwaʁ œ̃ vjø film/",
      },
    ],
  },
  {
    id: "consonnes-s-z",
    title: "« s » /s/ vs « z » /z/",
    ipa: "/s/ ↔ /z/",
    category: "Consonnes",
    level: "A2",
    description:
      "Regla clave : « s » entre dos vocales = /z/. « ss » siempre = /s/.",
    tip: "« poisson » /pwa.sɔ̃/ (pez) vs « poison » /pwa.zɔ̃/ (veneno) — ¡atención!",
    examples: [
      { fr: "poisson", ipa: "/pwa.sɔ̃/", en: "pez" },
      { fr: "poison", ipa: "/pwa.zɔ̃/", en: "veneno" },
      { fr: "zéro", ipa: "/ze.ʁo/", en: "cero" },
      { fr: "causer", ipa: "/ko.ze/", en: "causar" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "¿Qué oyes?",
        audio: "poison",
        options: ["poisson", "poison"],
        answer: "poison",
        explain: "Una sola « s » entre vocales = /z/.",
      },
      {
        type: "transcription",
        question: "« dessert » se prononce…",
        word: "dessert",
        options: ["/de.zɛʁ/", "/de.sɛʁ/"],
        answer: "/de.sɛʁ/",
        explain: "« ss » = /s/. « désert » (con una s) = /de.zɛʁ/.",
      },
    ],
  },

  /* ───────────────── A1 — Nasales et liquide ───────────────── */
  {
    id: "consonnes-m-n",
    title: "« m » /m/ et « n » /n/",
    ipa: "/m/ /n/",
    category: "Consonnes",
    level: "A1",
    description:
      "Nasales orales. ¡Ojo! Cuando « m/n » siguen a una vocal en la misma sílaba, suelen formar una vocal nasal (an, on, in, un).",
    tip: "« mer » /mɛʁ/ (m oral) ; « main » /mɛ̃/ (n nasaliza la vocal).",
    examples: [
      { fr: "mère", ipa: "/mɛʁ/", en: "madre" },
      { fr: "commode", ipa: "/kɔ.mɔd/", en: "cómoda" },
      { fr: "nez", ipa: "/ne/", en: "nariz" },
      { fr: "colonne", ipa: "/kɔ.lɔn/", en: "columna" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Répète :",
        target: "Maman a mis le nez dans la colonne.",
        ipa: "/ma.mɑ̃ a mi lə ne dɑ̃ la kɔ.lɔn/",
      },
    ],
  },
  {
    id: "consonne-l",
    title: "La consonne « l » /l/",
    ipa: "/l/",
    category: "Consonnes",
    level: "A1",
    description:
      "Lateral alveolar clara. Nunca « oscura » como en inglés americano.",
    tip: "Punta de la lengua firme contra los alvéolos. « ll » también = /l/ (« belle » /bɛl/).",
    examples: [
      { fr: "lit", ipa: "/li/", en: "cama" },
      { fr: "belle", ipa: "/bɛl/", en: "bella" },
      { fr: "Lille", ipa: "/lil/", en: "Lille (ciudad)" },
      { fr: "élève", ipa: "/e.lɛv/", en: "alumno" },
    ],
    exercises: [
      {
        type: "repeat",
        question: "Répète :",
        target: "La belle élève de Lille lit.",
        ipa: "/la bɛl e.lɛv də lil li/",
      },
    ],
  },
  {
    id: "consonne-ng",
    title: "« ng » /ŋ/ (anglicismes)",
    ipa: "/ŋ/",
    category: "Consonnes",
    level: "B1",
    description:
      "Nasal velar, importada del inglés. Aparece en préstamos: parking, camping, smoking.",
    tip: "Lengua atrás, contra el velo del paladar. No es lo mismo que /n/ ni que /ɲ/.",
    examples: [
      { fr: "parking", ipa: "/paʁ.kiŋ/", en: "aparcamiento" },
      { fr: "camping", ipa: "/kɑ̃.piŋ/", en: "camping" },
      { fr: "shopping", ipa: "/ʃɔ.piŋ/", en: "compras" },
    ],
    exercises: [
      {
        type: "discrimination",
        question: "/n/ vs /ŋ/ : ¿qué oyes?",
        audio: "parking",
        options: ["parkine", "parking"],
        answer: "parking",
      },
      {
        type: "repeat",
        question: "Répète :",
        target: "Le parking du camping est plein.",
        ipa: "/lə paʁ.kiŋ dy kɑ̃.piŋ ɛ plɛ̃/",
      },
    ],
  },
];

export const getLesson = (id: string) => lessons.find((l) => l.id === id);

export const lessonsByLevel = (level: Level) =>
  lessons.filter((l) => l.level === level);
