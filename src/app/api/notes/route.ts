import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";

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

    const notes = await Note.find({ userId: session.user.email }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Fetch notes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}