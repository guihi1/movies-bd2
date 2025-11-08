import { Router } from 'express';
import { showDirectorPage } from '../controllers/director-details.controller.js'

const router = Router();

router.get('/:id', showDirectorPage)

export default router;

