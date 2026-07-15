import { useEffect, useRef, useState } from "react";
import { detectPitchAutocorrelation } from "@/lib/pitch";

type Mode = "idle" | "recording" | "playing-ref";

type CanvasSet = {
  spec: HTMLCanvasElement | null;
  wave: HTMLCanvasElement | null;
  pitch: HTMLCanvasElement | null;
};

function drawFrame(
  canvases: CanvasSet,
  freqData: Uint8Array,
  timeData: Uint8Array,
  timeFloat: Float32Array,
  sampleRate: number,
  state: { specCol: number; pitchHistory: number[]; envelope: number[] },
) {
  const { spec, wave, pitch } = canvases;
  if (!spec || !wave || !pitch) return;
  const specCtx = spec.getContext("2d")!;
  const waveCtx = wave.getContext("2d")!;
  const pitchCtx = pitch.getContext("2d")!;

  // Waveform
  waveCtx.fillStyle = "#0b1220";
  waveCtx.fillRect(0, 0, wave.width, wave.height);
  waveCtx.strokeStyle = "#60a5fa";
  waveCtx.lineWidth = 1.5;
  waveCtx.beginPath();
  const slice = wave.width / timeData.length;
  for (let i = 0; i < timeData.length; i++) {
    const v = timeData[i] / 128.0;
    const y = (v * wave.height) / 2;
    if (i === 0) waveCtx.moveTo(i * slice, y);
    else waveCtx.lineTo(i * slice, y);
  }
  waveCtx.stroke();

  // Envelope (peak amplitude per frame, 0-1)
  let peak = 0;
  for (let i = 0; i < timeFloat.length; i++) {
    const a = Math.abs(timeFloat[i]);
    if (a > peak) peak = a;
  }
  state.envelope.push(peak);
  if (state.envelope.length > 600) state.envelope.shift();

  // Spectrogram (scrolling)
  const w = spec.width;
  const h = spec.height;
  const x = state.specCol % w;
  specCtx.fillStyle = "#0b1220";
  specCtx.fillRect((x + 1) % w, 0, 2, h);
  const binCount = Math.min(freqData.length, 256);
  for (let i = 0; i < binCount; i++) {
    const v = freqData[i];
    const y = h - (i / binCount) * h;
    const t = v / 255;
    const r = Math.min(255, Math.floor(t * 500 - 100));
    const g = Math.min(255, Math.floor(t * 400));
    const b = Math.min(255, Math.floor(255 - t * 200));
    specCtx.fillStyle = `rgb(${Math.max(0, r)},${Math.max(0, g)},${Math.max(0, b)})`;
    specCtx.fillRect(x, y, 1, h / binCount + 1);
  }
  state.specCol++;

  // Pitch
  const f = detectPitchAutocorrelation(timeFloat, sampleRate);
  state.pitchHistory.push(f);
  if (state.pitchHistory.length > 300) state.pitchHistory.shift();
  pitchCtx.fillStyle = "#0b1220";
  pitchCtx.fillRect(0, 0, pitch.width, pitch.height);
  pitchCtx.strokeStyle = "#22c55e";
  pitchCtx.lineWidth = 2;
  pitchCtx.beginPath();
  const stepX = pitch.width / 300;
  const minHz = 60,
    maxHz = 400;
  state.pitchHistory.forEach((p, i) => {
    if (p <= 0) return;
    const yy = pitch.height - ((p - minHz) / (maxHz - minHz)) * pitch.height;
    const xx = i * stepX;
    if (i === 0 || state.pitchHistory[i - 1] <= 0) pitchCtx.moveTo(xx, yy);
    else pitchCtx.lineTo(xx, yy);
  });
  pitchCtx.stroke();
  pitchCtx.fillStyle = "#64748b";
  pitchCtx.font = "10px sans-serif";
  pitchCtx.fillText("400 Hz", 4, 12);
  pitchCtx.fillText("60 Hz", 4, pitch.height - 4);
}

function clearCanvases(cs: CanvasSet) {
  for (const c of [cs.spec, cs.wave, cs.pitch]) {
    if (!c) continue;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, c.width, c.height);
  }
}

