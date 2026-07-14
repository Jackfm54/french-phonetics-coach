import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { generateObject } from "ai";

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
  score: z.number().min(0).max(100),
  summaryEs: z.string(),
  corrections: z.array(CorrectionSchema).max(30),
  improvements: z.array(z.string()).max(6),
});

export type WritingFeedback = z.infer<typeof OutputSchema>;

export const correctWriting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY faltante");
    const gateway = createLovableAiGatewayProvider(key);

    const { object } = await generateObject({
      model: gateway("openai/gpt-4o-mini"),
      schema: OutputSchema,
      system: `Eres un profesor de francés experto. Corriges un texto escrito por un alumno hispanohablante de nivel ${data.level}.
- Devuelve JSON válido según el esquema.
- correctedText: versión limpia y natural en francés, respetando el sentido original.
- corrections: lista de errores concretos (máximo 30), cada uno con la palabra/frase original, la sugerencia y una explicación breve en español.
- category: usa una de las etiquetas del esquema.
- score: 0-100 según corrección, riqueza léxica y coherencia para el nivel indicado.
- summaryEs: 2-3 frases en español con impresión general.
- improvements: consejos accionables en español.`,
      prompt: `${data.prompt ? `Consigna: ${data.prompt}\n\n` : ""}Texto del alumno:\n"""\n${data.text}\n"""`,
      temperature: 0.2,
    });
    return object;
  });
