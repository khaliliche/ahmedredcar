import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { getTieredPricing } from "./pricing";

export const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  price_per_day: number;
  price_extended_15: number;
  price_monthly_30: number;
  min_rental_days: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type ReservationStatus = "pending" | "contacted" | "confirmed" | "cancelled";

// zone matches DAMAGE_ZONES in lib/contract.ts; type is a short free label
// ("rayure", "bosse", "fissure", ...) entered by the admin, not an enum,
// to avoid over-constraining a physical inspection.
export type DamageEntry = {
  zone: string;
  type: string;
  note: string;
};

// key matches EQUIPMENT_ITEMS in lib/contract.ts.
export type EquipmentChecklist = Record<string, boolean>;

export type Reservation = {
  id: number;
  vehicle_id: number | null;
  vehicle_label: string;

  // Driver (main)
  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;

  // Second driver (optional block)
  has_second_driver: boolean;
  second_driver_full_name: string;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_license_number: string;
  second_driver_passport_number: string;

  // Rental period
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;

  // Pricing / billing
  price_per_day: number;
  min_rental_days: number;
  override_total_ttc: number | null;
  advance: number;
  prolongation: string;
  expected_return_date: string | null;
  expected_return_time: string | null;

  // Flow
  status: ReservationStatus;
  contract_number: string | null;
  contract_generated_at: string | null;
  created_at: string;

  // Signing
  signing_token: string | null;
  signing_token_expires_at: string | null;
  signed_at: string | null;
  signer_name: string | null;
  signer_ip: string | null;
  signature_data: string | null;

  // Second driver signing
  signing_token_2: string | null;
  signing_token_2_expires_at: string | null;
  signed_2_at: string | null;
  signer_2_name: string | null;
  signer_2_ip: string | null;
  signature_2_data: string | null;

  // Admin signature
  admin_signed_at: string | null;
  admin_signature_data: string | null;

  // Source
  source: string | null;

  // Handover / contract content
  registration_plate: string;
  mileage_start: number | null;
  mileage_end: number | null;
  damages: DamageEntry[];
  equipment: EquipmentChecklist;
  delivery_fee: number;
  pickup_fee: number;
  departure_place: string;
  return_place: string;
  fuel_level: string;
  fuel_type: string;

  // Driver extra fields
  first_name: string;
  last_name: string;
  birth_date: string | null;
  cin_issue_date: string | null;
  passport_issue_date: string | null;
  second_driver_first_name: string;
  second_driver_last_name: string;
  second_driver_birth_date: string | null;
  second_driver_cin_issue_date: string | null;
  second_driver_license_issue_date: string | null;
  second_driver_passport_issue_date: string | null;

  // Convenience label for admin lists ("Peugeot 208 — 12→15 oct")
  end_label: string;
};

export async function getVehicles(): Promise<Vehicle[]> {
  const rows = await sql<Vehicle[]>`
    SELECT v.*, COUNT(r.id) AS reservation_count
    FROM vehicles v
    LEFT JOIN reservations r ON r.vehicle_id = v.id AND r.status = 'confirmed'
    GROUP BY v.id
    ORDER BY v.brand, v.model
  `;
  return rows;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const rows = await sql<Vehicle[]>`SELECT * FROM vehicles WHERE slug = ${slug}`;
  return rows[0] ?? null;
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const rows = await sql<Vehicle[]>`SELECT * FROM vehicles WHERE id = ${id}`;
  return rows[0] ?? null;
}

