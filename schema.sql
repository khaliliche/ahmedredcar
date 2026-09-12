-- Full schema for a fresh database. For an existing production DB with
-- data already in it, use migrations/*.sql instead (additive, no drops).

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS vehicles;

CREATE TABLE vehicles (
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

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
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

  -- Admin contract editing
  fait_a TEXT NOT NULL DEFAULT '',
  override_total_ht NUMERIC(10,2),
  override_tva NUMERIC(10,2),
  override_total_ttc NUMERIC(10,2),

  -- Contract identity
  contract_number TEXT UNIQUE,
  contract_generated_at TIMESTAMPTZ,

  -- Remote contract signing
  signing_token UUID UNIQUE,
  signing_token_expires_at TIMESTAMPTZ,
  signer_name TEXT,
  signed_at TIMESTAMPTZ,
  signer_ip TEXT,
  signature_data TEXT,

  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reservations_vehicle_status_dates
  ON reservations (vehicle_id, status, start_date, end_date);

CREATE INDEX idx_reservations_signing_token
  ON reservations (signing_token);