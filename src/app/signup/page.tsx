"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/" className="font-handwritten text-3xl font-bold text-ink">
            notes2flashcards
          </Link>
        </div>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-coral p-8">
          <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full -rotate-2 mb-3">
            ✦ Join for free
          </span>
          <h1 className="text-2xl font-bold text-ink mb-1">
            Create your account
          </h1>
          <p className="text-sm text-ink/60 mb-6">
            Start turning your notes into flashcards
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-coral transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-coral transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-coral transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-coral font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-coral text-paper py-3 text-sm font-bold shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink underline decoration-highlight decoration-[3px] underline-offset-2">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}