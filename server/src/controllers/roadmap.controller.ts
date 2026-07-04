import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { generateChatCompletion } from '../services/ai.service';
import { buildRoadmapPrompt } from '../prompts/roadmap.prompt';
import { getUserProfile } from '../services/memory.service';

export const generateRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ message: 'goal required' });

  const profile = req.userId ? await getUserProfile(req.userId) : {};
  const prompt = buildRoadmapPrompt(profile, goal);

  const raw = await generateChatCompletion({
    system: 'You are a JSON-only career roadmap generator. Output ONLY valid JSON.',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    maxTokens: 3500,
  });

  let content: any;
  try {
    content = JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return res.status(500).json({ message: 'AI returned invalid JSON', raw });
  }

  const roadmap = await prisma.roadmap.create({
    data: { userId: req.userId, title: content.title || goal, goal, content },
  });
  res.json({ success: true, data: roadmap });
});

export const listRoadmaps = asyncHandler(async (req: AuthRequest, res: Response) => {
  const list = await prisma.roadmap.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: list });
});