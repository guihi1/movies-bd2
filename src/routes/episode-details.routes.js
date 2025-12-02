import express from 'express';
import { showEpisodePage } from '../controllers/episode-details.controller.js';

const router = express.Router();

router.get('/:id', showEpisodePage);

export default router;