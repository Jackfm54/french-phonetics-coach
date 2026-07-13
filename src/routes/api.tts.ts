import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { checkOrigin, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/tts
 * Body JSON: { text: string, voice?: string, speed?: number, format?: "mp3"|"wav" }
 * Devuelve el audio (audio/mpeg por defecto) generado por Lovable AI (openai/gpt-4o-mini-tts).
 */
export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const blocked =
          checkOrigin(request) ??
          rateLimit(request, { limit: 40, windowMs: 60_000, key: "tts" });
        if (blocked) return blocked;

        let body: {
          text?: string;
          voice?: string;
          speed?: number;
          format?: "mp3" | "wav";
          instructions?: string;
        };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON inválido" }, { status: 400 });
        }

        const text = (body.text ?? "").trim();
        if (!text) return Response.json({ error: "Falta 'text'" }, { status: 400 });
        if (text.length > 3500)
          return Response.json({ error: "Texto demasiado largo (>3500)" }, { status: 413 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json({ error: "LOVABLE_API_KEY no configurado" }, { status: 500 });
        }

        const voice = body.voice ?? "nova";
        const format = body.format ?? "mp3";
        const speed = typeof body.speed === "number" ? Math.max(0.5, Math.min(1.5, body.speed)) : 1;

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: text,
              voice,
              speed,
              response_format: format,
              instructions:
                body.instructions ??
                "Parle en français de France, avec une prononciation claire et naturelle, adaptée à un apprenant. Articule bien les liaisons.",
            }),
          });

          if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            console.error(`TTS error [${res.status}]: ${errBody.slice(0, 400)}`);
            return Response.json(
              { error: `TTS ${res.status}` },
              { status: res.status === 429 ? 429 : 502 },
            );
          }

          const audio = await res.arrayBuffer();
          return new Response(audio, {
            status: 200,
            headers: {
              "Content-Type": format === "wav" ? "audio/wav" : "audio/mpeg",
              "Cache-Control": "public, max-age=86400, immutable",
            },
          });
        } catch (error) {
          console.error("TTS unexpected", error);
          return Response.json({ error: "TTS falló" }, { status: 500 });
        }
      },
    },
  },
});
