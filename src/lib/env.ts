// src/lib/env.ts — Validate environment variables at startup
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  REDIS_PASSWORD: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  SALES_EMAIL: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string().optional(),
  ALGOLIA_ADMIN_KEY: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  SANITY_API_TOKEN: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`)
    // Log warnings but never crash — services will gracefully degrade
    console.warn('⚠️  Environment variable warnings:\n' + missing.join('\n'))
  }
  return (result.success ? result.data : process.env) as Env
}

export const env = validateEnv()
