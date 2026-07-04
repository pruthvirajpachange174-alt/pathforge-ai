import { Router } from 'express';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import examRoutes from './exam.routes';
import techRoutes from './tech.routes';
import languageRoutes from './language.routes';
import hackathonRoutes from './hackathon.routes';
import roadmapRoutes from './roadmap.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/exams', examRoutes);
router.use('/tech', techRoutes);
router.use('/languages', languageRoutes);
router.use('/hackathons', hackathonRoutes);
router.use('/roadmaps', roadmapRoutes);

export default router;