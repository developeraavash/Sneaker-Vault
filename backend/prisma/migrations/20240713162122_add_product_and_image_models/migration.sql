/*
  Warnings:

  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `SubCategory` DROP FOREIGN KEY `SubCategory_categoryId_fkey`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `categoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `SubCategory`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
