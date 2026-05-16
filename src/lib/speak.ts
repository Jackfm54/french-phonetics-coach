/** Speak French text using the browser's SpeechSynthesis API. */
export function speakFr(
  text: string,
  rate = 0.9,
  opts?: { onStart?: () => void; onEnd?: () => void },
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const fr =
    voices.find((v) => v.lang === "fr-FR") ||
    voices.find((v) => v.lang.startsWith("fr"));
  if (fr) utter.voice = fr;

  utter.onstart = () => opts?.onStart?.();
  utter.onend = () => opts?.onEnd?.();
  utter.onerror = () => opts?.onEnd?.();

  window.speechSynthesis.speak(utter);
}
