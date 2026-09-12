-- Second-driver signing: a fully independent slot from the main driver's.
-- Same shape as the existing signing_token/signer_name/signed_at/signer_ip/
-- signature_data columns, just suffixed _2, so the second driver can get
-- their own link, sign on their own phone, without touching the main
-- driver's signature at all.

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS signing_token_2 UUID UNIQUE,
  ADD COLUMN IF NOT EXISTS signing_token_2_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signer_2_name TEXT,
  ADD COLUMN IF NOT EXISTS signed_2_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS signer_2_ip TEXT,
  ADD COLUMN IF NOT EXISTS signature_2_data TEXT;

CREATE INDEX IF NOT EXISTS idx_reservations_signing_token_2 ON reservations (signing_token_2);
