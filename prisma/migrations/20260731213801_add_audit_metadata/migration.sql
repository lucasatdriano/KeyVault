-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "device" VARCHAR(100),
ADD COLUMN     "ip" VARCHAR(150),
ADD COLUMN     "resourceName" VARCHAR(150);
