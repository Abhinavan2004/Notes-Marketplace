import { Router } from 'express';
import { validateCoupon } from '../controllers/couponController';

const router = Router();

router.get('/validate', validateCoupon);

export default router;

