import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export function getClientIp(req: NextRequest | Request): string {
  if ('headers' in req && req.headers && typeof req.headers.get === 'function') {
    return req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  }
  return 'unknown'
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  customMessage = 'Too many requests. Please try again later.'
): Promise<{ allowed: true } | { response: NextResponse }> {
  const rl = await rateLimit(key, limit, windowSeconds)
  if (!rl.allowed) {
    return {
      response: NextResponse.json(
        { error: customMessage },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? windowSeconds) } }
      ),
    }
  }
  return { allowed: true }
}
