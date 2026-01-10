import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

const DATABASE_URL = "postgresql://neondb_owner:npg_iTKPxIYwmv78@ep-red-glade-ahaxrhjw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });
