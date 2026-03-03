import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', requireAuth, getWishlist);
router.post('/add', requireAuth, addToWishlist);
router.post('/remove', requireAuth, removeFromWishlist);

export default router;

