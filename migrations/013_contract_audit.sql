-- Audit trail for contract edits and signing events.
CREATE TABLE IF NOT EXISTS contract_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reservation_id bigint NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  actor text NOT NULL DEFAULT 'admin',
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contract_audit_reservation_idx
  ON contract_audit (reservation_id, created_at);