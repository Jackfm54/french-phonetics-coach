import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { VoiceAnalyzer } from "@/components/VoiceAnalyzer";

const PRESETS = [
  { label: "Salutation", text: "Bonjour, comment allez-vous ?" },
  { label: "Question (intonation ↑)", text: "Tu viens avec moi ?" },
  { label: "Affirmation (intonation ↓)", text: "Je vais au marché." },
  { label: "Nasale [ɑ̃]", text: "Un enfant blanc dans le champ." },
  { label: "Nasale [ɔ̃]", text: "Mon oncle a un bon bonbon." },
  { label: "Nasale [ɛ̃]", text: "Un pain, cinq matins." },
  { label: "Voyelle [y]", text: "Tu as vu la lune sur la rue." },
  { label: "R uvulaire", text: "Trois grands rats gris rongent." },
  { label: "Liaison", text: "Les_amis ont_un petit_enfant." },
  { label: "Poème (rythme)", text: "Il pleure dans mon cœur comme il pleut sur la ville." },
];

export const Route = createFileRoute("/analizador")({
  head: () => ({
    meta: [
      { title: "Analizador fonético — Professeur.fr" },
      {
        name: "description",
        content:
          "Analiza tu pronunciación francesa en tiempo real: espectrograma, forma de onda y curva de entonación.",
      },
    ],
  }),
  component: AnalyzerPage,
});

function AnalyzerPage() {
  const [selected, setSelected] = useState(PRESETS[0]);
  const [custom, setCustom] = useState("");

  return (
    <div className="min-h-screen bg-[image:var(--bg-gradient-hero)]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Fonética avanzada
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">Analizador de voz en tiempo real</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Escucha el modelo nativo, imítalo y compara visualmente tu espectrograma y entonación. Ideal para trabajar
            nasales, vocales cerradas, la /R/ uvular y el ritmo del francés.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            Elige una frase o escribe la tuya
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setSelected(p);
                  setCustom("");
                }}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  !custom && selected.label === p.label
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary hover:bg-secondary/70"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="…o escribe una frase en francés"
            className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <VoiceAnalyzer referenceText={custom.trim() || selected.text} />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Espectrograma",
              d: "Cada columna es un instante; el color muestra qué frecuencias suenan. Las nasales dejan bandas claras hacia arriba.",
            },
            {
              t: "Forma de onda",
              d: "Amplitud instantánea. Sirve para ver ritmo, sílabas cerradas y ataques consonánticos.",
            },
            {
              t: "Entonación (pitch)",
              d: "Curva de tu frecuencia fundamental. Las preguntas suben al final; las afirmaciones bajan.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-border bg-card p-4">
              <div className="text-sm font-semibold">{c.t}</div>
              <p className="mt-1 text-xs text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
