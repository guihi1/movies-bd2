import { Router } from 'express';
import { showProducerPage } from '../controllers/producer-details.controller.js'

const router = Router();

router.get('/:id', showProducerPage)

export default router;

