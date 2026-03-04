-- CreateEnum
CREATE TYPE "SkinType" AS ENUM ('OILY', 'DRY', 'NORMAL', 'COMBINATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkinAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "skinType" "SkinType" NOT NULL,
    "oil" INTEGER NOT NULL,
    "acne" INTEGER NOT NULL,
    "blackheads" INTEGER NOT NULL,
    "pigmentation" INTEGER NOT NULL,
    "hydration" INTEGER NOT NULL,
    "sensitivity" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "aiRawJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkinAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "routineJson" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_analysisId_key" ON "Routine"("analysisId");

-- AddForeignKey
ALTER TABLE "SkinAnalysis" ADD CONSTRAINT "SkinAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine" ADD CONSTRAINT "Routine_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "SkinAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
