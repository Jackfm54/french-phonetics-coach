import { useNavigate } from "@tanstack/react-router";
import { Mic, MicOff, Loader2, Sparkles, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useScribeRecorder } from "@/hooks/use-scribe-recorder";
import { speakFr } from "@/lib/speak";
import { diffFrench } from "@/lib/diff-fr";
import { WordDiff } from "@/components/WordDiff";
import { saveAttempt } from "@/lib/practice-history.functions";

interface PronunciationPracticeProps {
  targets: string[];
  lessonTitle: string;
}

export function PronunciationPractice({ targets, lessonTitle }: PronunciationPracticeProps) {
  const navigate = useNavigate();
  const rec = useScribeRecorder("fra");
  const [lastTranscript, setLastTranscript] = useState("");
  const [index, setIndex] = useState(0);

  const total = targets.length;
  const target = targets[Math.min(index, total - 1)] ?? lessonTitle;

  const diff = useMemo(() => {
    if (!lastTranscript) return null;
    return diffFrench(target, lastTranscript);
  }, [lastTranscript, target]);

  const success = diff !== null && diff.accuracy >= 0.85 && diff.problems.length === 0;

  const handleToggle = async () => {
    if (rec.recording) {
      const text = await rec.stopAndTranscribe();
      if (text) {
        setLastTranscript(text);
        const d = diffFrench(target, text);
        try {
          await saveAttempt({
            data: {
              kind: "pronunciation",
              context: lessonTitle,
              expectedText: target,
              transcript: text,
              score: Math.round(d.accuracy * 100),
            },
          });
        } catch {
          // usuario no autenticado: no bloqueamos la UX
        }
      }
    } else {
      setLastTranscript("");
      await rec.start();
    }
  };

  const retry = async () => {
    setLastTranscript("");
    rec.reset();
    await rec.start();
  };

  const goTo = (i: number) => {
    setLastTranscript("");
    rec.reset();
    setIndex(((i % total) + total) % total);
  };

  const askTutor = () => {
    const prompt = `J'apprends « ${lessonTitle} ». J'ai voulu dire : "${target}". J'ai dit : "${lastTranscript}". Corrige ma prononciation et donne-moi un conseil concret.`;
    if (typeof window !== "undefined") sessionStorage.setItem("prefill_chat", prompt);
    navigate({ to: "/chat" });
  };

  if (!rec.supported) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 text-sm text-muted-foreground">
        Tu navegador no soporta grabación de audio. Prueba con Chrome, Edge o Safari.
      </div>
    );
  }


  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Practica con tu voz · <span className="text-emerald-600">Scribe IA</span>
          </p>
          <p className="mt-2 font-display text-2xl font-semibold">{target}</p>
        </div>
        <button
          onClick={() => speakFr(target)}
          className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          Escuchar modelo
        </button>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleToggle}
          disabled={rec.transcribing}
          className={`grid h-16 w-16 place-items-center rounded-full transition disabled:opacity-60 ${
            rec.recording
              ? "bg-destructive text-destructive-foreground animate-pulse shadow-elegant"
              : "bg-[image:var(--bg-gradient-primary)] text-primary-foreground shadow-elegant hover:scale-105"
          }`}
          aria-label={rec.recording ? "Detener y transcribir" : "Grabar"}
        >
          {rec.transcribing ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : rec.recording ? (
            <MicOff className="h-7 w-7" />
          ) : (
            <Mic className="h-7 w-7" />
          )}
        </button>
        <div className="flex-1 text-sm">
          {rec.transcribing ? (
            <p className="text-muted-foreground">Transcribiendo con Scribe…</p>
          ) : rec.recording ? (
            <p className="text-muted-foreground">Grabando… habla la frase completa y pulsa detener.</p>
          ) : lastTranscript ? (
            <p className="font-display text-lg text-foreground">« {lastTranscript} »</p>
          ) : (
            <p className="text-muted-foreground">
              Pulsa el micrófono, di la frase, y vuelve a pulsar para recibir la corrección palabra por palabra.
            </p>
          )}
          {rec.error && (
            <p className="mt-1 text-xs text-destructive">{rec.error}</p>
          )}
        </div>
      </div>

      {diff && (
        <div className="mt-6 space-y-4">
          {success ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-300">
              <p className="text-sm font-semibold">Très bien ! Excelente pronunciación.</p>
            </div>
          ) : null}
          <WordDiff result={diff} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={retry}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm transition hover:border-primary hover:text-primary"
            >
              <RotateCcw className="h-4 w-4" /> Reintentar
            </button>
            <button
              onClick={askTutor}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-sm text-background transition hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" /> Pedir feedback al tuteur
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
