import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { correctWriting, type WritingFeedback } from "@/lib/writing.functions";
import { awardXp } from "@/lib/gamification.functions";
import { Sparkles, Copy, Check } from "lucide-react";
import { addVocabulary } from "@/lib/vocabulary.functions";

export const Route = createFileRoute("/_authenticated/escritura")({
  head: () => ({
    meta: [
      { title: "Corrector de escritura · Professeur.fr" },
      {
        name: "description",
        content: "Envía un texto en francés y recibe una corrección detallada con nivel CEFR.",
      },
    ],
  }),
  component: WritingPage,
});

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

function WritingPage() {
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [level, setLevel] = useState<Level>("B1");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    const t = text.trim();
    if (!t || busy) return;
    setBusy(true);
    setError(null);
    setFeedback(null);
    try {
      const fb = await correctWriting({ data: { text: t, level, prompt: prompt || undefined } });
      setFeedback(fb);
      awardXp({ data: { xp: 15, reason: "writing" } }).catch(() => {});
    } catch (e) {
      console.error(e);
      setError("No fue posible corregir el texto. Vuelve a intentarlo.");
    } finally {
      setBusy(false);
    }
  };

  const copyCorrected = async () => {
    if (!feedback) return;
    await navigator.clipboard.writeText(feedback.correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Corrector de escritura</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Escribe un texto en francés, elige tu nivel objetivo y recibirás correcciones, texto
          limpio y una estimación CEFR.
        </p>

        <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-elegant">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Consigna (opcional): p. ej. « Décris tes vacances »"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm"
            >
              {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map((l) => (
                <option key={l} value={l}>Nivel objetivo: {l}</option>
              ))}
            </select>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Colle ou écris ton texte en français…"
            className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary"
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{text.length} / 4000 caracteres</span>
            <button
              onClick={run}
              disabled={busy || !text.trim()}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {busy ? "Corrigiendo…" : "Corregir"}
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {feedback && (
          <section className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                Nivel: {feedback.cefrEstimate}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1">
                Puntuación: {Math.round(feedback.score)}/100
              </span>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Texto corregido</h2>
                <button
                  onClick={copyCorrected}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                {feedback.correctedText}
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold">Resumen</h2>
              <p className="mt-2 text-sm text-muted-foreground">{feedback.summaryEs}</p>
            </div>

            {feedback.corrections.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold">
                  Correcciones ({feedback.corrections.length})
                </h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {feedback.corrections.map((c, i) => (
                    <li key={i} className="rounded-xl bg-secondary/60 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-background px-2 py-0.5 text-xs text-muted-foreground">
                          {c.category}
                        </span>
                        <span className="text-red-600 line-through">{c.original}</span>
                        <span>→</span>
                        <span className="font-medium text-emerald-700">{c.suggestion}</span>
                        <button
                          onClick={() =>
                            addVocabulary({
                              data: {
                                word: c.suggestion,
                                exampleFr: feedback.correctedText.slice(0, 200),
                                source: "writing",
                              },
                            }).catch(() => {})
                          }
                          className="ml-auto rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          + Vocab
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{c.explanationEs}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold">Consejos para mejorar</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
