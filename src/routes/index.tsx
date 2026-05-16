import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { lessons } from "@/lib/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Professeur.fr — Aprende francés con un tutor IA" },
      {
        name: "description",
        content:
          "Domina la fonética francesa con lecciones de pronunciación y un tutor de IA que conversa contigo en francés.",
      },
      { property: "og:title", content: "Professeur.fr — Tutor IA de francés" },
      {
        property: "og:description",
        content: "Lecciones de fonética + chat con tutor IA para hablar francés.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = lessons.slice(0, 3);
  return (
    <div className="min-h-screen bg-[image:var(--bg-gradient-hero)]">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Nouveau · Tuteur IA en français
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight lg:text-7xl">
              Parle français
              <br />
              <span className="bg-[image:var(--bg-gradient-primary)] bg-clip-text text-transparent">
                avec confiance.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Un profesor de IA que te enseña la fonética del francés sonido a
              sonido, te corrige y conversa contigo. Desde principiantes hasta
              nivel avanzado.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/lecons"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-90"
              >
                Comenzar las lecciones
              </Link>
              <Link
                to="/chat"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                Hablar con el tuteur →
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                ["7+", "Lecciones"],
                ["A1–B2", "Niveles"],
                ["IA", "24/7"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-3xl font-semibold text-foreground">{k}</dt>
                  <dd className="text-xs uppercase tracking-wider text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-[image:var(--bg-gradient-primary)] opacity-20 blur-3xl" />
            <div className="relative rounded-3xl border border-border bg-card/90 p-8 shadow-elegant backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[image:var(--bg-gradient-primary)] text-primary-foreground">
                  ✦
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">Leçon du jour</p>
                  <p className="text-xs text-muted-foreground">Voyelles nasales</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-secondary/60 p-6">
                <p className="font-display text-6xl font-semibold text-primary">/ɑ̃/</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  como en <span className="font-medium text-foreground">enfant, France</span>
                </p>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                « Bonjour ! Aujourd&apos;hui on travaille la nasale <b>an</b>.
                Répète après moi… »
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold tracking-tight lg:text-4xl">
            Comienza por aquí
          </h2>
          <Link to="/lecons" className="text-sm font-medium text-primary hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => (
            <Link
              key={l.id}
              to="/lecons/$lessonId"
              params={{ lessonId: l.id }}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-soft"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{l.category}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5">{l.level}</span>
              </div>
              <p className="mt-4 font-display text-4xl font-semibold text-primary">{l.ipa}</p>
              <h3 className="mt-2 font-display text-lg font-semibold">{l.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{l.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Empezar →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