export async function createVehicle(data: {
  brand: string;
  model: string;
  price_per_day: number;
  description: string;
  image_url: string;
}): Promise<Vehicle> {
  const slug = `${data.brand}-${data.model}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const pricing = getTieredPricing(data.price_per_day);

  const rows = await sql<Vehicle[]>`
    INSERT INTO vehicles (
      slug, brand, model, price_per_day,
      price_extended_15, price_monthly_30,
      description, image_url
    )
    VALUES (
      ${slug}, ${data.brand}, ${data.model}, ${data.price_per_day},
      ${pricing.price_extended_15}, ${pricing.price_monthly_30},
      ${data.description}, ${data.image_url}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function updateVehicle(
  id: number,
  data: {
    brand: string;
    model: string;
    price_per_day: number;
    description: string;
    image_url: string;
  }
): Promise<Vehicle> {
  const slug = `${data.brand}-${data.model}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const pricing = getTieredPricing(data.price_per_day);

  const rows = await sql<Vehicle[]>`
    UPDATE vehicles
    SET slug = ${slug},
        brand = ${data.brand},
        model = ${data.model},
        price_per_day = ${data.price_per_day},
        price_extended_15 = ${pricing.price_extended_15},
        price_monthly_30 = ${pricing.price_monthly_30},
        description = ${data.description},
        image_url = ${data.image_url}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function deleteVehicle(id: number) {
  await sql`DELETE FROM vehicles WHERE id = ${id}`;
}

export type CreateReservationInput = {
  vehicle_id: number;

  full_name: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  age: number;
  cin_number: string;
  cin_issue_date: string | null;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;
  passport_issue_date: string | null;

  has_second_driver: boolean;
  second_driver_full_name: string;
  second_driver_first_name: string;
  second_driver_last_name: string;
  second_driver_birth_date: string | null;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_cin_issue_date: string | null;
  second_driver_license_number: string;
  second_driver_license_issue_date: string | null;
  second_driver_passport_number: string;
  second_driver_passport_issue_date: string | null;

  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
};

// Public (website) reservation: always starts as 'pending' / 'online'.
// Admin handover and billing fields are never accepted here.
export async function createReservation(data: CreateReservationInput): Promise<Reservation> {
  const vehicle = await getVehicleById(data.vehicle_id);
  if (!vehicle) throw new Error("Vehicle not found");
  const vehicleLabel = `${vehicle.brand} ${vehicle.model}`.trim();

  const rows = await sql<Reservation[]>`
    INSERT INTO reservations (
      vehicle_id, vehicle_label,
      full_name, first_name, last_name, birth_date, age,
      cin_number, cin_issue_date, license_issue_date,
      driver_address, driver_phone, driver_license_number,
      driver_passport_number, passport_issue_date,
      has_second_driver,
      second_driver_full_name, second_driver_first_name, second_driver_last_name,
      second_driver_birth_date, second_driver_address, second_driver_phone,
      second_driver_cin_number, second_driver_cin_issue_date,
      second_driver_license_number, second_driver_license_issue_date,
      second_driver_passport_number, second_driver_passport_issue_date,
      start_date, end_date, start_time, end_time,
      status, source
    )
    VALUES (
      ${vehicle.id}, ${vehicleLabel},
      ${data.full_name}, ${data.first_name}, ${data.last_name}, ${data.birth_date}, ${data.age},
      ${data.cin_number}, ${data.cin_issue_date}, ${data.license_issue_date},
      ${data.driver_address}, ${data.driver_phone}, ${data.driver_license_number},
      ${data.driver_passport_number}, ${data.passport_issue_date},
      ${data.has_second_driver},
      ${data.second_driver_full_name}, ${data.second_driver_first_name}, ${data.second_driver_last_name},
      ${data.second_driver_birth_date}, ${data.second_driver_address}, ${data.second_driver_phone},
      ${data.second_driver_cin_number}, ${data.second_driver_cin_issue_date},
      ${data.second_driver_license_number}, ${data.second_driver_license_issue_date},
      ${data.second_driver_passport_number}, ${data.second_driver_passport_issue_date},
      ${data.start_date}, ${data.end_date}, ${data.start_time}, ${data.end_time},
      'pending', 'online'
    )
    RETURNING *
  `;
  return rows[0];
}

export async function getReservations(): Promise<Reservation[]> {
  return sql<Reservation[]>`
    SELECT *,
      to_char(end_date, 'DD Mon YYYY') AS end_label
    FROM reservations
    ORDER BY created_at DESC
  `;
}

export async function getReservationById(id: number): Promise<Reservation | null> {
  const rows = await sql<Reservation[]>`
    SELECT *,
      to_char(end_date, 'DD Mon YYYY') AS end_label
    FROM reservations
    WHERE id = ${id}
  `;
  return rows[0] ?? null;
}

export async function updateReservationStatus(id: number, status: ReservationStatus) {
  await sql`UPDATE reservations SET status = ${status} WHERE id = ${id}`;
}

// NOTE: plain availability checks are always racy. Only use this for UI
// hints; the actual booking decision must go through lockVehicle() +
// getBlockingReservation() inside a transaction (see confirmReservation
// and updateReservationContractChecked below).
export async function isVehicleAvailable(
  vehicleId: number,
  startDate: string,
  endDate: string,
  excludeReservationId?: number
): Promise<boolean> {
  const rows = await sql<{ id: number }[]>`
    SELECT id FROM reservations
    WHERE vehicle_id = ${vehicleId}
      AND status = 'confirmed'
      AND start_date < ${endDate}::date
      AND end_date > ${startDate}::date
      ${excludeReservationId ? sql`AND id != ${excludeReservationId}` : sql``}
    LIMIT 1
  `;
  return rows.length === 0;
}

export async function getAvailableVehicles(
  startDate?: string,
  endDate?: string
): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  // No (or malformed) dates in the URL: show the whole fleet.
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  if (!startDate || !endDate || !isoDate.test(startDate) || !isoDate.test(endDate)) {
    return vehicles;
  }
  const rows = await sql<{ vehicle_id: number }[]>`
    SELECT vehicle_id FROM reservations
    WHERE status = 'confirmed'
      AND start_date < ${endDate}::date
      AND end_date > ${startDate}::date
  `;
  const bookedIds = new Set(rows.map((r) => r.vehicle_id));
  return vehicles.filter((v) => !bookedIds.has(v.id));
}

// Confirming a reservation is the moment it actually blocks the vehicle,
// so this is where we re-check for a conflicting confirmed booking
// (another admin could have confirmed an overlapping request in the
// meantime). Everything happens in ONE transaction, under a lock on the
// reservation row and the vehicle, and the exclusion constraint (23P01)
// is caught so a racing admin gets a clean "conflict" instead of a 500.
export async function confirmReservation(
  id: number
): Promise<{ ok: true } | { ok: false; reason: "conflict" | "notFound" }> {
  try {
    return await sql.begin(async (tx) => {
      // 1) Lock the reservation row and read its dates.
      const rows = await tx<{
        vehicle_id: number | null;
        start_date: unknown;
        end_date: unknown;
      }[]>`
        SELECT vehicle_id, start_date, end_date
        FROM reservations
        WHERE id = ${id}
        FOR UPDATE
      `;
      if (rows.length === 0 || !rows[0].vehicle_id) {
        return { ok: false, reason: "notFound" } as const;
      }
      const { vehicle_id, start_date, end_date } = rows[0];

      // DATE columns may come back as Date objects.
      const asDate = (v: unknown) =>
        v instanceof Date ? v.toISOString().slice(0, 10) : String(v);

      // 2) Serialise against every other booking of this vehicle.
      await lockVehicle(tx as unknown as postgres.Sql, vehicle_id);

      const blocking = await getBlockingReservation(
        vehicle_id,
        asDate(start_date),
        asDate(end_date),
        id,
        tx as unknown as postgres.Sql
      );
      if (blocking) {
        return { ok: false, reason: "conflict" } as const;
      }

      // 3) Confirm inside the same transaction.
      await tx`
        UPDATE reservations
        SET status = 'confirmed',
            contract_number = COALESCE(
              contract_number,
              'ARC-' || to_char(now(), 'YYYY') || '-' || lpad(id::text, 5, '0')
            ),
            contract_generated_at = COALESCE(contract_generated_at, now())
        WHERE id = ${id}
      `;
      return { ok: true } as const;
    });
  } catch (err) {
    // Two admins confirmed overlapping bookings at the same moment:
    // the exclusion constraint (23P01) fires — show a clean error.
    if (isOverlapError(err)) {
      return { ok: false, reason: "conflict" };
    }
    throw err;
  }
}

// Feature 1 — admin handover completion (plate, mileage, damages,
// equipment, delivery/pickup fees). Deliberately separate from the
// client-facing createReservation() input.
export async function updateReservationHandover(
  id: number,
  data: {
    registration_plate: string;
    mileage_start: number | null;
    mileage_end: number | null;
    damages: DamageEntry[];
    equipment: EquipmentChecklist;
    delivery_fee: number;
    pickup_fee: number;
  }
): Promise<Reservation> {
  const rows = await sql<Reservation[]>`
    UPDATE reservations
    SET registration_plate = ${data.registration_plate},
        mileage_start = ${data.mileage_start},
        mileage_end = ${data.mileage_end},
        damages = ${sql.json(data.damages)},
        equipment = ${sql.json(data.equipment)},
        delivery_fee = ${data.delivery_fee},
        pickup_fee = ${data.pickup_fee}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function deleteReservation(id: number) {
  await sql`DELETE FROM reservations WHERE id = ${id}`;
}

// Feature 3 — full contract editing. Lets an admin correct any section of
// the PDF (driver, second driver, vehicle label/plate, dates, handover
// details, and an optional manual override of the three billing totals)
// from one form, before (re)generating the PDF. Billing overrides are
// nullable: leaving them blank keeps the normal calculated value (see
// lib/contract.ts:resolveBilling).
export type UpdateReservationContractInput = {
  // Admin-chosen serial number for the printed contract. Blank/undefined
  // keeps whatever is already stored (and confirmReservation() will still
  // auto-generate one later if it's still empty at that point).
  contract_number?: string | null;

  vehicle_id?: number | null;
  vehicle_label: string;
  registration_plate: string;

  full_name: string;
  first_name?: string;
  last_name?: string;
  age: number;
  birth_date?: string | null;
  cin_number: string;
  cin_issue_date?: string | null;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;
  passport_issue_date?: string | null;

  has_second_driver: boolean;
  second_driver_full_name: string;
  second_driver_first_name?: string;
  second_driver_last_name?: string;
  second_driver_birth_date?: string | null;
  second_driver_address: string;
  second_driver_phone: string;
  second_driver_cin_number: string;
  second_driver_cin_issue_date?: string | null;
  second_driver_license_number: string;
  second_driver_license_issue_date?: string | null;
  second_driver_passport_number: string;
  second_driver_passport_issue_date?: string | null;

  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  departure_place?: string;
  return_place?: string;

  advance?: number;
  override_total_ttc?: number | null;
  prolongation?: string;
  expected_return_date?: string | null;
  expected_return_time?: string | null;

  fuel_level?: string;
  fuel_type?: string;

  damages: DamageEntry[];
};

export async function updateReservationContract(
  id: number,
  data: UpdateReservationContractInput,
  db: postgres.Sql = sql
): Promise<Reservation> {
  // undefined = keep the stored value, otherwise write the given value (null clears).
  const keepOr = <T>(value: T | undefined, column: string) =>
    value === undefined ? db(column) : value;

  const rows = await db<Reservation[]>`
    UPDATE reservations
    SET contract_number = COALESCE(${data.contract_number || null}, contract_number),
        full_name = ${data.full_name},
        age = ${data.age},
        cin_number = ${data.cin_number},
        license_issue_date = ${data.license_issue_date},
        driver_address = ${data.driver_address},
        driver_phone = ${data.driver_phone},
        driver_license_number = ${data.driver_license_number},
        driver_passport_number = ${data.driver_passport_number},

        first_name = COALESCE(${data.first_name ?? null}, first_name),
        last_name = COALESCE(${data.last_name ?? null}, last_name),
        birth_date = ${keepOr(data.birth_date, "birth_date")},
        cin_issue_date = ${keepOr(data.cin_issue_date, "cin_issue_date")},
        passport_issue_date = ${keepOr(data.passport_issue_date, "passport_issue_date")},

        has_second_driver = ${data.has_second_driver},
        second_driver_full_name = ${data.second_driver_full_name},
        second_driver_address = ${data.second_driver_address},
        second_driver_phone = ${data.second_driver_phone},
        second_driver_cin_number = ${data.second_driver_cin_number},
        second_driver_license_number = ${data.second_driver_license_number},
        second_driver_passport_number = ${data.second_driver_passport_number},

        second_driver_first_name = COALESCE(${data.second_driver_first_name ?? null}, second_driver_first_name),
        second_driver_last_name = COALESCE(${data.second_driver_last_name ?? null}, second_driver_last_name),
        second_driver_birth_date = ${keepOr(data.second_driver_birth_date, "second_driver_birth_date")},
        second_driver_cin_issue_date = ${keepOr(data.second_driver_cin_issue_date, "second_driver_cin_issue_date")},
        second_driver_license_issue_date = ${keepOr(data.second_driver_license_issue_date, "second_driver_license_issue_date")},
        second_driver_passport_issue_date = ${keepOr(data.second_driver_passport_issue_date, "second_driver_passport_issue_date")},

        vehicle_id = COALESCE(${data.vehicle_id ?? null}, vehicle_id),
        vehicle_label = ${data.vehicle_label},
        registration_plate = ${data.registration_plate},

        start_date = ${data.start_date},
        end_date = ${data.end_date},
        start_time = ${data.start_time},
        end_time = ${data.end_time},

        departure_place = COALESCE(${data.departure_place ?? null}, departure_place),
        return_place = COALESCE(${data.return_place ?? null}, return_place),
        advance = COALESCE(${data.advance ?? null}, advance),
        prolongation = COALESCE(${data.prolongation ?? null}, prolongation),
        expected_return_date = ${keepOr(data.expected_return_date, "expected_return_date")},
        expected_return_time = ${keepOr(data.expected_return_time, "expected_return_time")},
        fuel_level = COALESCE(${data.fuel_level ?? null}, fuel_level),
        fuel_type = COALESCE(${data.fuel_type ?? null}, fuel_type),

        damages = ${db.json(data.damages)},
        override_total_ttc = ${data.override_total_ttc ?? null}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

// True when Postgres rejected a write because of an exclusion constraint
// (SQLSTATE 23P01), i.e. two confirmed bookings overlap on the same vehicle.
export function isOverlapError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "23P01"
  );
}

// True when Postgres rejected a write because of a UNIQUE constraint
// (SQLSTATE 23505) — used to catch an admin typing in a contract serial
// number that's already used by another reservation.
export function isUniqueViolation(err: unknown, constraint?: string): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; constraint_name?: string };
  if (e.code !== "23505") return false;
  return constraint ? e.constraint_name === constraint : true;
}

