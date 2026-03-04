import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { UserRole } from '../models/User';

export const requireRole =
  (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };

