import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Please add your GEMINI_API_KEY to .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateFlashcardsFromText(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are an expert study assistant. Below is raw OCR-extracted text from a student's handwritten notes. The OCR may contain minor errors — use your judgment to infer the intended meaning.

Your task: generate a JSON array of flashcards covering the key concepts in this text. Create a mix of:
- "qa" (question and answer)
- "fill-blank" (a sentence with one key term replaced by "____", and the answer is the missing term)
- "mcq" (a question with 4 options, one correct answer)

Each flashcard must follow this exact JSON shape:
{
  "type": "qa" | "fill-blank" | "mcq",
  "question": "string",
  "answer": "string",
  "options": ["string", "string", "string", "string"] (ONLY for mcq, omit for other types),
  "difficulty": "easy" | "medium" | "hard",
  "explanation": "a short one-sentence explanation of the answer"
}

Generate between 5 and 10 flashcards depending on how much content is in the text. Return ONLY a valid JSON array, with no markdown formatting, no code fences, and no extra commentary.

Notes text:
"""
${text}
"""`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Strip any accidental markdown code fences just in case
  const cleaned = responseText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }
}