// Serialises everything that can book a vehicle. Call it INSIDE a
// transaction (sql.begin): the lock is released automatically on
// commit/rollback. Lock order used everywhere: reservation row
// (FOR UPDATE) first, then the vehicle, so two admins can never deadlock.
export async function lockVehicle(tx: postgres.Sql, vehicleId: number): Promise<void> {
  await tx`SELECT pg_advisory_xact_lock(1001, ${vehicleId}::int)`;
}

export type ContractUpdateResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: "notFound" }
  | { ok: false; reason: "signed" }
  | { ok: false; reason: "conflict"; endLabel: string }
  | { ok: false; reason: "duplicateContractNumber" };

// C3 - saving edits of a reservation: the availability check and the UPDATE
// now happen in ONE transaction, under a lock on the target vehicle, so
// another admin cannot confirm an overlapping booking in between.
// Additionally, once ANY party has signed (client, second driver or admin)
// the content is legally bound and editing is refused, and every successful
// edit is written to the contract_audit trail in the same transaction.
export async function updateReservationContractChecked(
  id: number,
  data: UpdateReservationContractInput
): Promise<ContractUpdateResult> {
  try {
    return await updateReservationContractCheckedTx(id, data);
  } catch (err) {
    if (isUniqueViolation(err, "reservations_contract_number_key")) {
      return { ok: false, reason: "duplicateContractNumber" };
    }
    throw err;
  }
}

