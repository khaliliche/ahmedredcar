-- 011_contract_template_v2.sql
-- New contract template: split names, issue dates, places, advance,
-- prolongation, expected return, fuel. All additive and nullable/defaulted.
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS first_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS last_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS cin_issue_date DATE,
  ADD COLUMN IF NOT EXISTS passport_issue_date DATE,
  ADD COLUMN IF NOT EXISTS second_driver_first_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS second_driver_last_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS second_driver_birth_date DATE,
  ADD COLUMN IF NOT EXISTS second_driver_cin_issue_date DATE,
  ADD COLUMN IF NOT EXISTS second_driver_license_issue_date DATE,
  ADD COLUMN IF NOT EXISTS second_driver_passport_issue_date DATE,
  ADD COLUMN IF NOT EXISTS departure_place TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS return_place TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS advance NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS prolongation TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS expected_return_date DATE,
  ADD COLUMN IF NOT EXISTS expected_return_time TIME,
  ADD COLUMN IF NOT EXISTS fuel_level TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS fuel_type TEXT NOT NULL DEFAULT '';

-- Backfill split names for existing contracts (first word = prénom, rest = nom).
UPDATE reservations
SET first_name = split_part(trim(full_name), ' ', 1),
    last_name  = trim(substr(trim(full_name), length(split_part(trim(full_name), ' ', 1)) + 1))
WHERE first_name = '' AND last_name = '' AND full_name <> '';

UPDATE reservations
SET second_driver_first_name = split_part(trim(second_driver_full_name), ' ', 1),
    second_driver_last_name  = trim(substr(trim(second_driver_full_name), length(split_part(trim(second_driver_full_name), ' ', 1)) + 1))
WHERE second_driver_first_name = '' AND second_driver_last_name = '' AND second_driver_full_name <> '';