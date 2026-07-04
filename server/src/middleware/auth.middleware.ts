import { Request, Response, NextFunction } from 'express';
import { clerkClient, verifyToken } from '@clerk/clerk-sdk-node';
import { env } from '../config/env';
import { prisma } from '../config/db';

export interface AuthRequest extends Request {
  userId?: string;
  clerkId?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    const clerkId = payload.sub;

    let user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
        },
      });
    }

    req.userId = user.id;
    req.clerkId = clerkId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Optional auth — allows anonymous but attaches user if logged in
export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next();
  try {
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    const user = await prisma.user.findUnique({ where: { clerkId: payload.sub } });
    if (user) {
      req.userId = user.id;
      req.clerkId = payload.sub;
    }
  } catch { /* ignore */ }
  next();
};