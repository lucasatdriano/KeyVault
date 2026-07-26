/*
  Warnings:

  - You are about to drop the column `description` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedName` on the `Category` table. All the data in the column will be lost.
  - You are about to alter the column `color` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to drop the column `deviceId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recovery` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tokenHash]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cipherText` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salt` to the `Credential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenHash` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encryptedVaultKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecoveryType" AS ENUM ('EMAIL', 'GOOGLE', 'QUESTIONS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'REGISTER';
ALTER TYPE "AuditAction" ADD VALUE 'VERIFY_EMAIL';
ALTER TYPE "AuditAction" ADD VALUE 'IMPORT_DATA';
ALTER TYPE "AuditAction" ADD VALUE 'RESET_PASSWORD';
ALTER TYPE "AuditAction" ADD VALUE 'RECOVERY';

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_userId_fkey";

-- DropForeignKey
ALTER TABLE "Recovery" DROP CONSTRAINT "Recovery_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_deviceId_fkey";

-- DropIndex
DROP INDEX "Session_token_key";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "description",
DROP COLUMN "ip",
ADD COLUMN     "browser" VARCHAR(100),
ADD COLUMN     "credentialId" TEXT,
ADD COLUMN     "os" VARCHAR(100);

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "encryptedName",
ADD COLUMN     "cipherText" TEXT NOT NULL,
ALTER COLUMN "color" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "salt" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "deviceId",
DROP COLUMN "token",
ADD COLUMN     "tokenHash" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "encryptedVaultKey" TEXT NOT NULL,
ADD COLUMN     "isRecoverable" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Device";

-- DropTable
DROP TABLE "Recovery";

-- DropEnum
DROP TYPE "DeviceType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "RecoveryMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RecoveryType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "encryptedVaultKey" TEXT,
    "recoverySalt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecoveryMethod_userId_idx" ON "RecoveryMethod"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryMethod_userId_type_key" ON "RecoveryMethod"("userId", "type");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_credentialId_idx" ON "AuditLog"("credentialId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");

-- CreateIndex
CREATE INDEX "Credential_categoryId_idx" ON "Credential"("categoryId");

-- CreateIndex
CREATE INDEX "Credential_favorite_idx" ON "Credential"("favorite");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryMethod" ADD CONSTRAINT "RecoveryMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
