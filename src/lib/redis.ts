import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis = globalForRedis.redis ?? new Redis(process.env.REDIS_URL!, {
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableReadyCheck: true,
})

// Prevent unhandled rejection crashes
redis.on('error', (err) => console.error('Redis connection error:', err))

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis
