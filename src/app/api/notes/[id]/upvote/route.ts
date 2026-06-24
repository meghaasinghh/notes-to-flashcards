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
        { error: "You must be logged in to upvote" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectToDatabase();

    const note = await Note.findById(id);

    if (!note || !note.isPublic) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    note.upvotes = (note.upvotes || 0) + 1;
    await note.save();

    return NextResponse.json({ upvotes: note.upvotes });
  } catch (error) {
    console.error("Upvote error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}