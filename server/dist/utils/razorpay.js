"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyWebhookSignature = exports.razorpay = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    // eslint-disable-next-line no-console
    console.warn('Razorpay keys are not fully configured');
}
exports.razorpay = new razorpay_1.default({
    key_id: RAZORPAY_KEY_ID || '',
    key_secret: RAZORPAY_KEY_SECRET || '',
});
const verifyWebhookSignature = (payload, signature) => {
    if (!RAZORPAY_WEBHOOK_SECRET) {
        throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured');
    }
    const expected = crypto_1.default.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(payload).digest('hex');
    return expected === signature;
};
exports.verifyWebhookSignature = verifyWebhookSignature;
