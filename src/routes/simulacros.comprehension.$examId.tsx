import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  getListeningExam,
  type ListeningExam,
  type ListeningTask,
} from "@/lib/listening-exams";
import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle2, XCircle, Loader2, Headphones } from "lucide-react";
import { saveAttempt } from "@/lib/practice-history.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/simulacros/comprehension/$examId")({
  head: ({ params }) => {
    const exam = getListeningExam(params.examId);
    return {
      meta: [
        {
          title: exam
            ? `${exam.code} — Compréhension orale · Professeur.fr`
            : "Compréhension orale · Professeur.fr",
        },
        {
          name: "description",
          content: exam?.description ?? "Simulacro de comprensión oral en francés.",
        },
      ],
    };
  },
  loader: ({ params }): { exam: ListeningExam } => {
    const exam = getListeningExam(params.examId);
    if (!exam) throw notFound();
    return { exam };
  },
  component: Runner,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Simulacre introuvable</h1>
        <Link
          to="/simulacros/comprehension"
          className="mt-4 inline-block text-primary hover:underline"
        >
          ← Volver
        </Link>
      </div>
    </div>
  ),
});

function shuffleTasks<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Runner() {
  const { exam: rawExam } = Route.useLoaderData() as unknown as { exam: ListeningExam };
  const [tasks, setTasks] = useState<ListeningTask[]>(rawExam.tasks);
  const [taskIdx, setTaskIdx] = useState(0);
  // Mezclamos los audios en cada visita (solo en cliente para evitar hydration mismatch).
  useEffect(() => {
    setTasks(shuffleTasks(rawExam.tasks));
    setTaskIdx(0);
  }, [rawExam]);
  const exam = { ...rawExam, tasks };
  const task = exam.tasks[taskIdx];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [taskIdx]);

  const correctCount = task.questions.reduce(
    (n, q) => (answers[q.id] === q.correctIndex ? n + 1 : n),
    0,
  );
  const total = task.questions.length;
  const percent = Math.round((correctCount / total) * 100);
  const allAnswered = task.questions.every((q) => answers[q.id] !== undefined);

  const nextTask = () => {
    if (taskIdx < exam.tasks.length - 1) setTaskIdx((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/simulacros/comprehension"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Tous les tests d&apos;écoute
        </Link>

        <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-primary">
              {exam.code} · Compréhension orale
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              {task.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{task.instruction}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {exam.tasks.map((t, i) => (
              <span
                key={t.id}
                className={`h-1.5 w-10 rounded-full transition ${
                  i === taskIdx ? "bg-primary" : i < taskIdx ? "bg-primary/40" : "bg-border"
                }`}
              />
            ))}
          </div>
        </header>

        <AudioPlayer task={task} />

        <section className="mt-8 space-y-4">
          {task.questions.map((q, qi) => {
            const chosen = answers[q.id];
            return (
              <div
                key={q.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Question {qi + 1}/{total}
                </p>
                <p className="mt-2 font-display text-lg leading-snug">{q.question}</p>
                <div className="mt-4 grid gap-2">
                  {q.options.map((opt, i) => {
                    const isChosen = chosen === i;
                    const isCorrect = i === q.correctIndex;
                    const showResult = submitted;
                    let cls =
                      "border-border bg-card hover:border-primary/50 hover:bg-secondary/40";
                    if (showResult && isCorrect)
                      cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                    else if (showResult && isChosen && !isCorrect)
                      cls = "border-destructive bg-destructive/10 text-destructive";
                    else if (isChosen)
                      cls = "border-primary bg-primary/10 text-primary";
                    return (
                      <button
                        key={i}
                        disabled={submitted}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: i }))
                        }
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition ${cls}`}
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current text-xs font-semibold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        )}
                        {submitted && isChosen && !isCorrect && (
                          <XCircle className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.hintEs && (
                  <p className="mt-3 rounded-xl bg-secondary/40 p-3 text-xs text-muted-foreground">
                    💡 {q.hintEs}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {!submitted ? (
          <button
            onClick={() => {
              setSubmitted(true);
              const c = task.questions.reduce(
                (n, q) => (answers[q.id] === q.correctIndex ? n + 1 : n),
                0,
              );
              const p = Math.round((c / total) * 100);
              save({
                data: {
                  kind: "listening",
                  context: `${exam.code} · ${task.title}`,
                  expectedText: task.script.slice(0, 2000),
                  transcript: `${c}/${total} correctes`,
                  score: p,
                  details: {
                    examId: exam.id,
                    taskId: task.id,
                    correct: c,
                    total,
                    answers,
                  },
                },
              }).catch(() => {});
            }}
            disabled={!allAnswered}
            className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 font-medium text-primary-foreground shadow-elegant transition hover:opacity-90 disabled:opacity-40"
          >
            {allAnswered
              ? "Corregir mis respuestas"
              : `Responde las ${total} preguntas para corregir`}
          </button>
        ) : (
          <section className="mt-8 rounded-3xl border border-border bg-[image:var(--bg-gradient-hero)] p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Resultado
                </p>
                <p className="mt-1 font-display text-5xl font-semibold text-primary tabular-nums">
                  {correctCount}
                  <span className="text-2xl text-muted-foreground">/{total}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{percent}% de aciertos</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  percent >= 60
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {percent >= 60 ? "✓ Bien" : "À retravailler"}
              </span>
            </div>

            <details className="mt-5 rounded-2xl border border-border bg-card/60 p-4 text-sm">
              <summary className="cursor-pointer font-medium text-foreground">
                Ver la transcripción del audio
              </summary>
              <p className="mt-3 whitespace-pre-wrap text-muted-foreground">{task.script}</p>
            </details>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" /> Reintentar
              </button>
              {taskIdx < exam.tasks.length - 1 && (
                <button
                  onClick={nextTask}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                >
                  Siguiente audio <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ────────── Reproductor con TTS del guion ────────── */

function AudioPlayer({ task }: { task: ListeningTask }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset al cambiar tarea
  useEffect(() => {
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setError(null);
    setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const ensureAudio = useCallback(async () => {
    if (url) return url;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: task.script,
          voice: task.voice ?? "nova",
          speed: task.speed ?? 1,
          format: "mp3",
        }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      setUrl(objUrl);
      return objUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar el audio");
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, task]);

  const togglePlay = async () => {
    const src = await ensureAudio();
    if (!src) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.src !== src) audio.src = src;
    if (playing) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch {
        // ignore
      }
    }
  };

  const restart = async () => {
    const src = await ensureAudio();
    if (!src) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.src !== src) audio.src = src;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return (
    <section className="mt-8 rounded-3xl border border-border bg-[image:var(--bg-gradient-hero)] p-7">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-elegant">
          <Headphones className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Audio en français
          </p>
          <p className="mt-0.5 font-display text-lg">Escucha con atención antes de responder</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={togglePlay}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generando…
            </>
          ) : playing ? (
            <>
              <Pause className="h-4 w-4" /> Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> {url ? "Reproducir" : "Escuchar el audio"}
            </>
          )}
        </button>
        {url && (
          <button
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        preload="none"
      />
    </section>
  );
}
