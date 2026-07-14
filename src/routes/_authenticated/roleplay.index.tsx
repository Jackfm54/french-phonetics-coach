import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SCENARIOS } from "@/lib/scenarios";
import { ACCENTS } from "@/lib/accents";

export const Route = createFileRoute("/_authenticated/roleplay/")({
  head: () => ({
    meta: [
      { title: "Roleplay · Professeur.fr" },
      {
        name: "description",
        content:
          "Simulaciones inmersivas en francés: café, aeropuerto, entrevista de trabajo, con acentos regionales.",
      },
    ],
  }),
  component: RoleplayIndex,
});

function RoleplayIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Jeux de rôle immersifs</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Vive situaciones reales en francés con un NPC hablado por IA. Habla o escribe, recibe la
          réplica en voz con acento auténtico y, al terminar, una evaluación con correcciones.
        </p>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Acentos disponibles
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACCENTS.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs"
                title={a.description}
              >
                <span>{a.flag}</span> {a.label}
              </span>
            ))}
          </div>
        </section>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((s) => (
            <li key={s.id}>
              <Link
                to="/roleplay/$scenarioId"
                params={{ scenarioId: s.id }}
                className="group block h-full rounded-2xl border border-border bg-card p-5 shadow-elegant transition hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {s.level}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-primary">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.goal}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Acento: {ACCENTS.find((a) => a.id === s.accent)?.flag}{" "}
                  {ACCENTS.find((a) => a.id === s.accent)?.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
