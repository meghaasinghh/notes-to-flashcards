import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Flashcard from "@/models/Flashcard";

export async function GET(
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

    await connectToDatabase();

    const flashcards = await Flashcard.find({
      noteId: id,
      userId: session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Fetch flashcards error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}