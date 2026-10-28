/** Handles API requests for Admin Placement Controller. */
import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * GET /api/v1/admin/placement
 */
export const getPlacementExams = asyncHandler(
  async (_req: Request, res: Response) => {
    const exams = await prisma.placementExam.findMany({
      orderBy: {
        company: "asc",
      },
    });

    res.json({
      success: true,
      data: exams,
    });
  }
);

/**
 * POST /api/v1/admin/placement
 */
export const createPlacementExam = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      company,
      slug,
      logo,
      eligibility,
      examPattern,
      difficulty,
      topics,
      roadmap,
      previousTrends,
      resources,
      expectedSalary,
      hiringProcess,
      tags,
    } = req.body;

    const exam = await prisma.placementExam.create({
      data: {
        company,
        slug,
        logo,
        eligibility,
        examPattern,
        difficulty,
        topics,
        roadmap,
        previousTrends,
        resources,
        expectedSalary,
        hiringProcess,
        tags,
      },
    });

    res.status(201).json({
      success: true,
      message: "Placement exam created successfully",
      data: exam,
    });
  }
);

/**
 * PUT /api/v1/admin/placement/:slug
 */
export const updatePlacementExam = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = String(req.params.slug);

    const exam = await prisma.placementExam.update({
      where: {
        slug,
      },
      data: req.body,
    });

    res.json({
      success: true,
      message: "Placement exam updated successfully",
      data: exam,
    });
  }
);

/**
 * DELETE /api/v1/admin/placement/:slug
 */
export const deletePlacementExam = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = String(req.params.slug);

    await prisma.placementExam.delete({
      where: {
        slug,
      },
    });

    res.json({
      success: true,
      message: "Placement exam deleted successfully",
    });
  }
);