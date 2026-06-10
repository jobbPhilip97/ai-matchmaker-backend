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

    // STEP 1: active chats
    const activeChats = await prisma.chat.findMany({
      where: { active: true },
    });

    // STEP 2: pending matches
    const pendingMatches = await prisma.match.findMany({
      where: { status: "pending" },
    });

    // STEP 3: build busy user list
    const busyUserIds = new Set<string>();

    activeChats.forEach(chat => {
      busyUserIds.add(chat.userAId);
      busyUserIds.add(chat.userBId);
    });

    pendingMatches.forEach(match => {
      busyUserIds.add(match.userAId);
      busyUserIds.add(match.userBId);
    });

    // STEP 4: filter candidates
    const candidates = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
          notIn: Array.from(busyUserIds),
        },
      },
    });

    // 🔥 NEW: track best match only
    let bestCandidate: any = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      const score = this.calculateScore(user, candidate);

      if (score < 70) {
        continue;
      }

      const existingMatch = await prisma.match.findFirst({
        where: {
          OR: [
            {
              userAId: user.id,
              userBId: candidate.id,
            },
            {
              userAId: candidate.id,
              userBId: user.id,
            },
          ],
        },
      });

      if (existingMatch) {
        console.log(
          `⏭️ Match already exists: ${user.firstName} ↔ ${candidate.firstName}`
        );
        continue;
      }

      if (
        score > bestScore ||
        (score === bestScore &&
          candidate.id < bestCandidate?.id)
      ) {
        bestScore = score;
        bestCandidate = candidate;
      }
    }

    // 🔥 CREATE ONLY ONE MATCH
    if (!bestCandidate) {
      console.log(`❌ No suitable match found for ${user.firstName}`);
      return [];
    }

    const match = await prisma.match.create({
      data: {
        userAId: user.id,
        userBId: bestCandidate.id,
        score: bestScore,
        status: "pending",
      },
    });

    console.log(
      `🎯 BEST MATCH: ${user.firstName} ↔ ${bestCandidate.firstName} (${bestScore}%)`
    );

    return [match];
  }
}