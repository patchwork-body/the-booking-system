/*
  Warnings:

  - You are about to drop the column `guests` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_guestId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "guests";

-- CreateTable
CREATE TABLE "GuestReservation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guestId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "GuestReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuestReservation" ADD CONSTRAINT "GuestReservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestReservation" ADD CONSTRAINT "GuestReservation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
