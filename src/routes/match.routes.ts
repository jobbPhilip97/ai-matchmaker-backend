import { Router } from "express";
import { MatchController } from "../controllers/match.controller.js";

const router = Router();

router.post("/:userId/run", MatchController.run);

export default router;