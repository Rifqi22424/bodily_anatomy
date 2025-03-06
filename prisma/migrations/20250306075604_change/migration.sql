/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "imageUrl",
ADD COLUMN     "InsideImageUrl" TEXT,
ADD COLUMN     "outsideImageUrl" TEXT;
