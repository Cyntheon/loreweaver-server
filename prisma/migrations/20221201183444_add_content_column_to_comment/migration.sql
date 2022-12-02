/*
  Warnings:

  - A unique constraint covering the columns `[contentId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ContentType" ADD VALUE 'Comment';

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "contentId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_contentId_key" ON "Comment"("contentId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
