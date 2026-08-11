/*
  Warnings:

  - The values [RECOVERY] on the enum `AuditAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditAction_new" AS ENUM ('REGISTER', 'VERIFY_EMAIL', 'LOGIN', 'LOGOUT', 'CREATE_CREDENTIAL', 'UPDATE_CREDENTIAL', 'DELETE_CREDENTIAL', 'RESTORE_CREDENTIAL', 'COPY_PASSWORD', 'CHANGE_MASTER_PASSWORD', 'EXPORT_DATA', 'IMPORT_DATA', 'ENABLE_RECOVERY_METHOD', 'DISABLE_RECOVERY_METHOD', 'GENERATE_RECOVERY_KEY', 'RESET_PASSWORD', 'UPDATE_PROFILE', 'CHANGE_EMAIL');
ALTER TABLE "AuditLog" ALTER COLUMN "action" TYPE "AuditAction_new" USING ("action"::text::"AuditAction_new");
ALTER TYPE "AuditAction" RENAME TO "AuditAction_old";
ALTER TYPE "AuditAction_new" RENAME TO "AuditAction";
DROP TYPE "public"."AuditAction_old";
COMMIT;
