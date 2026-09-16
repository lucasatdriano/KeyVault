/*
  Warnings:

  - You are about to drop the column `encryptedDataKey` on the `RecoveryData` table. All the data in the column will be lost.
  - You are about to drop the column `iv` on the `RecoveryData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecoveryData" DROP COLUMN "encryptedDataKey",
DROP COLUMN "iv";
