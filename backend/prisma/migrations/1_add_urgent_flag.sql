-- Add urgent flag to Appointment table
ALTER TABLE "Appointment" ADD COLUMN "urgent" BOOLEAN DEFAULT false;
ALTER TABLE "Appointment" ADD COLUMN "flagged_by" VARCHAR(255);

-- Update MoodLog to use student_id instead of user_id if not already done
-- Note: This migration assumes you want to add the student_id column
-- If the structure differs, adjust accordingly
ALTER TABLE "MoodLog" RENAME COLUMN "user_id" TO "student_id";

-- Add index for faster queries on urgent appointments
CREATE INDEX "idx_appointment_urgent" ON "Appointment"("urgent");
CREATE INDEX "idx_appointment_counsellor_id" ON "Appointment"("counsellor_id");
