-- 005_contract_editing.sql
-- Adds fields for full admin contract editing: "Fait a" location and
-- per-contract billing overrides. Overrides are nullable - null means
-- "use the calculated value" (see lib/contract.ts:resolveBilling).

ALTER TABLE reservations ADD COLUMN IF NOT EXISTS fait_a TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS override_total_ht  NUMERIC(10,2);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS override_tva       NUMERIC(10,2);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS override_total_ttc NUMERIC(10,2);
