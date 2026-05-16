import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getExam, type Exam, type ExamTask } from "@/lib/exams";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Play, Pause, RotateCcw, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/simulacros/$examId")({
  head: ({ params }) => {
    const exam = getExam(params.examId);
    return {
      meta: [
        {
          title: exam
            ? `Simulacro ${exam.code} · Professeur.fr`
            : "Simulacro · Professeur.fr",
        },
        {
          name: "description",
          content: exam?.description ?? "Simulacro oral de francés.",
        },
      ],
    };
  },
  loader: ({ params }): { exam: Exam } => {
    const exam = getExam(params.examId);
    if (!exam) throw notFound();
    return { exam };
  },
  component: SimulacroRunner,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Simulacre introuvable</h1>
        <Link to="/simulacros" className="mt-4 inline-block text-primary hover:underline">
          ← Volver
        </Link>
      </div>
    </div>
  ),
});

type Phase = "intro" | "prep" | "speaking" | "review" | "evaluating" | "feedback";

type Feedback = {
  globalScore: number;
  level: string;
  strengths: string[];
  improvements: string[];
  criteriaScores: { name: string; score: number; comment: string }[];
  correctedExample: string;
  nextTip: string;
};

function pickPrompt(task: ExamTask, attempt: number) {
  return task.prompts[attempt % task.prompts.length];
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function SimulacroRunner() {
  const { exam } = Route.useLoaderData();
  const [taskIdx, setTaskIdx] = useState(0);
  const [attempt] = useState(0);
  const task = exam.tasks[taskIdx];
  const prompt = pickPrompt(task, attempt);

  const [phase, setPhase] = useState<Phase>("intro");
  const [remaining, setRemaining] = useState(0);
  const [paused, setPaused] = useState(false);
  const speech = useSpeechRecognition("fr-FR");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when switching tasks
  useEffect(() => {
    setPhase("intro");
    setRemaining(0);
    setPaused(false);
    setFeedback(null);
    setEvalError(null);
    speech.reset();
    speech.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIdx]);

  // Countdown
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if ((phase === "prep" || phase === "speaking") && !paused) {
      tickRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            if (tickRef.current) clearInterval(tickRef.current);
            if (phase === "prep") {
              startSpeaking();
            } else if (phase === "speaking") {
              stopSpeaking();
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused]);

  const start = () => {
    if (task.prepSeconds > 0) {
      setPhase("prep");
      setRemaining(task.prepSeconds);
    } else {
      startSpeaking();
    }
  };

  const startSpeaking = () => {
    setPhase("speaking");
    setRemaining(task.speakSeconds);
    speech.reset();
    speech.start();
  };

  const stopSpeaking = () => {
    speech.stop();
    setPhase("review");
  };

  const submitForEval = async () => {
    setPhase("evaluating");
    setEvalError(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examCode: exam.code,
          taskTitle: task.title,
          prompt,
          transcript: speech.transcript,
          criteria: exam.criteria,
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = (await res.json()) as Feedback;
      setFeedback(data);
      setPhase("feedback");
    } catch (e) {
      setEvalError(e instanceof Error ? e.message : "Erreur");
      setPhase("review");
    }
  };

  const retry = () => {
    speech.reset();
    setFeedback(null);
    setPhase("intro");
  };

  const next = () => {
    if (taskIdx < exam.tasks.length - 1) setTaskIdx((i) => i + 1);
  };

  const totalSeconds = phase === "prep" ? task.prepSeconds : task.speakSeconds;
  const progress = useMemo(
    () => (totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0),
    [remaining, totalSeconds],
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/simulacros" className="text-sm text-muted-foreground hover:text-primary">
          ← Tous les simulacres
        </Link>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-primary">
              {exam.code} · {exam.name}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              {task.title}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            {exam.tasks.map((t: ExamTask, i: number) => (
              <span
                key={t.id}
                className={`h-1.5 w-10 rounded-full transition ${
                  i === taskIdx ? "bg-primary" : i < taskIdx ? "bg-primary/40" : "bg-border"
                }`}
              />
            ))}
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-border bg-card p-7 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Consigne
          </p>
          <p className="mt-3 font-display text-xl leading-snug text-foreground">{prompt}</p>
          <p className="mt-4 text-sm text-muted-foreground">{task.instruction}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {task.prepSeconds > 0 && (
              <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                Préparation : {fmt(task.prepSeconds)}
              </span>
            )}
            <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
              Réponse : {fmt(task.speakSeconds)}
            </span>
          </div>
        </section>

        {/* Phase: intro */}
        {phase === "intro" && (
          <button
            onClick={start}
            className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 font-medium text-primary-foreground shadow-elegant transition hover:opacity-90"
          >
            {task.prepSeconds > 0 ? "Commencer la préparation" : "Commencer à parler"}
          </button>
        )}

        {/* Phase: prep / speaking */}
        {(phase === "prep" || phase === "speaking") && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {phase === "prep" ? "Préparation" : "Vous parlez maintenant"}
                </p>
                <p className="mt-1 font-display text-5xl font-semibold tabular-nums">
                  {fmt(remaining)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary"
                >
                  {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </button>
                {phase === "prep" ? (
                  <button
                    onClick={startSpeaking}
                    className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
                  >
                    Sauter la prep →
                  </button>
                ) : (
                  <button
                    onClick={stopSpeaking}
                    className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-sm font-medium text-destructive-foreground"
                  >
                    <MicOff className="h-4 w-4" /> Terminer
                  </button>
                )}
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-[image:var(--bg-gradient-primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {phase === "speaking" && (
              <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-destructive">
                  <Mic className="h-3.5 w-3.5 animate-pulse" /> Enregistrement…
                </div>
                <p className="font-display text-base leading-relaxed text-foreground">
                  {speech.transcript}
                  <span className="text-muted-foreground"> {speech.interim}</span>
                  {!speech.transcript && !speech.interim && (
                    <span className="text-muted-foreground italic">
                      Commencez à parler en français…
                    </span>
                  )}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Phase: review */}
        {phase === "review" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Ta réponse
            </p>
            <p className="mt-3 whitespace-pre-wrap font-display text-base leading-relaxed text-foreground">
              {speech.transcript || (
                <span className="italic text-muted-foreground">
                  No se grabó nada. Inténtalo de nuevo.
                </span>
              )}
            </p>
            {evalError && (
              <p className="mt-3 text-sm text-destructive">{evalError}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={retry}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" /> Recommencer
              </button>
              <button
                onClick={submitForEval}
                disabled={!speech.transcript}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" /> Évaluer ma réponse
              </button>
            </div>
          </section>
        )}

        {/* Phase: evaluating */}
        {phase === "evaluating" && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 animate-pulse text-primary" />
            </div>
            <p className="mt-4 font-display text-lg font-semibold">
              L&apos;examinateur IA analyse votre réponse…
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Selon les critères officiels {exam.code}
            </p>
          </section>
        )}

        {/* Phase: feedback */}
        {phase === "feedback" && feedback && (
          <section className="mt-8 space-y-6">
            <div className="rounded-3xl border border-border bg-[image:var(--bg-gradient-hero)] p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Note globale
                  </p>
                  <p className="mt-1 font-display text-6xl font-semibold text-primary">
                    {feedback.globalScore.toFixed(1)}
                    <span className="text-2xl text-muted-foreground">/20</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Niveau estimé
                  </p>
                  <p className="font-display text-4xl font-semibold">{feedback.level}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Puntos fuertes
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
                  A mejorar
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Criterios oficiales
              </p>
              <div className="mt-4 space-y-4">
                {feedback.criteriaScores.map((c) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium">{c.name}</p>
                      <p className="font-display tabular-nums">{c.score.toFixed(1)}/5</p>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-[image:var(--bg-gradient-primary)]"
                        style={{ width: `${(c.score / 5) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-l-4 border-primary bg-secondary/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Reformulation modèle
              </p>
              <p className="mt-2 font-display italic text-foreground">
                « {feedback.correctedExample} »
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Conseil pour la prochaine fois
              </p>
              <p className="mt-2 text-foreground">{feedback.nextTip}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={retry}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-sm transition hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" /> Rejouer cette tâche
              </button>
              {taskIdx < exam.tasks.length - 1 ? (
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Tâche suivante <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  to="/simulacros"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Terminer le simulacre ✓
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
