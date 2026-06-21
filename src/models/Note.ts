import { Schema, models, model } from "mongoose";

export interface INote {
  userId: string;
  title: string;
  fileUrl: string;
  fileType: "image" | "pdf";
  extractedText?: string;
  ocrStatus: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["image", "pdf"],
    required: true,
  },
  extractedText: {
    type: String,
    default: "",
  },
  ocrStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = models.Note || model<INote>("Note", NoteSchema);

export default Note;