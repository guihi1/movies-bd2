import express from 'express';
import { showEpisodePage } from '../controllers/episodes.controller.js';

const router = express.Router();

router.get('/:showId/episodes/:episodeId', showEpisodePage);

export default router;