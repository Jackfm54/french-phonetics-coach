import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const InputSchema = z.object({
  examCode: z.string().max(80),
  taskTitle: z.string().max(200),
  prompt: z.string().max(1200),
  transcript: z.string().max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["examiner", "candidate"]),
        text: z.string().max(2000),
      }),
    )
    .max(6)
    .default([]),
});

/**
 * Modo examinateur: recibe la transcripción del candidato y devuelve UNA sola
 * pregunta de seguimiento como lo haría un jury DELF/TCF real.
 */
export const askFollowUp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY no configurado");

    const provider = createLovableAiGatewayProvider(key);

    const historyBlock = data.history
      .map((h) => (h.role === "examiner" ? `Examinateur : ${h.text}` : `Candidat : ${h.text}`))
      .join("\n");

    const system = `Tu es un examinateur officiel ${data.examCode}. Tu poses UNE seule question de suivi courte (max 20 mots), naturelle, orale, en français, adaptée au niveau attendu de l'épreuve. Tu rebondis sur ce que le candidat vient de dire pour l'inviter à préciser, justifier ou nuancer.
Règles strictes :
- Une seule question, pas d'introduction, pas de commentaire, pas d'évaluation.
- Ne répète pas les questions déjà posées.
- Français standard, ton bienveillant mais professionnel.
- Ne dis jamais "en tant qu'examinateur" ni ne te présentes.`;

    const userMsg = `Épreuve : ${data.examCode} — ${data.taskTitle}
Consigne initiale : ${data.prompt}

${historyBlock ? `Échanges précédents :\n${historyBlock}\n` : ""}Dernière réponse du candidat :
« ${data.transcript} »

Pose ta prochaine question.`;

    try {
      const { text } = await generateText({
        model: provider.chatModel("google/gemini-2.5-flash"),
        system,
        prompt: userMsg,
        temperature: 0.7,
      });
      const q = text.trim().replace(/^["«»]+|["«»]+$/g, "");
      return { question: q };
    } catch (err) {
      console.error("askFollowUp error", err);
      return {
        question:
          "Pouvez-vous développer votre réponse et donner un exemple concret, s'il vous plaît ?",
      };
    }
  });
