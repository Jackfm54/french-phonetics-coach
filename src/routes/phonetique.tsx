import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { speakFr } from "@/lib/speak";
import { Volume2 } from "lucide-react";

export const Route = createFileRoute("/phonetique")({
  head: () => ({
    meta: [
      { title: "Phonétique du français · tableaux complets · Professeur.fr" },
      {
        name: "description",
        content:
          "Tableaux complets de phonétique française : voyelles orales, voyelles nasales, semi-voyelles, consonnes et schéma articulatoire des voyelles.",
      },
    ],
  }),
  component: PhonetiquePage,
});

type Row = { son: string; graphie: string; exemples: string; sample: string };

// Texto corto que el TTS francés pronuncia exactamente como el fonema de la
// columna "Son". Evita que se lea como nombre de letra (p.ej. "u" suelto).
const SON_TO_TRIGGER: Record<string, string> = {
  "[a]": "a",
  "[e] fermé": "été",
  "[ɛ] ouvert": "très",
  "[ə]": "le",
  "[i]": "ici",
  "[o] fermé": "mot",
  "[ɔ] ouvert": "or",
  "[ø] fermé": "deux",
  "[œ] ouvert": "neuf",
  "[u]": "vous",
  "[y]": "tu",
  "[ɑ̃]": "an",
  "[ɛ̃]": "vin",
  "[ɔ̃]": "on",
  "[j]": "yeux",
  "[w]": "oui",
  "[ɥ]": "huit",
  "[p]": "pa",
  "[b]": "ba",
  "[t]": "ta",
  "[d]": "da",
  "[k]": "ka",
  "[ɡ]": "ga",
  "[f]": "fa",
  "[v]": "va",
  "[s]": "sa",
  "[z]": "za",
  "[ʃ]": "cha",
  "[ʒ]": "ja",
  "[m]": "ma",
  "[n]": "na",
  "[l]": "la",
  "[ʁ]": "ra",
  "[ɲ]": "agneau",
  "[ŋ]": "parking",
};

// Forma de la boca para cada fonema:
// w = ancho de la abertura (0..1) — pequeño = labios arrondis
// h = apertura vertical (0..1) — 0 cerrado, 1 muy abierto
// teeth = mostrar dientes (oclusivas/fricativas)
// tongue = posición de la lengua: "up" | "mid" | "down" | "back"

const VOYELLES_ORALES: Row[] = [
  { son: "[a]", graphie: "a, à, â", exemples: "papa, là, théâtre", sample: "papa" },
  { son: "[e] fermé", graphie: "é · e + consonne finale muette (sauf t)", exemples: "pied, restez, école, céder", sample: "été" },
  { son: "[ɛ] ouvert", graphie: "è, ê, ai, ei · e en milieu de syllabe", exemples: "mère, fête, maison, neige", sample: "mère" },
  { son: "[ə]", graphie: "e dans les monosyllabes · e en fin de syllabe", exemples: "le, de, ce, premier", sample: "le" },
  { son: "[i]", graphie: "i, î, ï, y", exemples: "lit, île, maïs, cycle", sample: "lit" },
  { son: "[o] fermé", graphie: "o en fin de syllabe · ô · au, eau", exemples: "photo, rose, diplôme, château", sample: "rose" },
  { son: "[ɔ] ouvert", graphie: "o en milieu de syllabe · au(l), au(r)", exemples: "port, bonne, Paul, aquarium", sample: "porte" },
  { son: "[ø] fermé", graphie: "eu, œu en fin de syllabe · eu + [z]/[t]", exemples: "feu, jeudi, vœu, chanteuse", sample: "feu" },
  { son: "[œ] ouvert", graphie: "eu, œu en milieu de syllabe · œ en début", exemples: "seul, fleur, cœur, œil", sample: "fleur" },
  { son: "[u]", graphie: "ou, où, oû", exemples: "loup, où, goût", sample: "vous" },
  { son: "[y]", graphie: "u, û · eu (p. passé d'avoir)", exemples: "mur, dû, j'ai eu", sample: "tu" },
];

