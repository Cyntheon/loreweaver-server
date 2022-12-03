/*
  Warnings:

  - Changed the type of `type` on the `ContentTarget` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentTargetType" AS ENUM ('Lore', 'Post', 'Comment');

-- AlterTable
ALTER TABLE "ContentTarget" DROP COLUMN "type",
ADD COLUMN     "type" "ContentTargetType" NOT NULL;

-- DropEnum
DROP TYPE "ContentType";
