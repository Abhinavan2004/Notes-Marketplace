import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type DiscountType = 'flat' | 'percentage';

export interface ICoupon extends Document {
  code: string;
  discountType: DiscountType;
  value: number;
  maxDiscount?: number;
  minOrderValue?: number;
  validFrom?: Date;
  validTo?: Date;
  usageLimit?: number;
  usedCount: number;
  applicableToNotes?: Types.ObjectId[];
  applicableToSellers?: Types.ObjectId[];
  isActive: boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    value: { type: Number, required: true },
    maxDiscount: { type: Number },
    minOrderValue: { type: Number },
    validFrom: { type: Date },
    validTo: { type: Date },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 },
    applicableToNotes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
    applicableToSellers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

couponSchema.index({ code: 1 });

export const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', couponSchema);

