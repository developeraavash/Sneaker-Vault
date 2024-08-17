/*
  Warnings:

  - You are about to drop the column `coverPic` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `coverPic`;

-- DropTable
DROP TABLE `Admin`;
