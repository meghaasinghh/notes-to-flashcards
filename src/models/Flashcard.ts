import { Schema, models, model } from "mongoose";

export interface IFlashcard {
  userId: string;
  noteId: string;
  type: "qa" | "fill-blank" | "mcq";
  question: string;
  answer: string;
  options?: string[];
  difficulty: "easy" | "medium" | "hard";
  explanation?: string;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  createdAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>({
  userId: {
    type: String,
    required: true,
  },
  noteId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["qa", "fill-blank", "mcq"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: undefined,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  explanation: {
    type: String,
    default: "",
  },
 createdAt: {
    type: Date,
    default: Date.now,
  },
  easinessFactor: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 0,
  },
  repetitions: {
    type: Number,
    default: 0,
  },
  nextReviewDate: {
    type: Date,
    default: Date.now,
  },
});
const Flashcard = models.Flashcard || model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;