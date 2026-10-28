/** Defines API routes for Auth Routes. */
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/auth.controller';

const router = Router();
router.get('/me', requireAuth, ctrl.getMe);
router.put('/profile', requireAuth, ctrl.updateProfile);
export default router;