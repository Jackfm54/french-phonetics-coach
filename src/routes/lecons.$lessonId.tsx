import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getLesson, lessons, type Lesson } from "@/lib/lessons";
import { speakFr } from "@/lib/speak";
import { Volume2 } from "lucide-react";
import { PronunciationPractice } from "@/components/PronunciationPractice";
import { InteractiveExercises } from "@/components/InteractiveExercises";
import { buildLessonExercises, buildPracticePool } from "@/lib/exercise-pool";

export const Route = createFileRoute("/lecons/$lessonId")({
  head: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    return {
      meta: [
        {
          title: lesson
            ? `${lesson.title} ${lesson.ipa} · Professeur.fr`
            : "Lección · Professeur.fr",
        },
        {
          name: "description",
          content: lesson?.description ?? "Lección de fonética francesa.",
        },
      ],
    };
  },
  loader: ({ params }): { lesson: Lesson } => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson };
  },
  component: LessonPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Leçon introuvable</h1>
        <Link to="/lecons" className="mt-4 inline-block text-primary hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  ),
});

// Mapa IPA → palabras-ejemplo que el TTS francés pronuncia exactamente como
// el fonema mostrado en la tabla de fonética. Usamos 3 ejemplos cortos para que
// el sonido se oiga aislado y claro, evitando que el TTS lo lea como nombre de
// letra (p. ej. "u" suelto = nombre de letra, "tu" = sonido /y/ claro).
const IPA_TO_GRAPHEME: Record<string, string> = {
  // ── Voyelles orales ──
  "/a/": "papa, la, ami",
  "/i/": "ici, lit, il",
  "/u/": "vous, tout, nous",
  "/y/": "tu, rue, lune",
  "/e/": "été, nez, parler",
  "/ɛ/": "mère, très, fête",
  "/o/": "mot, beau, eau",
  "/ɔ/": "porte, sort, bonne",
  "/ø/": "deux, peu, bleu",
  "/œ/": "sœur, peur, fleur",
  "/ə/": "le, de, petit",

  // ── Voyelles nasales ──
  "/ɑ̃/": "enfant, France, dans",
  "/ɔ̃/": "bonjour, maison, bon",
  "/ɛ̃/": "vin, pain, matin",
  "/œ̃/": "un, brun, parfum",
  "/ɑ̃/, /ɔ̃/, /ɛ̃/": "enfant, bon, vin",

  // ── Semi-voyelles ──
  "/j/": "fille, yeux, payer",
  "/w/": "oui, moi, froid",
  "/ɥ/": "huit, lui, nuit",
  "/j w ɥ/": "fille, oui, huit",

  // ── Consonnes ──
  "/p/": "papa, pain, pomme",
  "/b/": "bébé, bon, beau",
  "/t/": "table, tu, tomate",
  "/d/": "dame, dire, deux",
  "/k/": "café, qui, cou",
  "/ɡ/": "gare, gomme, guide",
  "/f/": "fou, femme, feu",
  "/v/": "vous, vie, vrai",
  "/s/": "sa, soir, ici",
  "/z/": "zéro, maison, rose",
  "/ʃ/": "chat, chien, chez",
  "/ʒ/": "je, jour, jaune",
  "/m/": "maman, mer, main",
  "/n/": "nous, neuf, nuit",
  "/ɲ/": "agneau, montagne, gagner",
  "/ŋ/": "parking, camping, shopping",
  "/l/": "la, lit, livre",
  "/ʁ/": "Paris, rouge, rare",
  "/ʁ ʀ ɣ χ/": "Paris, rouge, rare",

  // ── Contrastes (paires minimales) ──
  "/p/ ↔ /b/": "pain, bain, papa, baba",
  "/t/ ↔ /d/": "ton, don, tu, du",
  "/k/ ↔ /ɡ/": "car, gare, quand, gant",
  "/f/ ↔ /v/": "fou, vous, faim, vin",
  "/s/ ↔ /z/": "poisson, poison, base, basse",
  "/ʃ/ ↔ /ʒ/": "chien, gens, cher, jerre",
  "/m/ /n/": "maman, nous, mer, ne",
  "/e/ ↔ /ɛ/": "été, être, nez, neige",
  "/o/ ↔ /ɔ/": "beau, bonne, saute, sotte",
};