async function updateReservationContractCheckedTx(
  id: number,
  data: UpdateReservationContractInput
): Promise<ContractUpdateResult> {
  return sql.begin(async (tx): Promise<ContractUpdateResult> => {
    // 1) Lock the reservation row and read its CURRENT state,
    //    including any signature already attached.
    const current = await tx<{
      vehicle_id: number | null;
      status: ReservationStatus;
      signed_at: unknown;
      signed_2_at: unknown;
      admin_signed_at: unknown;
    }[]>`
      SELECT vehicle_id, status, signed_at, signed_2_at, admin_signed_at
      FROM reservations
      WHERE id = ${id}
      FOR UPDATE
    `;
    if (current.length === 0) return { ok: false, reason: "notFound" };

    // 1b) A signature legally binds the contract content: refuse to edit.
    if (
      current[0].signed_at ||
      current[0].signed_2_at ||
      current[0].admin_signed_at
    ) {
      return { ok: false, reason: "signed" };
    }

    // 2) Lock the vehicle the reservation will end up on.
    const vehicleId = data.vehicle_id ?? current[0].vehicle_id;
    if (vehicleId) await lockVehicle(tx as unknown as postgres.Sql, vehicleId);

    // 3) Only confirmed reservations block a car, so only they are re-checked.
    if (current[0].status === "confirmed" && vehicleId) {
      const blocking = await getBlockingReservation(
        vehicleId,
        data.start_date,
        data.end_date,
        id,
        tx as unknown as postgres.Sql
      );
      if (blocking) {
        return { ok: false, reason: "conflict", endLabel: blocking.end_label };
      }
    }

    // 4) Same UPDATE as before, on the same transaction.
    const reservation = await updateReservationContract(id, data, tx as unknown as postgres.Sql);

    // 5) Audit log of the edit, committed with the same transaction.
    await tx`
      INSERT INTO contract_audit (reservation_id, actor, action, details)
      VALUES (
        ${id},
        'admin',
        'contract_edit',
        ${tx.json({
          vehicle_id: data.vehicle_id ?? null,
          start_date: data.start_date,
          end_date: data.end_date,
          full_name: data.full_name,
          advance: data.advance ?? null,
          override_total_ttc: data.override_total_ttc ?? null,
        })}
      )
    `;

    return { ok: true, reservation };
  });
}

