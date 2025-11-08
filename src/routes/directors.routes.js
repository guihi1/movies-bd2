import { Router } from 'express';
import { showAllDirectorsPage } from '../controllers/directors.controller.js'

const router = Router();

router.get('/', showAllDirectorsPage)

export default router;

