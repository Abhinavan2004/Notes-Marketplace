import { Router } from 'express';
import {
  deleteNoteAdmin,
  getPlatformRevenue,
  listNotesAdmin,
  listUsers,
  listWithdrawalRequests,
  toggleUserBan,
} from '../controllers/adminController';
import { requireAuth } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/users', listUsers);
router.post('/users/ban', toggleUserBan);
router.get('/notes', listNotesAdmin);
router.delete('/notes/:noteId', deleteNoteAdmin);
router.get('/revenue', getPlatformRevenue);
router.get('/withdrawals', listWithdrawalRequests);

export default router;

