-- 009_admin_signature.sql
-- Agency signature columns. They existed in schema.sql and the code but
-- were missing from the migration history. Idempotent, safe on production.
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS admin_signature_data TEXT,
  ADD COLUMN IF NOT EXISTS admin_signed_at TIMESTAMPTZ;