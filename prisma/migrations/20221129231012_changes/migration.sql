/*
  Warnings:

  - You are about to drop the column `name` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Realm` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Realm` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserFollowship` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[contentId]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,realmId]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followTargetId]` on the table `Realm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,authorId]` on the table `Realm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followTargetId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentId` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contents` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Realm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followTargetId` to the `Realm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Realm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Realm` table without a default value. This is not possible if the table is not empty.
  - Made the column `representationLoreId` on table `Realm` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `followTargetId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FollowTargetType" AS ENUM ('User', 'Realm', 'Collection');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('Lore', 'Post');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Text', 'Article', 'Poll');

-- DropForeignKey
ALTER TABLE "Lore" DROP CONSTRAINT "Lore_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Realm" DROP CONSTRAINT "Realm_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Realm" DROP CONSTRAINT "Realm_representationLoreId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowship" DROP CONSTRAINT "UserFollowship_followeeId_fkey";

-- DropForeignKey
ALTER TABLE "UserFollowship" DROP CONSTRAINT "UserFollowship_followerId_fkey";

-- DropIndex
DROP INDEX "Lore_name_realmId_key";

-- DropIndex
DROP INDEX "Lore_ownerId_idx";

-- DropIndex
DROP INDEX "Realm_name_ownerId_key";

-- DropIndex
DROP INDEX "Realm_ownerId_idx";

-- AlterTable
ALTER TABLE "Lore" DROP COLUMN "name",
DROP COLUMN "ownerId",
ADD COLUMN     "authorId" UUID NOT NULL,
ADD COLUMN     "contentId" UUID NOT NULL,
ADD COLUMN     "contents" JSONB NOT NULL,
ADD COLUMN     "slug" CITEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Realm" DROP COLUMN "name",
DROP COLUMN "ownerId",
ADD COLUMN     "authorId" UUID NOT NULL,
ADD COLUMN     "followTargetId" UUID NOT NULL,
ADD COLUMN     "slug" CITEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "representationLoreId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayName",
ADD COLUMN     "followTargetId" UUID NOT NULL,
ADD COLUMN     "nickname" TEXT;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "pronouns" TEXT;

-- DropTable
DROP TABLE "UserFollowship";

-- CreateTable
CREATE TABLE "FollowTarget" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "FollowTargetType" NOT NULL,

    CONSTRAINT "FollowTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" UUID NOT NULL,
    "followeeId" UUID NOT NULL,
    "isRequest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ContentType" NOT NULL,
    "shortCode" CITEXT,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" UUID NOT NULL,
    "type" "PostType" NOT NULL,
    "contentId" UUID NOT NULL,
    "contents" JSONB NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" UUID NOT NULL,
    "followTargetId" UUID NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followeeId_key" ON "Follow"("followerId", "followeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_shortCode_key" ON "Content"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "Post_contentId_key" ON "Post"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_followTargetId_key" ON "Collection"("followTargetId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_contentId_key" ON "Lore"("contentId");

-- CreateIndex
CREATE INDEX "Lore_authorId_idx" ON "Lore"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_slug_realmId_key" ON "Lore"("slug", "realmId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_followTargetId_key" ON "Realm"("followTargetId");

-- CreateIndex
CREATE INDEX "Realm_authorId_idx" ON "Realm"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_slug_authorId_key" ON "Realm"("slug", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_followTargetId_key" ON "User"("followTargetId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_followTargetId_fkey" FOREIGN KEY ("followTargetId") REFERENCES "FollowTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "FollowTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_representationLoreId_fkey" FOREIGN KEY ("representationLoreId") REFERENCES "Lore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_followTargetId_fkey" FOREIGN KEY ("followTargetId") REFERENCES "FollowTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_followTargetId_fkey" FOREIGN KEY ("followTargetId") REFERENCES "FollowTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
