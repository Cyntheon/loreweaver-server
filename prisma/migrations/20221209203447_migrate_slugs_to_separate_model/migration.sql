/*
  Warnings:

  - You are about to drop the column `baseSlug` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `slugDiscriminator` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `baseSlug` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `slugDiscriminator` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the column `baseSlug` on the `Realm` table. All the data in the column will be lost.
  - You are about to drop the column `slugDiscriminator` on the `Realm` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Collection_authorId_baseSlug_slugDiscriminator_key";

-- DropIndex
DROP INDEX "Collection_baseSlug_idx";

-- DropIndex
DROP INDEX "Lore_baseSlug_idx";

-- DropIndex
DROP INDEX "Lore_realmId_baseSlug_slugDiscriminator_key";

-- DropIndex
DROP INDEX "Realm_authorId_baseSlug_slugDiscriminator_key";

-- DropIndex
DROP INDEX "Realm_baseSlug_idx";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "baseSlug",
DROP COLUMN "slugDiscriminator";

-- AlterTable
ALTER TABLE "Lore" DROP COLUMN "baseSlug",
DROP COLUMN "slugDiscriminator";

-- AlterTable
ALTER TABLE "Realm" DROP COLUMN "baseSlug",
DROP COLUMN "slugDiscriminator";

-- CreateTable
CREATE TABLE "RealmSlug" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "authorId" UUID NOT NULL,
    "realmId" UUID NOT NULL,
    "baseSlug" TEXT NOT NULL,
    "discriminator" INTEGER NOT NULL,

    CONSTRAINT "RealmSlug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreSlug" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "realmId" UUID NOT NULL,
    "loreId" UUID NOT NULL,
    "baseSlug" TEXT NOT NULL,
    "discriminator" INTEGER NOT NULL,

    CONSTRAINT "LoreSlug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionSlug" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "authorId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,
    "baseSlug" TEXT NOT NULL,
    "discriminator" INTEGER NOT NULL,

    CONSTRAINT "CollectionSlug_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RealmSlug_realmId_key" ON "RealmSlug"("realmId");

-- CreateIndex
CREATE UNIQUE INDEX "RealmSlug_authorId_baseSlug_discriminator_key" ON "RealmSlug"("authorId", "baseSlug", "discriminator");

-- CreateIndex
CREATE UNIQUE INDEX "LoreSlug_loreId_key" ON "LoreSlug"("loreId");

-- CreateIndex
CREATE UNIQUE INDEX "LoreSlug_realmId_baseSlug_discriminator_key" ON "LoreSlug"("realmId", "baseSlug", "discriminator");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSlug_collectionId_key" ON "CollectionSlug"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSlug_authorId_baseSlug_discriminator_key" ON "CollectionSlug"("authorId", "baseSlug", "discriminator");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Comment_parentPostId_idx" ON "Comment"("parentPostId");

-- CreateIndex
CREATE INDEX "Comment_parentCommentId_idx" ON "Comment"("parentCommentId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- AddForeignKey
ALTER TABLE "RealmSlug" ADD CONSTRAINT "RealmSlug_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmSlug" ADD CONSTRAINT "RealmSlug_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreSlug" ADD CONSTRAINT "LoreSlug_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreSlug" ADD CONSTRAINT "LoreSlug_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSlug" ADD CONSTRAINT "CollectionSlug_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSlug" ADD CONSTRAINT "CollectionSlug_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
