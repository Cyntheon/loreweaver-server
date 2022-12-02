/*
  Warnings:

  - You are about to drop the column `shortCode` on the `Content` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortcodeId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortcodeId]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortcodeId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortcodeId]` on the table `Realm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortcodeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ShortcodeType" AS ENUM ('InternalLink', 'User', 'Realm', 'Lore', 'Post', 'Comment', 'Collection');

-- DropIndex
DROP INDEX "Content_shortCode_key";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "shortcodeId" CITEXT;

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "shortCode";

-- AlterTable
ALTER TABLE "Lore" ADD COLUMN     "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shortcodeId" CITEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "shortcodeId" CITEXT;

-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "shortcodeId" CITEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "shortcodeId" CITEXT;

-- CreateTable
CREATE TABLE "Shortcode" (
    "id" CITEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ShortcodeType" NOT NULL,
    "url" TEXT,

    CONSTRAINT "Shortcode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isRequest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" UUID NOT NULL,
    "parentPostId" UUID NOT NULL,
    "parentCommentId" UUID,
    "shortcodeId" CITEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_contentId_userId_key" ON "Like"("contentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_shortcodeId_key" ON "Comment"("shortcodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_shortcodeId_key" ON "Collection"("shortcodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_shortcodeId_key" ON "Lore"("shortcodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_shortcodeId_key" ON "Post"("shortcodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_shortcodeId_key" ON "Realm"("shortcodeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_shortcodeId_key" ON "User"("shortcodeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_shortcodeId_fkey" FOREIGN KEY ("shortcodeId") REFERENCES "Shortcode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_shortcodeId_fkey" FOREIGN KEY ("shortcodeId") REFERENCES "Shortcode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_shortcodeId_fkey" FOREIGN KEY ("shortcodeId") REFERENCES "Shortcode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_shortcodeId_fkey" FOREIGN KEY ("shortcodeId") REFERENCES "Shortcode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentPostId_fkey" FOREIGN KEY ("parentPostId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_shortcodeId_fkey" FOREIGN KEY ("shortcodeId") REFERENCES "Shortcode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_shortcodeId_fkey" FOREIGN KEY ("shortcodeId") REFERENCES "Shortcode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
