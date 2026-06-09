import type { Request, Response } from "express";
import { MatchService } from "../services/match.service.js";

export class MatchController {
  static async run(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId || Array.isArray(userId)) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const matches = await MatchService.runForUser(userId);

      res.json(matches);
    } catch (error) {
      console.error(error); // 👈 VIKTIGT

      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}