import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { generateObject, NoObjectGeneratedError } from "ai";

const InputSchema = z.object({
  text: z.string().min(1).max(4000),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).default("B1"),
  prompt: z.string().max(500).optional(),
});

const ErrorCat = z.enum([
  "orthographe",
  "grammaire",
  "conjugaison",
  "accord",
  "lexique",
  "syntaxe",
  "ponctuation",
  "style",
  "registre",
]);

const CorrectionSchema = z.object({
  original: z.string(),
  suggestion: z.string(),
  category: ErrorCat,
  explanationEs: z.string(),
});

const OutputSchema = z.object({
  correctedText: z.string(),
  cefrEstimate: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  score: z.number(),
  summaryEs: z.string(),
  corrections: z.array(CorrectionSchema),
  improvements: z.array(z.string()),
});

export type WritingFeedback = z.infer<typeof OutputSchema>;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function normalize(o: WritingFeedback): WritingFeedback {
  return {
    ...o,
    score: clamp(Math.round(o.score ?? 0), 0, 100),
    corrections: (o.corrections ?? []).slice(0, 30),
    improvements: (o.improvements ?? []).slice(0, 6),
  };
}

export const correctWriting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY faltante");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { object } = await generateObject({
        model: gateway("google/gemini-2.5-flash"),
        schema: OutputSchema,
        system: `Eres un profesor de francés experto. Corriges un texto escrito por un alumno hispanohablante de nivel ${data.level}.
- Devuelve JSON válido según el esquema.
- correctedText: versión limpia y natural en francés, respetando el sentido original.
- corrections: lista de errores concretos (máximo 30), cada uno con la palabra/frase original, la sugerencia y una explicación breve en español.
- category: usa una de las etiquetas del esquema.
- score: 0-100 según corrección, riqueza léxica y coherencia para el nivel indicado.
- summaryEs: 2-3 frases en español con impresión general.
- improvements: máximo 6 consejos accionables en español.`,
        prompt: `${data.prompt ? `Consigna: ${data.prompt}\n\n` : ""}Texto del alumno:\n"""\n${data.text}\n"""`,
        temperature: 0.2,
      });
      return normalize(object);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        try {
          const raw = (error as { text?: string }).text ?? "";
          const start = raw.search(/[\{\[]/);
          const end = raw.lastIndexOf("}");
          const cleaned = raw
            .slice(start, end + 1)
            .replace(/,\s*}/g, "}")
            .replace(/,\s*]/g, "]");
          const parsed = JSON.parse(cleaned);
          return normalize(OutputSchema.parse(parsed));
        } catch {
          return normalize({
            correctedText: data.text,
            cefrEstimate: data.level,
            score: 0,
            summaryEs:
              "No se pudo generar una evaluación estructurada. Vuelve a intentarlo con un texto más corto o más simple.",
            corrections: [],
            improvements: [],
          });
        }
      }
      throw error;
    }
  });
