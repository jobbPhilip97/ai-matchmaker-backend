import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const user = await UserModel.create(req.body);

      return res.status(201).json(user);
    } catch (error) {
      console.error("CREATE USER ERROR:", error);

      return res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    const users = await UserModel.getAll();

    return res.json(users);
  }
}