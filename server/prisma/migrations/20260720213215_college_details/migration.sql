-- AlterTable
ALTER TABLE "College" ADD COLUMN     "courses" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "facilities" JSONB,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "ranking" TEXT,
ADD COLUMN     "website" TEXT;
