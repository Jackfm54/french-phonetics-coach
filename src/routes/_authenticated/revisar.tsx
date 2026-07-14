import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { listDueSrsItems, reviewSrsItem } from "@/lib/srs.functions";
import { awardXp } from "@/lib/gamification.functions";
import { speakFr } from "@/lib/speak";
import { Volume2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/revisar")({
  head: () => ({
    meta: [
      { title: "Revisar · Professeur.fr" },
      { name: "description", content: "Cola diaria de repaso con repetición espaciada (SM-2)." },
    ],
  }),
  component: ReviewPage,
});

type Item = {
  id: string;
  item_type: string;
  item_ref: string;
  payload: Record<string, unknown> | null;
};

function ReviewPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    listDueSrsItems()
      .then((r) => setItems(r.items as Item[]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const current = items[idx];

  const grade = async (quality: number) => {
    if (!current) return;
    await reviewSrsItem({
      data: {
        itemType: current.item_type as "phoneme" | "word" | "phrase" | "lesson",
        itemRef: current.item_ref,
        quality,
      },
    });
    await awardXp({ data: { xp: quality >= 3 ? 5 : 2, reason: "srs_review" } });
    setDone((d) => d + 1);
    setShowAnswer(false);
    if (idx + 1 >= items.length) {
      load();
      setIdx(0);
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Revisión del día</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Repite en el momento justo para memorizar de verdad. Método SM-2.
        </p>

        {loading && <p className="mt-8 text-sm text-muted-foreground">Cargando…</p>}

        {!loading && items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-display text-2xl">¡Todo al día! 🎉</p>
            <p className="mt-2 text-sm text-muted-foreground">
              No tienes tarjetas pendientes. Añade palabras desde el chat o completa una lección.
            </p>
            {done > 0 && (
              <p className="mt-4 text-sm text-primary">Revisadas hoy: {done}</p>
            )}
          </div>
        )}

        {current && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-elegant">
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                {current.item_type}
              </span>
              <span className="text-muted-foreground">
                {idx + 1} / {items.length} · hechos hoy: {done}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <p className="font-display text-4xl font-semibold">{current.item_ref}</p>
              <button
                onClick={() => speakFr(current.item_ref, 0.9)}
                className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground"
                aria-label="Écouter"
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>

            {showAnswer && current.payload && (
              <div className="mt-6 rounded-2xl bg-secondary/60 p-5 text-sm">
                {(current.payload as { ipa?: string }).ipa && (
                  <p><span className="font-semibold">IPA:</span> <span className="text-primary">{String((current.payload as { ipa?: string }).ipa)}</span></p>
                )}
                {(current.payload as { definition_es?: string }).definition_es && (
                  <p className="mt-1">{String((current.payload as { definition_es?: string }).definition_es)}</p>
                )}
              </div>
            )}

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="mt-8 w-full rounded-full bg-primary py-3 font-medium text-primary-foreground"
              >
                Ver respuesta
              </button>
            ) : (
              <div className="mt-8 grid grid-cols-4 gap-2 text-sm">
                <button onClick={() => grade(0)} className="rounded-xl bg-red-500/10 py-3 text-red-600 hover:bg-red-500/20">Fallé</button>
                <button onClick={() => grade(3)} className="rounded-xl bg-amber-500/10 py-3 text-amber-600 hover:bg-amber-500/20">Difícil</button>
                <button onClick={() => grade(4)} className="rounded-xl bg-emerald-500/10 py-3 text-emerald-600 hover:bg-emerald-500/20">Bien</button>
                <button onClick={() => grade(5)} className="rounded-xl bg-emerald-500/20 py-3 text-emerald-700 hover:bg-emerald-500/30">Fácil</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
