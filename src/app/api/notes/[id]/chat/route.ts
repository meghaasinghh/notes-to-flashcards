import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import Note from "@/models/Note";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A message is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const note = await Note.findById(id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (note.userId !== session.user.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemContext = `You are a friendly, encouraging AI study tutor helping a student understand their own notes. Below is the content of their notes. Answer their questions clearly, explain concepts simply, and only use information relevant to these notes unless they ask something general. Keep answers concise and focused — a few sentences unless they ask for more detail.

Notes content:
"""
${note.extractedText || "(No text extracted from this note yet)"}
"""`;

    const chatHistory = (history || []).map((h: { role: string; text: string }) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemContext }],
        },
        {
          role: "model",
          parts: [{ text: "Got it! I've read through your notes and I'm ready to help. What would you like to know?" }],
        },
        ...chatHistory,
      ],
    });

    async function sendWithRetry(retries = 2): Promise<string> {
      try {
        const result = await chat.sendMessage(message);
        return result.response.text();
      } catch (err) {
        const isRateLimit = err instanceof Error && err.message.includes("429");
        if (isRateLimit) {
          throw new Error("RATE_LIMIT");
        }
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return sendWithRetry(retries - 1);
        }
        throw err;
      }
    }

    const responseText = await sendWithRetry();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Tutor chat error:", error);

    if (error instanceof Error && error.message === "RATE_LIMIT") {
      return NextResponse.json(
        { error: "Daily AI quota reached for now — try again later today or tomorrow." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}