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

process.env.POSTGRES_URL = env.POSTGRES_URL;

const { sql } = await import("@vercel/postgres");

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

console.log("Table ready.");
