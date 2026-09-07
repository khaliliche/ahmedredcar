import { sql } from "@vercel/postgres";

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
    const { rows } = excludeId
      ? await sql`SELECT id FROM vehicles WHERE slug = ${slug} AND id != ${excludeId}`
      : await sql`SELECT id FROM vehicles WHERE slug = ${slug}`;
    if (rows.length === 0) return slug;
    slug = `${base}-${i}`;
    i++;
  }
}

export async function getVehicles(): Promise<Vehicle[]> {
  const { rows } = await sql<Vehicle>`SELECT * FROM vehicles ORDER BY created_at DESC`;
  return rows;
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { rows } = await sql<Vehicle>`SELECT * FROM vehicles WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const { rows } = await sql<Vehicle>`SELECT * FROM vehicles WHERE id = ${id} LIMIT 1`;
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
  const { rows } = await sql<Vehicle>`
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
  const { rows } = await sql<Vehicle>`
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
