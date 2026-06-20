"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          Welcome, {session.user?.name}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          {session.user?.email}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Your dashboard is coming soon — this is just a placeholder confirming you&apos;re logged in.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}