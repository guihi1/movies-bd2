import { Router } from 'express';
import { showMoviePage } from '../controllers/movies.controller.js'

const router = Router();

router.get('/:id', showMoviePage)

export default router;

