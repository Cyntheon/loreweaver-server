/*
  Warnings:

  - You are about to drop the column `collectionId` on the `CollectionSlug` table. All the data in the column will be lost.
  - You are about to drop the column `openedAt` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `loreId` on the `LoreSlug` table. All the data in the column will be lost.
  - You are about to drop the column `realmId` on the `RealmSlug` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slugId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugId]` on the table `Lore` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slugId]` on the table `Realm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slugId` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugId` to the `Lore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slugId` to the `Realm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollectionSlug" DROP CONSTRAINT "CollectionSlug_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "LoreSlug" DROP CONSTRAINT "LoreSlug_loreId_fkey";

-- DropForeignKey
ALTER TABLE "Realm" DROP CONSTRAINT "Realm_representationLoreId_fkey";

-- DropForeignKey
ALTER TABLE "RealmSlug" DROP CONSTRAINT "RealmSlug_realmId_fkey";

-- DropIndex
DROP INDEX "CollectionSlug_collectionId_key";

-- DropIndex
DROP INDEX "LoreSlug_loreId_key";

-- DropIndex
DROP INDEX "RealmSlug_realmId_key";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slugId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "CollectionSlug" DROP COLUMN "collectionId";

-- AlterTable
ALTER TABLE "Lore" DROP COLUMN "openedAt",
ADD COLUMN     "slugId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "LoreSlug" DROP COLUMN "loreId";

-- AlterTable
ALTER TABLE "Realm" ADD COLUMN     "slugId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RealmSlug" DROP COLUMN "realmId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nickname";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "website",
ADD COLUMN     "nickname" TEXT;

-- CreateTable
CREATE TABLE "RepresentationLore" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "loreId" UUID,

    CONSTRAINT "RepresentationLore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepresentationLore_loreId_key" ON "RepresentationLore"("loreId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slugId_key" ON "Collection"("slugId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_slugId_key" ON "Lore"("slugId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_slugId_key" ON "Realm"("slugId");

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "RealmSlug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_representationLoreId_fkey" FOREIGN KEY ("representationLoreId") REFERENCES "RepresentationLore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepresentationLore" ADD CONSTRAINT "RepresentationLore_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "LoreSlug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_slugId_fkey" FOREIGN KEY ("slugId") REFERENCES "CollectionSlug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
