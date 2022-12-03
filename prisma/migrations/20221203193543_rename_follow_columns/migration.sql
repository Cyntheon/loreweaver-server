/*
  Warnings:

  - You are about to drop the column `followeeId` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `followerId` on the `Follow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,followTargetId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followTargetId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Follow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followeeId_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_followerId_fkey";

-- DropIndex
DROP INDEX "Follow_followeeId_idx";

-- DropIndex
DROP INDEX "Follow_followeeId_isRequest_idx";

-- DropIndex
DROP INDEX "Follow_followerId_followeeId_key";

-- DropIndex
DROP INDEX "Follow_followerId_idx";

-- DropIndex
DROP INDEX "Follow_followerId_isRequest_idx";

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "followeeId",
DROP COLUMN "followerId",
ADD COLUMN     "followTargetId" UUID NOT NULL,
ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Follow_userId_idx" ON "Follow"("userId");

-- CreateIndex
CREATE INDEX "Follow_followTargetId_idx" ON "Follow"("followTargetId");

-- CreateIndex
CREATE INDEX "Follow_userId_isRequest_idx" ON "Follow"("userId", "isRequest");

-- CreateIndex
CREATE INDEX "Follow_followTargetId_isRequest_idx" ON "Follow"("followTargetId", "isRequest");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_userId_followTargetId_key" ON "Follow"("userId", "followTargetId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followTargetId_fkey" FOREIGN KEY ("followTargetId") REFERENCES "FollowTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
