/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "messageChatId" ON "Message"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
