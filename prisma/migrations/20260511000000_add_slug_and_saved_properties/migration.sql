-- Add slug column with temporary default (id value), then remove default
ALTER TABLE "Property" ADD COLUMN "slug" TEXT;
UPDATE "Property" SET "slug" = "id" WHERE "slug" IS NULL;
ALTER TABLE "Property" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateTable SavedProperty
CREATE TABLE "SavedProperty" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedProperty_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one save per user per property
CREATE UNIQUE INDEX "SavedProperty_userId_propertyId_key" ON "SavedProperty"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "SavedProperty" ADD CONSTRAINT "SavedProperty_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SavedProperty" ADD CONSTRAINT "SavedProperty_propertyId_fkey"
    FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
