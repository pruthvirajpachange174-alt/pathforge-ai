import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const listPlacementExams = asyncHandler(async (req: Request, res: Response) => {
  const { q, difficulty } = req.query;
  const exams = await prisma.placementExam.findMany({
    where: {
      ...(q ? { company: { contains: String(q), mode: 'insensitive' } } : {}),
      ...(difficulty ? { difficulty: String(difficulty) } : {}),
    },
    orderBy: { company: 'asc' },
  });
  res.json({ success: true, data: exams });
});

export const getPlacementExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await prisma.placementExam.findUnique({ where: { slug: req.params.slug } });
  if (!exam) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: exam });
});

export const listGovernmentExams = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query;
  const exams = await prisma.governmentExam.findMany({
    where: category ? { category: String(category) } : undefined,
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: exams });
});

export const getGovernmentExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await prisma.governmentExam.findUnique({ where: { slug: req.params.slug } });
  if (!exam) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: exam });
});