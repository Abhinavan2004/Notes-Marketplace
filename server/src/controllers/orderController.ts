import https from 'https';
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Note } from '../models/Note';
import { Order } from '../models/Order';
import { razorpay, verifyWebhookSignature } from '../utils/razorpay';
import { Coupon } from '../models/Coupon';
import { sendPurchaseEmail } from '../utils/email';

const COMMISSION_PERCENT = Number(process.env.PLATFORM_COMMISSION_PERCENT || 10);

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { noteId, couponCode, referralCode } = req.body as {
      noteId: string;
      couponCode?: string;
      referralCode?: string;
    };

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const existingPaid = await Order.findOne({ buyer: req.user.id, note: noteId, status: 'paid' });
    if (existingPaid) {
      return res.status(400).json({ message: 'You have already purchased this note' });
    }

    let finalAmount = note.price;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), isActive: true });
      if (coupon) {
        const now = new Date();
        if (
          (!coupon.validFrom || coupon.validFrom <= now) &&
          (!coupon.validTo || coupon.validTo >= now) &&
          (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit)
        ) {
          let discount =
            coupon.discountType === 'flat'
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

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `note_${note.id}_${Date.now()}`,
    });

    const order = await Order.findOneAndUpdate(
      { buyer: req.user.id, note: noteId },
      {
        buyer: req.user.id,
        note: noteId,
        razorpayOrderId: razorpayOrder.id,
        amount: amount / 100,
        status: 'pending',
        couponCode,
        referralCodeUsed: referralCode,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(201).json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    const payload = JSON.stringify(req.body);

    if (!signature || !verifyWebhookSignature(payload, signature)) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const { event, payload: eventPayload } = req.body;

    if (event === 'payment.captured') {
      const payment = eventPayload.payment.entity;
      const razorpayOrderId = payment.order_id as string;
      const paymentId = payment.id as string;

      const order = await Order.findOneAndUpdate(
        { razorpayOrderId },
        {
          status: 'paid',
          paymentId,
          razorpaySignature: signature,
          purchasedAt: new Date(),
        },
        { new: true },
      ).populate('note buyer');

      if (order && order.note) {
        await Note.findByIdAndUpdate(order.note._id, { $inc: { totalSales: 1 } });
      }

      if (order && order.note && order.buyer) {
        const note = order.note as any;
        const buyer = order.buyer as any;
        await sendPurchaseEmail(buyer.email, note.title, order.amount);
      }
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(500).json({ message: 'Webhook handling failed' });
  }
};

export const listMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const orders = await Order.find({ buyer: req.user.id })
      .populate('note', 'title subject price')
      .sort({ createdAt: -1 });

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const downloadNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { noteId } = req.params;

    const order = await Order.findOne({ buyer: req.user.id, note: noteId, status: 'paid' }).populate(
      'note',
    );
    if (!order || !order.note) {
      return res.status(403).json({ message: 'You have not purchased this note' });
    }

    const note = order.note as any;
    const fileUrl = note.fileUrl as string;

    res.setHeader('Content-Disposition', `attachment; filename="${note.title}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');

    https.get(fileUrl, (fileRes) => {
      fileRes.pipe(res);
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to download note' });
  }
};

