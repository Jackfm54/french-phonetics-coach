import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getLesson, lessons, type Lesson } from "@/lib/lessons";
import { speakFr } from "@/lib/speak";
import { Volume2 } from "lucide-react";
import { PronunciationPractice } from "@/components/PronunciationPractice";
import { InteractiveExercises } from "@/components/InteractiveExercises";

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

// Mapa IPA → grafía mínima que el TTS francés pronuncia como ese sonido aislado.
// Repetimos 3× para que se oiga claramente sin que se "trague" la consonante.
const IPA_TO_GRAPHEME: Record<string, string> = {
  "/ɑ̃/": "an, an, an",
  "/ɔ̃/": "on, on, on",
  "/ɛ̃/": "in, in, in",
  "/œ̃/": "un, un, un",
  "/ɑ̃/, /ɔ̃/, /ɛ̃/": "an, on, in",
  "/y/": "u, u, u",
  "/u/": "ou, ou, ou",
  "/ø/": "eu, eu, eu",
  "/œ/": "œu, œu, œu",
  "/ə/": "le, le, le",
  "/e/": "é, é, é",
  "/ɛ/": "è, è, è",
  "/o/": "ô, ô, ô",
  "/ɔ/": "o, o, o",
  "/a/": "a, a, a",
  "/i/": "i, i, i",
  "/ʁ/": "rrra, rrre, rrri",
  "/ʃ/": "cha, che, chi",
  "/ʒ/": "ja, je, ji",
  "/ɲ/": "gna, gne, gni",
  "/ŋ/": "ng, ng, ng",
  "/j/": "ya, ye, yi",
  "/ɥ/": "hui, hui, hui",
  "/w/": "oua, oui, oua",
};

function isolatedSoundFor(lesson: { ipa: string; examples: { fr: string }[]; title: string }): string {
  const mapped = IPA_TO_GRAPHEME[lesson.ipa];
  if (mapped) return mapped;
  // Fallback: ejemplo más corto.
  return (
    [...lesson.examples]
      .map((e) => e.fr)
      .sort((a, b) => a.split(/\s+/).length - b.split(/\s+/).length || a.length - b.length)[0] ??
    lesson.title
  );
}

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];

  const soundSample = isolatedSoundFor(lesson);

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
          <div className="mt-8 flex items-center gap-6 rounded-3xl border border-border bg-[image:var(--bg-gradient-hero)] p-8">
            <p className="font-display text-7xl font-semibold text-primary lg:text-8xl">
              {lesson.ipa}
            </p>
            <button
              onClick={() => speakFr(soundSample)}
              className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant transition hover:scale-105"
              aria-label={`Écouter le son ${lesson.ipa} (${soundSample})`}
              title={`Écouter : ${soundSample}`}
            >
              <Volume2 className="h-6 w-6" />
            </button>
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

        {lesson.exercises.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold">
                Exercices interactifs
              </h2>
              <span className="text-xs text-muted-foreground">
                {lesson.exercises.length} exercices
              </span>
            </div>
            <InteractiveExercises exercises={lesson.exercises} />
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
                  onClick={() => speakFr(ex.fr)}
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