// Feature 4 - remote signing. The admin generates a single-use, expiring
// link; the client signs on a public page; the signature (PNG data URL),
// typed name, IP and timestamp land on the reservation and are rendered
// in the contract PDF.
export async function createSigningToken(id: number): Promise<string | null> {
  const token = randomUUID();
  const rows = await sql<{ signing_token: string }[]>`
    UPDATE reservations
    SET signing_token = ${token},
        signing_token_expires_at = now() + interval '7 days'
    WHERE id = ${id}
    RETURNING signing_token
  `;
  return rows[0]?.signing_token ?? null;
}

export async function getReservationBySigningToken(token: string): Promise<Reservation | null> {
  // Guard garbage tokens that Postgres would reject as invalid UUIDs.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return null;
  }
  const rows = await sql<Reservation[]>`
    SELECT *,
      to_char(end_date, 'DD Mon YYYY') AS end_label
    FROM reservations
    WHERE signing_token = ${token} OR signing_token_2 = ${token}
  `;
  return rows[0] ?? null;
}

export function isSecondDriverToken(reservation: Reservation, token: string): boolean {
  return (
    !!reservation.signing_token_2 &&
    reservation.signing_token_2.toLowerCase() === token.toLowerCase()
  );
}

// Atomically consumes the main-driver token: the UPDATE only matches when
// the token exists AND has not expired AND has not been used yet, so a
// double submit or a replayed link signs exactly once.
export async function consumeSigningToken(
  token: string,
  data: { signer_name: string; signer_ip: string; signature_data: string }
): Promise<boolean> {
  const rows = await sql<{ id: number }[]>`
    UPDATE reservations
    SET signed_at = now(),
        signer_name = ${data.signer_name},
        signer_ip = ${data.signer_ip},
        signature_data = ${data.signature_data}
    WHERE signing_token = ${token}
      AND signing_token_expires_at > now()
      AND signed_at IS NULL
    RETURNING id
  `;
  return rows.length === 1;
}

