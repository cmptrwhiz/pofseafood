CREATE TABLE "SmsSubscriber" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "smsMarketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "consentTimestamp" TIMESTAMP(3),
    "consentSource" TEXT NOT NULL DEFAULT 'vip_landing_page',
    "consentTextVersion" TEXT NOT NULL DEFAULT 'v1.0',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "optOutTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SmsSubscriber_phone_key" ON "SmsSubscriber"("phone");
CREATE INDEX "SmsSubscriber_createdAt_idx" ON "SmsSubscriber"("createdAt" DESC);
CREATE INDEX "SmsSubscriber_status_idx" ON "SmsSubscriber"("status");

ALTER TABLE "SmsSubscriber" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "SmsSubscriber" FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "SmsSubscriber" FROM anon;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "SmsSubscriber" FROM authenticated;
  END IF;
END $$;
