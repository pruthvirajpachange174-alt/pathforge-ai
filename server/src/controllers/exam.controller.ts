/** Handles API requests for Exam Controller. */
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
  const exam = await prisma.placementExam.findUnique({ where: { slug: String(req.params.slug) } });
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
  const exam = await prisma.governmentExam.findUnique({ where: { slug: String(req.params.slug) } });
  if (!exam) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true, data: exam });
});

/**
 * POST /api/v1/exams/government
 */
export const createGovernmentExam = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      slug,
      category,
      whoShouldTake,
      eligibility,
      pattern,
      schedule,
      syllabus,
      difficulty,
      opportunities,
      officialUrl,
      tags,
    } = req.body;

    if (!name || !slug || !category) {
      return res.status(400).json({
        success: false,
        message: "name, slug, and category are required",
      });
    }

    const exam = await prisma.governmentExam.create({
      data: {
        name,
        slug,
        category,
        whoShouldTake: whoShouldTake ?? "",
        eligibility: eligibility ?? "",
        pattern: pattern ?? {},
        schedule: schedule ?? {},
        syllabus: syllabus ?? {},
        difficulty: difficulty ?? "Medium",
        opportunities: opportunities ?? "",
        officialUrl,
        tags: tags ?? [],
      },
    });

    return res.status(201).json({
      success: true,
      message: "Government exam created successfully",
      data: exam,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create government exam",
    });
  }
};

/**
 * PUT /api/v1/exams/government/:slug
 */
export const updateGovernmentExam = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug);

    const exam = await prisma.governmentExam.update({
      where: {
        slug,
      },
      data: req.body,
    });

    return res.json({
      success: true,
      message: "Government exam updated successfully",
      data: exam,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update government exam",
    });
  }
};

/**
 * DELETE /api/v1/exams/government/:slug
 */
export const deleteGovernmentExam = async (
  req: Request,
  res: Response
) => {
  try {
    const slug = String(req.params.slug);

    await prisma.governmentExam.delete({
      where: {
        slug,
      },
    });

    return res.json({
      success: true,
      message: "Government exam deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete government exam",
    });
  }
};
