import { Router } from 'express';
import { showShowPage } from '../controllers/shows.controller.js'

const router = Router();

router.get('/:id', showShowPage)

export default router;

