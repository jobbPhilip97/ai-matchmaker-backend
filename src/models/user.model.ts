import prisma from "../lib/prisma.js";
import type { CreateUserDto } from "../types/user.types.js";

export class UserModel {
  static async create(data: CreateUserDto) {
    return prisma.user.create({
      data,
    });
  }

  static async getAll() {
    return prisma.user.findMany();
  }

  static async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}