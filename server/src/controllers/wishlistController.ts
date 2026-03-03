import { AuthRequest } from '../middlewares/authMiddleware';
import { Response } from 'express';
import { User } from '../models/User';

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { noteId } = req.body as { noteId: string };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: noteId } },
      { new: true },
    ).select('wishlist');

    return res.json({ wishlist: user?.wishlist || [] });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { noteId } = req.body as { noteId: string };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: noteId } },
      { new: true },
    ).select('wishlist');

    return res.json({ wishlist: user?.wishlist || [] });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update wishlist' });
  }
};

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user.id)
      .select('wishlist')
      .populate('wishlist', 'title subject price averageRating previewUrl');

    return res.json({ wishlist: user?.wishlist || [] });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

