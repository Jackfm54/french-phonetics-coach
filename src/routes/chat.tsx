import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Volume2, Mic, MicOff } from "lucide-react";
import { speakFr } from "@/lib/speak";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Tuteur IA · Professeur.fr" },
      {
        name: "description",
        content: "Conversa en francés con un tutor IA que te corrige y te guía.",
      },
    ],
  }),
  component: ChatPage,
});

function getMessageText(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

function ChatPage() {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const speech = useSpeechRecognition("fr-FR");

  // Sync recognized speech into the input as it comes
  useEffect(() => {
    if (speech.transcript) setInput(speech.transcript);
  }, [speech.transcript]);

  const toggleMic = () => {
    if (speech.listening) speech.stop();
    else {
      setInput("");
      speech.start();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-8">
        <header className="mb-6">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Tuteur IA
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight lg:text-4xl">
            Parle avec ton professeur
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escribe en francés (o en español si necesitas). Te corrijo, te explico
            y te ayudo a pronunciar.
          </p>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto pb-32">
          {messages.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="font-display text-lg font-semibold">Bonjour ! 👋</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Pregúntame algo como “¿Cómo se pronuncia <i>bonjour</i>?” o
                escribe una frase en francés para que la corrija.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                {[
                  "Corrige: Je suis allé à le magasin",
                  "Explique la nasale 'an'",
                  "Salut ! Comment tu vas ?",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-full border border-border bg-card px-3 py-1.5 transition hover:border-primary/50 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const text = getMessageText(m);
            if (m.role === "user") {
              return (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-5 py-3 text-primary-foreground shadow-soft">
                    {text}
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className="group flex flex-col gap-2">
                <div className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-strong:text-primary prose-code:text-primary prose-code:before:content-none prose-code:after:content-none">
                  <ReactMarkdown>{text}</ReactMarkdown>
                </div>
                {text && (
                  <button
                    onClick={() => speakFr(text)}
                    className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                  >
                    <Volume2 className="h-3 w-3" /> Écouter
                  </button>
                )}
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error.message || "Une erreur est survenue."}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-3xl items-end gap-2 px-6 py-4">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              placeholder="Écris en français ou en espagnol…"
              className="min-h-12 max-h-40 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-elegant transition disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
