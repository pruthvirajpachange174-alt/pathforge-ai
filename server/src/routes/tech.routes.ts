/** Defines API routes for Tech Routes. */
import { Router } from 'express';
import * as ctrl from '../controllers/tech.controller';
const router = Router();
router.get('/', ctrl.listTechnologies);
router.get('/careers', ctrl.listTechCareers);
router.get('/:slug', ctrl.getTechnology);
export default router;
