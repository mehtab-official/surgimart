import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { generateOrderNumber } from '@/lib/utils'
import { rateLimit } from '@/lib/rate-limit'
import { v4 as uuidv4 } from 'uuid'

const CartItemSchema = z.object({
  id: z.string(), slug: z.string(), qty: z.number().int().positive(), price: z.number().positive(),
})
const ShippingSchema = z.object({
  firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(),
  phone: z.string().min(7), address1: z.string().min(5), city: z.string().min(1),
  country: z.string().length(2), postalCode: z.string().optional(),
})
const OrderSchema = z.object({
  cartItems: z.array(CartItemSchema).min(1),
  shippingData: ShippingSchema,
  paymentMethod: z.enum(['cod', 'bank_transfer']),
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
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
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
    }

    const { cartItems, shippingData, paymentMethod } = parsed.data

    // Server-side price recalculation
    const productIds = cartItems.map(i => i.id)
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const priceMap = Object.fromEntries(dbProducts.map(p => [p.id, p]))

    let serverTotal = 0
    for (const item of cartItems) {
      const product = priceMap[item.id]
      if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 400 })
      if (!product.inStock) return NextResponse.json({ error: `${product.name} is out of stock` }, { status: 400 })
      if (product.stockCount < item.qty) return NextResponse.json({ error: `Only ${product.stockCount} of ${product.name} available` }, { status: 409 })
      serverTotal += product.price * item.qty
    }

    // Generate a unique internal payment reference (no Stripe needed)
    const paymentIntentId = `${paymentMethod.toUpperCase()}-${uuidv4()}`
    const orderNumber = generateOrderNumber()

    // Atomic stock decrement + order creation
    try {
      await prisma.$transaction(async (tx) => {
        for (const item of cartItems) {
          const updated = await tx.product.updateMany({
            where: { id: item.id, stockCount: { gte: item.qty } },
            data: { stockCount: { decrement: item.qty } },
          })
          if (updated.count === 0) {
            const current = await tx.product.findUnique({
              where: { id: item.id },
              select: { name: true, stockCount: true },
            })
            throw new Error(
              current
                ? `Insufficient stock: only ${current.stockCount} of "${current.name}" remaining`
                : `Product ${item.id} not found`
            )
          }
          const refreshed = await tx.product.findUnique({
            where: { id: item.id },
            select: { stockCount: true },
          })
          if (refreshed && refreshed.stockCount <= 0) {
            await tx.product.update({ where: { id: item.id }, data: { inStock: false } })
          }
        }

        await tx.order.create({
          data: {
            orderNumber,
            paymentIntentId,
            status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
            total: serverTotal,
            items: JSON.stringify(cartItems.map(i => ({
              ...i,
              name: priceMap[i.id].name,
              serverPrice: priceMap[i.id].price,
            }))),
            shippingData: JSON.stringify({ ...shippingData, paymentMethod }),
            shippingEmail: shippingData.email,
          },
        })
      })
    } catch (txError: unknown) {
      const err = txError as Error
      if (err.message?.includes('Insufficient stock')) {
        return NextResponse.json({ error: err.message }, { status: 409 })
      }
      throw txError
    }

    // Send confirmation emails (non-blocking)
    const methodLabel = paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'
    Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM || 'orders@submedortho.com',
        to: shippingData.email,
        subject: `Order Confirmed — ${orderNumber}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order <strong>${orderNumber}</strong> has been received.</p>
          <p><strong>Payment Method:</strong> ${methodLabel}</p>
          <p><strong>Total:</strong> $${serverTotal.toFixed(2)}</p>
          ${paymentMethod === 'bank_transfer' ? `
            <div style="background:#f8f9fa;padding:16px;border-radius:8px;margin-top:16px">
              <h3>Bank Transfer Details</h3>
              <p>Bank: Meezan Bank</p>
              <p>Account Title: Submed Ortho</p>
              <p>Account Number: 0123456789</p>
              <p>IBAN: PK00MEZN0001234567890</p>
              <p><strong>Reference: ${orderNumber}</strong></p>
            </div>
          ` : ''}
        `,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM || 'orders@submedortho.com',
        to: process.env.ADMIN_EMAIL || 'admin@submedortho.com',
        subject: `New Order: ${orderNumber} (${methodLabel})`,
        html: `<p>New order <strong>${orderNumber}</strong> from ${shippingData.email}.<br/>Payment: ${methodLabel}<br/>Total: $${serverTotal.toFixed(2)}</p>`,
      }),
    ]).catch(err => console.error('Order email error:', err))

    return NextResponse.json({ orderNumber, status: paymentMethod === 'cod' ? 'confirmed' : 'pending' }, { status: 201 })
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
    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'orderNumber and email required' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const rl = await rateLimit(`order_lookup:${ip}`, 20, 60)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const order = await prisma.order.findFirst({ where: { orderNumber, shippingEmail: email } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Order lookup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
