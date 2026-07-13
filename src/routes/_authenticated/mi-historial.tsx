import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listAttempts } from "@/lib/practice-history.functions";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/_authenticated/mi-historial")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Mi historial · Professeur.fr" },
      { name: "description", content: "Revisa tus intentos de pronunciación, transcripciones y puntuaciones." },
    ],
  }),
});

type Attempt = {
  id: string;
  kind: string;
  context: string | null;
  expected_text: string | null;
  transcript: string | null;
  score: number | null;
  created_at: string;
};

function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listAttempts()
      .then((r) => setAttempts(r.attempts as Attempt[]))
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Mon historique</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Todas tus prácticas de pronunciación y simulacros guardados en tu cuenta.
        </p>

        {loading && <p className="mt-8 text-sm text-muted-foreground">Cargando…</p>}
        {error && <p className="mt-8 text-sm text-destructive">{error}</p>}
        {!loading && attempts.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            Aún no tienes intentos guardados. Empieza en <a href="/lecons" className="text-primary underline">Leçons</a>.
          </p>
        )}

        <ul className="mt-8 space-y-3">
          {attempts.map((a) => (
            <li key={a.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary">{a.kind}</p>
                  {a.context && <p className="mt-1 text-sm font-medium">{a.context}</p>}
                  {a.expected_text && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Esperado:</span> {a.expected_text}
                    </p>
                  )}
                  {a.transcript && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Dijiste:</span> « {a.transcript} »
                    </p>
                  )}
                </div>
                <div className="text-right">
                  {a.score !== null && (
                    <p className={`font-display text-2xl font-semibold ${a.score >= 85 ? "text-emerald-500" : a.score >= 60 ? "text-amber-500" : "text-red-500"}`}>
                      {Math.round(a.score)}%
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
