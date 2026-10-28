/** Defines API routes for College Routes. */
import { Router } from "express";
import { listColleges  } from "../controllers/college.controller";
import { getCollege } from "../controllers/college.controller";
const router = Router();

router.get("/", listColleges);
router.get("/:id",getCollege);
export default router;