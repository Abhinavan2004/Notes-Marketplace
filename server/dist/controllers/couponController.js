"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoupon = void 0;
const Coupon_1 = require("../models/Coupon");
const validateCoupon = async (req, res) => {
    try {
        const { code, amount } = req.query;
        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }
        const coupon = await Coupon_1.Coupon.findOne({ code: String(code).toUpperCase(), isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        const now = new Date();
        if ((coupon.validFrom && coupon.validFrom > now) || (coupon.validTo && coupon.validTo < now)) {
            return res.status(400).json({ message: 'Coupon is not valid currently' });
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }
        const orderAmount = amount ? Number(amount) : undefined;
        if (coupon.minOrderValue && orderAmount && orderAmount < coupon.minOrderValue) {
            return res
                .status(400)
                .json({ message: `Minimum order value is ${coupon.minOrderValue.toFixed(2)}` });
        }
        return res.json({
            code: coupon.code,
            discountType: coupon.discountType,
            value: coupon.value,
            maxDiscount: coupon.maxDiscount,
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to validate coupon' });
    }
};
exports.validateCoupon = validateCoupon;
