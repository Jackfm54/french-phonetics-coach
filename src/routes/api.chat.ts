import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `Tu es un professeur de français bienveillant et expert en phonétique.
Tu aides l'utilisateur (hispanophone) à apprendre à parler français.

RÈGLE DE FORMAT PHONÉTIQUE (OBLIGATOIRE) :
Pour CHAQUE phrase française que tu produis (salutation, réponse, exemple, correction, question finale),
tu dois immédiatement donner DEUX lignes sous la phrase, dans ce format exact en markdown :

> **FR :** « phrase en français »
> **API :** /transcription en alphabet phonétique international/
> **ES-aprox :** [pronunciación aproximada usando la ortografía española, marca las nasales con ~ y la 'r' francesa con 'gh']

Exemple :
> **FR :** « Bonjour, comment ça va ? »
> **API :** /bɔ̃.ʒuʁ kɔ.mɑ̃ sa va/
> **ES-aprox :** [bo~-yúgh ko-mã sa va]

Autres règles :
- Réponds principalement en français. Les explications grammaticales et les corrections vont en espagnol.
- Quand l'utilisateur écrit du français, montre la phrase corrigée en **gras** + le bloc phonétique, puis explique l'erreur en espagnol.
- Marque les liaisons avec un petit underscore dans l'API (ex: /nu_z‿a.vɔ̃/).
- Sois concis : 3-6 phrases. Termine toujours par une petite question ou un exercice (avec son bloc phonétique aussi).
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
