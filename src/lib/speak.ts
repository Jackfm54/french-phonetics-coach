/** Speak French text using the browser's SpeechSynthesis API. */
export function speakFr(text: string, rate = 0.9) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fr-FR";
  utter.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const fr =
    voices.find((v) => v.lang === "fr-FR") ||
    voices.find((v) => v.lang.startsWith("fr"));
  if (fr) utter.voice = fr;

  window.speechSynthesis.speak(utter);
}
