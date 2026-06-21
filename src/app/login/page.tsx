"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/" className="font-handwritten text-3xl font-bold text-ink">
            notes2flashcards
          </Link>
        </div>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-sage p-8">
          <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full rotate-2 mb-3">
            ✦ Pick up where you left off
          </span>
          <h1 className="text-2xl font-bold text-ink mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-ink/60 mb-6">
            Log in to continue studying
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-line bg-paper px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-coral transition-colors"
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="text-sm text-coral font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-ink text-paper py-3 text-sm font-bold shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-ink underline decoration-highlight decoration-[3px] underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}