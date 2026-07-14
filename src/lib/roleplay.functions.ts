import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { generateObject, generateText } from "ai";
import { getScenario } from "@/lib/scenarios";

const MsgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const TurnSchema = z.object({
  scenarioId: z.string().min(1).max(80),
  messages: z.array(MsgSchema).min(1).max(40),
});

/** Turno de conversación en un escenario. Devuelve la réplica del NPC en francés. */
export const roleplayTurn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => TurnSchema.parse(d))
  .handler(async ({ data }) => {
    const scenario = getScenario(data.scenarioId);
    if (!scenario) throw new Error("Escenario no encontrado");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY faltante");
    const gateway = createLovableAiGatewayProvider(key);

    const system = `Tu joues un rôle en français dans une simulation immersive pour un apprenant hispanophone.

RÔLE: ${scenario.role}
NIVEAU CIBLE: ${scenario.level} (adapte ton vocabulaire et ta vitesse en conséquence).
OBJECTIF DE L'APPRENANT: ${scenario.goal}
LEXIQUE ATTENDU: ${scenario.vocab.join(", ")}

RÈGLES STRICTES:
- Réponds UNIQUEMENT en français, dans ton personnage, comme dans une vraie interaction.
- Une réplique courte et naturelle à la fois (1 à 3 phrases).
- Ne corrige pas ni n'explique dans cette réplique. La correction se fait ailleurs.
- Si l'apprenant s'écarte trop du scénario, redirige-le gentiment en restant dans ton rôle.
- N'écris jamais d'IPA, ni de traduction, ni d'astérisques.`;

    const { text } = await generateText({
      model: gateway("google/gemini-2.5-flash"),

      system,
      messages: data.messages,
      temperature: 0.7,
    });
    return { reply: text.trim() };
  });

const FeedbackSchema = z.object({
  scenarioId: z.string(),
  transcript: z.array(MsgSchema).min(2).max(60),
});

/** Análisis final del roleplay: nivel percibido, aciertos y correcciones. */
export const roleplayFeedback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => FeedbackSchema.parse(d))
  .handler(async ({ data }) => {
    const scenario = getScenario(data.scenarioId);
    if (!scenario) throw new Error("Escenario no encontrado");

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY faltante");
    const gateway = createLovableAiGatewayProvider(key);

    const schema = z.object({
      cefrEstimate: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
      score: z.number().min(0).max(100),
      goalAchieved: z.boolean(),
      strengths: z.array(z.string()).max(5),
      corrections: z
        .array(
          z.object({
            original: z.string(),
            corrected: z.string(),
            explanationEs: z.string(),
          }),
        )
        .max(8),
      nextStepsEs: z.array(z.string()).max(5),
    });

    const dialog = data.transcript
      .map((m) => `${m.role === "user" ? "APPRENANT" : "NPC"}: ${m.content}`)
      .join("\n");

    const { object } = await generateObject({
      model: gateway("google/gemini-2.5-flash"),
      schema,
      system:
        "Eres un examinador francés. Evalúa el desempeño del alumno en un juego de rol. Devuelve JSON estricto según el esquema. Explicaciones en español, correcciones en francés.",
      prompt: `Escenario: ${scenario.title} (${scenario.level}). Objetivo: ${scenario.goal}

Diálogo:
${dialog}`,
      temperature: 0.2,
    });
    return object;
  });
