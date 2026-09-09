-- 002_contract_and_availability.sql
-- Additive only — safe to run against the existing production database.
-- Adds: driver/second-driver contact+document fields, vehicle pickup/return
-- times, admin handover fields (plate, mileage, damages, equipment, fees),
-- and the contract identity fields. Also adds the index needed for the
-- date-overlap availability check (Feature 2).

-- ---- Driver (main) ----------------------------------------------------
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS driver_address           TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS driver_phone             TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS driver_license_number    TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS driver_passport_number   TEXT NOT NULL DEFAULT '';

-- ---- Second driver (optional block) -----------------------------------
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS has_second_driver              BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS second_driver_full_name        TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS second_driver_address          TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS second_driver_phone            TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS second_driver_cin_number       TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS second_driver_license_number   TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS second_driver_passport_number  TEXT NOT NULL DEFAULT '';

-- ---- Vehicle pickup / return time (dates already existed) -------------
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS start_time TIME NOT NULL DEFAULT '10:00';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS end_time   TIME NOT NULL DEFAULT '10:00';

-- ---- Admin handover completion -----------------------------------------
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS registration_plate TEXT NOT NULL DEFAULT '';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS mileage_start      INTEGER;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS mileage_end        INTEGER;
-- damages: JSON array of { zone: string, type: string, note: string }
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS damages   JSONB NOT NULL DEFAULT '[]'::jsonb;
-- equipment: JSON object of { [equipmentKey: string]: boolean }
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS equipment JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS pickup_fee   NUMERIC(10,2) NOT NULL DEFAULT 0;

-- ---- Contract identity (assigned once, on first confirmation) ---------
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS contract_number       TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS contract_generated_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reservations_contract_number_key'
  ) THEN
    ALTER TABLE reservations ADD CONSTRAINT reservations_contract_number_key UNIQUE (contract_number);
  END IF;
END $$;

-- ---- Availability check index (Feature 2) ------------------------------
-- Speeds up: "for vehicle X, any confirmed reservation whose [start,end]
-- overlaps the requested range?"
CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_status_dates
  ON reservations (vehicle_id, status, start_date, end_date);
