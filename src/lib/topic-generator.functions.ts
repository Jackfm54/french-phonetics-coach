import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const InputSchema = z.object({
  examCode: z.string().max(40),
  taskType: z.enum(["interview", "info", "argumentation", "monologue", "writing"]),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
});

export type GeneratedTopic = {
  title: string;
  instruction: string;
  prompts: string[];
  keywords: string[];
};

const FALLBACK: GeneratedTopic = {
  title: "Un thème d'actualité",
  instruction: "Présentez le sujet, donnez votre opinion et justifiez-la.",
  prompts: ["Quelle est votre position ?", "Donnez un exemple concret.", "Que proposez-vous ?"],
  keywords: [],
};

function parseTopic(raw: string): GeneratedTopic {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      title: String(parsed.title ?? FALLBACK.title).slice(0, 200),
      instruction: String(parsed.instruction ?? FALLBACK.instruction).slice(0, 800),
      prompts: Array.isArray(parsed.prompts)
        ? parsed.prompts.slice(0, 6).map((p: unknown) => String(p).slice(0, 300))
        : FALLBACK.prompts,
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords.slice(0, 10).map((k: unknown) => String(k).slice(0, 40))
        : [],
    };
  } catch {
    return FALLBACK;
  }
}

export const generateExamTopic = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<GeneratedTopic> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return FALLBACK;
    const provider = createLovableAiGatewayProvider(key);

    const taskDescriptions: Record<typeof data.taskType, string> = {
      interview: "une entrevue dirigée (questions personnelles sur la vie quotidienne, projets, opinions)",
      info: "un échange d'informations (le candidat doit poser des questions pour obtenir des renseignements)",
      argumentation: "une argumentation à partir d'un document / d'une opinion à défendre",
      monologue: "un monologue suivi (présentation structurée sur un sujet)",
      writing: "une production écrite (essai, lettre formelle, courriel argumentatif)",
    };

    const prompt = `Génère un sujet ORIGINAL et RÉALISTE pour ${data.examCode} niveau ${data.level}, tâche : ${taskDescriptions[data.taskType]}.

Contraintes :
- Sujet actuel, culturellement pertinent (France, Québec, francophonie).
- Vocabulaire calibré au niveau ${data.level} (${data.level.startsWith("A") ? "quotidien concret" : data.level.startsWith("B") ? "opinions et raisonnements" : "abstrait, nuancé, argumentatif"}).
- Ni cliché, ni sujet déjà mille fois vu (évite "avantages/inconvénients d'internet", "pour ou contre les réseaux sociaux").

Réponds UNIQUEMENT avec un JSON valide, sans texte autour, au format :
{
  "title": "titre court",
  "instruction": "consigne complète pour le candidat (2-4 phrases)",
  "prompts": ["question 1 de relance", "question 2", "question 3"],
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"]
}`;

    try {
      const res = await generateText({
        model: provider("google/gemini-2.5-flash"),
        prompt,
        temperature: 0.9,
      });
      return parseTopic(res.text);
    } catch (e) {
      console.error("generateExamTopic", e);
      return FALLBACK;
    }
  });
