import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
type Mouth = { w: number; h: number; teeth?: boolean; tongue?: "up" | "mid" | "down" | "back" };

const MOUTH_SHAPE: Record<string, Mouth> = {
  // voyelles orales
  "[a]": { w: 0.85, h: 0.9, tongue: "down" },
  "[e] fermé": { w: 0.95, h: 0.25, tongue: "up" },
  "[ɛ] ouvert": { w: 0.95, h: 0.55, tongue: "mid" },
  "[ə]": { w: 0.55, h: 0.35, tongue: "mid" },
  "[i]": { w: 1, h: 0.15, tongue: "up" },
  "[o] fermé": { w: 0.35, h: 0.35, tongue: "back" },
  "[ɔ] ouvert": { w: 0.45, h: 0.6, tongue: "back" },
  "[ø] fermé": { w: 0.35, h: 0.3, tongue: "up" },
  "[œ] ouvert": { w: 0.45, h: 0.55, tongue: "mid" },
  "[u]": { w: 0.25, h: 0.25, tongue: "back" },
  "[y]": { w: 0.25, h: 0.2, tongue: "up" },
  // nasales
  "[ɑ̃]": { w: 0.7, h: 0.8, tongue: "back" },
  "[ɛ̃]": { w: 0.85, h: 0.55, tongue: "mid" },
  "[ɔ̃]": { w: 0.35, h: 0.55, tongue: "back" },
  // semi-voyelles
  "[j]": { w: 1, h: 0.2, tongue: "up" },
  "[w]": { w: 0.25, h: 0.25, tongue: "back" },
  "[ɥ]": { w: 0.3, h: 0.2, tongue: "up" },
  // consonnes
  "[p]": { w: 0.7, h: 0.05 },
  "[b]": { w: 0.7, h: 0.05 },
  "[t]": { w: 0.7, h: 0.2, teeth: true, tongue: "up" },
  "[d]": { w: 0.7, h: 0.2, teeth: true, tongue: "up" },
  "[k]": { w: 0.6, h: 0.4, tongue: "back" },
  "[ɡ]": { w: 0.6, h: 0.4, tongue: "back" },
  "[f]": { w: 0.75, h: 0.15, teeth: true },
  "[v]": { w: 0.75, h: 0.15, teeth: true },
  "[s]": { w: 0.85, h: 0.15, teeth: true, tongue: "up" },
  "[z]": { w: 0.85, h: 0.15, teeth: true, tongue: "up" },
  "[ʃ]": { w: 0.45, h: 0.25, teeth: true },
  "[ʒ]": { w: 0.45, h: 0.25, teeth: true },
  "[m]": { w: 0.7, h: 0.05 },
  "[n]": { w: 0.6, h: 0.2, tongue: "up" },
  "[l]": { w: 0.6, h: 0.35, tongue: "up" },
  "[ʁ]": { w: 0.5, h: 0.5, tongue: "back" },
  "[ɲ]": { w: 0.55, h: 0.25, tongue: "up" },
  "[ŋ]": { w: 0.5, h: 0.3, tongue: "back" },
};

