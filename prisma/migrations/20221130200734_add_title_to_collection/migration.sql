/*
  Warnings:

  - A unique constraint covering the columns `[slug,authorId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "slug" CITEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_authorId_key" ON "Collection"("slug", "authorId");
