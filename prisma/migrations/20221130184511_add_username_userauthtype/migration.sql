/*
  Warnings:

  - The values [Email] on the enum `UserAuthType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserAuthType_new" AS ENUM ('UsernamePassword', 'EmailPassword', 'Google');
ALTER TABLE "UserAuth" ALTER COLUMN "type" TYPE "UserAuthType_new" USING ("type"::text::"UserAuthType_new");
ALTER TYPE "UserAuthType" RENAME TO "UserAuthType_old";
ALTER TYPE "UserAuthType_new" RENAME TO "UserAuthType";
DROP TYPE "UserAuthType_old";
COMMIT;
