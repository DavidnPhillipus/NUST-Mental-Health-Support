-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auth_id" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "email" TEXT NOT NULL,
    "faculty" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "display_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "faculty" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT,
    "counsellor_id" TEXT,
    "availability_id" TEXT,
    "date" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "time" TEXT,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "notes" TEXT,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "flagged_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Appointment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Appointment_counsellor_id_fkey" FOREIGN KEY ("counsellor_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MoodLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT,
    "date" TEXT,
    "mood" TEXT,
    "sleep" TEXT,
    "appetite" TEXT,
    "energy" TEXT,
    "stress" TEXT,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MoodLog_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'article',
    "url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SessionNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointment_id" TEXT,
    "counsellor_id" TEXT,
    "date" TEXT,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionNote_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SessionNote_counsellor_id_fkey" FOREIGN KEY ("counsellor_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "counsellor_id" TEXT,
    "date" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Availability_counsellor_id_fkey" FOREIGN KEY ("counsellor_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_id_key" ON "User"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE INDEX "Appointment_student_id_idx" ON "Appointment"("student_id");

-- CreateIndex
CREATE INDEX "Appointment_counsellor_id_idx" ON "Appointment"("counsellor_id");

-- CreateIndex
CREATE INDEX "Appointment_date_idx" ON "Appointment"("date");

-- CreateIndex
CREATE INDEX "MoodLog_student_id_idx" ON "MoodLog"("student_id");

-- CreateIndex
CREATE INDEX "MoodLog_date_idx" ON "MoodLog"("date");

-- CreateIndex
CREATE INDEX "SessionNote_appointment_id_idx" ON "SessionNote"("appointment_id");

-- CreateIndex
CREATE INDEX "SessionNote_counsellor_id_idx" ON "SessionNote"("counsellor_id");

-- CreateIndex
CREATE INDEX "Availability_counsellor_id_idx" ON "Availability"("counsellor_id");

-- CreateIndex
CREATE INDEX "Availability_date_idx" ON "Availability"("date");
