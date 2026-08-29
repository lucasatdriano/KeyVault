-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "recoveryMethodId" TEXT,
ADD COLUMN     "resource" TEXT;

-- CreateIndex
CREATE INDEX "AuditLog_recoveryMethodId_idx" ON "AuditLog"("recoveryMethodId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_recoveryMethodId_fkey" FOREIGN KEY ("recoveryMethodId") REFERENCES "RecoveryMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
