"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadNote = exports.listMyOrders = exports.handleWebhook = exports.createOrder = void 0;
const https_1 = __importDefault(require("https"));
const Note_1 = require("../models/Note");
const Order_1 = require("../models/Order");
const razorpay_1 = require("../utils/razorpay");
const Coupon_1 = require("../models/Coupon");
const email_1 = require("../utils/email");
const COMMISSION_PERCENT = Number(process.env.PLATFORM_COMMISSION_PERCENT || 10);
const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { noteId, couponCode, referralCode } = req.body;
        const note = await Note_1.Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const existingPaid = await Order_1.Order.findOne({ buyer: req.user.id, note: noteId, status: 'paid' });
        if (existingPaid) {
            return res.status(400).json({ message: 'You have already purchased this note' });
        }
        let finalAmount = note.price;
        if (couponCode) {
            const coupon = await Coupon_1.Coupon.findOne({ code: String(couponCode).toUpperCase(), isActive: true });
            if (coupon) {
                const now = new Date();
                if ((!coupon.validFrom || coupon.validFrom <= now) &&
                    (!coupon.validTo || coupon.validTo >= now) &&
                    (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)) {
                    let discount = coupon.discountType === 'flat'
                        ? coupon.value
                        : (finalAmount * coupon.value) / 100;
                    if (coupon.maxDiscount) {
                        discount = Math.min(discount, coupon.maxDiscount);
                    }
                    finalAmount = Math.max(0, finalAmount - discount);
                }
            }
        }
        const amount = Math.round(finalAmount * 100);
        const razorpayOrder = await razorpay_1.razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `note_${note.id}_${Date.now()}`,
        });
        const order = await Order_1.Order.findOneAndUpdate({ buyer: req.user.id, note: noteId }, {
            buyer: req.user.id,
            note: noteId,
            razorpayOrderId: razorpayOrder.id,
            amount: amount / 100,
            status: 'pending',
            couponCode,
            referralCodeUsed: referralCode,
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return res.status(201).json({
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to create order' });
    }
};
exports.createOrder = createOrder;
const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const payload = JSON.stringify(req.body);
        if (!signature || !(0, razorpay_1.verifyWebhookSignature)(payload, signature)) {
            return res.status(400).json({ message: 'Invalid webhook signature' });
        }
        const { event, payload: eventPayload } = req.body;
        if (event === 'payment.captured') {
            const payment = eventPayload.payment.entity;
            const razorpayOrderId = payment.order_id;
            const paymentId = payment.id;
            const order = await Order_1.Order.findOneAndUpdate({ razorpayOrderId }, {
                status: 'paid',
                paymentId,
                razorpaySignature: signature,
                purchasedAt: new Date(),
            }, { new: true }).populate('note buyer');
            if (order && order.note) {
                await Note_1.Note.findByIdAndUpdate(order.note._id, { $inc: { totalSales: 1 } });
            }
            if (order && order.note && order.buyer) {
                const note = order.note;
                const buyer = order.buyer;
                await (0, email_1.sendPurchaseEmail)(buyer.email, note.title, order.amount);
            }
        }
        return res.json({ received: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Webhook handling failed' });
    }
};
exports.handleWebhook = handleWebhook;
const listMyOrders = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const orders = await Order_1.Order.find({ buyer: req.user.id })
            .populate('note', 'title subject price')
            .sort({ createdAt: -1 });
        return res.json({ orders });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch orders' });
    }
};
exports.listMyOrders = listMyOrders;
const downloadNote = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { noteId } = req.params;
        const order = await Order_1.Order.findOne({ buyer: req.user.id, note: noteId, status: 'paid' }).populate('note');
        if (!order || !order.note) {
            return res.status(403).json({ message: 'You have not purchased this note' });
        }
        const note = order.note;
        const fileUrl = note.fileUrl;
        res.setHeader('Content-Disposition', `attachment; filename="${note.title}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        https_1.default.get(fileUrl, (fileRes) => {
            fileRes.pipe(res);
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to download note' });
    }
};
exports.downloadNote = downloadNote;
