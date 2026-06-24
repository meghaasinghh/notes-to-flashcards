import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";

export async function GET() {
  try {
    await connectToDatabase();

    const publicNotes = await Note.find({ isPublic: true })
      .sort({ upvotes: -1, createdAt: -1 })
      .limit(50);

    return NextResponse.json({ notes: publicNotes });
  } catch (error) {
    console.error("Community fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}