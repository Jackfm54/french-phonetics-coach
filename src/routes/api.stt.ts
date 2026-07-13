import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { checkOrigin, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/stt
 * Body: multipart/form-data con `audio` (Blob) y opcional `language` (ISO-639-3, ej. "fra").
 * Devuelve: { text, words?: Array<{text,start,end}> }
 *
 * Usa ElevenLabs Scribe si está conectado; si no, usa Lovable AI STT.
 */
export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const blocked =
          checkOrigin(request) ??
          rateLimit(request, { limit: 30, windowMs: 60_000, key: "stt" });
        if (blocked) return blocked;

        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
          return Response.json(
            { error: "Se esperaba multipart/form-data con campo `audio`" },
            { status: 400 },
          );
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Multipart inválido" }, { status: 400 });
        }
        const audio = form.get("audio");
        const language = (form.get("language") as string) || "fra";
        if (!(audio instanceof Blob) || audio.size === 0) {
          return Response.json(
            { error: "Falta el archivo de audio o está vacío" },
            { status: 400 },
          );
        }
        if (audio.size > 25 * 1024 * 1024) {
          return Response.json(
            { error: "Audio demasiado grande (>25 MB)" },
            { status: 413 },
          );
        }

        const mime = audio.type || "audio/wav";
        const ext =
          mime.includes("wav") ? "wav"
          : mime.includes("mp4") ? "mp4"
          : mime.includes("mpeg") ? "mp3"
          : mime.includes("webm") ? "webm"
          : "wav";
        const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
        const lovableKey = process.env.LOVABLE_API_KEY;

        try {
          if (elevenLabsKey) {
            const upstream = new FormData();
            upstream.append("file", audio, `recording.${ext}`);
            upstream.append("model_id", "scribe_v2");
            upstream.append("language_code", language);
            upstream.append("diarize", "false");
            upstream.append("tag_audio_events", "false");

            const res = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
              method: "POST",
              headers: { "xi-api-key": elevenLabsKey },
              body: upstream,
            });

            if (res.ok) {
              type ScribeWord = { text: string; start?: number; end?: number };
              type ScribeResp = { text?: string; words?: ScribeWord[] };
              const data = (await res.json()) as ScribeResp;
              return Response.json({
                text: (data.text ?? "").trim(),
                words: Array.isArray(data.words) ? data.words : [],
                provider: "elevenlabs",
              });
            }

            const errBody = await res.text().catch(() => "");
            console.error(`Scribe error [${res.status}]: ${errBody}`);
            // Si ElevenLabs falla temporalmente, probamos Lovable AI antes de devolver error.
          }

          if (!lovableKey) {
            return Response.json(
              {
                text: "",
                fallback: true,
                error: "Transcripción IA no disponible: falta LOVABLE_API_KEY.",
              },
              { status: 200 },
            );
          }

          const upstream = new FormData();
          upstream.append("model", "openai/gpt-4o-transcribe");
          upstream.append("file", audio, `recording.${ext}`);
          // OpenAI STT espera ISO-639-1; convertimos el valor que usa ElevenLabs.
          upstream.append("language", language === "fra" ? "fr" : language.slice(0, 2));

          const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${lovableKey}` },
            body: upstream,
          });

          if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            console.error(`Lovable STT error [${res.status}]: ${errBody}`);
            return Response.json(
              {
                text: "",
                fallback: true,
                error: `Transcripción no disponible (${res.status}). Intenta de nuevo.`,
              },
              { status: 200 },
            );
          }

          const data = (await res.json()) as { text?: string };
          return Response.json({
            text: (data.text ?? "").trim(),
            words: [],
            provider: "lovable-ai",
          });
        } catch (error) {
          console.error("STT unexpected error", error);
          return Response.json(
            {
              text: "",
              fallback: true,
              error: "El servicio de transcripción no respondió. Intenta de nuevo.",
            },
            { status: 200 },
          );
        }
      },
    },
  },
});
