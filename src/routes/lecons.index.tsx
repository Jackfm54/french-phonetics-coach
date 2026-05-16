import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { lessons, levels, type Level } from "@/lib/lessons";
import { useState } from "react";

export const Route = createFileRoute("/lecons/")({
  head: () => ({
    meta: [
      { title: "Curso de fonética francesa A1–C2 · Professeur.fr" },
      {
        name: "description",
        content:
          "Catálogo interactivo de lecciones de fonética francesa, del nivel A1 al C2, con ejercicios de discriminación, transcripción API, dictado y repetición.",
      },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const [filter, setFilter] = useState<Level | "All">("All");

  const visible =
    filter === "All" ? lessons : lessons.filter((l) => l.level === filter);

  const categories = Array.from(new Set(visible.map((l) => l.category)));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Phonétique · A1 → C2
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
            Curso interactivo de fonética
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Cada lección incluye explicación, audio nativo y{" "}
            <b>ejercicios interactivos</b>: discriminación auditiva, transcripción
            API, dictado y repetición con reconocimiento de voz.
          </p>
        </header>

        {/* Level filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          <FilterChip
            label="Todos"
            active={filter === "All"}
            onClick={() => setFilter("All")}
            count={lessons.length}
          />
          {levels.map((lv) => {
            const count = lessons.filter((l) => l.level === lv).length;
            if (count === 0) return null;
            return (
              <FilterChip
                key={lv}
                label={lv}
                active={filter === lv}
                onClick={() => setFilter(lv)}
                count={count}
              />
            );
          })}
        </div>

        {categories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="mb-4 font-display text-xl font-semibold text-muted-foreground">
              {cat}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible
                .filter((l) => l.category === cat)
                .map((l) => (
                  <Link
                    key={l.id}
                    to="/lecons/$lessonId"
                    params={{ lessonId: l.id }}
                    className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-soft"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                        {l.level}
                      </span>
                      <span className="text-muted-foreground">
                        {l.exercises.length} ex. →
                      </span>
                    </div>
                    <p className="mt-3 font-display text-4xl font-semibold text-primary">
                      {l.ipa}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold">
                      {l.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {l.description}
                    </p>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        {visible.length === 0 && (
          <p className="text-center text-muted-foreground">
            Aucune leçon pour ce niveau pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-soft"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 text-xs ${
          active ? "bg-primary-foreground/20" : "bg-secondary text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
