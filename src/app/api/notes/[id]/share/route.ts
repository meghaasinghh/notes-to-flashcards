import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";

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

    note.isPublic = !note.isPublic;
    note.ownerName = session.user.name || "Anonymous";
    await note.save();

    return NextResponse.json({
      message: note.isPublic ? "Deck is now public" : "Deck is now private",
      isPublic: note.isPublic,
    });
  } catch (error) {
    console.error("Share toggle error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}