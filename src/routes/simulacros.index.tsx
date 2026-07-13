import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { exams } from "@/lib/exams";
import { listeningExams } from "@/lib/listening-exams";
import { GraduationCap, Clock, Target, Headphones, Mic } from "lucide-react";

export const Route = createFileRoute("/simulacros/")({
  head: () => ({
    meta: [
      { title: "Simulacros TCF Canada & DELF · Professeur.fr" },
      {
        name: "description",
        content:
          "Practica las pruebas orales del TCF Canada y del DELF (A1-B2) con cronómetros y evaluación por IA según los criterios oficiales.",
      },
    ],
  }),
  component: SimulacrosPage,
});

function SimulacrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Simulacros oficiales
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
            Prepárate para el examen oral
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Practica en condiciones reales: consignas oficiales, cronómetros de
            preparación y respuesta, grabación de tu voz y evaluación por IA
            según los criterios del jurado.
          </p>
        </header>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          <Link
            to="/simulacros/comprehension"
            className="group inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            <Headphones className="h-5 w-5" />
            <span>
              Compréhension orale ·{" "}
              <span className="text-muted-foreground">
                {listeningExams.length} niveles (A1 → C2)
              </span>
            </span>
            <span className="opacity-0 transition group-hover:opacity-100">→</span>
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Mic className="h-3.5 w-3.5" /> Expresión oral
        </div>
        <div className="grid gap-5 lg:grid-cols-2">

          {exams.map((exam) => (
            <Link
              key={exam.id}
              to="/simulacros/$examId"
              params={{ examId: exam.id }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition hover:border-primary/50 hover:shadow-elegant"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[image:var(--bg-gradient-primary)] opacity-10 transition group-hover:opacity-20" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-primary">
                      {exam.code}
                    </p>
                    <p className="text-xs text-muted-foreground">{exam.name}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm text-foreground">{exam.description}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                    <Target className="h-3 w-3" /> {exam.level}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                    <Clock className="h-3 w-3" /> {exam.duration}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1">
                    {exam.tasks.length} {exam.tasks.length > 1 ? "tâches" : "tâche"}
                  </span>
                </div>
                <p className="mt-6 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Comenzar simulacro →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
