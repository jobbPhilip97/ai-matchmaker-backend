import prisma from "../lib/prisma.js";

export class MatchService {
  static calculateScore(userA: any, userB: any): number {
    let score = 0;

    // Ålderspreferenser
    if (
      userB.age >= (userA.minAge ?? 18) &&
      userB.age <= (userA.maxAge ?? 100)
    ) {
      score += 30;
    }

    // Samma stad
    if (
      userA.city &&
      userB.city &&
      userA.city.toLowerCase() === userB.city.toLowerCase()
    ) {
      score += 20;
    }

    // Samma relationsmål
    if (
      userA.lookingFor &&
      userB.lookingFor &&
      userA.lookingFor === userB.lookingFor
    ) {
      score += 50;
    }

    return score;
  }

  static async runForUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const candidates = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
    });

    const matches = [];

    for (const candidate of candidates) {
      const score = this.calculateScore(user, candidate);

      if (score >= 70) {
        const match = await prisma.match.create({
          data: {
            userAId: user.id,
            userBId: candidate.id,
            score,
          },
        });

        matches.push(match);
      }
    }

    return matches;
  }
}