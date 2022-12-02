/*
  Warnings:

  - You are about to drop the column `url` on the `Shortcode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shortcode" DROP COLUMN "url",
ADD COLUMN     "data" JSONB;
