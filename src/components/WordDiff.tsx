import type { ReactElement } from "react";
import { type DiffResult, type DiffToken } from "@/lib/diff-fr";
import { Check, X, Minus, Plus } from "lucide-react";

const STYLES: Record<DiffToken["status"], string> = {
  ok: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  wrong: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/40",
  missing:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40 line-through decoration-2 decoration-amber-500",
  extra:
    "bg-slate-500/10 text-slate-500 border-slate-500/30 line-through decoration-slate-400",
};

const LABEL: Record<DiffToken["status"], string> = {
  ok: "correcta",
  wrong: "mal pronunciada",
  missing: "olvidada",
  extra: "de más",
};

const ICONS: Record<DiffToken["status"], ReactElement> = {
  ok: <Check className="h-3 w-3" />,
  wrong: <X className="h-3 w-3" />,
  missing: <Minus className="h-3 w-3" />,
  extra: <Plus className="h-3 w-3" />,
};

export function WordDiff({ result }: { result: DiffResult }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {result.tokens.map((t, i) => (
          <span
            key={i}
            title={LABEL[t.status] + (t.hint ? ` — ${t.hint}` : "")}
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-medium ${STYLES[t.status]}`}
          >
            <span aria-hidden>{ICONS[t.status]}</span>
            {t.text}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span>
          Precisión: <strong className="text-foreground">{Math.round(result.accuracy * 100)}%</strong>
        </span>
        <Legend color="bg-emerald-500" label="ok" />
        <Legend color="bg-red-500" label="mal" />
        <Legend color="bg-amber-500" label="olvidada" />
        <Legend color="bg-slate-400" label="de más" />
      </div>

      {result.problems.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            A repasar
          </p>
          <ul className="space-y-1.5 text-sm">
            {result.problems.slice(0, 6).map((p, i) => (
              <li key={i}>
                <strong className="text-foreground">{p.expected}</strong>
                {p.said && (
                  <span className="text-muted-foreground"> — dijiste « {p.said} »</span>
                )}
                {p.hint && <div className="mt-0.5 text-xs text-muted-foreground">{p.hint}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}
