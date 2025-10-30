import { Router } from 'express';
import { showAllMoviesPage } from '../controllers/movies.controller.js'

const router = Router();

router.get('/', showAllMoviesPage)

export default router;

