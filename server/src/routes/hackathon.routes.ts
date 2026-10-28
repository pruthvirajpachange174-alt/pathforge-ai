/** Defines API routes for Hackathon Routes. */
import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/hackathon.controller';

const router = Router();
router.get('/', optionalAuth, ctrl.listHackathons);
router.get('/recommended', requireAuth, ctrl.getRecommendedHackathons);
router.get('/:slug', ctrl.getHackathon);
export default router;