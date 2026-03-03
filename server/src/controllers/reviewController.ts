import { AuthRequest } from '../middlewares/authMiddleware';
import { Response, Request } from 'express';
import { Review } from '../models/Review';
import { Order } from '../models/Order';
import { Note } from '../models/Note';

export const createOrUpdateReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { noteId, rating, comment } = req.body as {
      noteId: string;
      rating: number;
      comment?: string;
    };

    const hasOrder = await Order.findOne({ buyer: req.user.id, note: noteId, status: 'paid' });
    if (!hasOrder) {
      return res.status(403).json({ message: 'You must purchase this note before reviewing' });
    }

    const review = await Review.findOneAndUpdate(
      { buyer: req.user.id, note: noteId },
      { rating, comment },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const stats = await Review.aggregate([
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
      await Note.findByIdAndUpdate(review.note, { averageRating, ratingsCount });
    }

    return res.status(201).json({ review });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save review' });
  }
};

export const listReviewsForNote = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    const reviews = await Review.find({ note: noteId })
      .populate('buyer', 'name')
      .sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