function drawCombinedEnvelope(
  canvas: HTMLCanvasElement | null,
  refEnv: number[],
  userEnv: number[],
) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d")!;
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, w, h);

  // Center axis
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  const drawEnv = (env: number[], color: string, fill: string) => {
    if (env.length < 2) return;
    const stepX = w / Math.max(env.length, 1);
    // Fill (mirrored)
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    for (let i = 0; i < env.length; i++) {
      const y = h / 2 - env[i] * (h / 2);
      ctx.lineTo(i * stepX, y);
    }
    for (let i = env.length - 1; i >= 0; i--) {
      const y = h / 2 + env[i] * (h / 2);
      ctx.lineTo(i * stepX, y);
    }
    ctx.closePath();
    ctx.fill();
    // Outline
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < env.length; i++) {
      const y = h / 2 - env[i] * (h / 2);
      if (i === 0) ctx.moveTo(i * stepX, y);
      else ctx.lineTo(i * stepX, y);
    }
    ctx.stroke();
  };

  // Reference in blue, user in green (semi-transparent so overlap is visible)
  drawEnv(refEnv, "#60a5fa", "rgba(96,165,250,0.25)");
  drawEnv(userEnv, "#22c55e", "rgba(34,197,94,0.28)");

  // Legend
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#60a5fa";
  ctx.fillText("■ Modelo nativo", 8, 14);
  ctx.fillStyle = "#22c55e";
  ctx.fillText("■ Tu voz", 120, 14);
}

function avg(nums: number[]) {
  const filtered = nums.filter((n) => n > 0);
  if (!filtered.length) return null;
  return filtered.reduce((a, b) => a + b, 0) / filtered.length;
}

