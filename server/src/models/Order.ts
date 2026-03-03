import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends Document {
  buyer: Types.ObjectId;
  note: Types.ObjectId;
  paymentId?: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  amount: number;
  status: OrderStatus;
  purchasedAt?: Date;
  couponCode?: string;
  referralCodeUsed?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    paymentId: { type: String },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    purchasedAt: { type: Date },
    couponCode: { type: String },
    referralCodeUsed: { type: String },
  },
  { timestamps: true },
);

orderSchema.index({ buyer: 1, note: 1 }, { unique: true });

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

