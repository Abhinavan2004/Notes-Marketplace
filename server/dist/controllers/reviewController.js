"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReviewsForNote = exports.createOrUpdateReview = void 0;
const Review_1 = require("../models/Review");
const Order_1 = require("../models/Order");
const Note_1 = require("../models/Note");
const createOrUpdateReview = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { noteId, rating, comment } = req.body;
        const hasOrder = await Order_1.Order.findOne({ buyer: req.user.id, note: noteId, status: 'paid' });
        if (!hasOrder) {
            return res.status(403).json({ message: 'You must purchase this note before reviewing' });
        }
        const review = await Review_1.Review.findOneAndUpdate({ buyer: req.user.id, note: noteId }, { rating, comment }, { upsert: true, new: true, setDefaultsOnInsert: true });
        const stats = await Review_1.Review.aggregate([
            { $match: { note: review.note } },
            {
                $group: {
                    _id: '$note',
                    averageRating: { $avg: '$rating' },
                    ratingsCount: { $sum: 1 },
                },
            },
        ]);
        if (stats.length > 0) {
            const { averageRating, ratingsCount } = stats[0];
            await Note_1.Note.findByIdAndUpdate(review.note, { averageRating, ratingsCount });
        }
        return res.status(201).json({ review });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to save review' });
    }
};
exports.createOrUpdateReview = createOrUpdateReview;
const listReviewsForNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const reviews = await Review_1.Review.find({ note: noteId })
            .populate('buyer', 'name')
            .sort({ createdAt: -1 });
        return res.json({ reviews });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch reviews' });
    }
};
exports.listReviewsForNote = listReviewsForNote;
