/** Defines API routes for Profile Routes. */
import { Router } from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

/*
GET    /api/v1/profile
*/
router.get("/", requireAuth, getProfile);

/*
PUT    /api/v1/profile
*/
router.put("/", requireAuth, updateProfile);

export default router;