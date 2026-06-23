import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Flashcard from "@/models/Flashcard";

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

    const dueCards = await Flashcard.find({
      userId: session.user.email,
      nextReviewDate: { $lte: new Date() },
    }).sort({ nextReviewDate: 1 });

    return NextResponse.json({ flashcards: dueCards });
  } catch (error) {
    console.error("Fetch due cards error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}