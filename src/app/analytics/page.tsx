"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AnalyticsData {
  totalReviews: number;
  retentionRate: number;
  totalFlashcards: number;
  totalNotes: number;
  streak: number;
  last7Days: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function fetchAnalytics() {
    setLoading(true);
    const res = await fetch("/api/analytics");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status]);

  if (status === "loading" || loading || !data) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="font-handwritten text-2xl text-ink">Loading...</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.last7Days.map((d) => d.count), 1);

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
          ✦ Your progress
        </span>
        <h1 className="text-3xl font-bold text-ink mb-8">Analytics</h1>

        <div className="grid sm:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border-2 border-ink rounded-xl p-5 shadow-hard-line">
            <p className="text-3xl font-bold text-coral">{data.streak}</p>
            <p className="text-xs font-semibold text-ink/60 mt-1">Day streak</p>
          </div>
          <div className="bg-white border-2 border-ink rounded-xl p-5 shadow-hard-line">
            <p className="text-3xl font-bold text-sage">{data.retentionRate}%</p>
            <p className="text-xs font-semibold text-ink/60 mt-1">Retention rate</p>
          </div>
          <div className="bg-white border-2 border-ink rounded-xl p-5 shadow-hard-line">
            <p className="text-3xl font-bold text-ink">{data.totalReviews}</p>
            <p className="text-xs font-semibold text-ink/60 mt-1">Total reviews</p>
          </div>
          <div className="bg-white border-2 border-ink rounded-xl p-5 shadow-hard-line">
            <p className="text-3xl font-bold text-ink">{data.totalFlashcards}</p>
            <p className="text-xs font-semibold text-ink/60 mt-1">Flashcards</p>
          </div>
        </div>

        <div className="bg-white border-2 border-ink rounded-2xl shadow-hard-coral p-8">
          <h2 className="font-bold text-ink mb-6">Last 7 days</h2>
          <div className="flex items-end justify-between gap-3 h-40">
            {data.last7Days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-coral rounded-t-md border-2 border-ink"
                    style={{
                      height: `${(day.count / maxCount) * 100}%`,
                      minHeight: day.count > 0 ? "8px" : "2px",
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-ink/50">{day.date}</span>
                <span className="text-xs font-bold text-ink">{day.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}