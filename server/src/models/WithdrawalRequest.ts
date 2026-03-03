import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface IWithdrawalRequest extends Document {
  seller: Types.ObjectId;
  amount: number;
  status: WithdrawalStatus;
  requestedAt: Date;
  processedAt?: Date;
  paymentDetails?: string;
}

const withdrawalSchema = new Schema<IWithdrawalRequest>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
      index: true,
    },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    paymentDetails: { type: String },
  },
  { timestamps: true },
);

export const WithdrawalRequest: Model<IWithdrawalRequest> = mongoose.model<IWithdrawalRequest>(
  'WithdrawalRequest',
  withdrawalSchema,
);

