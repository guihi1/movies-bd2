import { Router } from 'express';
import { showWriterPage } from '../controllers/writer-details.controller.js'

const router = Router();

router.get('/:id', showWriterPage)

export default router;

