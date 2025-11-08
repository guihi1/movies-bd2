import { Router } from 'express';
import { showAllProducersPage } from '../controllers/producers.controller.js'

const router = Router();

router.get('/', showAllProducersPage)

export default router;

