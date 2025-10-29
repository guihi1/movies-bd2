import { Router } from 'express';
import { showMoviePage } from '../controllers/movie-details.controller.js'

const router = Router();

router.get('/:id', showMoviePage)

export default router;

