import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'buyer' | 'seller' | 'both' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: UserRole;
  mobile?: string;
  profileImage?: string;
  isVerified: boolean;
  otpCode?: string;
  otpExpiresAt?: Date;
  tokenVersion: number;
  wishlist?: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String },
    googleId: { type: String, index: true },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'both', 'admin'],
      default: 'buyer',
    },
    mobile: { type: String },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
    tokenVersion: { type: Number, default: 0 },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
  },
  {
    timestamps: true,
  },
);

userSchema.index({ createdAt: -1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

