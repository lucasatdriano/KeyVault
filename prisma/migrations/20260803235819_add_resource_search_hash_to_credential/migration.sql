/*
  Warnings:

  - Added the required column `iv` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "iv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "resourceSearchHash" CHAR(64);
