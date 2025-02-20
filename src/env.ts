import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    JWT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID: z
      .string()
      .regex(/price_[a-zA-Z0-9]{8,32}/),
    NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID: z
      .string()
      .regex(/price_[a-zA-Z0-9]{8,32}/),
    NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID: z
      .string()
      .regex(/price_[a-zA-Z0-9]{8,32}/),
    NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID: z
      .string()
      .regex(/price_[a-zA-Z0-9]{8,32}/),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID,
  },
});
