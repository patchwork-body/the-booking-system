-- CreateIndex
CREATE INDEX "reservationPropertyId" ON "Reservation"("propertyId");

-- RenameIndex
ALTER INDEX "propertyId" RENAME TO "chatPropertyId";
