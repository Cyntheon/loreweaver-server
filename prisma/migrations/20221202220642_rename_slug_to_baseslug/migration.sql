/*
  Warnings:

  - You are about to drop the column `slug` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `slugDuplicateCount` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `slugDuplicateCount` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Realm` table. All the data in the column will be lost.
  - You are about to drop the column `slugDuplicateCount` on the `Realm` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorId,baseSlug,slugDiscriminator]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[realmId,baseSlug,slugDiscriminator]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,baseSlug,slugDiscriminator]` on the table `Realm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseSlug` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseSlug` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseSlug` to the `Realm` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Collection_authorId_slug_slugDuplicateCount_key";

-- DropIndex
DROP INDEX "Collection_slug_idx";

-- DropIndex
DROP INDEX "Lore_realmId_slug_slugDuplicateCount_key";

-- DropIndex
DROP INDEX "Lore_slug_idx";

-- DropIndex
DROP INDEX "Realm_authorId_slug_slugDuplicateCount_key";

-- DropIndex
DROP INDEX "Realm_slug_idx";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "slug",
DROP COLUMN "slugDuplicateCount",
ADD COLUMN     "baseSlug" CITEXT NOT NULL,
ADD COLUMN     "slugDiscriminator" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Lore" DROP COLUMN "slug",
DROP COLUMN "slugDuplicateCount",
ADD COLUMN     "baseSlug" CITEXT NOT NULL,
ADD COLUMN     "slugDiscriminator" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Realm" DROP COLUMN "slug",
DROP COLUMN "slugDuplicateCount",
ADD COLUMN     "baseSlug" CITEXT NOT NULL,
ADD COLUMN     "slugDiscriminator" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Collection_baseSlug_idx" ON "Collection"("baseSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_authorId_baseSlug_slugDiscriminator_key" ON "Collection"("authorId", "baseSlug", "slugDiscriminator");

-- CreateIndex
CREATE INDEX "Lore_baseSlug_idx" ON "Lore"("baseSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_realmId_baseSlug_slugDiscriminator_key" ON "Lore"("realmId", "baseSlug", "slugDiscriminator");

-- CreateIndex
CREATE INDEX "Realm_baseSlug_idx" ON "Realm"("baseSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_authorId_baseSlug_slugDiscriminator_key" ON "Realm"("authorId", "baseSlug", "slugDiscriminator");
