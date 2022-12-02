/*
  Warnings:

  - You are about to drop the column `vignette` on the `Lore` table. All the data in the column will be lost.
  - You are about to drop the `LoreUserPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RealmUserPermissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoreUserPermissions" DROP CONSTRAINT "LoreUserPermissions_loreId_fkey";

-- DropForeignKey
ALTER TABLE "LoreUserPermissions" DROP CONSTRAINT "LoreUserPermissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "RealmUserPermissions" DROP CONSTRAINT "RealmUserPermissions_realmId_fkey";

-- DropForeignKey
ALTER TABLE "RealmUserPermissions" DROP CONSTRAINT "RealmUserPermissions_userId_fkey";

-- AlterTable
ALTER TABLE "Lore" DROP COLUMN "vignette",
ADD COLUMN     "summary" TEXT;

-- DropTable
DROP TABLE "LoreUserPermissions";

-- DropTable
DROP TABLE "RealmUserPermissions";

-- DropEnum
DROP TYPE "ContentUserPermissionsLevel";
