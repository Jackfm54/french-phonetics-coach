import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { clipsByLevel } from "@/lib/listening-library";
import { generateDiplomaPdf } from "@/lib/diploma-pdf";
import { generateExamTopic, type GeneratedTopic } from "@/lib/topic-generator.functions";
import { supabase } from "@/integrations/supabase/client";

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type Phase = "intro" | "CE" | "CO" | "PE" | "PO" | "done";

type Scores = {
  CE: number | null;
  CO: number | null;
  PE: number | null;
  PO: number | null;
};

const PHASE_INFO: Record<
  Exclude<Phase, "intro" | "done">,
  { label: string; minutes: number; max: number }
> = {
  CE: { label: "Compréhension Écrite", minutes: 30, max: 25 },
  CO: { label: "Compréhension Orale", minutes: 25, max: 25 },
  PE: { label: "Production Écrite", minutes: 60, max: 25 },
  PO: { label: "Production Orale", minutes: 12, max: 25 },
};

export const Route = createFileRoute("/simulacros/complet/$level")({
  head: ({ params }) => ({
    meta: [
      { title: `Simulacre complet ${params.level} — Professeur.fr` },
      {
        name: "description",
        content: `Simulacre complet 4/4 épreuves cronometrado nivel ${params.level} con diploma PDF.`,
      },
    ],
  }),
  component: FullExamPage,
});

