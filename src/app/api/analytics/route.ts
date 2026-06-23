import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import ReviewLog from "@/models/ReviewLog";
import Flashcard from "@/models/Flashcard";
import Note from "@/models/Note";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const userId = session.user.email;

    const allLogs = await ReviewLog.find({ userId }).sort({ reviewedAt: -1 });
    const totalReviews = allLogs.length;

    const goodReviews = allLogs.filter((log) => log.quality >= 3).length;
    const retentionRate =
      totalReviews > 0 ? Math.round((goodReviews / totalReviews) * 100) : 0;

    const totalFlashcards = await Flashcard.countDocuments({ userId });
    const totalNotes = await Note.countDocuments({ userId });

    // Calculate study streak: consecutive days (including today) with at least one review
    const reviewDates = new Set(
      allLogs.map((log) => new Date(log.reviewedAt).toDateString())
    );

    let streak = 0;
    const checkDate = new Date();

    while (reviewDates.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Reviews over the last 7 days, for a simple chart
    const last7Days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();
      const count = allLogs.filter(
        (log) => new Date(log.reviewedAt).toDateString() === dateStr
      ).length;
      last7Days.push({
        date: d.toLocaleDateString("en-US", { weekday: "short" }),
        count,
      });
    }

    return NextResponse.json({
      totalReviews,
      retentionRate,
      totalFlashcards,
      totalNotes,
      streak,
      last7Days,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}