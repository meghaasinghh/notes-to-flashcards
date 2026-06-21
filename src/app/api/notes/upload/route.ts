import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in to upload notes" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to a format Cloudinary can accept
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const isPdf = file.type === "application/pdf";

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "notes-to-flashcards",
      resource_type: isPdf ? "raw" : "image",
    });

    await connectToDatabase();

    const newNote = await Note.create({
      userId: session.user.email,
      title: title || file.name,
      fileUrl: uploadResult.secure_url,
      fileType: isPdf ? "pdf" : "image",
      ocrStatus: "pending",
    });

    return NextResponse.json(
      { message: "Upload successful", note: newNote },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Something went wrong during upload" },
      { status: 500 }
    );
  }
}