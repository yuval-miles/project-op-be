-- AlterTable
ALTER TABLE `Post` ADD COLUMN `anon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `comments` BOOLEAN NOT NULL DEFAULT false;
