/*
  Warnings:

  - You are about to drop the column `contentId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `isRequest` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Collection_ContentList` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authorId,slug,slugDuplicateCount]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contentTargetId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contentTargetId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contentTargetId]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[realmId,slug,slugDuplicateCount]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contentTargetId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,slug,slugDuplicateCount]` on the table `Realm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentTargetId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentTargetId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentTargetId` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentTargetId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Lore" DROP CONSTRAINT "Lore_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_contentId_fkey";

-- DropForeignKey
ALTER TABLE "_Collection_ContentList" DROP CONSTRAINT "_Collection_ContentList_A_fkey";

-- DropForeignKey
ALTER TABLE "_Collection_ContentList" DROP CONSTRAINT "_Collection_ContentList_B_fkey";

-- DropIndex
DROP INDEX "Collection_slug_authorId_key";

-- DropIndex
DROP INDEX "Comment_contentId_key";

-- DropIndex
DROP INDEX "Like_contentId_userId_key";

-- DropIndex
DROP INDEX "Lore_contentId_key";

-- DropIndex
DROP INDEX "Lore_slug_realmId_key";

-- DropIndex
DROP INDEX "Post_contentId_key";

-- DropIndex
DROP INDEX "Realm_slug_authorId_key";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "slugDuplicateCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "contentId",
ADD COLUMN     "contentTargetId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "contentId",
DROP COLUMN "isRequest",
ADD COLUMN     "contentTargetId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Lore" DROP COLUMN "contentId",
ADD COLUMN     "contentTargetId" UUID NOT NULL,
ADD COLUMN     "slugDuplicateCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "contentId",
ADD COLUMN     "contentTargetId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "slugDuplicateCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "_Collection_ContentList";

-- CreateTable
CREATE TABLE "ContentTarget" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ContentType" NOT NULL,

    CONSTRAINT "ContentTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Collection_ContentTargetList" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Collection_ContentTargetList_AB_unique" ON "_Collection_ContentTargetList"("A", "B");

-- CreateIndex
CREATE INDEX "_Collection_ContentTargetList_B_index" ON "_Collection_ContentTargetList"("B");

-- CreateIndex
CREATE INDEX "Collection_authorId_idx" ON "Collection"("authorId");

-- CreateIndex
CREATE INDEX "Collection_slug_idx" ON "Collection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_authorId_slug_slugDuplicateCount_key" ON "Collection"("authorId", "slug", "slugDuplicateCount");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_contentTargetId_key" ON "Comment"("contentTargetId");

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followeeId_idx" ON "Follow"("followeeId");

-- CreateIndex
CREATE INDEX "Follow_followerId_isRequest_idx" ON "Follow"("followerId", "isRequest");

-- CreateIndex
CREATE INDEX "Follow_followeeId_isRequest_idx" ON "Follow"("followeeId", "isRequest");

-- CreateIndex
CREATE INDEX "Like_contentTargetId_idx" ON "Like"("contentTargetId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_contentTargetId_userId_key" ON "Like"("contentTargetId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_contentTargetId_key" ON "Lore"("contentTargetId");

-- CreateIndex
CREATE INDEX "Lore_slug_idx" ON "Lore"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_realmId_slug_slugDuplicateCount_key" ON "Lore"("realmId", "slug", "slugDuplicateCount");

-- CreateIndex
CREATE UNIQUE INDEX "Post_contentTargetId_key" ON "Post"("contentTargetId");

-- CreateIndex
CREATE INDEX "Realm_slug_idx" ON "Realm"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_authorId_slug_slugDuplicateCount_key" ON "Realm"("authorId", "slug", "slugDuplicateCount");

-- CreateIndex
CREATE INDEX "UserAuth_userId_idx" ON "UserAuth"("userId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_contentTargetId_fkey" FOREIGN KEY ("contentTargetId") REFERENCES "ContentTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_contentTargetId_fkey" FOREIGN KEY ("contentTargetId") REFERENCES "ContentTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_contentTargetId_fkey" FOREIGN KEY ("contentTargetId") REFERENCES "ContentTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_contentTargetId_fkey" FOREIGN KEY ("contentTargetId") REFERENCES "ContentTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collection_ContentTargetList" ADD CONSTRAINT "_Collection_ContentTargetList_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collection_ContentTargetList" ADD CONSTRAINT "_Collection_ContentTargetList_B_fkey" FOREIGN KEY ("B") REFERENCES "ContentTarget"("id") ON DELETE CASCADE ON UPDATE CASCADE;
