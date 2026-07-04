import { Router } from 'express';
import * as ctrl from '../controllers/exam.controller';

const router = Router();
router.get('/placement', ctrl.listPlacementExams);
router.get('/placement/:slug', ctrl.getPlacementExam);
router.get('/government', ctrl.listGovernmentExams);
router.get('/government/:slug', ctrl.getGovernmentExam);
export default router;