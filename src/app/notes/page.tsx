"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Note {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  extractedText?: string;
  ocrStatus: string;
  isPublic?: boolean;
  createdAt: string;
}

export default function NotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningOcrId, setRunningOcrId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes();
    }
  }, [status]);

  async function fetchNotes() {
    setLoading(true);
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data.notes || []);
    setLoading(false);
  }

  async function runOcr(noteId: string) {
    setRunningOcrId(noteId);
    try {
      await fetch(`/api/notes/${noteId}/ocr`, { method: "POST" });
      await fetchNotes();
    } finally {
      setRunningOcrId(null);
    }
  }
  async function generateFlashcards(noteId: string) {
    setGeneratingId(noteId);
    try {
      const res = await fetch(`/api/notes/${noteId}/generate-flashcards`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        router.push(`/notes/${noteId}/flashcards`);
      } else {
        alert(data.error || "Failed to generate flashcards");
      }
    } finally {
      setGeneratingId(null);
    }
  }
  async function toggleShare(noteId: string) {
    await fetch(`/api/notes/${noteId}/share`, { method: "POST" });
    await fetchNotes();
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="font-handwritten text-2xl text-ink">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex-1 bg-paper">
      <nav className="flex items-center justify-between px-8 sm:px-12 py-6 max-w-6xl mx-auto">
        <Link href="/" className="font-handwritten text-2xl font-bold text-ink">
          notes2flashcards
        </Link>
        <div className="flex gap-4">
          <Link href="/upload" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
            Upload new
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 sm:px-12 py-12">
        <h1 className="text-3xl font-bold text-ink mb-8">My Notes</h1>

        {notes.length === 0 ? (
          <p className="text-ink/60">
            No notes yet.{" "}
            <Link href="/upload" className="font-semibold text-coral underline">
              Upload your first one
            </Link>
          </p>
        ) : (
          <div className="grid gap-5">
            {notes.map((note) => (
              <div key={note._id} className="bg-white border-2 border-ink rounded-xl p-6 shadow-hard-line">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-ink text-lg">{note.title}</h3>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-highlight text-ink">
                    {note.ocrStatus}
                  </span>
                </div>

                {note.fileType === "image" && (
                  <img
                    src={note.fileUrl}
                    alt={note.title}
                    className="max-h-48 rounded-lg border-2 border-line mb-4"
                  />
                )}

                {note.extractedText && (
                  <p className="text-sm text-ink/70 bg-paper border border-line rounded-lg p-3 mb-4 whitespace-pre-wrap">
                    {note.extractedText}
                  </p>
                )}

                {note.ocrStatus === "pending" && note.fileType === "image" && (
                  <button
                    onClick={() => runOcr(note._id)}
                    disabled={runningOcrId === note._id}
                    className="text-sm font-bold bg-coral text-paper px-4 py-2 rounded-lg shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-60"
                  >
                    {runningOcrId === note._id ? "Reading text..." : "Run OCR"}
                  </button>
                )}
                {note.ocrStatus === "completed" && (
                  <button
                    onClick={() => generateFlashcards(note._id)}
                    disabled={generatingId === note._id}
                    className="text-sm font-bold bg-sage text-paper px-4 py-2 rounded-lg shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-60"
                  >
                    {generatingId === note._id ? "Generating cards..." : "Generate Flashcards"}
                  </button>
                )}
                {note.ocrStatus === "completed" && (
                  <Link
                    href={`/notes/${note._id}/chat`}
                    className="inline-block ml-2 text-sm font-bold bg-ink text-paper px-4 py-2 rounded-lg shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Ask AI Tutor
                  </Link>
                )}
                {note.ocrStatus === "completed" && (
                  <button
                    onClick={() => toggleShare(note._id)}
                    className={`inline-block ml-2 text-sm font-bold px-4 py-2 rounded-lg shadow-hard transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
                      note.isPublic ? "bg-sage text-paper" : "bg-white border-2 border-ink text-ink"
                    }`}
                  >
                    {note.isPublic ? "✓ Public" : "Make public"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}