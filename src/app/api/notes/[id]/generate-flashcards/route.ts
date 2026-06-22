import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";
import Flashcard from "@/models/Flashcard";
import { generateFlashcardsFromText } from "@/lib/gemini";

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

    await connectToDatabase();

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== session.user.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (!note.extractedText || note.extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "This note has no extracted text yet. Run OCR first." },
        { status: 400 }
      );
    }

    const generatedCards = await generateFlashcardsFromText(note.extractedText);

    const savedCards = await Flashcard.insertMany(
      generatedCards.map((card: { type: string; question: string; answer: string; options?: string[]; difficulty: string; explanation?: string }) => ({
        userId: session.user!.email,
        noteId: note._id.toString(),
        type: card.type,
        question: card.question,
        answer: card.answer,
        options: card.options,
        difficulty: card.difficulty,
        explanation: card.explanation,
      }))
    );

    return NextResponse.json({
      message: "Flashcards generated successfully",
      flashcards: savedCards,
    });
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json(
      { error: "Something went wrong generating flashcards" },
      { status: 500 }
    );
  }
}