function isolatedSoundFor(lesson: { ipa: string; examples: { fr: string }[]; title: string }): string {
  // 1) Prioridad: extraer la grafía entre « ... » del título (p. ej. "an / en").
  //    El TTS francés pronuncia "an, en" exactamente como el fonema mostrado.
  const guillemets = lesson.title.match(/«\s*([^»]+?)\s*»/);
  if (guillemets) {
    const graphies = guillemets[1]
      .split(/[\/·,]| vs | ↔ /i)
      .map((s) => s.trim())
      .filter(Boolean);
    if (graphies.length) return graphies.join(", ");
  }
  // 2) Si no hay guillemets, usamos el mapeo IPA → palabras-ejemplo.
  const mapped = IPA_TO_GRAPHEME[lesson.ipa];
  if (mapped) return mapped;
  // 3) Fallback: el ejemplo más corto.
  return (
    [...lesson.examples]
      .map((e) => e.fr)
      .sort((a, b) => a.split(/\s+/).length - b.split(/\s+/).length || a.length - b.length)[0] ??
    lesson.title
  );
}

function LessonPage() {
  const { lesson } = Route.useLoaderData() as unknown as { lesson: Lesson };
  const exercises = useMemo(() => buildLessonExercises(lesson, 15), [lesson.id]);
  const practiceTargets = useMemo(() => buildPracticePool(lesson, 15), [lesson.id]);
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];
  const [rate, setRate] = useState(0.9);

  const soundSample = isolatedSoundFor(lesson);

  const speedPresets: { label: string; value: number }[] = [
    { label: "Très lent", value: 0.5 },
    { label: "Lent", value: 0.75 },
    { label: "Normal", value: 0.9 },
    { label: "Rapide", value: 1.1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/lecons" className="text-sm text-muted-foreground hover:text-primary">
          ← Toutes les leçons
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              {lesson.category}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
              Niveau {lesson.level}
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
            {lesson.title}
          </h1>
          <div className="mt-8 rounded-3xl border border-border bg-[image:var(--bg-gradient-hero)] p-8">
            <div className="flex items-center gap-6">
              <p className="font-display text-7xl font-semibold text-primary lg:text-8xl">
                {lesson.ipa}
              </p>
              <button
                onClick={() => speakFr(soundSample, rate)}
                className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant transition hover:scale-105"
                aria-label={`Écouter le son ${lesson.ipa} (${soundSample})`}
                title={`Écouter : ${soundSample}`}
              >
                <Volume2 className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 border-t border-border/60 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="speed-range"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Vitesse de lecture
                </label>
                <span className="font-mono text-sm text-primary">×{rate.toFixed(2)}</span>
              </div>
              <input
                id="speed-range"
                type="range"
                min={0.4}
                max={1.3}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {speedPresets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setRate(p.value)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      Math.abs(rate - p.value) < 0.01
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <p className="text-lg leading-relaxed text-foreground">{lesson.description}</p>
          <div className="mt-6 rounded-2xl border-l-4 border-primary bg-secondary/60 p-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Astuce
            </p>
            <p className="mt-1 text-foreground">{lesson.tip}</p>
          </div>
        </section>

        <section className="mt-10">
          <PronunciationPractice
            target={lesson.examples[0]?.fr ?? lesson.title}
            lessonTitle={lesson.title}
          />
        </section>

        {exercises.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold">
                Exercices interactifs
              </h2>
              <span className="text-xs text-muted-foreground">
                {exercises.length} exercices · ordre aléatoire
              </span>
            </div>
            <InteractiveExercises exercises={exercises} />
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-semibold">Exemples</h2>
          <ul className="space-y-3">
            {lesson.examples.map((ex: Lesson["examples"][number]) => (
              <li
                key={ex.fr}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-5"
              >
                <div>
                  <p className="font-display text-xl font-semibold">{ex.fr}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary">{ex.ipa}</span> · {ex.en}
                  </p>
                </div>
                <button
                  onClick={() => speakFr(ex.fr, rate)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-primary hover:text-primary-foreground"
                  aria-label={`Écouter ${ex.fr}`}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            to="/chat"
            className="text-sm font-medium text-primary hover:underline"
          >
            Practicar con el tutor IA →
          </Link>
          {next && (
            <Link
              to="/lecons/$lessonId"
              params={{ lessonId: next.id }}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Siguiente: {next.title} →
            </Link>
          )}
        </footer>
      </article>
    </div>
  );
}
