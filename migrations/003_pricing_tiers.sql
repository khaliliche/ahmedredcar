-- Adds tiered pricing columns to vehicles and backfills known rates.

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS min_rental_days integer NOT NULL DEFAULT 5;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS price_extended_15 numeric;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS price_monthly_30 numeric;

-- Default: any vehicle without tier data keeps a flat rate (no discount)
-- until you set real numbers for it.
UPDATE vehicles
SET price_extended_15 = price_per_day
WHERE price_extended_15 IS NULL;

UPDATE vehicles
SET price_monthly_30 = price_per_day
WHERE price_monthly_30 IS NULL;

-- Known real tiers from the price list you gave.
UPDATE vehicles
SET price_per_day = 300, price_extended_15 = 280, price_monthly_30 = 250
WHERE price_per_day = 300;

UPDATE vehicles
SET price_per_day = 550, price_extended_15 = 500, price_monthly_30 = 450
WHERE price_per_day = 550;

ALTER TABLE vehicles ALTER COLUMN price_extended_15 SET NOT NULL;
ALTER TABLE vehicles ALTER COLUMN price_monthly_30 SET NOT NULL;
