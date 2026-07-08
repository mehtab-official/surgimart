// src/lib/rate-limit.ts — Reusable Redis-based rate limiter
import { redis } from '@/lib/redis'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
}

/**
 * Generic rate limiter using Redis INCR + EXPIRE.
 * @param key   Unique key (e.g. `payment:${ip}`)
 * @param limit Max requests in the window
 * @param windowSeconds Duration of the rate limit window
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, windowSeconds)
  }
  if (current > limit) {
    const ttl = await redis.ttl(key)
    return { allowed: false, remaining: 0, retryAfter: ttl > 0 ? ttl : windowSeconds }
  }
  return { allowed: true, remaining: limit - current }
}
