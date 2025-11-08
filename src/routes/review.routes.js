import { Router } from 'express';
import { handleReview } from '../controllers/review.controller.js';

const router = Router();

router.post('/create', handleReview);

export default router;
