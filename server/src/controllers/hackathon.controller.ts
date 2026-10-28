/** Handles API requests for Hackathon Controller. */
import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { recommendHackathons } from '../services/recommendation.service';
import { getUserProfile } from '../services/memory.service';

export const listHackathons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, q, difficulty } = req.query;
  const list = await prisma.hackathon.findMany({
    where: {
      ...(type ? { type: String(type) } : {}),
      ...(difficulty ? { difficulty: String(difficulty) } : {}),
      ...(q ? { name: { contains: String(q), mode: 'insensitive' } } : {}),
    },
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: list });
});

export const getHackathon = asyncHandler(async (req: AuthRequest, res: Response) => {
  const h = await prisma.hackathon.findUnique({ where: { slug: String(req.params.slug) } });
  if (!h) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: h });
});

export const getRecommendedHackathons = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = req.userId ? await getUserProfile(req.userId) : null;
  if (!profile) return res.json({ success: true, data: [] });
  const recs = await recommendHackathons(profile);
  res.json({ success: true, data: recs });
});