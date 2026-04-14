/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `availability_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `flagged_by` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `urgent` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `auth_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_email_key";

-- DropIndex
DROP INDEX "Profile_user_id_key";

-- DropIndex
DROP INDEX "Session_user_id_idx";

-- DropIndex
DROP INDEX "Session_token_idx";

-- DropIndex
DROP INDEX "Session_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Profile";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT,
    "counsellor_id" TEXT,
    "date" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Appointment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Appointment_counsellor_id_fkey" FOREIGN KEY ("counsellor_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("counsellor_id", "created_at", "date", "endTime", "id", "reason", "startTime", "status", "student_id") SELECT "counsellor_id", "created_at", "date", "endTime", "id", "reason", "startTime", "status", "student_id" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE INDEX "Appointment_student_id_idx" ON "Appointment"("student_id");
CREATE INDEX "Appointment_counsellor_id_idx" ON "Appointment"("counsellor_id");
CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "faculty" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("created_at", "email", "faculty", "id", "name", "role") SELECT "created_at", "email", "faculty", "id", "name", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
