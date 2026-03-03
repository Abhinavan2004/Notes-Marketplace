import { Router } from 'express';
import { createOrUpdateReview, listReviewsForNote } from '../controllers/reviewController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', requireAuth, createOrUpdateReview);
router.get('/:noteId', listReviewsForNote);

export default router;

