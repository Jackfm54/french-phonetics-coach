/** Speak French text using the browser's SpeechSynthesis API. */

let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  if (voicesReady) return voicesReady;

  voicesReady = new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing && existing.length > 0) {
      resolve(existing);
      return;
    }
    const handler = () => {
      const v = synth.getVoices();
      if (v && v.length > 0) {
        synth.removeEventListener("voiceschanged", handler);
        resolve(v);
      }
    };
    synth.addEventListener("voiceschanged", handler);
    setTimeout(() => {
      const v = synth.getVoices();
      synth.removeEventListener("voiceschanged", handler);
      // Si seguimos sin voces, NO cacheamos vacío: reseteamos para
      // que la próxima llamada vuelva a intentar la carga.
      if (!v || v.length === 0) {
        voicesReady = null;
      }
      resolve(v ?? []);
    }, 1500);
  });
  return voicesReady;
}


function pickFrenchVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (!voices.length) return undefined;
  // Preferencia: fr-FR nativa > fr-CA > cualquier fr-*.
  const preferred =
    voices.find((v) => v.lang === "fr-FR" && v.localService) ||
    voices.find((v) => v.lang === "fr-FR") ||
    voices.find((v) => v.lang === "fr-CA") ||
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr"));
  return preferred;
}

// Pre-carga las voces lo antes posible para que la primera llamada no falle.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
}

export async function speakFr(
  text: string,
  rate = 0.9,
  opts?: { onStart?: () => void; onEnd?: () => void },
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    opts?.onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();

  const voices = await loadVoices();
  const voice = pickFrenchVoice(voices);

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voice?.lang ?? "fr-FR";
  utter.rate = rate;
  utter.pitch = 1;
  if (voice) utter.voice = voice;

  utter.onstart = () => opts?.onStart?.();
  utter.onend = () => opts?.onEnd?.();
  utter.onerror = () => opts?.onEnd?.();

  // Pequeño truco anti-bug de Chrome: cancel() puede dejar el motor en pausa.
  try {
    synth.resume();
  } catch {
    /* noop */
  }
  synth.speak(utter);
}
