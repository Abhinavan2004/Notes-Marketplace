"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWithdrawalRequests = exports.getPlatformRevenue = exports.deleteNoteAdmin = exports.listNotesAdmin = exports.toggleUserBan = exports.listUsers = void 0;
const User_1 = require("../models/User");
const Note_1 = require("../models/Note");
const Order_1 = require("../models/Order");
const WithdrawalRequest_1 = require("../models/WithdrawalRequest");
const listUsers = async (_req, res) => {
    try {
        const users = await User_1.User.find().select('name email role isVerified createdAt');
        return res.json({ users });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch users' });
    }
};
exports.listUsers = listUsers;
const toggleUserBan = async (req, res) => {
    try {
        const { userId, banned } = req.body;
        const user = await User_1.User.findByIdAndUpdate(userId, { banned }, { new: true });
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update user' });
    }
};
exports.toggleUserBan = toggleUserBan;
const listNotesAdmin = async (_req, res) => {
    try {
        const notes = await Note_1.Note.find()
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });
        return res.json({ notes });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch notes' });
    }
};
exports.listNotesAdmin = listNotesAdmin;
const deleteNoteAdmin = async (req, res) => {
    try {
        const { noteId } = req.params;
        await Note_1.Note.findByIdAndDelete(noteId);
        return res.json({ message: 'Note removed' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete note' });
    }
};
exports.deleteNoteAdmin = deleteNoteAdmin;
const getPlatformRevenue = async (_req, res) => {
    try {
        const agg = await Order_1.Order.aggregate([
            { $match: { status: 'paid' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalOrders: { $sum: 1 },
                },
            },
        ]);
        const overview = agg[0] || { totalRevenue: 0, totalOrders: 0 };
        return res.json({ overview });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch revenue' });
    }
};
exports.getPlatformRevenue = getPlatformRevenue;
const listWithdrawalRequests = async (_req, res) => {
    try {
        const requests = await WithdrawalRequest_1.WithdrawalRequest.find()
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });
        return res.json({ requests });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch withdrawal requests' });
    }
};
exports.listWithdrawalRequests = listWithdrawalRequests;
