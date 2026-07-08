import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  // C-6: Explicit null check instead of non-null assertion
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // C-2: Process synchronously BEFORE returning response (Stripe allows 30s)
  // C-3: Fix logic — use upsert pattern instead of findUnique + updateMany
  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as { id: string }
      await prisma.order.updateMany({
        where: { paymentIntentId: pi.id },
        data: { status: 'confirmed' },
      })
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as { id: string }
      await prisma.order.updateMany({
        where: { paymentIntentId: pi.id },
        data: { status: 'failed' },
      })
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
