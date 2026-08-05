-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Credential_deletedAt_idx" ON "Credential"("deletedAt");
