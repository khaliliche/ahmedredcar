-- C1: Prevent deleting vehicles that are referenced by reservations.
--
-- The old foreign key used ON DELETE SET NULL, which could destroy
-- the vehicle relationship on existing contracts/reservations.

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT tc.constraint_name
  INTO constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema = kcu.table_schema
  WHERE tc.table_schema = 'public'
    AND tc.table_name = 'reservations'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'vehicle_id'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format(
      'ALTER TABLE reservations DROP CONSTRAINT %I',
      constraint_name
    );
  END IF;
END
$$;

ALTER TABLE reservations
  ADD CONSTRAINT reservations_vehicle_id_fkey
  FOREIGN KEY (vehicle_id)
  REFERENCES vehicles(id)
  ON DELETE RESTRICT;