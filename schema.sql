-- Baseline schema for a FRESH, EMPTY database only.
-- Never drops anything. Apply it with: npm run db:migrate
-- (the runner detects an empty database, applies this file, and records
-- every migration as already applied). Existing databases use migrations/.

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price_per_day INTEGER NOT NULL,
  min_rental_days INTEGER NOT NULL DEFAULT 5,
  price_extended_15 NUMERIC NOT NULL,
  price_monthly_30 NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE RESTRICT,
  vehicle_label TEXT NOT NULL,

  -- Driver (main)
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  cin_number TEXT NOT NULL,
  license_issue_date DATE NOT NULL,
  driver_address TEXT NOT NULL DEFAULT '',
  driver_phone TEXT NOT NULL DEFAULT '',
  driver_license_number TEXT NOT NULL DEFAULT '',
  driver_passport_number TEXT NOT NULL DEFAULT '',

  -- Second driver (optional block)
  has_second_driver BOOLEAN NOT NULL DEFAULT false,
  second_driver_full_name TEXT NOT NULL DEFAULT '',
  second_driver_address TEXT NOT NULL DEFAULT '',
  second_driver_phone TEXT NOT NULL DEFAULT '',
  second_driver_cin_number TEXT NOT NULL DEFAULT '',
  second_driver_license_number TEXT NOT NULL DEFAULT '',
  second_driver_passport_number TEXT NOT NULL DEFAULT '',

  -- Rental period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '10:00',
  end_time TIME NOT NULL DEFAULT '10:00',

  -- Admin handover completion
  registration_plate TEXT NOT NULL DEFAULT '',
  mileage_start INTEGER,
  mileage_end INTEGER,
  damages JSONB NOT NULL DEFAULT '[]'::jsonb,
  equipment JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  pickup_fee NUMERIC(10,2) NOT NULL DEFAULT 0,

  -- Contract template v2 (see migrations/011)
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  birth_date DATE,
  cin_issue_date DATE,
  passport_issue_date DATE,
  second_driver_first_name TEXT NOT NULL DEFAULT '',
  second_driver_last_name TEXT NOT NULL DEFAULT '',
  second_driver_birth_date DATE,
  second_driver_cin_issue_date DATE,
  second_driver_license_issue_date DATE,
  second_driver_passport_issue_date DATE,
  departure_place TEXT NOT NULL DEFAULT '',
  return_place TEXT NOT NULL DEFAULT '',
  advance NUMERIC(10,2) NOT NULL DEFAULT 0,
  prolongation TEXT NOT NULL DEFAULT '',
  expected_return_date DATE,
  expected_return_time TIME,
  fuel_level TEXT NOT NULL DEFAULT '',
  fuel_type TEXT NOT NULL DEFAULT '',

  -- Admin contract editing
  fait_a TEXT NOT NULL DEFAULT '',
  override_total_ht NUMERIC(10,2),
  override_tva NUMERIC(10,2),
  override_total_ttc NUMERIC(10,2),

  -- Contract identity
  contract_number TEXT UNIQUE,
  contract_generated_at TIMESTAMPTZ,

  -- Remote signing: main driver
  signing_token UUID UNIQUE,
  signing_token_expires_at TIMESTAMPTZ,
  signer_name TEXT,
  signed_at TIMESTAMPTZ,
  signer_ip TEXT,
  signature_data TEXT,

  -- Remote signing: second driver
  signing_token_2 UUID UNIQUE,
  signing_token_2_expires_at TIMESTAMPTZ,
  signer_2_name TEXT,
  signed_2_at TIMESTAMPTZ,
  signer_2_ip TEXT,
  signature_2_data TEXT,

  -- Agency (admin) signature
  admin_signature_data TEXT,
  admin_signed_at TIMESTAMPTZ,

  source TEXT NOT NULL DEFAULT 'online' CHECK (source IN ('online', 'walk_in')),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No double booking: two confirmed reservations of one vehicle can never
-- overlap (see migrations/012_no_double_booking.sql).
CREATE EXTENSION IF NOT EXISTS btree_gist;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reservations_no_overlap') THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_no_overlap
      EXCLUDE USING gist (
        vehicle_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
      )
      WHERE (status = 'confirmed' AND vehicle_id IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_status_dates
  ON reservations (vehicle_id, status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reservations_signing_token
  ON reservations (signing_token);
CREATE INDEX IF NOT EXISTS idx_reservations_signing_token_2
  ON reservations (signing_token_2);

-- Persistent per-key failure counter / rate-limit window.
CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ
);

-- Fixed-window rate limit for the public reservation form
-- (see migrations/014_rate_limits.sql).
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Contract audit trail
CREATE TABLE IF NOT EXISTS contract_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reservation_id bigint NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  actor TEXT NOT NULL DEFAULT 'admin',
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contract_audit_reservation_idx
  ON contract_audit (reservation_id, created_at);
  