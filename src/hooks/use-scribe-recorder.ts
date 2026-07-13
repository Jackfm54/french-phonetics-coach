import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Graba audio del micrófono como PCM (Web Audio API), lo codifica como WAV
 * mono 16 kHz y lo sube a /api/stt para transcripción profesional con
 * ElevenLabs Scribe.
 *
 * Ventajas frente a Web Speech API:
 *  - Precisión mucho más alta en francés.
 *  - Funciona en Safari/iOS.
 *  - No repite/pierde palabras entre auto-restarts del navegador.
 */
export function useScribeRecorder(language = "fra") {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const sampleRateRef = useRef(48000);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setSupported(false);
    }
  }, []);

  const cleanup = useCallback(() => {
    try {
      nodeRef.current?.disconnect();
    } catch {}
    try {
      sourceRef.current?.disconnect();
    } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
    void ctxRef.current?.close();
    nodeRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    ctxRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setTranscript("");
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      ctxRef.current = ctx;
      sampleRateRef.current = ctx.sampleRate;
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const node = ctx.createScriptProcessor(4096, 1, 1);
      nodeRef.current = node;
      node.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        // Copiamos porque el buffer se reutiliza.
        chunksRef.current.push(new Float32Array(input));
      };
      source.connect(node);
      node.connect(ctx.destination);
      setRecording(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al acceder al micrófono";
      setError(msg);
      cleanup();
    }
  }, [cleanup]);

  const stopAndTranscribe = useCallback(async (): Promise<string | null> => {
    if (!recording) return null;
    setRecording(false);
    const chunks = chunksRef.current;
    const sr = sampleRateRef.current;
    cleanup();

    if (chunks.length === 0) {
      setError("No se capturó audio. Habla más cerca del micrófono.");
      return null;
    }
    const wavBlob = encodeWav(chunks, sr, 16000);
    if (wavBlob.size < 2048) {
      setError("La grabación es demasiado corta. Vuelve a intentarlo.");
      return null;
    }

    setTranscribing(true);
    try {
      const form = new FormData();
      form.append("audio", wavBlob, "recording.wav");
      form.append("language", language);
      const res = await fetch("/api/stt", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`STT ${res.status}: ${body.slice(0, 200)}`);
      }
      const data = (await res.json()) as { text?: string; fallback?: boolean; error?: string };
      if (data.fallback) {
        setError(data.error ?? "Transcripción no disponible. Intenta de nuevo.");
        return null;
      }
      const text = (data.text ?? "").trim();
      if (!text) {
        setError("No pude detectar palabras en la grabación. Intenta hablar más claro o más cerca del micrófono.");
        return null;
      }
      setTranscript(text);
      return text;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error transcribiendo";
      setError(msg);
      return null;
    } finally {
      setTranscribing(false);
    }
  }, [recording, cleanup, language]);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
    chunksRef.current = [];
  }, []);

  return {
    supported,
    recording,
    transcribing,
    transcript,
    error,
    start,
    stopAndTranscribe,
    reset,
  };
}

/** Codifica chunks de Float32Array (mono) como WAV PCM 16-bit al sample rate destino. */
function encodeWav(
  chunks: Float32Array[],
  sourceRate: number,
  targetRate = 16000,
): Blob {
  const totalIn = chunks.reduce((sum, c) => sum + c.length, 0);
  const merged = new Float32Array(totalIn);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  const resampled =
    sourceRate === targetRate ? merged : downsample(merged, sourceRate, targetRate);
  const pcm16 = new Int16Array(resampled.length);
  for (let i = 0; i < resampled.length; i++) {
    const s = Math.max(-1, Math.min(1, resampled[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return new Blob([wavHeader(pcm16.length, targetRate), pcm16.buffer], {
    type: "audio/wav",
  });
}

function downsample(input: Float32Array, srcRate: number, dstRate: number): Float32Array {
  if (dstRate >= srcRate) return input;
  const ratio = srcRate / dstRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Float32Array(outLen);
  let posIn = 0;
  for (let i = 0; i < outLen; i++) {
    const nextIn = Math.floor((i + 1) * ratio);
    let sum = 0;
    let count = 0;
    for (let j = posIn; j < nextIn && j < input.length; j++) {
      sum += input[j];
      count++;
    }
    out[i] = count > 0 ? sum / count : 0;
    posIn = nextIn;
  }
  return out;
}

function wavHeader(sampleCount: number, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const byteRate = sampleRate * 2;
  const dataSize = sampleCount * 2;
  writeStr(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(view, 8, "WAVE");
  writeStr(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // format = PCM
  view.setUint16(22, 1, true); // channels
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(view, 36, "data");
  view.setUint32(40, dataSize, true);
  return buffer;
}
function writeStr(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
