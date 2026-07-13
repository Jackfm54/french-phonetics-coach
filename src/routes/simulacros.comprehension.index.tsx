import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { listeningExams } from "@/lib/listening-exams";
import { Headphones, Target } from "lucide-react";

export const Route = createFileRoute("/simulacros/comprehension/")({
  head: () => ({
    meta: [
      { title: "Compréhension orale · Simulacros · Professeur.fr" },
      {
        name: "description",
        content:
          "Practica la comprensión oral del TCF y DELF/DALF con audios en francés y preguntas de opción múltiple, de A1 a C2.",
      },
    ],
  }),
  component: ListPage,
});

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-emerald-500/15 text-emerald-600",
  A2: "bg-emerald-500/15 text-emerald-700",
  B1: "bg-sky-500/15 text-sky-600",
  B2: "bg-sky-500/15 text-sky-700",
  C1: "bg-violet-500/15 text-violet-600",
  C2: "bg-violet-500/15 text-violet-700",
};

function ListPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link to="/simulacros" className="text-sm text-muted-foreground hover:text-primary">
          ← Todos los simulacros
        </Link>
        <header className="mt-4 mb-10">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Compréhension orale
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
            Entrena tu oído en francés
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Escucha audios generados por IA con voces francesas nativas y responde preguntas
            de opción múltiple. Corrección automática al instante.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {listeningExams.map((exam) => (
            <Link
              key={exam.id}
              to="/simulacros/comprehension/$examId"
              params={{ examId: exam.id }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-elegant"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-primary">{exam.code}</p>
                </div>
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    LEVEL_COLORS[exam.level] ?? "bg-secondary text-muted-foreground"
                  }`}
                >
                  {exam.level}
                </span>
              </div>
              <p className="mt-4 text-sm text-foreground">{exam.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                  <Target className="h-3 w-3" /> {exam.tasks.length}{" "}
                  {exam.tasks.length > 1 ? "audios" : "audio"}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1">
                  {exam.tasks.reduce((n, t) => n + t.questions.length, 0)} preguntas
                </span>
              </div>
              <p className="mt-5 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Empezar →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
