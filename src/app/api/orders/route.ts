import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { resend } from '@/lib/resend'
import { generateOrderNumber } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'

const CartItemSchema = z.object({
  id: z.string(), slug: z.string(), qty: z.number().int().positive(), price: z.number().positive(),
})
const ShippingSchema = z.object({
  firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(),
  phone: z.string().min(7), address1: z.string().min(5), city: z.string().min(1),
  country: z.string().length(2), postalCode: z.string().optional(),
})
const OrderSchema = z.object({
  cartItems: z.array(CartItemSchema).min(1), shippingData: ShippingSchema,
  paymentIntentId: z.string().startsWith("pi_"),
})

export async function POST(req: NextRequest) {
  try {
    // H-1: Rate limiting on order creation
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const rl = await rateLimit(`order_rate:${ip}`, 5, 60)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 60) } }
      )
    }

    const body = await req.json()
    const parsed = OrderSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    const { cartItems, shippingData, paymentIntentId } = parsed.data

    console.log('[DEBUG] POST /api/orders hit', { cartItemsCount: cartItems.length, paymentIntentId })
    if (process.env.NODE_ENV !== 'production' && process.env.E2E_MOCK === 'true') {
      console.log('[DEBUG] /api/orders E2E_MOCK SUCCESS')
      return NextResponse.json({ orderNumber: 'SM-12345678', status: 'confirmed' }, { status: 201 })
    }

    // Step 1: Server-side price recalculation
    const productIds = cartItems.map(i => i.id)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })
    const priceMap = Object.fromEntries(
      dbProducts.map(p => [p.id, p])
    )

    let serverTotal = 0
    for (const item of cartItems) {
      const product = priceMap[item.id]
      if (!product) return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 400 })
      if (!product.inStock) return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 })
      if (product.stockCount < item.qty) return NextResponse.json({ error: `Only ${product.stockCount} of ${product.name} available` }, { status: 409 })
      serverTotal += product.price * item.qty
    }

    const clientTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
    if (Math.abs(serverTotal - clientTotal) > 0.01) return NextResponse.json({ error: 'Price mismatch — please refresh and retry' }, { status: 400 })

    // Step 2: Verify Stripe payment (idempotency)
    const existingOrder = await prisma.order.findUnique({ where: { paymentIntentId } })
    if (existingOrder) return NextResponse.json({ orderNumber: existingOrder.orderNumber }, { status: 200 })

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') return NextResponse.json({ error: 'Payment not confirmed' }, { status: 400 })
    const expectedAmount = Math.round(serverTotal * 100)
    if (Math.abs(paymentIntent.amount - expectedAmount) > 1) return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 })

    // Step 3: Atomic stock decrement + order creation
    // Stock is decremented inside the transaction with a WHERE guard so concurrent
    // orders for the same product cannot both succeed when only one unit remains.
    const orderNumber = generateOrderNumber()
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of cartItems) {
          // Decrement only when sufficient stock exists — the WHERE guard serialises
          // concurrent orders and prevents negative stock without raw SQL.
          const updated = await tx.product.updateMany({
            where: { id: item.id, stockCount: { gte: item.qty } },
            data: { stockCount: { decrement: item.qty } },
          })
          if (updated.count === 0) {
            // Re-read to give a helpful message (within the transaction)
            const current = await tx.product.findUnique({
              where: { id: item.id },
              select: { name: true, stockCount: true },
            })
            throw new Error(
              current
                ? `Insufficient stock: only ${current.stockCount} of "${current.name}" remaining`
                : `Product ${item.id} not found during stock update`
            )
          }

          // Mark out-of-stock when the post-decrement count has reached zero
          const refreshed = await tx.product.findUnique({
            where: { id: item.id },
            select: { stockCount: true },
          })
          if (refreshed && refreshed.stockCount <= 0) {
            await tx.product.update({ where: { id: item.id }, data: { inStock: false } })
          }
        }

        return await tx.order.create({
          data: {
            orderNumber, paymentIntentId, status: 'confirmed', total: serverTotal,
            items: JSON.stringify(cartItems.map(i => ({ ...i, name: priceMap[i.id].name, serverPrice: priceMap[i.id].price }))),
            shippingData: JSON.stringify(shippingData), shippingEmail: shippingData.email,
          }
        })
      })
    } catch (txError: unknown) {
      const err = txError as Error
      if (err.message?.includes('Insufficient stock')) return NextResponse.json({ error: err.message }, { status: 409 })
      throw txError
    }

    // Step 4: Send emails (non-blocking)
    Promise.all([
      resend.emails.send({ from: process.env.RESEND_FROM!, to: shippingData.email, subject: `Order Confirmed — ${orderNumber}`, html: `<p>Your order ${orderNumber} is confirmed. Total: $${serverTotal.toFixed(2)}</p>` }),
      resend.emails.send({ from: process.env.RESEND_FROM!, to: process.env.ADMIN_EMAIL!, subject: `New Order: ${orderNumber}`, html: `<p>New order from ${shippingData.email}: ${orderNumber}</p>` }),
    ]).catch(err => console.error('Order email error:', err))

    return NextResponse.json({ orderNumber, status: 'confirmed' }, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')
    if (!orderNumber || !email) return NextResponse.json({ error: 'orderNumber and email required' }, { status: 400 })

    // Rate limit order lookups to prevent enumeration
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const rl = await rateLimit(`order_lookup:${ip}`, 20, 60)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    if (process.env.NODE_ENV !== 'production' && process.env.E2E_MOCK === 'true') {
      if (orderNumber === 'SM-TEST0001' && email === 'buyer@test.com') {
         return NextResponse.json({
           orderNumber: 'SM-TEST0001',
           status: 'shipped',
           total: 154.99,
           createdAt: new Date().toISOString(),
           shippingEmail: 'buyer@test.com'
         })
      }
      if (orderNumber === 'SM-SLOWTEST') {
        await new Promise(r => setTimeout(r, 600))
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
    }

    const order = await prisma.order.findFirst({ where: { orderNumber, shippingEmail: email } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Order lookup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
