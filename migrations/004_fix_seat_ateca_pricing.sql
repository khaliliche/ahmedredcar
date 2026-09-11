-- Fixes the Seat Ateca (id 3), which was priced at 500 DH/day flat and
-- got skipped by the 550 DH/day match in 003_pricing_tiers.sql.

UPDATE vehicles
SET price_per_day = 550, price_extended_15 = 500, price_monthly_30 = 450
WHERE id = 3;
