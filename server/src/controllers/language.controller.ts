import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const listLanguages = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const langs = await prisma.language.findMany({
    where: q ? { name: { contains: String(q), mode: 'insensitive' } } : undefined,
    orderBy: { demand: 'desc' },
  });
  res.json({ success: true, data: langs });
});

export const getLanguage = asyncHandler(async (req: Request, res: Response) => {
  const lang = await prisma.language.findUnique({ where: { slug: req.params.slug } });
  if (!lang) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: lang });
});