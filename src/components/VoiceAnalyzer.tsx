import { useEffect, useRef, useState } from "react";
import { detectPitchAutocorrelation } from "@/lib/pitch";

type Mode = "idle" | "recording";

export function VoiceAnalyzer({ referenceText }: { referenceText?: string }) {
  const specCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const pitchCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchHistoryRef = useRef<number[]>([]);
  const specColRef = useRef<number>(0);
  const [mode, setMode] = useState<Mode>("idle");
  const [avgPitch, setAvgPitch] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    const pitches = pitchHistoryRef.current.filter((p) => p > 0);
    if (pitches.length) {
      const avg = pitches.reduce((a, b) => a + b, 0) / pitches.length;
      setAvgPitch(avg);
    }
    setMode("idle");
  };

  const start = async () => {
    try {
      setError(null);
      setAvgPitch(null);
      pitchHistoryRef.current = [];
      specColRef.current = 0;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      analyserRef.current = analyser;
      source.connect(analyser);

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Uint8Array(analyser.fftSize);
      const timeFloat = new Float32Array(analyser.fftSize);

      const specCanvas = specCanvasRef.current!;
      const waveCanvas = waveCanvasRef.current!;
      const pitchCanvas = pitchCanvasRef.current!;
      const specCtx = specCanvas.getContext("2d")!;
      const waveCtx = waveCanvas.getContext("2d")!;
      const pitchCtx = pitchCanvas.getContext("2d")!;
      specCtx.fillStyle = "#0b1220";
      specCtx.fillRect(0, 0, specCanvas.width, specCanvas.height);

      setMode("recording");

      const render = () => {
        rafRef.current = requestAnimationFrame(render);
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        analyser.getFloatTimeDomainData(timeFloat);

        // Waveform
        waveCtx.fillStyle = "#0b1220";
        waveCtx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);
        waveCtx.strokeStyle = "#60a5fa";
        waveCtx.lineWidth = 1.5;
        waveCtx.beginPath();
        const slice = waveCanvas.width / timeData.length;
        for (let i = 0; i < timeData.length; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * waveCanvas.height) / 2;
          if (i === 0) waveCtx.moveTo(i * slice, y);
          else waveCtx.lineTo(i * slice, y);
        }
        waveCtx.stroke();

        // Spectrogram (scrolling)
        const w = specCanvas.width;
        const h = specCanvas.height;
        const x = specColRef.current % w;
        // clear next column
        specCtx.fillStyle = "#0b1220";
        specCtx.fillRect((x + 1) % w, 0, 2, h);
        // draw column
        const binCount = Math.min(freqData.length, 256);
        for (let i = 0; i < binCount; i++) {
          const v = freqData[i];
          const y = h - (i / binCount) * h;
          // color: dark blue -> cyan -> yellow -> red
          const t = v / 255;
          const r = Math.min(255, Math.floor(t * 500 - 100));
          const g = Math.min(255, Math.floor(t * 400));
          const b = Math.min(255, Math.floor(255 - t * 200));
          specCtx.fillStyle = `rgb(${Math.max(0, r)},${Math.max(0, g)},${Math.max(0, b)})`;
          specCtx.fillRect(x, y, 1, h / binCount + 1);
        }
        specColRef.current++;

        // Pitch
        const f = detectPitchAutocorrelation(timeFloat, ctx.sampleRate);
        pitchHistoryRef.current.push(f);
        if (pitchHistoryRef.current.length > 300) pitchHistoryRef.current.shift();
        pitchCtx.fillStyle = "#0b1220";
        pitchCtx.fillRect(0, 0, pitchCanvas.width, pitchCanvas.height);
        pitchCtx.strokeStyle = "#22c55e";
        pitchCtx.lineWidth = 2;
        pitchCtx.beginPath();
        const stepX = pitchCanvas.width / 300;
        const minHz = 60, maxHz = 400;
        pitchHistoryRef.current.forEach((p, i) => {
          if (p <= 0) return;
          const yy = pitchCanvas.height - ((p - minHz) / (maxHz - minHz)) * pitchCanvas.height;
          const xx = i * stepX;
          if (i === 0 || pitchHistoryRef.current[i - 1] <= 0) pitchCtx.moveTo(xx, yy);
          else pitchCtx.lineTo(xx, yy);
        });
        pitchCtx.stroke();
        // grid labels
        pitchCtx.fillStyle = "#64748b";
        pitchCtx.font = "10px sans-serif";
        pitchCtx.fillText("400 Hz", 4, 12);
        pitchCtx.fillText("60 Hz", 4, pitchCanvas.height - 4);
      };
      render();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo acceder al micrófono");
      setMode("idle");
    }
  };

  useEffect(() => () => stop(), []);

  const playReference = () => {
    if (!referenceText) return;
    const u = new SpeechSynthesisUtterance(referenceText);
    u.lang = "fr-FR";
    u.rate = 0.9;
    const voices = speechSynthesis.getVoices();
    const fr = voices.find((v) => v.lang.startsWith("fr"));
    if (fr) u.voice = fr;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Analizador fonético avanzado</h3>
          <p className="text-xs text-muted-foreground">
            Espectrograma, forma de onda y curva de entonación en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {referenceText && (
            <button
              onClick={playReference}
              className="rounded-full border border-border bg-secondary px-4 py-2 text-xs font-medium hover:bg-secondary/80"
            >
              🔊 Modelo nativo
            </button>
          )}
          {mode === "recording" ? (
            <button
              onClick={stop}
              className="rounded-full bg-red-500 px-4 py-2 text-xs font-medium text-white hover:opacity-90"
            >
              ⏹ Detener
            </button>
          ) : (
            <button
              onClick={start}
              className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              🎙 Grabar y analizar
            </button>
          )}
        </div>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      {referenceText && (
        <div className="rounded-lg bg-secondary/40 px-3 py-2 text-sm">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Modelo:</span>{" "}
          <span className="font-medium">{referenceText}</span>
        </div>
      )}

      <div>
        <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Espectrograma (frecuencias)</div>
        <canvas ref={specCanvasRef} width={800} height={200} className="h-40 w-full rounded-lg bg-[#0b1220]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Forma de onda</div>
          <canvas ref={waveCanvasRef} width={400} height={120} className="h-28 w-full rounded-lg bg-[#0b1220]" />
        </div>
        <div>
          <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Entonación (pitch)</div>
          <canvas ref={pitchCanvasRef} width={400} height={120} className="h-28 w-full rounded-lg bg-[#0b1220]" />
        </div>
      </div>

      {avgPitch !== null && (
        <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
          <strong>Pitch promedio:</strong> {avgPitch.toFixed(1)} Hz{" "}
          <span className="text-muted-foreground">
            ({avgPitch < 165 ? "voz grave / masculina típica" : "voz aguda / femenina típica"})
          </span>
          <div className="mt-1 text-xs text-muted-foreground">
            En francés, una entonación ascendente al final indica pregunta; descendente indica afirmación.
          </div>
        </div>
      )}
    </div>
  );
}
