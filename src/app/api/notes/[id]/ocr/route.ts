import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";
import { extractTextFromImage } from "@/lib/ocr";

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

    await connectToDatabase();
    
    const { id } = await params;
    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== session.user.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (note.fileType !== "image") {
      return NextResponse.json(
        { error: "OCR currently only supports images" },
        { status: 400 }
      );
    }

    note.ocrStatus = "processing";
    await note.save();

    const extractedText = await extractTextFromImage(note.fileUrl);

    note.extractedText = extractedText;
    note.ocrStatus = "completed";
    await note.save();

    return NextResponse.json({
      message: "OCR completed",
      extractedText,
    });
  } catch (error) {
    console.error("OCR error:", error);

    return NextResponse.json(
      { error: "OCR processing failed" },
      { status: 500 }
    );
  }
}