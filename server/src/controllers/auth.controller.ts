import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, year, branch, skills, languages, interests, githubUrl, leetcodeUrl, linkedinUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, year, branch, skills, languages, interests, githubUrl, leetcodeUrl, linkedinUrl },
  });
  res.json({ success: true, data: user });
});