/** Handles API requests for Auth Controller. */
import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import { isAdminClerkUser } from '../services/authorization.service';

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user || !req.clerkId) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const role = await isAdminClerkUser(req.clerkId) ? 'admin' : 'user';
  res.json({ success: true, data: { ...user, role } });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, image, college, year, branch, careerGoal, city, skills, languages, interests, githubUrl, leetcodeUrl, linkedinUrl, bio } = req.body;
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name, image, college, year, branch, careerGoal, city, skills, languages, interests, githubUrl, leetcodeUrl, linkedinUrl, bio },
  });
  res.json({ success: true, data: user });
});
