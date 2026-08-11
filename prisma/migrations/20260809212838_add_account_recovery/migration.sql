/*
  Warnings:

  - The values [GOOGLE] on the enum `RecoveryType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `color` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedVaultKey` on the `RecoveryMethod` table. All the data in the column will be lost.
  - You are about to drop the column `recoverySalt` on the `RecoveryMethod` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

-- CreateTable
CREATE TABLE "RecoverySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoverySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryChallenge" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "RecoveryType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecoveryChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionCipherText" TEXT NOT NULL,
    "questionIv" TEXT NOT NULL,
    "answerHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecoverySession_userId_idx" ON "RecoverySession"("userId");

-- CreateIndex
CREATE INDEX "RecoverySession_tokenHash_idx" ON "RecoverySession"("tokenHash");

-- CreateIndex
CREATE INDEX "RecoverySession_expiresAt_idx" ON "RecoverySession"("expiresAt");

-- CreateIndex
CREATE INDEX "RecoveryChallenge_sessionId_idx" ON "RecoveryChallenge"("sessionId");

-- CreateIndex
CREATE INDEX "RecoveryChallenge_tokenHash_idx" ON "RecoveryChallenge"("tokenHash");

-- CreateIndex
CREATE INDEX "RecoveryChallenge_expiresAt_idx" ON "RecoveryChallenge"("expiresAt");

-- CreateIndex
CREATE INDEX "RecoveryQuestion_userId_idx" ON "RecoveryQuestion"("userId");

ALTER TYPE "AuditAction" ADD VALUE 'ENABLE_RECOVERY_METHOD';
ALTER TYPE "AuditAction" ADD VALUE 'DISABLE_RECOVERY_METHOD';
ALTER TYPE "AuditAction" ADD VALUE 'GENERATE_RECOVERY_KEY';
ALTER TYPE "AuditAction" ADD VALUE 'UPDATE_PROFILE';
ALTER TYPE "AuditAction" ADD VALUE 'CHANGE_EMAIL';

-- AlterEnum
BEGIN;
CREATE TYPE "RecoveryType_new" AS ENUM ('EMAIL', 'QUESTIONS', 'RECOVERY_KEY');
ALTER TABLE "RecoveryMethod" ALTER COLUMN "type" TYPE "RecoveryType_new" USING ("type"::text::"RecoveryType_new");
ALTER TABLE "RecoveryChallenge" ALTER COLUMN "type" TYPE "RecoveryType_new" USING ("type"::text::"RecoveryType_new");
ALTER TYPE "RecoveryType" RENAME TO "RecoveryType_old";
ALTER TYPE "RecoveryType_new" RENAME TO "RecoveryType";
DROP TYPE "public"."RecoveryType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "color";

-- AlterTable
ALTER TABLE "RecoveryMethod" DROP COLUMN "encryptedVaultKey",
DROP COLUMN "recoverySalt",
ADD COLUMN     "secretHash" TEXT,
ALTER COLUMN "enabled" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "RecoverySession" ADD CONSTRAINT "RecoverySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryChallenge" ADD CONSTRAINT "RecoveryChallenge_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RecoverySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryQuestion" ADD CONSTRAINT "RecoveryQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
