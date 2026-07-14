import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { getScenario } from "@/lib/scenarios";
import { ACCENTS, getAccent, type AccentId } from "@/lib/accents";
import { roleplayTurn, roleplayFeedback } from "@/lib/roleplay.functions";
import { awardXp } from "@/lib/gamification.functions";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Mic, MicOff, Send, Volume2, RotateCcw, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/roleplay/$scenarioId")({
  head: ({ params }) => ({
    meta: [
      { title: `Roleplay · ${params.scenarioId} · Professeur.fr` },
      { name: "description", content: "Simulación inmersiva de conversación en francés." },
    ],
  }),
  component: RoleplayView,
});

type Msg = { role: "user" | "assistant"; content: string };
type Feedback = Awaited<ReturnType<typeof roleplayFeedback>>;

function RoleplayView() {
  const { scenarioId } = Route.useParams();
  const scenario = getScenario(scenarioId);
  if (!scenario) throw notFound();

  const [accentId, setAccentId] = useState<AccentId>(scenario.accent);
  const accent = getAccent(accentId);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: scenario.opener },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { listening, transcript, interim, supported, start, stop, reset } =
    useSpeechRecognition("fr-FR");

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, feedback]);

  // Copiar transcript al input
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Reproducir automáticamente la primera réplica (una sola vez, evita eco en StrictMode)
  const openerPlayedRef = useRef(false);
  useEffect(() => {
    if (openerPlayedRef.current) return;
    openerPlayedRef.current = true;
    speakLine(0, scenario.opener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speakLine = async (idx: number, text: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlaying(idx);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: accent.voice,
          instructions: accent.instructions,
        }),
      });
      if (!res.ok) throw new Error("tts");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setPlaying((p) => (p === idx ? null : p));
      await audio.play();
    } catch {
      setPlaying(null);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    if (listening) stop();
    reset();
    const nextMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMsgs);
    setInput("");
    setBusy(true);
    try {
      const { reply } = await roleplayTurn({
        data: { scenarioId: scenario.id, messages: nextMsgs },
      });
      const finalMsgs: Msg[] = [...nextMsgs, { role: "assistant", content: reply }];
      setMessages(finalMsgs);
      speakLine(finalMsgs.length - 1, reply);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "(Erreur de connexion. Réessaie.)" },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const evaluate = async () => {
    if (busy || messages.length < 3) return;
    setBusy(true);
    try {
      const fb = await roleplayFeedback({
        data: { scenarioId: scenario.id, transcript: messages },
      });
      setFeedback(fb);
      awardXp({ data: { xp: Math.max(10, Math.round(fb.score / 5)), reason: "roleplay" } }).catch(
        () => {},
      );
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const resetAll = () => {
    setMessages([{ role: "assistant", content: scenario.opener }]);
    setFeedback(null);
    setInput("");
    reset();
  };

  const vocabHint = useMemo(() => scenario.vocab.join(" · "), [scenario.vocab]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Link
          to="/roleplay"
          className="text-xs text-muted-foreground hover:text-primary"
        >
          ← Todos los escenarios
        </Link>

        <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">
              {scenario.emoji} {scenario.title}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Objetivo:</span> {scenario.goal}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Léxico: {vocabHint}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <label className="text-xs text-muted-foreground">Acento</label>
            <select
              value={accentId}
              onChange={(e) => setAccentId(e.target.value as AccentId)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm"
            >
              {ACCENTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.flag} {a.label}
                </option>
              ))}
            </select>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" /> Reiniciar
            </button>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-elegant">
          <ul className="space-y-4">
            {messages.map((m, i) => (
              <li key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => speakLine(i, m.content)}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Volume2 className="h-3 w-3" />
                      {playing === i ? "Sonando…" : "Écouter"}
                    </button>
                  )}
                </div>
              </li>
            ))}
            {busy && !feedback && (
              <li className="text-xs italic text-muted-foreground">Le NPC réfléchit…</li>
            )}
          </ul>
          <div ref={bottomRef} />
        </section>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          {supported && (interim || listening) && (
            <p className="mb-2 text-xs italic text-muted-foreground">
              🎤 {interim || "Escuchando…"}
            </p>
          )}
          <div className="flex gap-2">
            {supported && (
              <button
                onClick={listening ? stop : start}
                className={`grid h-11 w-11 place-items-center rounded-full ${
                  listening ? "bg-red-500 text-white" : "bg-secondary hover:bg-primary hover:text-primary-foreground"
                }`}
                title={listening ? "Detener" : "Hablar"}
              >
                {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Écris ou dicte en français…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> Envoyer
            </button>
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <div>
              Pistas: {scenario.hints.map((h, i) => (
                <span key={i} className="mr-2 rounded bg-secondary px-2 py-0.5">{h}</span>
              ))}
            </div>
            <button
              onClick={evaluate}
              disabled={busy || messages.length < 3}
              className="inline-flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3" /> Evaluar mi desempeño
            </button>
          </div>
        </div>

        {feedback && (
          <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">Evaluación</h2>
              <div className="flex gap-2 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  Nivel percibido: {feedback.cefrEstimate}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1">
                  Puntuación: {Math.round(feedback.score)}/100
                </span>
                <span
                  className={`rounded-full px-3 py-1 ${
                    feedback.goalAchieved
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {feedback.goalAchieved ? "Objetivo logrado ✓" : "Objetivo parcial"}
                </span>
              </div>
            </div>

            {feedback.strengths.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Aciertos</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {feedback.corrections.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Correcciones</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {feedback.corrections.map((c, i) => (
                    <li key={i} className="rounded-xl bg-secondary/60 p-3">
                      <p>
                        <span className="text-red-600 line-through">{c.original}</span> →{" "}
                        <span className="font-medium text-emerald-700">{c.corrected}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{c.explanationEs}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.nextStepsEs.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Próximos pasos
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {feedback.nextStepsEs.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
