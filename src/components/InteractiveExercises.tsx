import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Volume2,
  RotateCcw,
  Trophy,
  Mic,
  MicOff,
  ChevronRight,
} from "lucide-react";
import { speakFr } from "@/lib/speak";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { Exercise } from "@/lib/lessons";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface Props {
  exercises: Exercise[];
}

export function InteractiveExercises({ exercises }: Props) {
  const [idx, setIdx] = useState(0);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean[]>([]);
  const [restartKey, setRestartKey] = useState(0);

  if (exercises.length === 0) return null;

  const total = exercises.length;
  const finished = idx >= total;
  const score = answeredCorrect.filter(Boolean).length;

  const handleAnswered = (correct: boolean) => {
    setAnsweredCorrect((arr) => [...arr, correct]);
  };

  const next = () => setIdx((i) => i + 1);
  const restart = () => {
    setIdx(0);
    setAnsweredCorrect([]);
    setRestartKey((k) => k + 1);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="rounded-3xl border border-border bg-[image:var(--bg-gradient-hero)] p-7 text-center shadow-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15">
          <Trophy className="h-7 w-7 text-primary" />
        </div>
        <p className="mt-4 font-display text-3xl font-semibold">
          {score}/{total}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {pct >= 80
            ? "Excellent ! Tu maîtrises ce point."
            : pct >= 50
              ? "Bien — recommence pour ancrer le son."
              : "Encore un peu — réécoute le modèle et réessaie."}
        </p>
        <button
          onClick={restart}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <RotateCcw className="h-4 w-4" /> Recommencer
        </button>
      </div>
    );
  }

  const ex = exercises[idx];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Exercice {idx + 1} / {total}
        </span>
        <div className="flex gap-1">
          {exercises.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full transition ${
                i < idx
                  ? answeredCorrect[i]
                    ? "bg-primary"
                    : "bg-destructive/60"
                  : i === idx
                    ? "bg-primary/40"
                    : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <ExerciseCard
        key={`${idx}-${restartKey}`}
        exercise={ex}
        onAnswered={handleAnswered}
        onNext={next}
        isLast={idx === total - 1}
      />
    </div>
  );
}

