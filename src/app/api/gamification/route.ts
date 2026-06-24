import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import ReviewLog from "@/models/ReviewLog";

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

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const xp = user.xp || 0;
    const dailyGoal = user.dailyGoal || 10;

    const level = Math.floor(xp / 100) + 1;
    const xpIntoLevel = xp % 100;
    const xpForNextLevel = 100;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayReviews = await ReviewLog.countDocuments({
      userId: session.user.email,
      reviewedAt: { $gte: todayStart },
    });

    const goalProgress = Math.min(
      Math.round((todayReviews / dailyGoal) * 100),
      100
    );

    return NextResponse.json({
      xp,
      level,
      xpIntoLevel,
      xpForNextLevel,
      dailyGoal,
      todayReviews,
      goalProgress,
      goalReached: todayReviews >= dailyGoal,
    });
  } catch (error) {
    console.error("Gamification error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}