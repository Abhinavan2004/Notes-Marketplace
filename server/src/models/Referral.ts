import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type ReferralStatus = 'pending' | 'credited';

export interface IReferral extends Document {
  referrer: Types.ObjectId;
  referralCode: string;
  referredUser?: Types.ObjectId;
  rewardAmount: number;
  status: ReferralStatus;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referralCode: { type: String, required: true, unique: true },
    referredUser: { type: Schema.Types.ObjectId, ref: 'User' },
    rewardAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'credited'], default: 'pending' },
  },
  { timestamps: true },
);

export const Referral: Model<IReferral> = mongoose.model<IReferral>('Referral', referralSchema);

