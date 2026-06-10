-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "userAStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "userBStatus" TEXT NOT NULL DEFAULT 'pending';
