/** Defines API routes for Roadmap Routes. */
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/roadmap.controller';

const router = Router();
router.use(requireAuth);
router.get('/', ctrl.listRoadmaps);
router.post('/generate', ctrl.generateRoadmap);
export default router;