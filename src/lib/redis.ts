// lib/redis.ts
import { Redis } from "@upstash/redis";
import { env } from "@/env";

let redis: Redis | null = null;

export function getRedisClient() {
  if (!redis) {
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}
