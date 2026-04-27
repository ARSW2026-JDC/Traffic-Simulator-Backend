/*
  Warnings:

  - You are about to drop the column `newValue` on the `ChangeLog` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `ChangeLog` table. All the data in the column will be lost.
  - Added the required column `message` to the `ChangeLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `simId` to the `ChangeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChangeLog" DROP COLUMN "newValue",
DROP COLUMN "oldValue",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "simId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;

-- CreateIndex
CREATE INDEX "ChangeLog_simId_timestamp_idx" ON "ChangeLog"("simId", "timestamp");
