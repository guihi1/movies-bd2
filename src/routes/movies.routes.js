import { Router } from 'express';
import { showAllMoviesPage } from '../controllers/movies.controller.js'

const router = Router();

router.get('/movies', showAllMoviesPage)

export default router;

