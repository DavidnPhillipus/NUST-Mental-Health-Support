ALTER TABLE "Appointment" ADD COLUMN "urgent" BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE "Appointment" ADD COLUMN "flagged_by" TEXT;

CREATE INDEX "idx_appointment_urgent" ON "Appointment"("urgent");