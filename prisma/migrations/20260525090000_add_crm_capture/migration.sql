-- CreateTable
CREATE TABLE "CustomerLead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneRaw" TEXT NOT NULL,
    "phoneNormalized" TEXT NOT NULL,
    "email" TEXT,
    "emailNormalized" TEXT,
    "smsConsent" BOOLEAN NOT NULL DEFAULT false,
    "emailConsent" BOOLEAN NOT NULL DEFAULT false,
    "consentTextVersion" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCapture" (
    "id" TEXT NOT NULL,
    "customerLeadId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "fulfillmentType" TEXT NOT NULL,
    "pickupTime" TEXT,
    "totalCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'captured',
    "source" TEXT NOT NULL DEFAULT 'website',
    "itemsJson" JSONB NOT NULL,
    "consentsJson" JSONB,
    "sessionJson" JSONB,
    "complianceJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderCapture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerLead_phoneNormalized_key" ON "CustomerLead"("phoneNormalized");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerLead_emailNormalized_key" ON "CustomerLead"("emailNormalized");

-- AddForeignKey
ALTER TABLE "OrderCapture" ADD CONSTRAINT "OrderCapture_customerLeadId_fkey" FOREIGN KEY ("customerLeadId") REFERENCES "CustomerLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
