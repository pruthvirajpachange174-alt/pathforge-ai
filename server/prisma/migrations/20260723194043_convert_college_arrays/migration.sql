/*
  Warnings:

  - The `courses` column on the `College` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `facilities` column on the `College` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "College" DROP COLUMN "courses",
ADD COLUMN     "courses" TEXT[],
DROP COLUMN "facilities",
ADD COLUMN     "facilities" TEXT[];
