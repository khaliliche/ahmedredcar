import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  price_per_day: number;
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

  // Admin handover completion
  registration_plate: string;
  mileage_start: number | null;
  mileage_end: number | null;
  damages: DamageEntry[];
  equipment: EquipmentChecklist;
  delivery_fee: number;
  pickup_fee: number;

  // Contract identity
  contract_number: string | null;
  contract_generated_at: string | null;

  status: ReservationStatus;
  created_at: string;
};

function slugify(brand: string, model: string) {
  return `${brand}-${model}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueSlug(base: string, excludeId?: number) {
  let slug = base;
  let i = 2;
  while (true) {
    const rows = excludeId
      ? await sql`SELECT id FROM vehicles WHERE slug = ${slug} AND id != ${excludeId}`
      : await sql`SELECT id FROM vehicles WHERE slug = ${slug}`;
    if (rows.length === 0) return slug;
    slug = `${base}-${i}`;
    i++;
  }
}

export async function getVehicles(): Promise<Vehicle[]> {
  const rows = await sql<Vehicle[]>`SELECT * FROM vehicles ORDER BY created_at DESC`;
  return rows;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const rows = await sql<Vehicle[]>`SELECT * FROM vehicles WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const rows = await sql<Vehicle[]>`SELECT * FROM vehicles WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function createVehicle(data: {
  brand: string;
  model: string;
  price_per_day: number;
  description: string;
  image_url: string;
}) {
  const slug = await uniqueSlug(slugify(data.brand, data.model));
  const rows = await sql<Vehicle[]>`
    INSERT INTO vehicles (slug, brand, model, price_per_day, description, image_url)
    VALUES (${slug}, ${data.brand}, ${data.model}, ${data.price_per_day}, ${data.description}, ${data.image_url})
    RETURNING *
  `;
  return rows[0];
}

export async function updateVehicle(
  id: number,
  data: { brand: string; model: string; price_per_day: number; description: string; image_url: string }
) {
  const base = slugify(data.brand, data.model);
  const slug = await uniqueSlug(base, id);
  const rows = await sql<Vehicle[]>`
    UPDATE vehicles
    SET slug = ${slug}, brand = ${data.brand}, model = ${data.model},
        price_per_day = ${data.price_per_day}, description = ${data.description},
        image_url = ${data.image_url}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function deleteVehicle(id: number) {
  await sql`DELETE FROM vehicles WHERE id = ${id}`;
}

// Fields the client-facing reservation form collects. Admin handover
// fields (plate, mileage, damages, equipment, fees) are deliberately not
// accepted here — they're only ever set via updateReservationHandover()
// (see Step 4), so a client submission can never forge them.
export type CreateReservationInput = {
  vehicle_id: number;
  vehicle_label: string;

  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string;
  driver_address: string;
  driver_phone: string;
  driver_license_number: string;
  driver_passport_number: string;

  has_second_driver: boolean;
  second_driver_full_name?: string;
  second_driver_address?: string;
  second_driver_phone?: string;
  second_driver_cin_number?: string;
  second_driver_license_number?: string;
  second_driver_passport_number?: string;

  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
};

export async function createReservation(
  data: CreateReservationInput
): Promise<Reservation> {
  const rows = await sql<Reservation[]>`
    INSERT INTO reservations
      (vehicle_id, vehicle_label,
       full_name, age, cin_number, license_issue_date,
       driver_address, driver_phone, driver_license_number, driver_passport_number,
       has_second_driver,
       second_driver_full_name, second_driver_address, second_driver_phone,
       second_driver_cin_number, second_driver_license_number, second_driver_passport_number,
       start_date, end_date, start_time, end_time)
    VALUES
      (${data.vehicle_id}, ${data.vehicle_label},
       ${data.full_name}, ${data.age}, ${data.cin_number}, ${data.license_issue_date},
       ${data.driver_address}, ${data.driver_phone}, ${data.driver_license_number}, ${data.driver_passport_number},
       ${data.has_second_driver},
       ${data.second_driver_full_name ?? ""}, ${data.second_driver_address ?? ""}, ${data.second_driver_phone ?? ""},
       ${data.second_driver_cin_number ?? ""}, ${data.second_driver_license_number ?? ""}, ${data.second_driver_passport_number ?? ""},
       ${data.start_date}, ${data.end_date}, ${data.start_time}, ${data.end_time})
    RETURNING *
  `;
  return rows[0];
}

export async function getReservations(): Promise<Reservation[]> {
  const rows = await sql<Reservation[]>`SELECT * FROM reservations ORDER BY created_at DESC`;
  return rows;
}

export async function getReservationById(id: number): Promise<Reservation | null> {
  const rows = await sql<Reservation[]>`SELECT * FROM reservations WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function updateReservationStatus(id: number, status: ReservationStatus) {
  await sql`UPDATE reservations SET status = ${status} WHERE id = ${id}`;
}

// Feature 2 — availability. Only CONFIRMED reservations block a vehicle;
// pending/contacted requests are just leads and don't reserve the car.
// Uses idx_reservations_vehicle_status_dates (see migrations/002_*.sql).
export async function isVehicleAvailable(
  vehicleId: number,
  startDate: string,
  endDate: string,
  excludeReservationId?: number
): Promise<boolean> {
  const rows = excludeReservationId
    ? await sql`
        SELECT id FROM reservations
        WHERE vehicle_id = ${vehicleId}
          AND status = 'confirmed'
          AND id != ${excludeReservationId}
          AND start_date <= ${endDate}
          AND end_date >= ${startDate}
        LIMIT 1
      `
    : await sql`
        SELECT id FROM reservations
        WHERE vehicle_id = ${vehicleId}
          AND status = 'confirmed'
          AND start_date <= ${endDate}
          AND end_date >= ${startDate}
        LIMIT 1
      `;
  return rows.length === 0;
}

// Vehicles list for /vehicules. If no dates are given, returns the full
// fleet (unchanged behaviour). If dates are given, excludes any vehicle
// with a confirmed reservation overlapping that range.
export async function getAvailableVehicles(
  startDate?: string,
  endDate?: string
): Promise<Vehicle[]> {
  const vehicles = await getVehicles();
  if (!startDate || !endDate) return vehicles;

  const rows = await sql<{ vehicle_id: number | null }[]>`
    SELECT DISTINCT vehicle_id FROM reservations
    WHERE status = 'confirmed'
      AND start_date <= ${endDate}
      AND end_date >= ${startDate}
  `;
  const bookedIds = new Set(rows.map((r) => r.vehicle_id));
  return vehicles.filter((v) => !bookedIds.has(v.id));
}

// Confirming a reservation is the moment it actually blocks the vehicle,
// so this is where we re-check for a conflicting confirmed booking
// (another admin could have confirmed an overlapping request in the
// meantime). Returns a reason instead of throwing so the UI can show a
// friendly message.
export async function confirmReservation(
  id: number
): Promise<{ ok: true } | { ok: false; reason: "conflict" | "notFound" }> {
  const reservation = await getReservationById(id);
  if (!reservation || !reservation.vehicle_id) {
    return { ok: false, reason: "notFound" };
  }

  const available = await isVehicleAvailable(
    reservation.vehicle_id,
    reservation.start_date,
    reservation.end_date,
    reservation.id
  );
  if (!available) {
    return { ok: false, reason: "conflict" };
  }

  await sql`
    UPDATE reservations
    SET status = 'confirmed',
        contract_number = COALESCE(
          contract_number,
          'ARC-' || to_char(now(), 'YYYY') || '-' || lpad(id::text, 5, '0')
        ),
        contract_generated_at = COALESCE(contract_generated_at, now())
    WHERE id = ${id}
  `;
  return { ok: true };
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
