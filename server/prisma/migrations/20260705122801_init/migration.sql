-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "year" INTEGER,
    "branch" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "githubUrl" TEXT,
    "leetcodeUrl" TEXT,
    "linkedinUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacementExam" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "eligibility" TEXT NOT NULL,
    "examPattern" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topics" TEXT[],
    "roadmap" JSONB NOT NULL,
    "previousTrends" TEXT NOT NULL,
    "resources" JSONB NOT NULL,
    "expectedSalary" TEXT NOT NULL,
    "hiringProcess" JSONB NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacementExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentExam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "whoShouldTake" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "syllabus" JSONB NOT NULL,
    "difficulty" TEXT NOT NULL,
    "opportunities" TEXT NOT NULL,
    "officialUrl" TEXT,
    "tags" TEXT[],

    CONSTRAINT "GovernmentExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "skills" TEXT[],
    "languages" TEXT[],
    "roadmap" JSONB NOT NULL,
    "projects" JSONB NOT NULL,
    "certifications" TEXT[],
    "salary" TEXT NOT NULL,
    "companies" TEXT[],
    "futureDemand" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "usedFor" TEXT[],
    "companies" TEXT[],
    "pros" TEXT[],
    "cons" TEXT[],
    "beginnerFriendly" INTEGER NOT NULL,
    "demand" INTEGER NOT NULL,
    "futureScope" TEXT NOT NULL,
    "exampleProjects" TEXT[],
    "icon" TEXT,
    "color" TEXT,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hackathon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "website" TEXT,
    "registrationPeriod" TEXT,
    "eligibility" TEXT NOT NULL,
    "teamSize" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "selectionProcess" TEXT NOT NULL,
    "problemStatements" TEXT[],
    "domains" TEXT[],
    "difficulty" TEXT NOT NULL,
    "previousWinners" TEXT[],
    "judgingCriteria" JSONB NOT NULL,
    "prizePool" TEXT NOT NULL,
    "benefits" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "tips" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "Hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementExam_company_key" ON "PlacementExam"("company");

-- CreateIndex
CREATE UNIQUE INDEX "PlacementExam_slug_key" ON "PlacementExam"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GovernmentExam_name_key" ON "GovernmentExam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GovernmentExam_slug_key" ON "GovernmentExam"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_slug_key" ON "Language"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Hackathon_slug_key" ON "Hackathon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SavedItem_userId_itemType_itemId_key" ON "SavedItem"("userId", "itemType", "itemId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadmap" ADD CONSTRAINT "Roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
