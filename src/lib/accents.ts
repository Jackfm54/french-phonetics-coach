/**
 * Presets de acentos regionales del francés para openai/gpt-4o-mini-tts.
 * Se aplican vía `voice` + `instructions`.
 */
export type AccentId =
  | "fr_standard"
  | "fr_parisien"
  | "fr_meridional"
  | "qc_quebecois"
  | "be_belge"
  | "ch_suisse"
  | "af_africain";

export type AccentPreset = {
  id: AccentId;
  label: string;
  flag: string;
  voice: string;
  instructions: string;
  description: string;
};

export const ACCENTS: AccentPreset[] = [
  {
    id: "fr_standard",
    label: "Français standard",
    flag: "🇫🇷",
    voice: "nova",
    description: "Neutro, ideal para aprender.",
    instructions:
      "Parle en français de France standard, prononciation claire et neutre, articulation soignée, débit posé adapté à un apprenant. Liaisons naturelles.",
  },
  {
    id: "fr_parisien",
    label: "Parisien",
    flag: "🗼",
    voice: "shimmer",
    description: "París, ritmo rápido, elisiones urbanas.",
    instructions:
      "Parle avec un accent parisien contemporain: débit rapide, /R/ légèrement grasseyé, chute fréquente du « ne » de négation, voyelles antérieures marquées. Reste compréhensible.",
  },
  {
    id: "fr_meridional",
    label: "Meridional (Marsella)",
    flag: "☀️",
    voice: "onyx",
    description: "Sur de Francia, cantarín, nasales abiertas.",
    instructions:
      "Parle avec un accent méridional du sud de la France (type marseillais): intonation chantante, e caducs prononcés (« une petite fenêtre » → « une pétite fénêtre »), voyelles nasales très ouvertes, /R/ plus roulé.",
  },
  {
    id: "qc_quebecois",
    label: "Québécois",
    flag: "🍁",
    voice: "echo",
    description: "Quebec, diptongación, T/D africadas.",
    instructions:
      "Parle avec un accent québécois clair: diphtongaison des voyelles longues (père→paèr, mère→maèr), affrication de /t/ et /d/ devant /i,y/ (tu→tsu, dire→dzire), voyelles nasales antériorisées, intonation typique du Québec.",
  },
  {
    id: "be_belge",
    label: "Belge",
    flag: "🇧🇪",
    voice: "alloy",
    description: "Bélgica, ritmo pausado, W como /w/.",
    instructions:
      "Parle avec un accent belge francophone: débit un peu plus lent, voyelles longues bien tenues, distinction « brun/brin », prononciation du « w » comme /w/ (wagon → wagon), « septante » et « nonante » possibles.",
  },
  {
    id: "ch_suisse",
    label: "Suisse romand",
    flag: "🇨🇭",
    voice: "fable",
    description: "Suiza, cadencia lenta, vocales largas.",
    instructions:
      "Parle avec un accent suisse romand: débit lent et posé, voyelles longues bien marquées, intonation descendante en fin de phrase, « huitante » possible pour 80.",
  },
  {
    id: "af_africain",
    label: "Africano (Dakar/Abiyán)",
    flag: "🌍",
    voice: "onyx",
    description: "África francófona, /R/ vibrante, ritmo silábico.",
    instructions:
      "Parle avec un accent d'Afrique francophone (Dakar/Abidjan): /R/ apical vibrant, rythme syllabique (chaque syllabe bien détachée), voyelles pleines sans réduction, intonation mélodique.",
  },
];

export function getAccent(id: string | undefined | null): AccentPreset {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}
