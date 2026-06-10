import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { MatchService } from "../services/match.service.js";

export class ChatController {
  static async leave(req: Request, res: Response) {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid id" });
    }

    const chat = await prisma.chat.findUnique({
      where: { id },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // 1. stäng chat
    const updated = await prisma.chat.update({
      where: { id },
      data: {
        active: false,
      },
    });

    console.log(
      `💬 Chat ended between ${chat.userAId} ↔ ${chat.userBId}`
    );

    // 2. auto matchmaking för båda users
    console.log("🔄 Triggering auto matchmaking...");

    try {
      await MatchService.runForUser(chat.userAId);
      await MatchService.runForUser(chat.userBId);
    } catch (err) {
      console.error("❌ Auto matchmaking failed:", err);
    }

    return res.json({
      message: "Chat closed and matchmaking triggered",
      chat: updated,
    });
  }
}