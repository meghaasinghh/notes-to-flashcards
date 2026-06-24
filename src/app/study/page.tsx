"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export default function StudyPage() {
  const { status } = useSession();
  const router = useRouter();

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      setLoading(true);
      const res = await fetch("/api/flashcards/due");
      const data = await res.json();
      setCards(data.flashcards || []);
      setLoading(false);
    })();
  }, [status]);

  async function rateCard(quality: number) {
    const card = cards[currentIndex];
    setSubmitting(true);

    try {
      await fetch(`/api/flashcards/${card._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quality }),
      });

      setReviewedCount((c) => c + 1);
      setRevealed(false);

      if (currentIndex + 1 >= cards.length) {
        setSessionDone(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="font-handwritten text-2xl text-ink">Loading...</p>
      </div>
    );
  }

  if (cards.length === 0 || sessionDone) {
    return (
      <div className="flex-1 bg-paper flex flex-col items-center justify-center px-8 text-center">
        <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full -rotate-2 mb-4">
          ✦ {sessionDone ? "Session complete" : "All caught up"}
        </span>
        <h1 className="text-2xl font-bold text-ink mb-2">
          {sessionDone
            ? `Nice work — you reviewed ${reviewedCount} card${reviewedCount === 1 ? "" : "s"}`
            : "No cards due for review right now"}
        </h1>
        <p className="text-ink/60 mb-6">
          {sessionDone
            ? "Come back later for your next scheduled review."
            : "Check back later, or generate flashcards from a new note."}
        </p>
        <Link href="/dashboard" className="font-semibold text-coral underline">
          Back to dashboard
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
        <Link href="/dashboard" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
          Exit session
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-8 sm:px-12 py-12">
        <p className="text-center text-sm font-mono text-ink/50 mb-6">
          Card {currentIndex + 1} of {cards.length}
        </p>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-coral p-8 min-h-65 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wide text-sage">
              {card.type === "qa" ? "Question & Answer" : card.type === "fill-blank" ? "Fill in the blank" : "Multiple choice"}
            </span>
            <span className="text-xs font-mono px-2 py-1 rounded bg-highlight text-ink">
              {card.difficulty}
            </span>
          </div>

          <p className="text-lg font-semibold text-ink mb-6 flex-1">
            {card.question}
          </p>

          {card.type === "mcq" && card.options && (
            <div className="grid gap-2 mb-4">
              {card.options.map((opt, i) => (
                <div
                  key={i}
                  className={`text-sm border-2 rounded-lg px-3 py-2 ${
                    revealed && opt === card.answer
                      ? "border-sage bg-sage/10 font-semibold"
                      : "border-line"
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
                <p className="font-handwritten text-2xl text-coral mb-2">
                  {card.answer}
                </p>
              )}
              {card.explanation && (
                <p className="text-sm text-ink/60">{card.explanation}</p>
              )}
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="self-start text-sm font-bold bg-ink text-paper px-4 py-2 rounded-lg shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Reveal answer
            </button>
          )}
        </div>

        {revealed && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-ink/70 mb-3 text-center">
              How well did you know this?
            </p>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => rateCard(1)}
                disabled={submitting}
                className="text-xs font-bold py-3 rounded-lg border-2 border-ink text-ink hover:bg-coral hover:text-paper transition-colors disabled:opacity-50"
              >
                Again
              </button>
              <button
                onClick={() => rateCard(3)}
                disabled={submitting}
                className="text-xs font-bold py-3 rounded-lg border-2 border-ink text-ink hover:bg-highlight transition-colors disabled:opacity-50"
              >
                Hard
              </button>
              <button
                onClick={() => rateCard(4)}
                disabled={submitting}
                className="text-xs font-bold py-3 rounded-lg border-2 border-ink text-ink hover:bg-sage hover:text-paper transition-colors disabled:opacity-50"
              >
                Good
              </button>
              <button
                onClick={() => rateCard(5)}
                disabled={submitting}
                className="text-xs font-bold py-3 rounded-lg border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
              >
                Easy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}