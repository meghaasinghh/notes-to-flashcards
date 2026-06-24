"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface GamificationData {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  dailyGoal: number;
  todayReviews: number;
  goalProgress: number;
  goalReached: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gamification, setGamification] = useState<GamificationData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/gamification")
        .then((res) => res.json())
        .then((data) => setGamification(data));
    }
  }, [status]);

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
        <p className="text-ink/60 mb-8">{session.user?.email}</p>

        {gamification && (
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mb-10">
            <div className="bg-ink text-paper rounded-2xl shadow-hard-coral p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-handwritten text-2xl">Level {gamification.level}</span>
                <span className="font-mono text-xs text-highlight">{gamification.xp} XP total</span>
              </div>
              <div className="w-full bg-paper/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-highlight h-full rounded-full transition-all"
                  style={{ width: `${gamification.xpIntoLevel}%` }}
                />
              </div>
              <p className="text-xs text-paper/60 mt-2">
                {gamification.xpIntoLevel} / {gamification.xpForNextLevel} XP to next level
              </p>
            </div>

            <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-sage p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-ink">Daily goal</span>
                <span className="font-mono text-xs text-ink/60">
                  {gamification.todayReviews}/{gamification.dailyGoal} cards
                </span>
              </div>
              <div className="w-full bg-line rounded-full h-3 overflow-hidden">
                <div
                  className="bg-sage h-full rounded-full transition-all"
                  style={{ width: `${gamification.goalProgress}%` }}
                />
              </div>
              <p className="text-xs text-ink/60 mt-2">
                {gamification.goalReached ? "✦ Goal reached today!" : "Keep going to hit your goal"}
              </p>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl">
          <Link href="/study" className="bg-coral text-paper border-2 border-ink rounded-2xl shadow-hard p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <h3 className="font-bold text-lg mb-1">Start studying</h3>
            <p className="text-sm text-paper/80">Review cards that are due today</p>
          </Link>
          <Link href="/notes" className="bg-white border-2 border-ink rounded-2xl shadow-hard-line p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <h3 className="font-bold text-lg text-ink mb-1">My notes</h3>
            <p className="text-sm text-ink/60">Upload notes or view your decks</p>
          </Link>
          <Link href="/analytics" className="bg-white border-2 border-ink rounded-2xl shadow-hard-sage p-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <h3 className="font-bold text-lg text-ink mb-1">Analytics</h3>
            <p className="text-sm text-ink/60">See your streak and progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
}