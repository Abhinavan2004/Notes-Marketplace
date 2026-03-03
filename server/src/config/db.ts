import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // Intentionally throw early so misconfiguration is obvious in logs
  throw new Error('MONGODB_URI is not defined in environment variables');
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error', error);
    process.exit(1);
  }
};

