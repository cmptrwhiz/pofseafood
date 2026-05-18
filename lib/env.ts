import { z } from "zod";

const cloverEnvSchema = z.object({
  CLOVER_APP_ID: z.string().min(1),
  CLOVER_APP_SECRET: z.string().min(1),
  CLOVER_REDIRECT_URI: z.string().url(),
  CLOVER_BASE_URL: z.string().url().default("https://sandbox.dev.clover.com"),
});

export function getCloverEnv() {
  return cloverEnvSchema.parse({
    CLOVER_APP_ID: process.env.CLOVER_APP_ID,
    CLOVER_APP_SECRET: process.env.CLOVER_APP_SECRET,
    CLOVER_REDIRECT_URI: process.env.CLOVER_REDIRECT_URI,
    CLOVER_BASE_URL: process.env.CLOVER_BASE_URL ?? "https://sandbox.dev.clover.com",
  });
}
