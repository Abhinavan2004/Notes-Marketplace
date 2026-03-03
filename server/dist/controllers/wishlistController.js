"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWishlist = exports.removeFromWishlist = exports.addToWishlist = void 0;
const User_1 = require("../models/User");
const addToWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { noteId } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user.id, { $addToSet: { wishlist: noteId } }, { new: true }).select('wishlist');
        return res.json({ wishlist: user?.wishlist || [] });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update wishlist' });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { noteId } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user.id, { $pull: { wishlist: noteId } }, { new: true }).select('wishlist');
        return res.json({ wishlist: user?.wishlist || [] });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update wishlist' });
    }
};
exports.removeFromWishlist = removeFromWishlist;
const getWishlist = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await User_1.User.findById(req.user.id)
            .select('wishlist')
            .populate('wishlist', 'title subject price averageRating previewUrl');
        return res.json({ wishlist: user?.wishlist || [] });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
};
exports.getWishlist = getWishlist;
