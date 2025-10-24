import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url().startsWith("postgresql://"),
  API_BASE_URL: z.url(),
  AUTH_REDIRECT_URL: z.url(),
  JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
