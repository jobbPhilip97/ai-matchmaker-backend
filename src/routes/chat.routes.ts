import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";

const router = Router();

router.post("/:id/leave", ChatController.leave);

export default router;