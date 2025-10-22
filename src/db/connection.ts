import postgres from "postgres";
import { env } from "../env";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export const sql = postgres(env.DATABASE_URL);
export const db = drizzle(sql, {
  schema,
  casing: "snake_case",
});
