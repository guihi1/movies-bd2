import { Router } from 'express';
import { showAllWritersPage } from '../controllers/writers.controller.js'

const router = Router();

router.get('/', showAllWritersPage)

export default router;

