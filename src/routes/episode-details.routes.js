import express from 'express';
import { showEpisodePage } from '../controllers/episode-details.controller.js';

const router = express.Router();

router.get('/:showId/episode/:episodeId', showEpisodePage);

export default router;