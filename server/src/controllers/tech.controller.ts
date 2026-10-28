/** Handles API requests for Tech Controller. */
import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const listTechnologies = asyncHandler(async (req: Request, res: Response) => {
  const { q, category } = req.query;
  const techs = await prisma.technology.findMany({
    where: {
      ...(q ? { name: { contains: String(q), mode: 'insensitive' } } : {}),
      ...(category ? { category: String(category) } : {}),
    },
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: techs });
});

export const getTechnology = asyncHandler(async (req: Request, res: Response) => {
  const tech = await prisma.technology.findUnique({ where: { slug: String(req.params.slug) } });
  if (!tech) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: tech });
});

export const listTechCareers = asyncHandler(async (_req: Request, res: Response) => {
  const careers = await prisma.techCareer.findMany({
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: careers });
});
