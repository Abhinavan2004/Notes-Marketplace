import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminConfig extends Document {
  platformCommissionPercent: number;
}

const adminConfigSchema = new Schema<IAdminConfig>({
  platformCommissionPercent: { type: Number, default: 10 },
});

export const AdminConfig: Model<IAdminConfig> = mongoose.model<IAdminConfig>(
  'AdminConfig',
  adminConfigSchema,
);

