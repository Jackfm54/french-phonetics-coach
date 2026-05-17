import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const CriterionInputSchema = z.object({
  name: z.string().min(1).max(160),
  max: z.number().min(1).max(20),
});

const BodySchema = z.object({
  examCode: z.string().min(1).max(80),
  taskTitle: z.string().min(1).max(200),
  prompt: z.string().min(1).max(800),
  transcript: z.string().min(1).max(8000),
  totalMax: z.number().min(5).max(100),
  passMark: z.number().min(0).max(100).optional(),
  perCriterionMin: z.number().min(0).max(10).optional(),
  criteria: z.array(CriterionInputSchema).min(1).max(12),
  scaleNote: z.string().min(1).max(400),
});

const FeedbackSchema = z.object({
  globalScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Note globale dans l'échelle officielle (ex: /20 pour TCF, /25 pour DELF/DALF)"),
  totalMax: z.number().describe("Le maximum de l'échelle officielle utilisée (20 ou 25)."),
  level: z
    .string()
    .describe("Niveau CECRL atteint (A1, A2, B1, B2, C1, C2)."),
  admitted: z
    .boolean()
    .describe("Vrai si le candidat atteint le seuil de réussite officiel de cette épreuve."),
  verdict: z
    .string()
    .describe(
      "Phrase courte en español avec le statut officiel, ex : 'Admis · Niveau B2 confirmé' ou 'Non admis — niveau actuel A2'.",
    ),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  criteriaScores: z.array(
    z.object({
      name: z.string(),
      score: z.number(),
      max: z.number(),
      comment: z.string(),
    }),
  ),
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
        const model = gateway("openai/gpt-5-mini");

        const {
          examCode,
          taskTitle,
          prompt,
          transcript,
          totalMax,
          passMark,
          perCriterionMin,
          criteria,
          scaleNote,
        } = parsed.data;

        const criteriaList = criteria
          .map((c) => `  • ${c.name} (/${c.max})`)
          .join("\n");

        try {
          const { object: output } = await generateObject({
            model,
            schema: FeedbackSchema,
            system: `Tu es un examinateur officiel de l'examen ${examCode}.
Tu évalues la production orale d'un candidat hispanophone STRICTEMENT selon la grille d'évaluation officielle de ${examCode}.
Sois précis, juste, bienveillant mais exigeant. Réponds en espagnol (les exemples corrigés restent en français).
Tu DOIS répondre uniquement avec un objet JSON valide conforme au schéma fourni.

RÈGLES DE NOTATION (impératives) :
1. Chaque critère doit recevoir une note entre 0 et son maximum officiel (voir la liste).
2. La note globale = somme des critères = sur ${totalMax}. Renvoie EXACTEMENT cette somme dans "globalScore" et ${totalMax} dans "totalMax".
3. Détermine le niveau CECRL réellement démontré (A1 → C2) en suivant l'échelle officielle :
   ${scaleNote}
4. ${
              passMark !== undefined
                ? `Le candidat est "admitted" si globalScore >= ${passMark}${
                    perCriterionMin !== undefined
                      ? ` ET aucune note critère n'est inférieure à ${perCriterionMin} (note éliminatoire)`
                      : ""
                  }.`
                : `Le candidat est "admitted" si son niveau CECRL atteint au moins le niveau cible de l'examen.`
            }
5. "verdict" : une phrase courte en español avec le statut officiel et le niveau, ex : "Admis · Nivel B2 confirmado" ou "No admitido — nivel actual A2 (faltan 4 puntos)".
6. Même si la transcription est très courte, incomplète, hors-sujet, vide ou seulement quelques mots, tu DOIS quand même produire une évaluation complète : attribue des notes basses (souvent 0 ou 1) et explique-le dans les commentaires. Ne refuse JAMAIS d'évaluer. Renseigne TOUS les champs du schéma (strengths, improvements, criteriaScores pour chaque critère listé, correctedExample, nextTip).`,
            prompt: `Examen: ${examCode}
Tâche: ${taskTitle}
Consigne donnée au candidat: "${prompt}"

Grille officielle (note chaque critère sur son maximum) :
${criteriaList}
Total : /${totalMax}${
              passMark !== undefined ? ` · seuil d'admission : ${passMark}/${totalMax}` : ""
            }
Note de bas d'échelle : ${scaleNote}

Transcription de la réponse du candidat (générée par reconnaissance vocale, peut contenir des erreurs de transcription) :
"""
${transcript}
"""

Évalue cette production en suivant strictement la grille. Sois constructif.`,
          });

          return Response.json(output);
        } catch (err) {
          const e = err as { message?: string; text?: string; cause?: unknown };
          console.error("[/api/evaluate] generation failed:", e?.message, "| text:", e?.text, "| cause:", e?.cause);
          // Fallback : on renvoie une évaluation minimale plutôt qu'une 500,
          // pour que l'UI puisse au moins afficher quelque chose.
          const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;
          const tooShort = wordCount < 15;
          const fallback = {
            globalScore: tooShort ? 1 : Math.round(totalMax * 0.25),
            totalMax,
            level: "A1" as const,
            admitted: false,
            verdict: tooShort
              ? `Respuesta demasiado corta (${wordCount} palabras) para evaluar. Vuelve a intentar y habla durante todo el tiempo asignado.`
              : "No se pudo generar la evaluación detallada. Inténtalo de nuevo en unos segundos.",
            strengths: [],
            improvements: tooShort
              ? [
                  "Habla durante el tiempo completo de la tarea.",
                  "Estructura tu respuesta: introducción, ideas, conclusión.",
                ]
              : ["Vuelve a intentar la evaluación: el servicio de IA no respondió correctamente."],
            criteriaScores: criteria.map((c) => ({
              name: c.name,
              score: tooShort ? 0 : Math.round(c.max * 0.25),
              max: c.max,
              comment: tooShort
                ? "Pas assez de production pour évaluer ce critère."
                : "Évaluation indisponible — réessaie.",
            })),
            correctedExample: transcript.slice(0, 200),
            nextTip: tooShort
              ? "Aprovecha el tiempo: desarrolla cada idea con un ejemplo concreto."
              : "Reintenta la evaluación en unos segundos.",
          };
          return Response.json(fallback);
        }
      },
    },
  },
});
