-- Feature 4: remote contract signing.
-- signing_token is single-use (nulled after signing) and expires after 7 days.
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS signing_token UUID UNIQUE,
  ADD COLUMN IF NOT EXISTS signing_token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signer_name TEXT,
  ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signer_ip TEXT,
  ADD COLUMN IF NOT EXISTS signature_data TEXT;

CREATE INDEX IF NOT EXISTS idx_reservations_signing_token ON reservations (signing_token);