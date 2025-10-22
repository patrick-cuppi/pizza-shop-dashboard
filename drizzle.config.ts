import { defineConfig } from "drizzle-kit";
import { env } from "./src/env";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
