import { useEffect, useRef, useState, useCallback } from "react";

// Minimal types for Web Speech API (not in lib.dom)
type SRConstructor = new () => SpeechRecognitionLike;
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }> & { isFinal: boolean }>;
}

function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(lang = "fr-FR") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const ref = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SR = getSR();
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e) => {
      let finalT = "";
      let interimT = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r[0].transcript;
        if (r.isFinal) finalT += text;
        else interimT += text;
      }
      if (finalT) setTranscript((prev) => (prev ? prev + " " : "") + finalT.trim());
      setInterim(interimT);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };

    ref.current = rec;
    return () => {
      rec.abort();
      ref.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    if (!ref.current) return;
    setTranscript("");
    setInterim("");
    try {
      ref.current.start();
      setListening(true);
    } catch {
      // already started
    }
  }, []);

  const stop = useCallback(() => {
    ref.current?.stop();
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterim("");
  }, []);

  return { listening, transcript, interim, supported, start, stop, reset };
}
