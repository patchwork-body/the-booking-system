/*
  Warnings:

  - Added the required column `participantId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "participantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "ChatParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
