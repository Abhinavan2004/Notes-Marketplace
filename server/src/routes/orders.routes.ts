import { Router } from 'express';
import { createOrder, downloadNote, handleWebhook, listMyOrders } from '../controllers/orderController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', requireAuth, createOrder);
router.get('/', requireAuth, listMyOrders);
router.get('/:noteId/download', requireAuth, downloadNote);
router.post('/webhook', handleWebhook);

export default router;