export async function setAdminSignature(
  id: number,
  signatureData: string | null
): Promise<void> {
  await sql`
    UPDATE reservations
    SET admin_signature_data = ${signatureData},
        admin_signed_at = CASE WHEN ${signatureData}::text IS NULL THEN NULL ELSE now() END
    WHERE id = ${id}
  `;
}

export async function createSigningToken2(id: number): Promise<string | null> {
  const token = randomUUID();
  const rows = await sql<{ signing_token_2: string }[]>`
    UPDATE reservations
    SET signing_token_2 = ${token},
        signing_token_2_expires_at = now() + interval '7 days'
    WHERE id = ${id}
    RETURNING signing_token_2
  `;
  return rows[0]?.signing_token_2 ?? null;
}

// Same single-use, expiring semantics as consumeSigningToken, for the
// second driver's independent signing slot.
export async function consumeSigningToken2(
  token: string,
  data: { signer_name: string; signer_ip: string; signature_data: string }
): Promise<boolean> {
  const rows = await sql<{ id: number }[]>`
    UPDATE reservations
    SET signed_2_at = now(),
        signer_2_name = ${data.signer_name},
        signer_2_ip = ${data.signer_ip},
        signature_2_data = ${data.signature_data}
    WHERE signing_token_2 = ${token}
      AND signing_token_2_expires_at > now()
      AND signed_2_at IS NULL
    RETURNING id
  `;
  return rows.length === 1;
}

