import { useNavigate } from "@tanstack/react-router";
import { Mic, MicOff, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { speakFr } from "@/lib/speak";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface PronunciationPracticeProps {
  target: string;
  lessonTitle: string;
}

export function PronunciationPractice({ target, lessonTitle }: PronunciationPracticeProps) {
  const navigate = useNavigate();
  const speech = useSpeechRecognition("fr-FR");
  const said = speech.transcript || speech.interim;

  const match = useMemo(() => {
    if (!speech.transcript) return null;
    return normalize(speech.transcript).includes(normalize(target));
  }, [speech.transcript, target]);

  // Detener el micrófono automáticamente al acertar.
  useEffect(() => {
    if (match === true && speech.listening) {
      speech.stop();
    }
  }, [match, speech]);

  const askTutor = () => {
    const prompt = `J'apprends « ${lessonTitle} ». J'ai voulu dire : "${target}". J'ai dit : "${speech.transcript}". Corrige ma prononciation et donne-moi un conseil concret.`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("prefill_chat", prompt);
    }
    navigate({ to: "/chat" });
  };

  if (!speech.supported) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 text-sm text-muted-foreground">
        Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Practica con tu voz
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
          onClick={speech.listening ? speech.stop : speech.start}
          className={`grid h-16 w-16 place-items-center rounded-full transition ${
            speech.listening
              ? "bg-destructive text-destructive-foreground animate-pulse shadow-elegant"
              : "bg-[image:var(--bg-gradient-primary)] text-primary-foreground shadow-elegant hover:scale-105"
          }`}
          aria-label={speech.listening ? "Detener" : "Grabar"}
        >
          {speech.listening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            {speech.listening
              ? "Habla ahora en francés…"
              : "Pulsa el micrófono y di la frase en voz alta."}
          </p>
          {said && (
            <p className="mt-1 font-display text-lg text-foreground">
              {said}
              {speech.interim && !speech.transcript && <span className="text-muted-foreground"> …</span>}
            </p>
          )}
        </div>
      </div>

      {speech.transcript && match !== null && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {match ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              <CheckCircle2 className="h-4 w-4" /> Très bien ! Coincide
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
              <XCircle className="h-4 w-4" /> Pas encore — réessaie
            </span>
          )}
          <button
            onClick={() => {
              speech.reset();
              // Esperar a que el navegador procese el abort() antes de
              // reiniciar el reconocedor; si no, start() puede ignorarse.
              setTimeout(() => speech.start(), 250);
            }}
            className="rounded-full border border-border px-3 py-1.5 text-sm transition hover:border-primary hover:text-primary"
          >
            Reintentar
          </button>
          <button
            onClick={askTutor}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-sm text-background transition hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" /> Pedir feedback al tuteur
          </button>
        </div>
      )}
    </div>
  );
}
