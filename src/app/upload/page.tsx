"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!file) {
      setError("Please choose a file first");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name);

    try {
      const res = await fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      setSuccess(true);
      setFile(null);
      setTitle("");
      setUploading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  }

  if (status === "loading") {
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
        <Link href="/dashboard" className="text-sm font-semibold text-ink hover:text-coral transition-colors">
          Back to dashboard
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-8 sm:px-12 py-12">
        <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full -rotate-2 mb-3">
          ✦ Step 1 of your study deck
        </span>
        <h1 className="text-3xl font-bold text-ink mb-2">
          Upload your notes
        </h1>
        <p className="text-ink/60 mb-8">
          Add a photo, scan, or PDF of your handwritten notes
        </p>

        <form onSubmit={handleUpload} className="bg-white border-2 border-ink rounded-2xl shadow-hard-coral p-8">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-ink mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-coral transition-colors"
              placeholder="e.g. Biology Chapter 4"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-ink mb-1">
              File
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-ink/70 border-2 border-dashed border-line rounded-lg p-4 cursor-pointer"
            />
            {file && (
              <p className="text-xs text-sage font-medium mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-coral font-medium mb-4">{error}</p>
          )}

          {success && (
            <p className="text-sm text-sage font-medium mb-4">
              ✓ Uploaded successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-xl bg-coral text-paper py-3 text-sm font-bold shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload notes"}
          </button>
        </form>
      </div>
    </div>
  );
}