import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { lessons } from "@/lib/lessons";

export const Route = createFileRoute("/lecons/")({
  head: () => ({
    meta: [
      { title: "Lecciones de fonética francesa · Professeur.fr" },
      {
        name: "description",
        content:
          "Catálogo de lecciones de fonética francesa: nasales, R uvular, vocales y liaisons.",
      },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const categories = Array.from(new Set(lessons.map((l) => l.category)));
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Phonétique
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
            Sonidos del francés
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Cada lección te explica un sonido, te muestra ejemplos y los pronuncia
            con voz nativa para que practiques.
          </p>
        </header>

        {categories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 font-display text-xl font-semibold text-muted-foreground">
              {cat}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {lessons
                .filter((l) => l.category === cat)
                .map((l) => (
                  <Link
                    key={l.id}
                    to="/lecons/$lessonId"
                    params={{ lessonId: l.id }}
                    className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-soft"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{l.level}</span>
                      <span>→</span>
                    </div>
                    <p className="mt-3 font-display text-4xl font-semibold text-primary">
                      {l.ipa}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold">{l.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {l.description}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
