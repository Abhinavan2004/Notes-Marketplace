import { Router } from 'express';
import { createNote, getNoteById, listNotes } from '../controllers/noteController';
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadPdfMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

router.get('/', listNotes);
router.get('/:id', getNoteById);
router.post(
  '/',
  requireAuth,
  uploadPdfMiddleware.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'preview', maxCount: 1 },
  ]),
  createNote,
);

export default router;

