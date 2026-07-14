import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { generateText } from "ai";


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

    const system = `Eres un profesor de francés experto. Corriges un texto escrito por un alumno hispanohablante de nivel ${data.level}.
Devuelve EXCLUSIVAMENTE un JSON válido (sin backticks, sin texto extra) con esta forma exacta:
{
  "correctedText": string,           // versión limpia y natural en francés
  "cefrEstimate": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "score": number,                   // 0-100
  "summaryEs": string,               // 2-3 frases en español
  "corrections": [ { "original": string, "suggestion": string, "category": "orthographe"|"grammaire"|"conjugaison"|"accord"|"lexique"|"syntaxe"|"ponctuation"|"style"|"registre", "explanationEs": string } ],
  "improvements": [ string ]         // máximo 6
}`;

    const prompt = `${data.prompt ? `Consigna: ${data.prompt}\n\n` : ""}Texto del alumno:\n"""\n${data.text}\n"""`;

    const parseJson = (raw: string) => {
      const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
      const s = cleaned.search(/[\{\[]/);
      const e = cleaned.lastIndexOf("}");
      if (s === -1 || e === -1) throw new Error("no json");
      const body = cleaned.slice(s, e + 1).replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
      return JSON.parse(body);
    };

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        system,
        prompt,
        temperature: 0.2,
      });
      try {
        const parsed = parseJson(text);
        return normalize(OutputSchema.parse(parsed));
      } catch {
        // partial recovery
        const parsed = parseJson(text);
        return normalize({
          correctedText: String(parsed.correctedText ?? data.text),
          cefrEstimate: (parsed.cefrEstimate ?? data.level) as WritingFeedback["cefrEstimate"],
          score: Number(parsed.score ?? 0),
          summaryEs: String(parsed.summaryEs ?? ""),
          corrections: Array.isArray(parsed.corrections) ? parsed.corrections.filter((c: any) => c?.original && c?.suggestion).map((c: any) => ({
            original: String(c.original),
            suggestion: String(c.suggestion),
            category: (["orthographe","grammaire","conjugaison","accord","lexique","syntaxe","ponctuation","style","registre"].includes(c.category) ? c.category : "grammaire") as WritingFeedback["corrections"][number]["category"],
            explanationEs: String(c.explanationEs ?? ""),
          })) : [],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
        });
      }
    } catch {
      return normalize({
        correctedText: data.text,
        cefrEstimate: data.level,
        score: 0,
        summaryEs: "No se pudo generar una evaluación. Vuelve a intentarlo.",
        corrections: [],
        improvements: [],
      });
    }
  });

