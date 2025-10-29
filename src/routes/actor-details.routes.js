import { Router } from 'express';
import { showActorPage } from '../controllers/actor-details.controller.js'

const router = Router();

router.get('/:id', showActorPage)

export default router;

