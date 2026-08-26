-- CreateEnum
CREATE TYPE "RecoverySessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'FAILED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "RecoveryType" ADD VALUE 'RECOVERY_PASSWORD';

-- AlterTable
ALTER TABLE "RecoveryChallenge" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "RecoverySession" ADD COLUMN     "status" "RecoverySessionStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "RecoverySession_status_idx" ON "RecoverySession"("status");
