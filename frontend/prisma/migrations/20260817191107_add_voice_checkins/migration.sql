-- CreateEnum
CREATE TYPE "VoiceCheckInType" AS ENUM ('ONBOARDING', 'DAILY');

-- CreateEnum
CREATE TYPE "VoiceCheckInStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "VoiceCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "VoiceCheckInType" NOT NULL,
    "status" "VoiceCheckInStatus" NOT NULL DEFAULT 'COMPLETED',
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "answers" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoiceCheckIn_userId_checkInDate_idx" ON "VoiceCheckIn"("userId", "checkInDate");

-- CreateIndex
CREATE INDEX "VoiceCheckIn_userId_type_idx" ON "VoiceCheckIn"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceCheckIn_userId_type_checkInDate_key" ON "VoiceCheckIn"("userId", "type", "checkInDate");

-- AddForeignKey
ALTER TABLE "VoiceCheckIn" ADD CONSTRAINT "VoiceCheckIn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
