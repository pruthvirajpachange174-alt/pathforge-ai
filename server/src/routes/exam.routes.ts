/** Defines API routes for Exam Routes. */
import { Router } from "express";
import * as ctrl from "../controllers/exam.controller";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

const router = Router();

/* ===========================
   Placement Exams
=========================== */

router.get("/placement", ctrl.listPlacementExams);

router.get("/placement/:slug", ctrl.getPlacementExam);

/* ===========================
   Government Exams
=========================== */

router.get("/government", ctrl.listGovernmentExams);

router.get("/government/:slug", ctrl.getGovernmentExam);

// Create Government Exam
router.post("/government", requireAuth, requireAdmin, ctrl.createGovernmentExam);

// Update Government Exam
router.put("/government/:slug", requireAuth, requireAdmin, ctrl.updateGovernmentExam);

// Delete Government Exam
router.delete("/government/:slug", requireAuth, requireAdmin, ctrl.deleteGovernmentExam);

export default router;