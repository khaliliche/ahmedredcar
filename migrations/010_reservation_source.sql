-- 010_reservation_source.sql
-- Distinguishes reservations that came from the website ('online') from
-- contracts the admin creates directly at the office ('walk_in').
-- Additive and idempotent: existing rows become 'online'.
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'online'
  CHECK (source IN ('online', 'walk_in'));