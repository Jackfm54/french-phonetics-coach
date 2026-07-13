import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { checkOrigin, rateLimit } from "@/lib/api-guard";

/**
 * POST /api/stt
 * Body: multipart/form-data con `audio` (Blob) y opcional `language` (ISO-639-3, ej. "fra").
 * Devuelve: { text, words?: Array<{text,start,end}> }
 *
 * Usa ElevenLabs Scribe (scribe_v2) para transcripción profesional en francés.
 */
export const Route = createFileRoute("/api/stt")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const blocked =
          checkOrigin(request) ??
          rateLimit(request, { limit: 30, windowMs: 60_000, key: "stt" });
        if (blocked) return blocked;

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
          return Response.json(
            { error: "ELEVENLABS_API_KEY no configurado" },
            { status: 500 },
          );
        }

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

        const upstream = new FormData();
        // Nombramos el archivo con extensión coherente con el MIME.
        const mime = audio.type || "audio/wav";
        const ext =
          mime.includes("wav") ? "wav"
          : mime.includes("mp4") ? "mp4"
          : mime.includes("mpeg") ? "mp3"
          : mime.includes("webm") ? "webm"
          : "wav";
        upstream.append("file", audio, `recording.${ext}`);
        upstream.append("model_id", "scribe_v2");
        upstream.append("language_code", language);
        upstream.append("diarize", "false");
        upstream.append("tag_audio_events", "false");

        const res = await fetch(
          "https://api.elevenlabs.io/v1/speech-to-text",
          {
            method: "POST",
            headers: { "xi-api-key": apiKey },
            body: upstream,
          },
        );

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          console.error(`Scribe error [${res.status}]: ${errBody}`);
          return Response.json(
            { error: `Transcripción falló (${res.status})`, detail: errBody.slice(0, 500) },
            { status: res.status },
          );
        }

        type ScribeWord = { text: string; start?: number; end?: number };
        type ScribeResp = { text?: string; words?: ScribeWord[] };
        const data = (await res.json()) as ScribeResp;
        return Response.json({
          text: (data.text ?? "").trim(),
          words: Array.isArray(data.words) ? data.words : [],
        });
      },
    },
  },
});
