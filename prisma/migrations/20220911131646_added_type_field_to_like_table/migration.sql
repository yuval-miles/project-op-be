/*
  Warnings:

  - Added the required column `type` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Like` ADD COLUMN `type` ENUM('like', 'dislike') NOT NULL;
