/*
  Warnings:

  - A unique constraint covering the columns `[storeId,userId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Rating" ADD COLUMN     "comment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Rating_storeId_userId_key" ON "public"."Rating"("storeId", "userId");
