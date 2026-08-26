/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,type]` on the table `RecoveryChallenge` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionId,step]` on the table `RecoveryChallenge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `step` to the `RecoveryChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecoveryChallenge" ADD COLUMN     "step" INTEGER NOT NULL,
ALTER COLUMN "tokenHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryChallenge_sessionId_type_key" ON "RecoveryChallenge"("sessionId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryChallenge_sessionId_step_key" ON "RecoveryChallenge"("sessionId", "step");
