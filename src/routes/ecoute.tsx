import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { listeningLibrary, type ListeningClip } from "@/lib/listening-library";

export const Route = createFileRoute("/ecoute")({
  head: () => ({
    meta: [
      { title: "Bibliothèque d'écoute — Professeur.fr" },
      {
        name: "description",
        content:
          "Clips audio authentiques en français avec transcription interactive : cliquez sur un mot pour l'ajouter à votre vocabulaire.",
      },
    ],
  }),
  component: EcoutePage,
});

const LEVELS = ["Tous", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

function EcoutePage() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Tous");
  const [selected, setSelected] = useState<ListeningClip | null>(null);

  const clips = useMemo(
    () => (level === "Tous" ? listeningLibrary : listeningLibrary.filter((c) => c.level === level)),
    [level],
  );

  return (
    <div className="min-h-screen bg-[image:var(--bg-gradient-hero)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Fase 4 · Contenido auténtico
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Bibliothèque d'écoute
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Clips auténticos en francés con voces nativas de estudio y transcripción interactiva.
            Haz clic en cualquier palabra para escucharla aislada.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                level === lv
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary hover:bg-secondary/70"
              }`}
            >
              {lv}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clips.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary hover:shadow-elegant"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>{c.level} · {c.category}</span>
                <span>{c.duration}</span>
              </div>
              <div className="mt-2 font-display text-lg font-semibold">{c.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.source}</div>
              <div className="mt-3 line-clamp-2 text-sm text-foreground/80">
                {c.transcript.slice(0, 120)}…
              </div>
            </button>
          ))}
        </div>

        {selected && <ClipPlayer clip={selected} onClose={() => setSelected(null)} />}
      </main>
    </div>
  );
}

function ClipPlayer({ clip, onClose }: { clip: ListeningClip; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const words = useMemo(() => clip.transcript.split(/(\s+|[.,!?;:])/), [clip.transcript]);

  const loadAudio = async () => {
    if (audioUrl) return audioUrl;
    setLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clip.transcript, voice: clip.voice, speed: rate }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return url;
    } finally {
      setLoading(false);
    }
  };

  const play = async () => {
    const url = await loadAudio();
    if (!url) return;
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.play();
    }
  };

  const speakWord = async (word: string) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: word, voice: clip.voice, speed: 0.85 }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      a.play();
      a.onended = () => URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const score = clip.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {clip.level} · {clip.category}
            </div>
            <h2 className="font-display text-2xl font-semibold">{clip.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-xs hover:bg-secondary"
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-secondary/40 p-3">
          <button
            onClick={play}
            disabled={loading}
            className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Cargando…" : audioUrl ? "▶ Reproducir" : "🎧 Generar y escuchar"}
          </button>
          <label className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
            Velocidad
            <select
              value={rate}
              onChange={(e) => {
                const r = Number(e.target.value);
                setRate(r);
                if (audioRef.current) audioRef.current.playbackRate = r;
              }}
              className="rounded border border-border bg-background px-2 py-1"
            >
              {[0.6, 0.75, 0.9, 1, 1.15].map((r) => (
                <option key={r} value={r}>
                  {r}x
                </option>
              ))}
            </select>
          </label>
          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} controls className="ml-auto h-8" />
          )}
        </div>

        <div className="mb-4 rounded-xl border border-border bg-background/60 p-4 text-base leading-loose">
          {words.map((w, i) => {
            const clean = w.replace(/[.,!?;:]/g, "").trim();
            if (!clean) return <span key={i}>{w}</span>;
            return (
              <span
                key={i}
                onClick={() => speakWord(clean)}
                className="cursor-pointer rounded px-0.5 hover:bg-primary/20"
                title="Clic para escuchar"
              >
                {w}
              </span>
            );
          })}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Comprensión</div>
          <button
            onClick={() => setShowQuestions((s) => !s)}
            className="text-xs text-primary hover:underline"
          >
            {showQuestions ? "Ocultar" : "Ver preguntas"}
          </button>
        </div>

        {showQuestions && (
          <div className="space-y-3">
            {clip.questions.map((q, i) => (
              <div key={i} className="rounded-lg border border-border bg-background/60 p-3">
                <div className="mb-2 text-sm font-medium">
                  {i + 1}. {q.q}
                </div>
                <div className="space-y-1">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[i] === oi;
                    const isCorrect = checked && oi === q.answer;
                    const isWrong = checked && chosen && oi !== q.answer;
                    return (
                      <button
                        key={oi}
                        onClick={() => setAnswers({ ...answers, [i]: oi })}
                        disabled={checked}
                        className={`block w-full rounded-md border px-3 py-1.5 text-left text-sm transition ${
                          isCorrect
                            ? "border-emerald-500 bg-emerald-500/10"
                            : isWrong
                              ? "border-red-500 bg-red-500/10"
                              : chosen
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-secondary"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setChecked(false);
                  setAnswers({});
                }}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary"
              >
                Reiniciar
              </button>
              <button
                onClick={() => setChecked(true)}
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                Corregir
              </button>
            </div>
            {checked && (
              <div className="rounded-lg bg-secondary/40 p-3 text-sm">
                Puntuación : <strong>{score} / {clip.questions.length}</strong>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to="/vocabulario" className="text-xs text-muted-foreground hover:text-primary">
            Palabras guardadas → mi vocabulario
          </Link>
        </div>
      </div>
    </div>
  );
}
