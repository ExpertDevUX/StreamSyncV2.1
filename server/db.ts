import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("DATABASE_URL is not set. Database initialization skipped for build.");
    // Return a dummy object or throw if needed. 
    // For Next.js build, throwing can be okay if the route is dynamic.
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({ connectionString: url });
  return drizzle(pool, { schema });
}

// Lazy-loaded proxy for backward compatibility
export const db = new Proxy({} as any, {
  get(target, prop) {
    return (getDb() as any)[prop];
  }
});
