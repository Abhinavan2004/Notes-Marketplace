import { Request, Response } from 'express';
import { User } from '../models/User';
import { Note } from '../models/Note';
import { Order } from '../models/Order';
import { WithdrawalRequest } from '../models/WithdrawalRequest';

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('name email role isVerified createdAt');
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const toggleUserBan = async (req: Request, res: Response) => {
  try {
    const { userId, banned } = req.body as { userId: string; banned: boolean };
    const user = await User.findByIdAndUpdate(userId, { banned }, { new: true });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user' });
  }
};

export const listNotesAdmin = async (_req: Request, res: Response) => {
  try {
    const notes = await Note.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ notes });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const deleteNoteAdmin = async (req: Request, res: Response) => {
  try {
    const { noteId } = req.params;
    await Note.findByIdAndDelete(noteId);
    return res.json({ message: 'Note removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete note' });
  }
};

export const getPlatformRevenue = async (_req: Request, res: Response) => {
  try {
    const agg = await Order.aggregate([
      { $match: { status: 'paid' as const } },
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
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch revenue' });
  }
};

export const listWithdrawalRequests = async (_req: Request, res: Response) => {
  try {
    const requests = await WithdrawalRequest.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    return res.json({ requests });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch withdrawal requests' });
  }
};

