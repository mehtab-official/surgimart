import 'server-only'
import Stripe from 'stripe'

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key || !key.startsWith('sk_')) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-02-25.clover' as Stripe.LatestApiVersion,
      typescript: true,
    })
  }
  return _stripe
}

// Proxy defers instantiation to first use — avoids crashing at module load
// when STRIPE_SECRET_KEY is a placeholder during build
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export async function createPaymentIntent(
  amountUSD: number,
  currency: string = 'usd',
  idempotencyKey: string
) {
  return getStripe().paymentIntents.create(
    {
      amount: Math.round(amountUSD * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    },
    { idempotencyKey }
  )
}
