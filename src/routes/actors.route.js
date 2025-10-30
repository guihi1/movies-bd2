import { Router } from 'express';
import { showAllActorsPage } from '../controllers/actors.controller.js'

const router = Router();

router.get('/actors', showAllActorsPage)

export default router;