const VOYELLES_NASALES: Row[] = [
  { son: "[ɑ̃]", graphie: "an, am, en, em, aon, aen, ean", exemples: "danse, chambre, cent, temps, paon, Jean", sample: "enfant" },
  { son: "[ɛ̃]", graphie: "in, im, yn, ym, ain, aim, ein, eim, (é)en, un, um", exemples: "vin, pain, plein, lycéen, lundi, humble", sample: "vin" },
  { son: "[ɔ̃]", graphie: "on, om", exemples: "pont, nombre, bonjour", sample: "bonjour" },
];

const SEMI_VOYELLES: Row[] = [
  { son: "[j]", graphie: "i / y + voyelle · (a)il, (e)il, ill(e)", exemples: "pied, essuyer, travail, soleil, feuille", sample: "fille" },
  { son: "[w]", graphie: "ou + voyelle · oi = [wa] · oin = [wɛ̃]", exemples: "oui, soir, loin", sample: "oui" },
  { son: "[ɥ]", graphie: "u + voyelle", exemples: "lui, tuer, huit", sample: "huit" },
];

const CONSONNES: Row[] = [
  { son: "[p]", graphie: "p, pp, b (s)", exemples: "père, appel, absolu", sample: "papa" },
  { son: "[b]", graphie: "b, bb (rare)", exemples: "ballon, abbé", sample: "ballon" },
  { son: "[t]", graphie: "t, tt, th · d en liaison", exemples: "table, chatte, thé, prend-il", sample: "table" },
  { son: "[d]", graphie: "d, dd, dh", exemples: "donner, addition, adhérer", sample: "donner" },
  { son: "[k]", graphie: "c + cons./a/o/u · cc · qu, k, ch (grec) · x [ks]", exemples: "climat, accuser, quand, kilo, orchestre, axe", sample: "quand" },
  { son: "[ɡ]", graphie: "g + cons./a/o/u · gu + voyelle · ex + voyelle [gz]", exemples: "grand, garder, guider, exercice", sample: "garder" },
  { son: "[f]", graphie: "f, ff, ph", exemples: "café, effort, physique", sample: "café" },
  { son: "[v]", graphie: "v, w", exemples: "venir, wagon", sample: "venir" },
  { son: "[s]", graphie: "s, ss · c+e/i/y · ç · x [ks] · ti+voyelle", exemples: "sonner, passer, ceci, façon, action", sample: "sonner" },
  { son: "[z]", graphie: "s entre deux voyelles · z, zz · x [gz]", exemples: "causer, zéro, deuxième, exercice", sample: "zéro" },
  { son: "[ʃ]", graphie: "ch, sch, sh", exemples: "chat, schéma, shampooing", sample: "chat" },
  { son: "[ʒ]", graphie: "j · g + e/i · ge + voyelle", exemples: "jeune, gentil, Georges", sample: "jeune" },
  { son: "[m]", graphie: "m, mm", exemples: "mère, commode", sample: "mère" },
  { son: "[n]", graphie: "n, nn", exemples: "nez, colonne", sample: "nez" },
  { son: "[l]", graphie: "l, ll", exemples: "lit, belle", sample: "lit" },
  { son: "[ʁ]", graphie: "r, rr, rh", exemples: "riz, terre, rhume", sample: "rouge" },
  { son: "[ɲ]", graphie: "gn", exemples: "agneau, montagne", sample: "montagne" },
  { son: "[ŋ]", graphie: "ng (anglicismes)", exemples: "parking, camping", sample: "parking" },
];

function PhonetiquePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Référence · Du son à l'écriture
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
            Phonétique du français
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Tableaux complets : <b>voyelles orales</b>, <b>voyelles nasales</b>,{" "}
            <b>semi-voyelles</b>, <b>consonnes</b> et schéma articulatoire des voyelles.
            Clique sur l'icône audio pour entendre chaque son.
          </p>
        </header>

        <Section title="Voyelles orales" rows={VOYELLES_ORALES} accent="from-primary/15 to-primary/5" />
        <Section title="Voyelles nasales" rows={VOYELLES_NASALES} accent="from-amber-500/15 to-amber-500/5" />
        <Section title="Semi-voyelles" rows={SEMI_VOYELLES} accent="from-emerald-500/15 to-emerald-500/5" />
        <Section title="Consonnes" rows={CONSONNES} accent="from-sky-500/15 to-sky-500/5" />

        <ArticulatoryDiagram />

        <aside className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6 text-sm leading-relaxed text-foreground">
          <h3 className="font-display text-lg font-semibold">Notes</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>
              Le <b>e</b> est muet en fin de mot (sauf monosyllabes), avant un{" "}
              <i>-s</i> de pluriel ou de terminaison verbale, et à l'intérieur d'un
              mot s'il n'y a pas de groupe de consonnes difficile à prononcer.
            </li>
            <li>
              Les consonnes <b>d, p, s, t, x, z</b> sont généralement muettes en
              fin de mot (<i>pied</i>, <i>pieds</i>, <i>tu prends</i>).
            </li>
            <li>
              Le <b>h</b> ne se prononce jamais ; le « h aspiré » empêche
              élision et liaison (<i>la harpe</i>, <i>les / harpes</i>).
            </li>
            <li>
              En français moderne, <b>un / um</b> [œ̃] tendent à se confondre
              avec [ɛ̃].
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  rows,
  accent,
}: {
  title: string;
  rows: Row[];
  accent: string;
}) {
  const [playing, setPlaying] = useState<string | null>(null);

  const play = async (r: Row) => {
    if (playing) return;
    setPlaying(r.son);
    const ipa = r.son; // ex: "[ɛ̃]", "[e] fermé"
    const trigger = SON_TO_TRIGGER[r.son] ?? r.sample;
    const words = r.exemples
      .split(/[,·]/)
      .map((w) => w.trim())
      .filter(Boolean);
    // Un texto único con pausas para que el TTS pronuncie: fonema aislado,
    // luego cada ejemplo, con pausas naturales (los "..." se leen como silencio).
    const input = `${trigger}... ... ${words.join("... ")}.`;
    const instructions =
      `Tu es un professeur de phonétique française. Prononce d'abord uniquement le son ${ipa} de manière isolée et claire — ne dis pas le nom de la lettre ni les crochets, seulement le phonème. Fais une pause nette. Ensuite prononce chaque mot d'exemple lentement, séparément, avec une courte pause entre chaque. Voix française de France, articulation nette, adaptée à un apprenant.`;
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          voice: "nova",
          speed: 0.9,
          format: "mp3",
          instructions,
        }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPlaying(null);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setPlaying(null);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      // Fallback: TTS del navegador si el servidor falla
      const queue = [trigger, ...words];
      const next = (i: number) => {
        if (i >= queue.length) {
          setPlaying(null);
          return;
        }
        speakFr(queue[i], 0.85, {
          onEnd: () => setTimeout(() => next(i + 1), 250),
        });
      };
      next(0);
    }
  };

  return (
    <section className="mb-12">
      <div
        className={`mb-4 rounded-2xl bg-gradient-to-r ${accent} px-5 py-3`}
      >
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Son</th>
              <th className="px-4 py-3 text-left font-semibold">Graphie</th>
              <th className="px-4 py-3 text-left font-semibold">Exemples</th>
              <th className="px-4 py-3 text-right font-semibold">Écouter</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.son}
                className="border-t border-border bg-card hover:bg-secondary/40"
              >
                <td className="px-4 py-3 font-display text-lg font-semibold text-primary">
                  {r.son}
                </td>
                <td className="px-4 py-3 text-foreground">{r.graphie}</td>
                <td className="px-4 py-3 italic text-muted-foreground">
                  {r.exemples}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => play(r)}
                    disabled={playing !== null}
                    className="inline-grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                    aria-label={`Écouter ${r.son} et les exemples`}
                    title={`Écouter : ${r.son} → ${r.exemples}`}
                  >
                    <Volume2 className={`h-4 w-4 ${playing === r.son ? "animate-pulse" : ""}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ArticulatoryDiagram() {
  // Points: x (0-100), y (0-100), label, color group
  type Point = { x: number; y: number; label: string; group: "i" | "y" | "u" | "n" };
  const points: Point[] = [
    { x: 15, y: 12, label: "[i]", group: "i" },
    { x: 50, y: 12, label: "[y]", group: "y" },
    { x: 85, y: 12, label: "[u]", group: "u" },
    { x: 22, y: 32, label: "[e]", group: "i" },
    { x: 50, y: 32, label: "[ø]", group: "y" },
    { x: 78, y: 32, label: "[o]", group: "u" },
    { x: 50, y: 48, label: "[ə]", group: "y" },
    { x: 30, y: 58, label: "[ɛ]", group: "i" },
    { x: 50, y: 58, label: "[œ]", group: "y" },
    { x: 70, y: 58, label: "[ɔ]", group: "u" },
    { x: 36, y: 76, label: "[ɛ̃]", group: "n" },
    { x: 50, y: 76, label: "[ɑ̃]", group: "n" },
    { x: 76, y: 70, label: "[ɔ̃]", group: "n" },
    { x: 50, y: 92, label: "[a]", group: "i" },
  ];

  const colors: Record<Point["group"], string> = {
    i: "fill-pink-500/20 stroke-pink-500",
    y: "fill-sky-500/20 stroke-sky-500",
    u: "fill-amber-500/20 stroke-amber-500",
    n: "fill-emerald-500/20 stroke-emerald-500",
  };

  return (
    <section className="mb-12">
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-rose-500/15 to-rose-500/5 px-5 py-3">
        <h2 className="font-display text-xl font-semibold">
          Schéma articulatoire des voyelles
        </h2>
      </div>

      <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 lg:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[4/3] w-full rounded-xl border border-border bg-background">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            {/* triangle des voyelles */}
            <polyline
              points="15,12 85,12 50,92 15,12"
              className="fill-none stroke-muted-foreground/40"
              strokeWidth="0.4"
            />
            {points.map((p) => (
              <g key={p.label}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4.5}
                  className={`${colors[p.group]}`}
                  strokeWidth="0.6"
                />
                <text
                  x={p.x}
                  y={p.y + 1.6}
                  textAnchor="middle"
                  className="fill-foreground font-mono"
                  fontSize="3.4"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
          <span className="absolute left-2 top-2 text-xs text-muted-foreground">
            − fermée
          </span>
          <span className="absolute bottom-2 left-2 text-xs text-muted-foreground">
            +++ très ouverte
          </span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            ← langue avant · langue arrière →
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-display text-base font-semibold">
            Quatre critères d'articulation
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <b className="text-foreground">Ouverture</b> de la bouche : de
              fermée (i, y, u) à très ouverte (a).
            </li>
            <li>
              <b className="text-foreground">Arrondissement</b> : lèvres
              étirées (i, e, ɛ) vs arrondies (y, ø, œ, u, o, ɔ).
            </li>
            <li>
              <b className="text-foreground">Position de la langue</b> : en
              avant (i, e, ɛ) ou en arrière (u, o, ɔ).
            </li>
            <li>
              <b className="text-foreground">Nasalité</b> : air par la bouche
              (orales) ou par bouche + nez (ɛ̃, ɑ̃, ɔ̃).
            </li>
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
            <Legend swatch="bg-pink-500" label="Antérieures étirées" />
            <Legend swatch="bg-sky-500" label="Antérieures arrondies" />
            <Legend swatch="bg-amber-500" label="Postérieures arrondies" />
            <Legend swatch="bg-emerald-500" label="Nasales" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-full ${swatch}`} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
