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
    });

    if (flashcards.length === 0) {
      return NextResponse.json({ error: "No flashcards found" }, { status: 404 });
    }

    // Anki format: question[TAB]answer, one card per line
    const lines = flashcards.map((card) => {
      const question = card.question.replace(/\t/g, " ").replace(/\n/g, " ");
      const answer = card.answer.replace(/\t/g, " ").replace(/\n/g, " ");
      return `${question}\t${answer}`;
    });

    const fileContent = lines.join("\n");

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=flashcards-anki-export.txt",
      },
    });
  } catch (error) {
    console.error("Anki export error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}