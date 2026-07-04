import { Router } from 'express';
import * as ctrl from '../controllers/tech.controller';
const router = Router();
router.get('/', ctrl.listTechnologies);
router.get('/:slug', ctrl.getTechnology);
export default router;