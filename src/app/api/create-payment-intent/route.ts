import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPaymentIntent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

// C-1: Require cart items instead of arbitrary amount — server recalculates total
const CartItemSchema = z.object({
  id: z.string(),
  qty: z.number().int().positive(),
})
const schema = z.object({
  cartItems: z.array(CartItemSchema).min(1),
  idempotencyKey: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    // H-1: Rate limiting on payment endpoint
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const rl = await rateLimit(`payment_rate:${ip}`, 10, 60)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
      )
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    console.log('[DEBUG] POST /api/create-payment-intent hit', { E2E_MOCK: process.env.E2E_MOCK })
    if (process.env.NODE_ENV !== 'production' && process.env.E2E_MOCK === 'true') {
      const mockSecret = 'pi_mock_secret_' + Math.random().toString(36).slice(2)
      console.log('[DEBUG] /api/create-payment-intent E2E_MOCK SUCCESS', mockSecret)
      return NextResponse.json({ clientSecret: mockSecret })
    }

    // C-1: Server-side price calculation from DB
    const productIds = parsed.data.cartItems.map(i => i.id)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })
    const priceMap = Object.fromEntries(
      dbProducts.map(p => [p.id, p])
    )

    let serverTotal = 0
    for (const item of parsed.data.cartItems) {
      const product = priceMap[item.id]
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 400 })
      if (!product.inStock) return NextResponse.json({ error: 'Product is out of stock' }, { status: 400 })
      serverTotal += product.price * item.qty
    }

    const pi = await createPaymentIntent(serverTotal, 'usd', parsed.data.idempotencyKey)
    return NextResponse.json({ clientSecret: pi.client_secret })
  } catch (error) {
    // C-5: Never leak internal error details to client
    console.error('Payment intent error:', error)
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}