function MouthIcon({ son, animate }: { son: string; animate: boolean }) {
  const m = MOUTH_SHAPE[son] ?? { w: 0.6, h: 0.3 };
  // Phase 0..1 : 0 = bouche au repos, 1 = articulation cible
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!animate) {
      setPhase(0);
      return;
    }
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      // oscille entre 0.25 et 1 pour simuler la mâchoire
      setPhase(0.25 + 0.75 * Math.abs(Math.sin(t * 0.6)));
    }, 80);
    return () => clearInterval(id);
  }, [animate]);

  // dimensions cibles, modulées par phase quand on articule
  const k = animate ? phase : 1;
  const cx = 32;
  const cy = 24;
  const rx = 6 + m.w * 18 * (0.7 + 0.3 * k); // labios se contraen un poco
  const ry = 0.8 + m.h * 12 * k; // apertura modulada
  return (
    <div
      className={`inline-grid h-16 w-20 place-items-center rounded-lg border bg-background transition-colors ${
        animate ? "border-primary shadow-sm" : "border-border"
      }`}
      title={`Articulation : ${son}`}
    >
      <svg viewBox="0 0 64 48" className="h-14 w-[4.5rem]">
        {/* contour du visage */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={28}
          ry={20}
          className="fill-secondary/40 stroke-border"
          strokeWidth="0.6"
        />
        {/* nez */}
        <path
          d={`M ${cx} ${cy - 8} q -1.5 4 0 7`}
          className="fill-none stroke-border"
          strokeWidth="0.6"
        />
        {/* lèvres */}
        <ellipse
          cx={cx}
          cy={cy + 6}
          rx={rx}
          ry={ry}
          className="fill-rose-400/90 stroke-rose-600 transition-all duration-75"
          strokeWidth="0.8"
        />
        {/* dents */}
        {m.teeth && ry > 1.6 && (
          <rect
            x={cx - rx + 1.5}
            y={cy + 6 - Math.max(ry - 1.8, 0.8)}
            width={Math.max(rx * 2 - 3, 2)}
            height={1.8}
            className="fill-background"
          />
        )}
        {/* langue */}
        {m.tongue && ry > 2 && (
          <ellipse
            cx={
              m.tongue === "back"
                ? cx + rx * 0.35
                : cx - rx * 0.05
            }
            cy={
              m.tongue === "up"
                ? cy + 6 - ry * 0.3
                : m.tongue === "down"
                ? cy + 6 + ry * 0.4
                : cy + 6 + ry * 0.15
            }
            rx={Math.min(rx * 0.55, 6)}
            ry={Math.min(ry * 0.45, 3)}
            className="fill-pink-300/90"
          />
        )}
      </svg>
    </div>
  );
}

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
                    onClick={() => {
                      const trigger = SON_TO_TRIGGER[r.son] ?? r.sample;
                      const words = r.exemples
                        .split(/[,·]/)
                        .map((w) => w.trim())
                        .filter(Boolean);
                      const queue = [trigger, ...words];
                      const playNext = (i: number) => {
                        if (i >= queue.length) {
                          return;
                        }
                        speakFr(queue[i], 0.85, {
                          onEnd: () => setTimeout(() => playNext(i + 1), 250),
                        });
                      };
                      playNext(0);
                    }}
                    className="inline-grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground"
                    aria-label={`Écouter ${r.son} et les exemples`}
                    title={`Écouter : ${r.son} → ${r.exemples}`}
                  >
                    <Volume2 className="h-4 w-4" />
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
  type Point = {
    x: number;
    y: number;
    son: string;
    label: string;
    col: "front" | "round" | "back" | "central" | "nasal";
  };

  const points: Point[] = [
    { x: 14, y: 8, son: "[i]", label: "i", col: "front" },
    { x: 42, y: 8, son: "[y]", label: "y", col: "round" },
    { x: 86, y: 8, son: "[u]", label: "u", col: "back" },
    { x: 22, y: 28, son: "[e] fermé", label: "e", col: "front" },
    { x: 46, y: 28, son: "[ø] fermé", label: "ø", col: "round" },
    { x: 78, y: 28, son: "[o] fermé", label: "o", col: "back" },
    { x: 50, y: 46, son: "[ə]", label: "ə", col: "central" },
    { x: 30, y: 62, son: "[ɛ] ouvert", label: "ɛ", col: "front" },
    { x: 50, y: 62, son: "[œ] ouvert", label: "œ", col: "round" },
    { x: 70, y: 62, son: "[ɔ] ouvert", label: "ɔ", col: "back" },
    { x: 38, y: 88, son: "[a]", label: "a", col: "front" },
    { x: 70, y: 88, son: "[ɑ̃]", label: "ɑ̃", col: "nasal" },
  ];

  const colColor: Record<Point["col"], string> = {
    front: "bg-sky-500 text-white",
    round: "bg-sky-600 text-white",
    back: "bg-sky-700 text-white",
    central: "bg-slate-500 text-white",
    nasal: "bg-emerald-600 text-white",
  };

  const [playing, setPlaying] = useState<string | null>(null);

  const play = (son: string) => {
    if (playing) return;
    setPlaying(son);
    const trigger = SON_TO_TRIGGER[son] ?? son.replace(/[\[\]]/g, "");
    speakFr(trigger, 0.85, { onEnd: () => setPlaying(null) });
  };

  return (
    <section className="mb-12">
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-rose-500/15 to-rose-500/5 px-5 py-3">
        <h2 className="font-display text-xl font-semibold">
          Les voyelles orales · schéma articulatoire
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Clique sur une bouche pour entendre le son et voir l'articulation.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-3 flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span>← avant</span>
          <span className="font-display text-base text-foreground">
            position de la langue
          </span>
          <span>arrière →</span>
        </div>

        <div className="flex gap-4">
          <div className="relative aspect-[5/4] flex-1 rounded-xl border border-border bg-background">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <polygon
                points="8,4 92,4 78,96 22,96"
                className="fill-secondary/30 stroke-muted-foreground/50"
                strokeWidth="0.5"
              />
              <line x1="14" y1="28" x2="86" y2="28" className="stroke-muted-foreground/25" strokeWidth="0.3" />
              <line x1="18" y1="52" x2="82" y2="52" className="stroke-muted-foreground/25" strokeWidth="0.3" />
              <line x1="22" y1="76" x2="78" y2="76" className="stroke-muted-foreground/25" strokeWidth="0.3" />
            </svg>

            {points.map((p) => (
              <button
                key={p.son}
                onClick={() => play(p.son)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 transition hover:scale-110"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                title={`Écouter ${p.son}`}
                aria-label={`Écouter ${p.son}`}
              >
                
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full font-display text-sm font-bold shadow ${colColor[p.col]}`}
                >
                  {p.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex w-6 flex-col items-center justify-between py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="[writing-mode:vertical-rl] rotate-180">
              bouche plus fermée
            </span>
            <span className="[writing-mode:vertical-rl] rotate-180">
              bouche plus ouverte
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          <Legend swatch="bg-sky-500" label="Antérieures étirées" />
          <Legend swatch="bg-sky-600" label="Antérieures arrondies" />
          <Legend swatch="bg-sky-700" label="Postérieures arrondies" />
          <Legend swatch="bg-emerald-600" label="Nasales" />
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