export function VoiceAnalyzer({ referenceText }: { referenceText?: string }) {
  // User canvases
  const userSpec = useRef<HTMLCanvasElement>(null);
  const userWave = useRef<HTMLCanvasElement>(null);
  const userPitch = useRef<HTMLCanvasElement>(null);
  // Reference canvases
  const refSpec = useRef<HTMLCanvasElement>(null);
  const refWave = useRef<HTMLCanvasElement>(null);
  const refPitch = useRef<HTMLCanvasElement>(null);
  // Combined comparison waveform
  const compareWave = useRef<HTMLCanvasElement>(null);

  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const userState = useRef({ specCol: 0, pitchHistory: [] as number[], envelope: [] as number[] });
  const refState = useRef({ specCol: 0, pitchHistory: [] as number[], envelope: [] as number[] });

  const [mode, setMode] = useState<Mode>("idle");
  const [avgUserPitch, setAvgUserPitch] = useState<number | null>(null);
  const [avgRefPitch, setAvgRefPitch] = useState<number | null>(null);
  const [loadingRef, setLoadingRef] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioElRef.current?.pause();
    audioElRef.current = null;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  };

  const stopUser = () => {
    if (mode !== "recording") return;
    setAvgUserPitch(avg(userState.current.pitchHistory));
    drawCombinedEnvelope(compareWave.current, refState.current.envelope, userState.current.envelope);
    cleanup();
    setMode("idle");
  };

  const resetAll = () => {
    cleanup();
    userState.current = { specCol: 0, pitchHistory: [], envelope: [] };
    refState.current = { specCol: 0, pitchHistory: [], envelope: [] };
    clearCanvases({ spec: userSpec.current, wave: userWave.current, pitch: userPitch.current });
    clearCanvases({ spec: refSpec.current, wave: refWave.current, pitch: refPitch.current });
    setAvgUserPitch(null);
    setAvgRefPitch(null);
    setLoadingRef(false);
    setError(null);
    setMode("idle");
  };

  const startUser = async () => {
    try {
      setError(null);
      setAvgUserPitch(null);
      userState.current = { specCol: 0, pitchHistory: [], envelope: [] };
      clearCanvases({ spec: userSpec.current, wave: userWave.current, pitch: userPitch.current });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Uint8Array(analyser.fftSize);
      const timeFloat = new Float32Array(analyser.fftSize);

      setMode("recording");

      const render = () => {
        rafRef.current = requestAnimationFrame(render);
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        analyser.getFloatTimeDomainData(timeFloat);
        drawFrame(
          { spec: userSpec.current, wave: userWave.current, pitch: userPitch.current },
          freqData,
          timeData,
          timeFloat,
          ctx.sampleRate,
          userState.current,
        );
        drawCombinedEnvelope(compareWave.current, refState.current.envelope, userState.current.envelope);
      };
      render();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo acceder al micrófono");
      setMode("idle");
    }
  };

  const playAndAnalyzeReference = async () => {
    if (!referenceText) return;
    try {
      cleanup();
      setError(null);
      setAvgRefPitch(null);
      refState.current = { specCol: 0, pitchHistory: [], envelope: [] };
      clearCanvases({ spec: refSpec.current, wave: refWave.current, pitch: refPitch.current });
      setLoadingRef(true);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: referenceText, speed: 0.9, voice: "nova" }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audioElRef.current = audio;

      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser);
      src.connect(ctx.destination);

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const timeData = new Uint8Array(analyser.fftSize);
      const timeFloat = new Float32Array(analyser.fftSize);

      setLoadingRef(false);
      setMode("playing-ref");

      const render = () => {
        rafRef.current = requestAnimationFrame(render);
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
        analyser.getFloatTimeDomainData(timeFloat);
        drawFrame(
          { spec: refSpec.current, wave: refWave.current, pitch: refPitch.current },
          freqData,
          timeData,
          timeFloat,
          ctx.sampleRate,
          refState.current,
        );
        drawCombinedEnvelope(compareWave.current, refState.current.envelope, userState.current.envelope);
      };

      audio.onended = () => {
        setAvgRefPitch(avg(refState.current.pitchHistory));
        cleanup();
        setMode("idle");
      };

      await audio.play();
      render();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo reproducir el modelo");
      setLoadingRef(false);
      cleanup();
      setMode("idle");
    }
  };

  useEffect(() => () => cleanup(), []);

  const pitchDelta =
    avgUserPitch !== null && avgRefPitch !== null ? avgUserPitch - avgRefPitch : null;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Analizador fonético comparativo</h3>
          <p className="text-xs text-muted-foreground">
            Escucha el modelo nativo, míralo en el espectrograma y compara con tu propia voz.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {referenceText && (
            <button
              onClick={playAndAnalyzeReference}
              disabled={mode !== "idle" || loadingRef}
              className="rounded-full border border-border bg-secondary px-4 py-2 text-xs font-medium hover:bg-secondary/80 disabled:opacity-50"
            >
              {loadingRef
                ? "Cargando…"
                : mode === "playing-ref"
                  ? "▶ Reproduciendo…"
                  : "🔊 Analizar modelo nativo"}
            </button>
          )}
          {mode === "recording" ? (
            <button
              onClick={stopUser}
              className="rounded-full bg-red-500 px-4 py-2 text-xs font-medium text-white hover:opacity-90"
            >
              ⏹ Detener
            </button>
          ) : (
            <button
              onClick={startUser}
              disabled={mode !== "idle"}
              className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              🎙 Grabar mi voz
            </button>
          )}
          <button
            onClick={resetAll}
            className="rounded-full border border-border bg-secondary px-4 py-2 text-xs font-medium hover:bg-secondary/80"
            title="Reiniciar el ejercicio y limpiar los visores"
          >
            🔄 Reiniciar
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      {referenceText && (
        <div className="rounded-lg bg-secondary/40 px-3 py-2 text-sm">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Frase modelo:</span>{" "}
          <span className="font-medium">{referenceText}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reference column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-primary">🎧 Modelo nativo</div>
            {avgRefPitch !== null && (
              <div className="text-xs text-muted-foreground">
                pitch ~ <strong>{avgRefPitch.toFixed(0)} Hz</strong>
              </div>
            )}
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Espectrograma
            </div>
            <canvas
              ref={refSpec}
              width={600}
              height={160}
              className="h-32 w-full rounded-lg bg-[#0b1220]"
            />
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Forma de onda
            </div>
            <canvas
              ref={refWave}
              width={600}
              height={100}
              className="h-20 w-full rounded-lg bg-[#0b1220]"
            />
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Entonación
            </div>
            <canvas
              ref={refPitch}
              width={600}
              height={100}
              className="h-20 w-full rounded-lg bg-[#0b1220]"
            />
          </div>
        </div>

        {/* User column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-emerald-500">🎙 Tu voz</div>
            {avgUserPitch !== null && (
              <div className="text-xs text-muted-foreground">
                pitch ~ <strong>{avgUserPitch.toFixed(0)} Hz</strong>
              </div>
            )}
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Espectrograma
            </div>
            <canvas
              ref={userSpec}
              width={600}
              height={160}
              className="h-32 w-full rounded-lg bg-[#0b1220]"
            />
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Forma de onda
            </div>
            <canvas
              ref={userWave}
              width={600}
              height={100}
              className="h-20 w-full rounded-lg bg-[#0b1220]"
            />
          </div>
          <div>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Entonación
            </div>
            <canvas
              ref={userPitch}
              width={600}
              height={100}
              className="h-20 w-full rounded-lg bg-[#0b1220]"
            />
          </div>
        </div>
      </div>

      {pitchDelta !== null && (
        <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm">
          <strong>Comparación:</strong> tu pitch promedio está{" "}
          {Math.abs(pitchDelta) < 15 ? (
            <span className="text-emerald-500">muy cerca</span>
          ) : pitchDelta > 0 ? (
            <span className="text-amber-500">{pitchDelta.toFixed(0)} Hz por encima</span>
          ) : (
            <span className="text-amber-500">{Math.abs(pitchDelta).toFixed(0)} Hz por debajo</span>
          )}{" "}
          del modelo nativo. Recuerda que hombres y mujeres tienen rangos distintos: fíjate sobre todo
          en la <em>forma</em> de la curva (sube en preguntas, baja en afirmaciones) y en las bandas
          del espectrograma más que en el valor absoluto.
        </div>
      )}
    </div>
  );
}
