/*
  Warnings:

  - Added the required column `vaultKeyCipherText` to the `RecoveryData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaultKeyIv` to the `RecoveryData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecoveryData" ADD COLUMN     "vaultKeyCipherText" TEXT NOT NULL,
ADD COLUMN     "vaultKeyIv" TEXT NOT NULL;
