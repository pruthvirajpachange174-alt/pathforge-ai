import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { chatLimiter } from '../middleware/rateLimit.middleware';
import * as ctrl from '../controllers/chat.controller';

const router = Router();
router.use(requireAuth);

router.get('/conversations', ctrl.listConversations);
router.post('/conversations', ctrl.createConversation);
router.get('/conversations/:id', ctrl.getConversation);
router.delete('/conversations/:id', ctrl.deleteConversation);
router.post('/message', chatLimiter, ctrl.sendMessage);
router.post('/stream', chatLimiter, ctrl.streamMessage);

export default router;