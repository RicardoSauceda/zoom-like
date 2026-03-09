import { Pool } from "pg";

const globalForPg = globalThis as unknown as { _pgPool?: Pool };

export const pool =
  globalForPg._pgPool ??
  new Pool({
    host: process.env.PG_HOST ?? "localhost",
    port: Number(process.env.PG_PORT ?? 5432),
    database: process.env.PG_DATABASE ?? "sivyc_local",
    user: process.env.PG_USER ?? process.env.USER ?? "ricardosauceda",
    password: process.env.PG_PASSWORD ?? "",
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg._pgPool = pool;
}
