export type Lesson = {
  id: string;
  title: string;
  ipa: string;
  category: "Voyelles nasales" | "Le R français" | "Voyelles" | "Liaisons";
  level: "A1" | "A2" | "B1" | "B2";
  description: string;
  tip: string;
  examples: { fr: string; ipa: string; en: string }[];
};

export const lessons: Lesson[] = [
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
  },
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
  },
  {
    id: "liaison",
    title: "Les liaisons",
    ipa: "—",
    category: "Liaisons",
    level: "B1",
    description:
      "Conexión obligatoria entre palabras: una consonante muda se pronuncia ante vocal.",
    tip: "Lee como si fuera una sola palabra. 'Les amis' suena /le.za.mi/.",
    examples: [
      { fr: "les amis", ipa: "/le.za.mi/", en: "los amigos" },
      { fr: "nous avons", ipa: "/nu.za.vɔ̃/", en: "nosotros tenemos" },
      { fr: "un grand homme", ipa: "/œ̃ ɡʁɑ̃.tɔm/", en: "un gran hombre" },
    ],
  },
];

export const getLesson = (id: string) => lessons.find((l) => l.id === id);
