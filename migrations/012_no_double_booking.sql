-- 012_no_double_booking.sql
-- Makes double bookings impossible at the database level: two CONFIRMED
-- reservations of the same vehicle can never have overlapping dates
-- (both start and end days are inclusive, like the app's availability check).
-- This closes the race where two admins confirm at the same moment.

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Stop with a readable message if the data already contains an overlap,
-- instead of failing with an obscure constraint error.
DO $$
DECLARE
  clash TEXT;
BEGIN
  SELECT string_agg('#' || a.id || ' / #' || b.id || ' (vehicle ' || a.vehicle_id || ')', ', ')
    INTO clash
  FROM reservations a
  JOIN reservations b
    ON a.id < b.id
   AND a.vehicle_id = b.vehicle_id
   AND a.status = 'confirmed'
   AND b.status = 'confirmed'
   AND a.start_date <= b.end_date
   AND a.end_date >= b.start_date;

  IF clash IS NOT NULL THEN
    RAISE EXCEPTION
      'Overlapping confirmed reservations already exist: %. Cancel or fix one of each pair, then run this migration again.',
      clash;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reservations_no_overlap'
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_no_overlap
      EXCLUDE USING gist (
        vehicle_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
      )
      WHERE (status = 'confirmed' AND vehicle_id IS NOT NULL);
  END IF;
END $$;
