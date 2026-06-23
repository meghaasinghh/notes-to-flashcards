import { Schema, models, model } from "mongoose";

export interface IReviewLog {
  userId: string;
  flashcardId: string;
  quality: number;
  reviewedAt: Date;
}

const ReviewLogSchema = new Schema<IReviewLog>({
  userId: {
    type: String,
    required: true,
  },
  flashcardId: {
    type: String,
    required: true,
  },
  quality: {
    type: Number,
    required: true,
  },
  reviewedAt: {
    type: Date,
    default: Date.now,
  },
});

const ReviewLog = models.ReviewLog || model<IReviewLog>("ReviewLog", ReviewLogSchema);

export default ReviewLog;