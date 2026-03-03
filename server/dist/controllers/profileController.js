"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await User_1.User.findById(req.user.id).select('-password -otpCode -otpExpiresAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch profile' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { name, mobile, role } = req.body;
        const update = {};
        if (name)
            update.name = name;
        if (mobile)
            update.mobile = mobile;
        if (role)
            update.role = role;
        const user = await User_1.User.findByIdAndUpdate(req.user.id, update, {
            new: true,
            runValidators: true,
            select: '-password -otpCode -otpExpiresAt',
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
