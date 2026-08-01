/*
  Warnings:

  - You are about to drop the column `resourceName` on the `AuditLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "resourceName",
ADD COLUMN     "resourceSearchHash" CHAR(64),
ALTER COLUMN "browser" SET DATA TYPE TEXT,
ALTER COLUMN "os" SET DATA TYPE TEXT,
ALTER COLUMN "device" SET DATA TYPE TEXT,
ALTER COLUMN "ip" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_resourceSearchHash_idx" ON "AuditLog"("resourceSearchHash");
