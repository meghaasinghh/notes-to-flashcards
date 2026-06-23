import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Flashcard from "@/models/Flashcard";
import { calculateSM2 } from "@/lib/sm2";
import ReviewLog from "@/models/ReviewLog";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { quality } = await req.json();

    if (quality === undefined || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "Quality rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const card = await Flashcard.findById(id);

    if (!card) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }

    if (card.userId !== session.user.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const result = calculateSM2({
      quality,
      easinessFactor: card.easinessFactor,
      interval: card.interval,
      repetitions: card.repetitions,
    });

    card.easinessFactor = result.easinessFactor;
    card.interval = result.interval;
    card.repetitions = result.repetitions;
    card.nextReviewDate = result.nextReviewDate;
    await card.save();

    await ReviewLog.create({
      userId: session.user.email,
      flashcardId: id,
      quality,
    });

    return NextResponse.json({
      message: "Review recorded",
      nextReviewDate: result.nextReviewDate,
      interval: result.interval,
    });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}