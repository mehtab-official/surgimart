import 'server-only'
import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis | null }

function createRedis(): Redis {
  const url = process.env.REDIS_URL
  if (!url || url === 'redis://placeholder') {
    // Return a no-op stub so rate limiting silently passes when Redis isn't configured
    const stub = new Redis({ lazyConnect: true, enableOfflineQueue: false })
    stub.on('error', () => {}) // suppress errors
    return stub
  }
  const client = new Redis(url, {
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableReadyCheck: false,
  })
  client.on('error', (err) => console.error('[Redis] connection error:', err))
  return client
}

export const redis: Redis = globalForRedis.redis ?? createRedis()

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
