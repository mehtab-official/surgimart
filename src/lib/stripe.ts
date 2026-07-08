import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

export async function createPaymentIntent(
  amountUSD: number,
  currency: string = "usd",
  idempotencyKey: string
) {
  return stripe.paymentIntents.create(
    {
      amount: Math.round(amountUSD * 100),
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    },
    { idempotencyKey }
  )
}
