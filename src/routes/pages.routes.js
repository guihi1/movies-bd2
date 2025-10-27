import { Router } from 'express';
import { showHomePage } from '../controllers/pages.controller.js';

const router = Router();

router.get('/', showHomePage);

export default router;
