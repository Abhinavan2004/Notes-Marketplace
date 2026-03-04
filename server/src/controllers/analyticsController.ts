import { AuthRequest } from '../middlewares/authMiddleware';
import { Response } from 'express';
import { Order } from '../models/Order';
import { Note } from '../models/Note';

export const getSellerStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const sellerId = req.user.id;

    const [notesCount, salesAgg] = await Promise.all([
      Note.countDocuments({ seller: sellerId }),
      Order.aggregate([
        { $match: { status: 'paid' as const } },
        {
          $lookup: {
            from: 'notes',
            localField: 'note',
            foreignField: '_id',
            as: 'note',
          },
        },
        { $unwind: '$note' },
        { $match: { 'note.seller': new (require('mongoose').Types.ObjectId)(sellerId) } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const overview = salesAgg[0] || { totalSales: 0, totalRevenue: 0 };

    const revenuePerNote = await Order.aggregate([
      { $match: { status: 'paid' as const } },
      {
        $lookup: {
          from: 'notes',
          localField: 'note',
          foreignField: '_id',
          as: 'note',
        },
      },
      { $unwind: '$note' },
      { $match: { 'note.seller': new (require('mongoose').Types.ObjectId)(sellerId) } },
      {
        $group: {
          _id: '$note._id',
          title: { $first: '$note.title' },
          sales: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const monthlySales = await Order.aggregate([
      { $match: { status: 'paid' as const } },
      {
        $lookup: {
          from: 'notes',
          localField: 'note',
          foreignField: '_id',
          as: 'note',
        },
      },
      { $unwind: '$note' },
      { $match: { 'note.seller': new (require('mongoose').Types.ObjectId)(sellerId) } },
      {
        $group: {
          _id: { year: { $year: '$purchasedAt' }, month: { $month: '$purchasedAt' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return res.json({
      overview: {
        notesCount,
        totalSales: overview.totalSales,
        totalRevenue: overview.totalRevenue,
      },
      revenuePerNote,
      monthlySales,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch seller stats' });
  }
};

