/*
  Warnings:

  - You are about to drop the column `InsideImageUrl` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "InsideImageUrl",
ADD COLUMN     "insideImageUrl" TEXT;
