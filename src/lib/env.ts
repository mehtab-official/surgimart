// src/lib/env.ts — Validate environment variables at startup
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  REDIS_PASSWORD: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  RESEND_API_KEY: z.string().startsWith('re_'),
  RESEND_FROM: z.string().email(),
  ADMIN_EMAIL: z.string().email(),
  SALES_EMAIL: z.string().email(),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().min(1),
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string().min(1),
  ALGOLIA_ADMIN_KEY: z.string().optional(),
  REVALIDATE_SECRET: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`)
    console.error('❌ Missing or invalid environment variables:\n' + missing.join('\n'))
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration')
    }
  }
  return (result.success ? result.data : process.env) as Env
}

export const env = validateEnv()
