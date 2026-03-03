import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReview extends Document {
  buyer: Types.ObjectId;
  note: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true },
);

reviewSchema.index({ buyer: 1, note: 1 }, { unique: true });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

