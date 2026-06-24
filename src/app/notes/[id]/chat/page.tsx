"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function TutorChatPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`/api/notes/${noteId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, something went wrong. Try again?" },
        ]);
      }
    } finally {
      setSending(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="font-handwritten text-2xl text-ink">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-paper flex flex-col">
      <nav className="flex items-center justify-between px-8 sm:px-12 py-6 max-w-4xl mx-auto w-full">
        <Link href="/" className="font-handwritten text-2xl font-bold text-ink">
          notes2flashcards
        </Link>
        <Link href="/notes" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
          Back to notes
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto w-full px-8 sm:px-12 flex-1 flex flex-col">
        <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full -rotate-2 mb-3 self-start">
          ✦ AI Tutor
        </span>
        <h1 className="text-2xl font-bold text-ink mb-6">
          Ask about your notes
        </h1>

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto mb-4 min-h-75">
          {messages.length === 0 && (
            <div className="bg-white border-2 border-ink rounded-xl p-5 shadow-hard-line">
              <p className="text-sm text-ink/70">
                Hi! I&apos;ve read through your notes. Ask me anything — I can
                explain concepts, quiz you, or clarify anything that&apos;s
                confusing.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-xl p-4 text-sm border-2 border-ink ${
                msg.role === "user"
                  ? "self-end bg-coral text-paper shadow-hard"
                  : "self-start bg-white text-ink shadow-hard-line"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {sending && (
            <div className="self-start bg-white border-2 border-ink rounded-xl p-4 shadow-hard-line">
              <p className="text-sm text-ink/50 font-handwritten text-lg">
                Thinking...
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 pb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about these notes..."
            className="flex-1 rounded-lg border-2 border-line bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-coral transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-lg bg-ink text-paper px-5 py-3 text-sm font-bold shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}