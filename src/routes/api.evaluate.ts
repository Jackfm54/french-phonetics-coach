import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const BodySchema = z.object({
  examCode: z.string().min(1).max(80),
  taskTitle: z.string().min(1).max(200),
  prompt: z.string().min(1).max(800),
  transcript: z.string().min(1).max(8000),
  criteria: z.array(z.string().min(1).max(120)).min(1).max(10),
});

const FeedbackSchema = z.object({
  globalScore: z.number().min(0).max(20).describe("Note globale sur 20"),
  level: z
    .enum(["A1", "A2", "B1", "B2", "C1", "C2"])
    .describe("Niveau CEFR estimé"),
  strengths: z.array(z.string()).min(1).max(5),
  improvements: z.array(z.string()).min(1).max(5),
  criteriaScores: z
    .array(
      z.object({
        name: z.string(),
        score: z.number().min(0).max(5),
        comment: z.string(),
      }),
    )
    .min(1)
    .max(10),
  correctedExample: z
    .string()
    .describe(
      "Un fragmento corto del discurso del candidato reformulado correctamente, con mejor léxico.",
    ),
  nextTip: z.string().describe("Un consejo concreto para la próxima vez."),
});

export const Route = createFileRoute("/api/evaluate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const json = await request.json();
        const parsed = BodySchema.safeParse(json);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: parsed.error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const { examCode, taskTitle, prompt, transcript, criteria } = parsed.data;

        try {
          const { experimental_output: output } = await generateText({
            model,
            output: Output.object({ schema: FeedbackSchema }),
            system: `Tu es un examinateur officiel de l'examen ${examCode}.
Tu évalues la production orale d'un candidat hispanophone selon les critères officiels.
Sois précis, juste, bienveillant mais exigeant. Réponds en espagnol (les exemples corrigés restent en français).`,
            prompt: `Examen: ${examCode}
Tâche: ${taskTitle}
Consigne donnée au candidat: "${prompt}"
Critères officiels à noter (sobre 5): ${criteria.join(", ")}

Transcription de la réponse du candidat (générée par reconnaissance vocale, peut contenir des erreurs de transcription):
"""
${transcript}
"""

Évalue cette production. Sois constructif.`,
          });

          return Response.json(output);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Erreur d'évaluation";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
