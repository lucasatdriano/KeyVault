-- CreateTable
CREATE TABLE "RecoveryData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "encryptedDataKey" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecoveryData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryData_userId_key" ON "RecoveryData"("userId");

-- AddForeignKey
ALTER TABLE "RecoveryData" ADD CONSTRAINT "RecoveryData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
