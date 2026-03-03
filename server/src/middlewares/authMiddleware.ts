import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId);
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = { id: user.id, role: user.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

