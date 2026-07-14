import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { listVocabulary, removeVocabulary } from "@/lib/vocabulary.functions";
import { speakFr } from "@/lib/speak";
import { Volume2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vocabulario")({
  head: () => ({
    meta: [
      { title: "Mi vocabulario · Professeur.fr" },
      { name: "description", content: "Diccionario personal de palabras francesas guardadas." },
    ],
  }),
  component: VocabPage,
});

type Word = {
  id: string;
  word: string;
  ipa: string | null;
  definition_es: string | null;
  example_fr: string | null;
  source: string | null;
  created_at: string;
};

function VocabPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listVocabulary()
      .then((r) => setWords(r.words as Word[]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const del = async (id: string) => {
    await removeVocabulary({ data: { id } });
    setWords((w) => w.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Mon vocabulaire</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Palabras guardadas. Se repasan automáticamente en{" "}
              <Link to="/revisar" className="text-primary underline">Revisar</Link>.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{words.length} palabras</p>
        </div>

        {loading && <p className="mt-8 text-sm text-muted-foreground">Cargando…</p>}

        {!loading && words.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no has guardado palabras. Usa el botón <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs">+</span> en el chat o las lecciones.
            </p>
          </div>
        )}

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {words.map((w) => (
            <li key={w.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold">{w.word}</p>
                    <button
                      onClick={() => speakFr(w.word, 0.9)}
                      className="grid h-7 w-7 place-items-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground"
                      aria-label={`Écouter ${w.word}`}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {w.ipa && <p className="mt-1 text-sm text-primary">{w.ipa}</p>}
                  {w.definition_es && (
                    <p className="mt-1 text-sm text-muted-foreground">{w.definition_es}</p>
                  )}
                  {w.example_fr && (
                    <p className="mt-2 text-xs italic text-muted-foreground">« {w.example_fr} »</p>
                  )}
                </div>
                <button
                  onClick={() => del(w.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
