import { Router } from 'express';
import { showAllShowsPage } from '../controllers/shows.controller.js'

const router = Router();

router.get('/shows', showAllShowsPage)

export default router;

