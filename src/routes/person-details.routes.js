import { Router } from 'express';
import { showPersonPage } from '../controllers/person-details.controller.js'

const router = Router();

router.get('/:id', showPersonPage)

export default router;