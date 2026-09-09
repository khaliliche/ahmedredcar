import { readFileSync } from "fs";

const raw = readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  raw
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      const key = l.slice(0, idx).trim();
      let val = l.slice(idx + 1).trim();
      val = val.replace(/^"|"$/g, "");
      return [key, val];
    })
);

process.env.DATABASE_URL = env.DATABASE_URL;

const { default: postgres } = await import("postgres");
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

await sql`
  CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    price_per_day INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`DROP TABLE IF EXISTS reservations`;

await sql`
  CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    vehicle_label TEXT NOT NULL,

    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    cin_number TEXT NOT NULL,
    license_issue_date DATE NOT NULL,
    driver_address TEXT NOT NULL DEFAULT '',
    driver_phone TEXT NOT NULL DEFAULT '',
    driver_license_number TEXT NOT NULL DEFAULT '',
    driver_passport_number TEXT NOT NULL DEFAULT '',

    has_second_driver BOOLEAN NOT NULL DEFAULT false,
    second_driver_full_name TEXT NOT NULL DEFAULT '',
    second_driver_address TEXT NOT NULL DEFAULT '',
    second_driver_phone TEXT NOT NULL DEFAULT '',
    second_driver_cin_number TEXT NOT NULL DEFAULT '',
    second_driver_license_number TEXT NOT NULL DEFAULT '',
    second_driver_passport_number TEXT NOT NULL DEFAULT '',

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '10:00',
    end_time TIME NOT NULL DEFAULT '10:00',

    registration_plate TEXT NOT NULL DEFAULT '',
    mileage_start INTEGER,
    mileage_end INTEGER,
    damages JSONB NOT NULL DEFAULT '[]'::jsonb,
    equipment JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    pickup_fee NUMERIC(10,2) NOT NULL DEFAULT 0,

    contract_number TEXT UNIQUE,
    contract_generated_at TIMESTAMPTZ,

    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_status_dates
    ON reservations (vehicle_id, status, start_date, end_date)
`;

console.log("Tables ready.");

await sql.end();