// ---------------------------------------------------------------------------
// Login-attempt limiting (ban logic lives in lib/auth.ts)
// ---------------------------------------------------------------------------

export async function getLockExpiry(key: string): Promise<Date | null> {
  const rows = await sql<{ locked_until: Date }[]>`
    SELECT locked_until FROM login_attempts
    WHERE ip = ${key}
      AND locked_until IS NOT NULL
      AND locked_until > now()
  `;
  return rows[0]?.locked_until ?? null;
}

// Each failure increments the counter; when it reaches maxAttempts the key
// is locked for banMs and the counter restarts (see BANLOGIC.md).
export async function recordFailedAttempt(
  key: string,
  opts: { maxAttempts: number; banMs: number }
): Promise<void> {
  await sql`
    INSERT INTO login_attempts (ip, count, locked_until)
    VALUES (${key}, 1, NULL)
    ON CONFLICT (ip) DO UPDATE SET
      count = CASE
        WHEN login_attempts.count + 1 >= ${opts.maxAttempts}::int THEN 0
        ELSE login_attempts.count + 1
      END,
      locked_until = CASE
        WHEN login_attempts.count + 1 >= ${opts.maxAttempts}::int
        THEN now() + ${opts.banMs}::float8 * interval '1 millisecond'
        ELSE login_attempts.locked_until
      END
  `;
}

export async function clearFailures(key: string): Promise<void> {
  await sql`DELETE FROM login_attempts WHERE ip = ${key}`;
}

export async function consumeWindowedLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const rows = await sql<{ allowed: boolean }[]>`
    INSERT INTO rate_limits (key, count, window_start)
    VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE
        WHEN rate_limits.window_start < now() - ${windowMs}::float8 * interval '1 millisecond'
        THEN 1
        ELSE rate_limits.count + 1
      END,
      window_start = CASE
        WHEN rate_limits.window_start < now() - ${windowMs}::float8 * interval '1 millisecond'
        THEN now()
        ELSE rate_limits.window_start
      END
    RETURNING (count <= ${limit}::int) AS allowed
  `;
  return rows[0]?.allowed ?? false;
}

// The single source of truth for "is this car booked for these dates".
// Pass a transaction client (tx) to run it under lockVehicle(); without
// one it is a best-effort read for UI hints only.
export async function getBlockingReservation(
  vehicleId: number,
  startDate: string,
  endDate: string,
  excludeReservationId?: number,
  db: postgres.Sql = sql
): Promise<{ id: number; end_label: string } | null> {
  const rows = await db<{ id: number; end_label: string }[]>`
    SELECT id, to_char(end_date, 'DD Mon YYYY') AS end_label
    FROM reservations
    WHERE vehicle_id = ${vehicleId}
      AND status = 'confirmed'
      AND start_date < ${endDate}::date
      AND end_date > ${startDate}::date
      ${excludeReservationId ? db`AND id != ${excludeReservationId}` : db``}
    ORDER BY end_date DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}