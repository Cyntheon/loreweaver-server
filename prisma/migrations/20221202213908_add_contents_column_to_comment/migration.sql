/*
  Warnings:

  - Added the required column `contents` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "contents" JSONB NOT NULL;
