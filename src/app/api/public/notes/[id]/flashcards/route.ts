import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";
import Flashcard from "@/models/Flashcard";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const note = await Note.findById(id);

    if (!note || !note.isPublic) {
      return NextResponse.json({ error: "Deck not found or not public" }, { status: 404 });
    }

    const flashcards = await Flashcard.find({ noteId: id });

    return NextResponse.json({
      note: { title: note.title, ownerName: note.ownerName, upvotes: note.upvotes },
      flashcards,
    });
  } catch (error) {
    console.error("Public flashcards error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}