function FullExamPage() {
  const { level } = Route.useParams() as { level: string };
  const navigate = useNavigate();
  const validLevel: Level | null = ["A1", "A2", "B1", "B2", "C1", "C2"].includes(level)
    ? (level as Level)
    : null;

  const [phase, setPhase] = useState<Phase>("intro");
  const [scores, setScores] = useState<Scores>({ CE: null, CO: null, PE: null, PO: null });
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setStudentName(data.user?.email?.split("@")[0] ?? "Candidat(e)");
    });
  }, []);

  if (!validLevel) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p>Nivel inválido.</p>
          <button
            onClick={() => navigate({ to: "/simulacros" })}
            className="mt-4 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"
          >
            ← Volver
          </button>
        </main>
      </div>
    );
  }

  const total = (Object.values(scores).filter((s) => s !== null) as number[]).reduce(
    (a, b) => a + b,
    0,
  );
  const totalMax = 100;

  const cefr = useMemo(() => {
    if (phase !== "done") return "—";
    const pct = (total / totalMax) * 100;
    if (pct >= 85) return upgrade(validLevel, 1);
    if (pct >= 50) return validLevel;
    return downgrade(validLevel, 1);
  }, [phase, total, validLevel]);

  const downloadDiploma = () => {
    const blob = generateDiplomaPdf({
      studentName,
      examCode: "DELF/DALF Simulacre complet",
      level: validLevel,
      date: new Date().toLocaleDateString("fr-FR"),
      scores: [
        { label: "Compréhension Écrite", score: scores.CE ?? 0, max: 25 },
        { label: "Compréhension Orale", score: scores.CO ?? 0, max: 25 },
        { label: "Production Écrite", score: scores.PE ?? 0, max: 25 },
        { label: "Production Orale", score: scores.PO ?? 0, max: 25 },
      ],
      totalScore: total,
      totalMax,
      cefrEstimated: cefr,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Diploma_${validLevel}_${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[image:var(--bg-gradient-hero)]">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Simulacre complet · {validLevel}
        </span>

        {phase === "intro" && (
          <Intro
            level={validLevel}
            studentName={studentName}
            setStudentName={setStudentName}
            onStart={() => setPhase("CE")}
          />
        )}

        {(phase === "CE" || phase === "CO" || phase === "PE" || phase === "PO") && (
          <TimedPhase
            key={phase}
            level={validLevel}
            phase={phase}
            onFinish={(score) => {
              setScores((s) => ({ ...s, [phase]: score }));
              const order: Phase[] = ["CE", "CO", "PE", "PO", "done"];
              setPhase(order[order.indexOf(phase) + 1]);
            }}
          />
        )}

        {phase === "done" && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-3xl font-semibold">Simulacre terminé !</h2>
            <p className="mt-1 text-muted-foreground">
              Voici votre récapitulatif. Vous pouvez télécharger votre diplôme au format PDF.
            </p>
            <div className="mt-6 space-y-2">
              {(["CE", "CO", "PE", "PO"] as const).map((k) => (
                <div key={k} className="flex items-center justify-between border-b border-border py-2">
                  <span className="text-sm">{PHASE_INFO[k].label}</span>
                  <strong>{scores[k]} / 25</strong>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-semibold">Total</span>
                <strong className="text-lg">{total} / 100</strong>
              </div>
              <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-center">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Niveau CECRL estimé
                </div>
                <div className="mt-1 font-display text-4xl font-bold text-emerald-600">{cefr}</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={downloadDiploma}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                📄 Télécharger le diplôme
              </button>
              <button
                onClick={() => navigate({ to: "/simulacros" })}
                className="rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary"
              >
                ← Simulacres
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function upgrade(l: Level, n: number): Level {
  const order: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return order[Math.min(order.length - 1, order.indexOf(l) + n)];
}
function downgrade(l: Level, n: number): Level {
  const order: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return order[Math.max(0, order.indexOf(l) - n)];
}

function Intro({
  level,
  studentName,
  setStudentName,
  onStart,
}: {
  level: Level;
  studentName: string;
  setStudentName: (s: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-8">
      <h1 className="font-display text-3xl font-semibold">Simulacre complet — {level}</h1>
      <p className="mt-2 text-muted-foreground">
        Quatre épreuves enchaînées avec temporisation officielle. Ne fermez pas cet onglet pendant
        le simulacre.
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {(["CE", "CO", "PE", "PO"] as const).map((k) => (
          <div key={k} className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="font-semibold">{PHASE_INFO[k].label}</div>
            <div className="text-xs text-muted-foreground">{PHASE_INFO[k].minutes} min</div>
          </div>
        ))}
      </div>
      <label className="mt-6 block">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Votre nom (pour le diplôme)
        </span>
        <input
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
        />
      </label>
      <button
        onClick={onStart}
        disabled={!studentName.trim()}
        className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
      >
        ▶ Commencer le simulacre
      </button>
    </div>
  );
}

function TimedPhase({
  level,
  phase,
  onFinish,
}: {
  level: Level;
  phase: "CE" | "CO" | "PE" | "PO";
  onFinish: (score: number) => void;
}) {
  const info = PHASE_INFO[phase];
  const [secondsLeft, setSecondsLeft] = useState(info.minutes * 60);
  const [text, setText] = useState("");
  const [topic, setTopic] = useState<GeneratedTopic | null>(null);
  const [loadingTopic, setLoadingTopic] = useState(false);
  const clip = useMemo(() => clipsByLevel(level)[0], [level]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (phase === "PE" || phase === "PO") {
      setLoadingTopic(true);
      generateExamTopic({
        data: {
          examCode: `DELF ${level}`,
          taskType: phase === "PE" ? "writing" : "monologue",
          level,
        },
      })
        .then(setTopic)
        .finally(() => setLoadingTopic(false));
    }
  }, [phase, level]);

  useEffect(() => {
    if (phase === "CO" && clip) {
      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clip.transcript, voice: clip.voice, speed: 1 }),
      })
        .then((r) => r.blob())
        .then((b) => setAudioUrl(URL.createObjectURL(b)))
        .catch(() => {});
    }
  }, [phase, clip]);

  useEffect(() => {
    if (secondsLeft === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const submit = () => {
    let score = 15;
    if (phase === "CE") {
      score = Math.min(25, 10 + Math.floor(text.length / 100));
    } else if (phase === "CO" && clip) {
      const correct = clip.questions.reduce(
        (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
        0,
      );
      score = Math.round((correct / clip.questions.length) * 25);
    } else if (phase === "PE") {
      const words = text.trim().split(/\s+/).length;
      score = Math.min(25, Math.max(5, Math.floor(words / 8)));
    } else if (phase === "PO") {
      score = 18;
    }
    onFinish(score);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const urgent = secondsLeft < 60;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{phase}</div>
          <h2 className="font-display text-2xl font-semibold">{info.label}</h2>
        </div>
        <div
          className={`rounded-full px-4 py-2 font-mono text-lg font-bold ${
            urgent ? "bg-red-500 text-white" : "bg-secondary"
          }`}
        >
          {mm}:{ss}
        </div>
      </div>

      {phase === "CE" && (
        <div className="space-y-3">
          <p className="rounded-xl bg-secondary/40 p-4 text-sm leading-relaxed">
            Lisez ce texte et résumez-le en 150 mots minimum en justifiant votre compréhension.
          </p>
          <div className="rounded-xl border border-border p-4 text-sm leading-relaxed">
            {clip?.transcript ?? "Chargement du texte…"}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Votre résumé et vos réponses ici…"
            className="min-h-[200px] w-full rounded-lg border border-border bg-background p-3 text-sm"
          />
        </div>
      )}

      {phase === "CO" && clip && (
        <div className="space-y-3">
          {audioUrl ? (
            <audio src={audioUrl} controls className="w-full" />
          ) : (
            <div className="text-sm text-muted-foreground">Chargement de l'audio…</div>
          )}
          {clip.questions.map((q, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="mb-2 text-sm font-medium">
                {i + 1}. {q.q}
              </div>
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setAnswers({ ...answers, [i]: oi })}
                  className={`block w-full rounded-md border px-3 py-1.5 text-left text-sm ${
                    answers[i] === oi
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {(phase === "PE" || phase === "PO") && (
        <div className="space-y-3">
          {loadingTopic ? (
            <div className="text-sm text-muted-foreground">Génération du sujet…</div>
          ) : topic ? (
            <div className="rounded-xl bg-secondary/40 p-4">
              <div className="font-semibold">{topic.title}</div>
              <p className="mt-1 text-sm">{topic.instruction}</p>
              {topic.prompts.length > 0 && (
                <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                  {topic.prompts.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          {phase === "PE" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Votre production écrite…"
              className="min-h-[240px] w-full rounded-lg border border-border bg-background p-3 text-sm"
            />
          )}
          {phase === "PO" && (
            <p className="rounded-lg bg-secondary/30 p-3 text-xs text-muted-foreground">
              Enregistrez-vous à voix haute. À la fin du temps imparti, cliquez sur « Terminer ».
              La note sera indicative ; utilisez également <em>/analizador</em> et <em>/chat</em>
              pour un feedback fin.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={submit}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Terminer cette épreuve →
        </button>
      </div>
    </div>
  );
}
