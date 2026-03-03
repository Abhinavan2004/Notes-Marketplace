import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  subject: string;
  description: string;
  price: number;
  fileUrl: string;
  filePublicId: string;
  previewUrl?: string;
  previewPublicId?: string;
  seller: Types.ObjectId;
  totalSales: number;
  averageRating: number;
  ratingsCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    previewUrl: { type: String },
    previewPublicId: { type: String },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    totalSales: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    tags: [{ type: String, index: true }],
  },
  { timestamps: true },
);

noteSchema.index({ createdAt: -1 });
noteSchema.index({ subject: 1, price: 1 });
noteSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });

export const Note: Model<INote> = mongoose.model<INote>('Note', noteSchema);

