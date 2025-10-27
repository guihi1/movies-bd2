import { Router } from 'express';
import { showActorPage } from '../controllers/actors.controller.js'

const router = Router();

router.get('/:id', showActorPage)

export default router;

