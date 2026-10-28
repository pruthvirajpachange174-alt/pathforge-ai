CREATE TABLE "IndiaDirectoryEntry" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "sourceUrl" TEXT,
    "sourceSection" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL,
    "sourceNotes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndiaDirectoryEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "IndiaDirectoryEntry_slug_key" ON "IndiaDirectoryEntry"("slug");
CREATE INDEX "IndiaDirectoryEntry_category_idx" ON "IndiaDirectoryEntry"("category");
CREATE INDEX "IndiaDirectoryEntry_title_idx" ON "IndiaDirectoryEntry"("title");
