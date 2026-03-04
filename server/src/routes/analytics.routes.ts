import { Router } from 'express';
import { getSellerStats } from '../controllers/analyticsController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.get('/seller', requireAuth, requireRole('seller', 'both'), getSellerStats);

export default router;

