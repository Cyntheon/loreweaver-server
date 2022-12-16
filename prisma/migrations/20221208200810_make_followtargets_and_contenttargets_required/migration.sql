/*
  Warnings:

  - Made the column `representationLoreId` on table `Realm` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Realm" DROP CONSTRAINT "Realm_representationLoreId_fkey";

-- AlterTable
ALTER TABLE "Realm" ALTER COLUMN "representationLoreId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_representationLoreId_fkey" FOREIGN KEY ("representationLoreId") REFERENCES "Lore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
