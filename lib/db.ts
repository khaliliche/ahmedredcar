import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  price_per_day: number;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type ReservationStatus = "pending" | "contacted" | "confirmed" | "cancelled";

export type Reservation = {
  id: number;
  vehicle_id: number | null;
  vehicle_label: string;
  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string;
  start_date: string;
  end_date: string;
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

export async function createReservation(data: {
  vehicle_id: number;
  vehicle_label: string;
  full_name: string;
  age: number;
  cin_number: string;
  license_issue_date: string;
  start_date: string;
  end_date: string;
}): Promise<Reservation> {
  const rows = await sql<Reservation[]>`
    INSERT INTO reservations
      (vehicle_id, vehicle_label, full_name, age, cin_number, license_issue_date, start_date, end_date)
    VALUES
      (${data.vehicle_id}, ${data.vehicle_label}, ${data.full_name}, ${data.age},
       ${data.cin_number}, ${data.license_issue_date}, ${data.start_date}, ${data.end_date})
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

export async function deleteReservation(id: number) {
  await sql`DELETE FROM reservations WHERE id = ${id}`;
}