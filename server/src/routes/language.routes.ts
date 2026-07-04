import { Router } from 'express';
import * as ctrl from '../controllers/language.controller';
const router = Router();
router.get('/', ctrl.listLanguages);
router.get('/:slug', ctrl.getLanguage);
export default router;