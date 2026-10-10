-- Franchise box on the contract: whether the franchise is included
-- ('' = not filled in, 'yes', 'no') and the amount given by the client (DH).
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS franchise_included TEXT NOT NULL DEFAULT ''
  CHECK (franchise_included IN ('', 'yes', 'no'));

ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS franchise_amount NUMERIC(10,2)
  CHECK (franchise_amount IS NULL OR franchise_amount >= 0);