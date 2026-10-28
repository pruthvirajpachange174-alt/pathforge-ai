import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const listIndiaDirectoryEntries = asyncHandler(async (_req: Request, res: Response) => {
  const entries = await prisma.indiaDirectoryEntry.findMany({
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
  });

  res.json({ success: true, data: entries });
});
