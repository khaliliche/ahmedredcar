DROP TABLE IF EXISTS vehicles;

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price_per_day INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
