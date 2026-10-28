-- CreateTable
CREATE TABLE "TechCareer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "learningRoadmap" JSONB NOT NULL,
    "salaryRange" TEXT NOT NULL,
    "demandLevel" TEXT NOT NULL,
    "companiesHiring" TEXT[],
    "resources" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechCareer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechCareer_slug_key" ON "TechCareer"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TechCareer_name_key" ON "TechCareer"("name");
