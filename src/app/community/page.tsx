"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PublicNote {
  _id: string;
  title: string;
  ownerName: string;
  upvotes: number;
}

export default function CommunityPage() {
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/community")
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 bg-paper">
      <nav className="flex items-center justify-between px-8 sm:px-12 py-6 max-w-6xl mx-auto">
        <Link href="/" className="font-handwritten text-2xl font-bold text-ink">
          notes2flashcards
        </Link>
        <Link href="/dashboard" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
          Dashboard
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 sm:px-12 py-12">
        <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full -rotate-2 mb-3">
          ✦ Shared by students
        </span>
        <h1 className="text-3xl font-bold text-ink mb-8">Community Decks</h1>

        {loading ? (
          <p className="font-handwritten text-2xl text-ink">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-ink/60">No public decks yet. Be the first to share one!</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {notes.map((note) => (
              <Link
                key={note._id}
                href={`/community/${note._id}`}
                className="bg-white border-2 border-ink rounded-xl p-6 shadow-hard-line hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <h3 className="font-bold text-ink text-lg mb-1">{note.title}</h3>
                <p className="text-sm text-ink/60 mb-3">by {note.ownerName || "Anonymous"}</p>
                <span className="text-xs font-mono px-2 py-1 rounded bg-highlight text-ink">
                  ▲ {note.upvotes} upvotes
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}