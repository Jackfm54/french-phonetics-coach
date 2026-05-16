import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `Tu es un professeur de français bienveillant et expert en phonétique.
Tu aides l'utilisateur (hispanophone) à apprendre à parler français.

Règles importantes :
- Réponds principalement en français, mais explique les concepts difficiles en espagnol entre parenthèses si nécessaire.
- Quand l'utilisateur écrit du français, corrige-le avec douceur : montre la phrase corrigée en **gras**, puis explique l'erreur en espagnol.
- Pour la prononciation, donne toujours la transcription en API (alphabet phonétique international) entre /barres/.
- Sois concis : 3-6 phrases en général. Utilise des listes courtes si utile.
- Encourage et propose toujours une petite question ou un exercice à la fin pour continuer la conversation.
- Si l'utilisateur débute, simplifie ton français.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
