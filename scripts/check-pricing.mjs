import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

const rows = await sql\
  SELECT id, name, min_rental_days, price_per_day, price_extended_15, price_monthly_30
  FROM vehicles
  ORDER BY id
\;

console.table(rows);
await sql.end();
