import { defineConfig } from "drizzle-kit";

const DATABASE_URL = "postgresql://neondb_owner:npg_iTKPxIYwmv78@ep-red-glade-ahaxrhjw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
