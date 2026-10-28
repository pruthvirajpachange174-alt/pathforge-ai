/** Defines API routes for Admin Placement Routes. */
import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

import {
  getPlacementExams,
  createPlacementExam,
  updatePlacementExam,
  deletePlacementExam,
} from "../controllers/adminPlacement.controller";

const router = Router();
router.use(requireAuth, requireAdmin);

// GET all placement exams
router.get("/", getPlacementExams);

// CREATE placement exam
router.post("/", createPlacementExam);

// UPDATE placement exam
router.put("/:slug", updatePlacementExam);

// DELETE placement exam
router.delete("/:slug", deletePlacementExam);

export default router;