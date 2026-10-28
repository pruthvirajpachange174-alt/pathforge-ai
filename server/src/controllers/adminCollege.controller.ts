/** Handles API requests for Admin College Controller. */
import { Request, Response } from "express";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";

export const getColleges = asyncHandler(async (req: Request, res: Response) => {
  const colleges = await prisma.college.findMany({
    orderBy: {
      name: "asc",
    },
  });

  res.json({
    success: true,
    data: colleges,
  });
});

export const createCollege = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    city,
    image,
    website,
    ranking,
    description,
    courses,
    facilities,
  } = req.body;

  if (!name || !city) {
    return res.status(400).json({
      success: false,
      message: "name and city are required",
    });
  }

  const college = await prisma.college.create({
    data: {
      name,
      city,
      image: image ?? null,
      website: website ?? null,
      ranking: ranking ?? null,
      description: description ?? null,
      courses: courses ?? [],
      facilities: facilities ?? [],
    },
  });

  res.json({
    success: true,
    data: college,
  });
});

export const updateCollege = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const {
    name,
    city,
    image,
    website,
    ranking,
    description,
    courses,
    facilities,
  } = req.body;

  const college = await prisma.college.update({
    where: {
      id,
    },
    data: {
      name,
      city,
      image,
      website,
      ranking,
      description,
      courses,
      facilities,
    },
  });

  res.json({
    success: true,
    data: college,
  });
});

export const deleteCollege = asyncHandler(async (req: Request, res: Response)=>{
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.college.delete({
        where:{id},
    });

    res.json({
        success:true,
    });
});
