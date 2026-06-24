"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Flashcard {
  _id: string;
  type: string;
  question: string;
  answer: string;
  options?: string[];
  difficulty: string;
  explanation?: string;
}

export default function PublicDeckPage() {
  const params = useParams();
  const { status } = useSession();
  const noteId = params.id as string;

  const [noteInfo, setNoteInfo] = useState<{ title: string; ownerName: string; upvotes: number } | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    fetchDeck();
  }, [noteId]);

async function fetchDeck() {
    setLoading(true);
    const res = await fetch(`/api/public/notes/${noteId}/flashcards`);
    const data = await res.json();
    if (res.ok) {
      setNoteInfo(data.note);
      setCards(data.flashcards || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDeck();
  }, [noteId]);

  async function handleUpvote() {
    if (upvoted || status !== "authenticated") return;
    const res = await fetch(`/api/notes/${noteId}/upvote`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setNoteInfo((prev) => (prev ? { ...prev, upvotes: data.upvotes } : prev));
      setUpvoted(true);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="font-handwritten text-2xl text-ink">Loading...</p>
      </div>
    );
  }

  if (!noteInfo) {
    return (
      <div className="flex-1 bg-paper flex flex-col items-center justify-center px-8 text-center">
        <p className="text-ink/60 mb-4">This deck isn&apos;t available or isn&apos;t public.</p>
        <Link href="/community" className="font-semibold text-coral underline">
          Back to community
        </Link>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 bg-paper flex flex-col items-center justify-center px-8 text-center">
        <p className="text-ink/60 mb-4">This deck has no flashcards yet.</p>
        <Link href="/community" className="font-semibold text-coral underline">
          Back to community
        </Link>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="flex-1 bg-paper">
      <nav className="flex items-center justify-between px-8 sm:px-12 py-6 max-w-6xl mx-auto">
        <Link href="/" className="font-handwritten text-2xl font-bold text-ink">
          notes2flashcards
        </Link>
        <Link href="/community" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
          Back to community
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-8 sm:px-12 py-12">
        <h1 className="text-2xl font-bold text-ink mb-1">{noteInfo.title}</h1>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-ink/60">by {noteInfo.ownerName || "Anonymous"}</p>
          <button
            onClick={handleUpvote}
            disabled={upvoted}
            className="text-xs font-mono px-3 py-1.5 rounded-full bg-highlight text-ink font-semibold disabled:opacity-60"
          >
            ▲ {noteInfo.upvotes} {upvoted ? "(thanks!)" : "upvote"}
          </button>
        </div>

        <p className="text-center text-sm font-mono text-ink/50 mb-6">
          Card {currentIndex + 1} of {cards.length}
        </p>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-coral p-8 min-h-[260px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wide text-sage">
              {card.type === "qa" ? "Question & Answer" : card.type === "fill-blank" ? "Fill in the blank" : "Multiple choice"}
            </span>
            <span className="text-xs font-mono px-2 py-1 rounded bg-highlight text-ink">
              {card.difficulty}
            </span>
          </div>

          <p className="text-lg font-semibold text-ink mb-6 flex-1">{card.question}</p>

          {card.type === "mcq" && card.options && (
            <div className="grid gap-2 mb-4">
              {card.options.map((opt, i) => (
                <div
                  key={i}
                  className={`text-sm border-2 rounded-lg px-3 py-2 ${
                    revealed && opt === card.answer ? "border-sage bg-sage/10 font-semibold" : "border-line"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}

          {revealed ? (
            <div className="border-t-2 border-line pt-4 mt-2">
              {card.type !== "mcq" && (
                <p className="font-handwritten text-2xl text-coral mb-2">{card.answer}</p>
              )}
              {card.explanation && <p className="text-sm text-ink/60">{card.explanation}</p>}
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="self-start text-sm font-bold bg-ink text-paper px-4 py-2 rounded-lg shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Reveal answer
            </button>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => { setRevealed(false); setCurrentIndex((i) => Math.max(i - 1, 0)); }}
            disabled={currentIndex === 0}
            className="text-sm font-semibold text-ink disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            onClick={() => { setRevealed(false); setCurrentIndex((i) => Math.min(i + 1, cards.length - 1)); }}
            disabled={currentIndex === cards.length - 1}
            className="text-sm font-semibold text-ink disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}