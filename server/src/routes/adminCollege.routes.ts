/** Defines API routes for Admin College Routes. */
import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware";

import {
    getColleges,
    createCollege,
    updateCollege,
    deleteCollege
}
from "../controllers/adminCollege.controller";

const router=Router();
router.use(requireAuth, requireAdmin);

router.get("/",getColleges);

router.post("/",createCollege);

router.put("/:id",updateCollege);

router.delete("/:id",deleteCollege);

export default router;