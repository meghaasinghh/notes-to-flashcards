"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-semibold text-ink border-2 border-ink rounded-lg px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
        >
          Log out
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 sm:px-12 py-12">
        <span className="inline-block bg-highlight text-ink text-xs font-semibold px-3 py-1 rounded-full -rotate-2 mb-3">
          ✦ Welcome back
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">
          Hey, <span className="font-handwritten text-coral text-4xl sm:text-5xl">{session.user?.name}</span>
        </h1>
        <p className="text-ink/60 mb-10">{session.user?.email}</p>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-line p-8 max-w-md">
          <p className="text-ink/70 leading-relaxed">
            Your dashboard is coming soon — upload your first set of notes to
            get started, once that feature lands.
          </p>
        </div>
      </div>
    </div>
  );
}