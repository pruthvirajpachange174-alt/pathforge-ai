/** Handles API requests for Profile Controller. */
import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * GET /api/v1/profile
 * Get logged-in user's profile
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * PUT /api/v1/profile
 * Update logged-in user's profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      image,
      college,
      year,
      branch,
      careerGoal,
      city,
      skills,
      languages,
      interests,
      githubUrl,
      leetcodeUrl,
      linkedinUrl,
      bio,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        image,
        college,
        year,
        branch,
        careerGoal,
        city,
        skills,
        languages,
        interests,
        githubUrl,
        leetcodeUrl,
        linkedinUrl,
        bio,
      },
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};