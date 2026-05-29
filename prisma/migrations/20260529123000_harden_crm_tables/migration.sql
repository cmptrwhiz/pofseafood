-- CRM tables contain customer PII and should not be readable through
-- Supabase client/browser roles. The Next.js server talks to Postgres with
-- the DATABASE_URL service credentials, while anon/authenticated clients are
-- denied direct table access.

ALTER TABLE "CustomerLead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderCapture" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "CustomerLead" FROM PUBLIC;
REVOKE ALL ON TABLE "OrderCapture" FROM PUBLIC;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "CustomerLead" FROM anon;
    REVOKE ALL ON TABLE "OrderCapture" FROM anon;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "CustomerLead" FROM authenticated;
    REVOKE ALL ON TABLE "OrderCapture" FROM authenticated;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS "CustomerLead_createdAt_idx"
  ON "CustomerLead" ("createdAt" DESC);

CREATE INDEX IF NOT EXISTS "CustomerLead_lastSeenAt_idx"
  ON "CustomerLead" ("lastSeenAt" DESC);

CREATE INDEX IF NOT EXISTS "OrderCapture_createdAt_idx"
  ON "OrderCapture" ("createdAt" DESC);

CREATE INDEX IF NOT EXISTS "OrderCapture_customerLeadId_idx"
  ON "OrderCapture" ("customerLeadId");
