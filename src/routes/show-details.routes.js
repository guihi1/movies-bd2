import { Router } from 'express';
import { showShowPage } from '../controllers/show-details.controller.js'

const router = Router();

router.get('/:id', showShowPage)

export default router;

