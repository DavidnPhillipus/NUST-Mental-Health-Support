ALTER TABLE "User" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT 1;

ALTER TABLE "Resource" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'general';
ALTER TABLE "Resource" ADD COLUMN "approval_status" TEXT NOT NULL DEFAULT 'pending';

UPDATE "Resource"
SET "category" = 'general'
WHERE "category" IS NULL;

UPDATE "Resource"
SET "approval_status" = 'approved'
WHERE "approval_status" IS NULL;