interface CardProps {
  exercise: Exercise;
  onAnswered: (correct: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

function ExerciseCard({ exercise, onAnswered, onNext, isLast }: CardProps) {
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [value, setValue] = useState("");
  const speech = useSpeechRecognition("fr-FR");

  const continueBtn = (
    <button
      onClick={onNext}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
    >
      {isLast ? "Voir le résultat" : "Suivant"} <ChevronRight className="h-4 w-4" />
    </button>
  );

  const feedbackBanner = submitted && (
    <div
      className={`mt-4 flex items-start gap-2 rounded-2xl p-4 text-sm ${
        correct
          ? "bg-primary/10 text-primary"
          : "bg-destructive/10 text-destructive"
      }`}
    >
      {correct ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
      )}
      <div className="flex-1">
        <p className="font-semibold">
          {correct ? "Très bien !" : "Pas tout à fait."}
        </p>
        {exercise.explain && (
          <p className="mt-1 text-foreground/80">{exercise.explain}</p>
        )}
      </div>
    </div>
  );

  /* ───── DISCRIMINATION ───── */
  if (exercise.type === "discrimination") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Discrimination auditive
        </p>
        <p className="mt-2 font-display text-lg">{exercise.question}</p>
        <button
          onClick={() => speakFr(exercise.audio)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[image:var(--bg-gradient-primary)] px-5 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition hover:scale-[1.02]"
        >
          <Volume2 className="h-4 w-4" /> Écouter
        </button>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {exercise.options.map((opt) => {
            const isAnswer = opt === exercise.answer;
            const isPicked = value === opt;
            return (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => {
                  setValue(opt);
                  const ok = opt === exercise.answer;
                  setCorrect(ok);
                  setSubmitted(true);
                  onAnswered(ok);
                }}
                className={`rounded-2xl border px-4 py-3 text-left font-display transition ${
                  submitted && isAnswer
                    ? "border-primary bg-primary/10 text-primary"
                    : submitted && isPicked
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card hover:border-primary/50 hover:text-primary"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {feedbackBanner}
        {submitted && <div className="mt-4">{continueBtn}</div>}
      </div>
    );
  }

  /* ───── TRANSCRIPTION ───── */
  if (exercise.type === "transcription") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Transcription API
        </p>
        <p className="mt-2 font-display text-lg">{exercise.question}</p>
        <div className="mt-4 flex items-center gap-3">
          <p className="font-display text-3xl font-semibold">{exercise.word}</p>
          <button
            onClick={() => speakFr(exercise.word)}
            className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-primary hover:text-primary-foreground"
            aria-label="Écouter"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-2">
          {exercise.options.map((opt) => {
            const isAnswer = opt === exercise.answer;
            const isPicked = value === opt;
            return (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => {
                  setValue(opt);
                  const ok = opt === exercise.answer;
                  setCorrect(ok);
                  setSubmitted(true);
                  onAnswered(ok);
                }}
                className={`rounded-2xl border px-4 py-3 text-left font-mono text-base transition ${
                  submitted && isAnswer
                    ? "border-primary bg-primary/10 text-primary"
                    : submitted && isPicked
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card hover:border-primary/50 hover:text-primary"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {feedbackBanner}
        {submitted && <div className="mt-4">{continueBtn}</div>}
      </div>
    );
  }

  /* ───── DICTÉE ───── */
  if (exercise.type === "dictee") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Dictée
        </p>
        <p className="mt-2 font-display text-lg">{exercise.question}</p>
        <button
          onClick={() => speakFr(exercise.audio)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[image:var(--bg-gradient-primary)] px-5 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition hover:scale-[1.02]"
        >
          <Volume2 className="h-4 w-4" /> Écouter (rejouable)
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          disabled={submitted}
          placeholder="Écris ce que tu entends…"
          className="mt-4 w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 font-display text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {!submitted && (
          <button
            onClick={() => {
              const ok = normalize(value) === normalize(exercise.answer);
              setCorrect(ok);
              setSubmitted(true);
              onAnswered(ok);
            }}
            disabled={!value.trim()}
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition disabled:opacity-40"
          >
            Vérifier
          </button>
        )}
        {submitted && (
          <p className="mt-3 text-sm">
            <span className="text-muted-foreground">Réponse attendue : </span>
            <span className="font-display font-semibold text-primary">
              {exercise.answer}
            </span>
          </p>
        )}
        {feedbackBanner}
        {submitted && <div className="mt-4">{continueBtn}</div>}
      </div>
    );
  }

  /* ───── REPEAT (speech recognition) ───── */
  if (exercise.type === "repeat") {
    const said = speech.transcript || speech.interim;
    return (
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Répète à voix haute
        </p>
        <p className="mt-2 font-display text-lg">{exercise.question}</p>

        <div className="mt-4 rounded-2xl bg-secondary/60 p-4">
          <p className="font-display text-xl">{exercise.target}</p>
          {exercise.ipa && (
            <p className="mt-1 font-mono text-sm text-primary">{exercise.ipa}</p>
          )}
          <button
            onClick={() => speakFr(exercise.target)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs transition hover:border-primary hover:text-primary"
          >
            <Volume2 className="h-3 w-3" /> Écouter le modèle
          </button>
        </div>

        {!speech.supported ? (
          <p className="mt-4 rounded-2xl border border-dashed border-border bg-card/50 p-3 text-sm text-muted-foreground">
            Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.
          </p>
        ) : (
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => {
                if (speech.listening) {
                  speech.stop();
                  // esperar a que llegue el resultado final del reconocedor
                  setTimeout(() => {
                    const final = speech.getTranscript() || "";
                    const nSaid = normalize(final);
                    const nTarget = normalize(exercise.target);
                    const ok =
                      !!nSaid &&
                      (nSaid.includes(nTarget) ||
                        nTarget.includes(nSaid) ||
                        // tolerancia: 70% de las palabras esperadas presentes
                        (() => {
                          const words = nTarget.split(" ").filter(Boolean);
                          if (words.length === 0) return false;
                          const hit = words.filter((w) => nSaid.includes(w)).length;
                          return hit / words.length >= 0.7;
                        })());
                    setCorrect(ok);
                    setSubmitted(true);
                    onAnswered(ok);
                  }, 900);
                } else {
                  speech.reset();
                  setSubmitted(false);
                  speech.start();
                }
              }}
              className={`grid h-14 w-14 place-items-center rounded-full transition ${
                speech.listening
                  ? "bg-destructive text-destructive-foreground animate-pulse shadow-elegant"
                  : "bg-[image:var(--bg-gradient-primary)] text-primary-foreground shadow-elegant hover:scale-105"
              }`}
            >
              {speech.listening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                {speech.listening ? "Écoute en cours…" : "Pulsa et parle."}
              </p>
              {said && (
                <p className="mt-1 font-display text-base">{said}</p>
              )}
            </div>
          </div>
        )}

        {feedbackBanner}
        {submitted && <div className="mt-4">{continueBtn}</div>}
        {!submitted && !speech.supported && (
          <button
            onClick={() => {
              setCorrect(true);
              setSubmitted(true);
              onAnswered(true);
            }}
            className="mt-4 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
          >
            J&apos;ai répété — passer
          </button>
        )}
      </div>
    );
  }

  return null;
}

export type { Exercise };

