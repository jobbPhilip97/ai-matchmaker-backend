import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export class SwipeController {
  static async accept(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { userId } = req.body;

    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // uppdatera rätt sida
    const isUserA = match.userAId === userId;

    const updated = await prisma.match.update({
      where: { id },
      data: {
        ...(isUserA
          ? { userAStatus: "accepted" }
          : { userBStatus: "accepted" }),
      },
    });

    // kolla om båda accepterat
    if (
      updated.userAStatus === "accepted" &&
      updated.userBStatus === "accepted"
    ) {
      await prisma.match.update({
        where: { id },
        data: {
          status: "matched",
        },
      });
    }

    return res.json(updated);
  }

  static async reject(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { userId } = req.body;

  const match = await prisma.match.findUnique({
    where: { id },
  });

  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  await prisma.match.update({
    where: { id },
    data: {
      status: "rejected",
      ...(match.userAId === userId
        ? { userAStatus: "rejected" }
        : { userBStatus: "rejected" }),
    },
  });

  return res.json({ ok: true });
}
}