"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    // Intentionally throw early so misconfiguration is obvious in logs
    throw new Error('MONGODB_URI is not defined in environment variables');
}
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        // eslint-disable-next-line no-console
        console.log('MongoDB connected');
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error('MongoDB connection error', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
