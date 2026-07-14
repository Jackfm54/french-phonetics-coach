import { useState } from "react";
import { addVocabulary } from "@/lib/vocabulary.functions";
import { Plus, Check } from "lucide-react";

type Props = {
  word: string;
  ipa?: string;
  definitionEs?: string;
  exampleFr?: string;
  source?: string;
  className?: string;
};

export function AddToVocabButton({ word, ipa, definitionEs, exampleFr, source, className }: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      await addVocabulary({
        data: { word, ipa, definitionEs, exampleFr, source: source ?? "manual" },
      });
      setSaved(true);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      onClick={save}
      disabled={saving || saved}
      className={
        className ??
        "inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-70"
      }
      title={saved ? "Guardada en tu vocabulario" : "Guardar en mi vocabulario"}
    >
      {saved ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      {saved ? "Guardada" : "Vocabulario"}
    </button>
  );
}
