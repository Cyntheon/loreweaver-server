-- DropForeignKey
ALTER TABLE "Realm" DROP CONSTRAINT "Realm_representationLoreId_fkey";

-- AlterTable
ALTER TABLE "Realm" ALTER COLUMN "representationLoreId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_representationLoreId_fkey" FOREIGN KEY ("representationLoreId") REFERENCES "Lore"("id") ON DELETE SET NULL ON UPDATE CASCADE;
