/** Defines API routes for Clerk Webhook Routes. */
import { Router } from "express";
import { clerkWebhook } from "../controllers/clerkWebhook.controller";

const router = Router();

router.post("/clerk", clerkWebhook);

export default router;