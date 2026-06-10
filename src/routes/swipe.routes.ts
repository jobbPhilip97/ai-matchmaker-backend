import { Router } from "express";
import { SwipeController } from "../controllers/swipe.controller.js";

const router = Router();

router.post("/:id/accept", SwipeController.accept);
router.post("/:id/reject", SwipeController.reject);

export default router;