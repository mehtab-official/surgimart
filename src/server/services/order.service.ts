import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { generateOrderNumber } from '@/lib/utils'
import { stripe } from '@/lib/stripe'
import crypto from 'crypto'

export interface CartItemInput {
  id: string
  slug?: string
  qty: number
  price?: number
}

export interface ShippingDataInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  city: string
  country: string
  postalCode?: string
}

export interface CreateOrderParams {
  cartItems: CartItemInput[]
  shippingData: ShippingDataInput
  paymentMethod?: 'cod' | 'bank_transfer'
  paymentIntentId?: string
}

export class OrderService {
  async createOrder({ cartItems, shippingData, paymentMethod, paymentIntentId }: CreateOrderParams) {
    // 1. Validate paymentIntentId format if provided
    if (paymentIntentId && !paymentIntentId.startsWith('pi_')) {
      const err = new Error('Invalid paymentIntentId format')
      ;(err as any).statusCode = 400
      throw err
    }

    // 2. Server-side price recalculation & stock validation
    const productIds = cartItems.map(i => i.id)
    const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const priceMap = Object.fromEntries(dbProducts.map(p => [p.id, p]))

    let serverTotal = 0
    for (const item of cartItems) {
      const product = priceMap[item.id]
      if (!product) {
        const err = new Error('Product not found')
        ;(err as any).statusCode = 400
        throw err
      }
      if (!product.inStock) {
        const err = new Error(`${product.name} is out of stock`)
        ;(err as any).statusCode = 400
        throw err
      }
      if (product.stockCount < item.qty) {
        const err = new Error(`Insufficient stock: only ${product.stockCount} of "${product.name}" remaining`)
        ;(err as any).statusCode = 409
        throw err
      }
      serverTotal += product.price * item.qty
    }

    // 3. Check for existing order by paymentIntentId (idempotency)
    if (paymentIntentId) {
      const existing = await prisma.order.findUnique({
        where: { paymentIntentId },
      })
      if (existing) {
        return {
          orderNumber: existing.orderNumber,
          status: existing.status,
          isExisting: true,
        }
      }
    }

    // 4. Verify Stripe payment intent if paying via Stripe
    let effectivePaymentIntentId = paymentIntentId
    let orderStatus = 'pending'

    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
      if (!pi || pi.status !== 'succeeded') {
        const err = new Error('Payment not confirmed')
        ;(err as any).statusCode = 400
        throw err
      }
      if (pi.amount !== Math.round(serverTotal * 100)) {
        const err = new Error('Payment amount mismatch')
        ;(err as any).statusCode = 400
        throw err
      }
      orderStatus = 'confirmed'
    } else if (paymentMethod) {
      effectivePaymentIntentId = `${paymentMethod.toUpperCase()}-${crypto.randomUUID()}`
      orderStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending'
    }

    const orderNumber = generateOrderNumber()

    // 5. Atomic stock decrement + order creation
    await prisma.$transaction(async (tx: any) => {
      for (const item of cartItems) {
        if (typeof tx.product.updateMany === 'function') {
          const updated = await tx.product.updateMany({
            where: { id: item.id, stockCount: { gte: item.qty } },
            data: { stockCount: { decrement: item.qty } },
          })
          if (updated.count === 0) {
            const current = await tx.product.findUnique({
              where: { id: item.id },
              select: { name: true, stockCount: true },
            })
            const err = new Error(
              current
                ? `Insufficient stock: only ${current.stockCount} of "${current.name}" remaining`
                : `Product ${item.id} not found`
            )
            ;(err as any).statusCode = 409
            throw err
          }
        } else if (typeof tx.product.update === 'function') {
          await tx.product.update({
            where: { id: item.id },
            data: { stockCount: { decrement: item.qty } },
          })
        }

        if (typeof tx.product.findUnique === 'function') {
          const refreshed = await tx.product.findUnique({
            where: { id: item.id },
            select: { stockCount: true },
          })
          if (refreshed && refreshed.stockCount <= 0 && typeof tx.product.update === 'function') {
            await tx.product.update({ where: { id: item.id }, data: { inStock: false } })
          }
        }
      }

      await tx.order.create({
        data: {
          orderNumber,
          paymentIntentId: effectivePaymentIntentId!,
          status: orderStatus,
          total: serverTotal,
          items: JSON.stringify(cartItems.map(i => ({
            ...i,
            name: priceMap[i.id]?.name ?? '',
            serverPrice: priceMap[i.id]?.price ?? 0,
          }))),
          shippingData: JSON.stringify({ ...shippingData, paymentMethod }),
          shippingEmail: shippingData.email,
        },
      })
    })

    // 6. Send confirmation emails (non-blocking)
    const methodLabel = paymentMethod === 'cod'
      ? 'Cash on Delivery'
      : paymentMethod === 'bank_transfer'
      ? 'Bank Transfer'
      : 'Card / Stripe'

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
        `,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM || 'orders@submedortho.com',
        to: process.env.ADMIN_EMAIL || 'admin@submedortho.com',
        subject: `New Order: ${orderNumber} (${methodLabel})`,
        html: `<p>New order <strong>${orderNumber}</strong> from ${shippingData.email}.<br/>Payment: ${methodLabel}<br/>Total: $${serverTotal.toFixed(2)}</p>`,
      }),
    ]).catch(err => console.error('Order email error:', err))

    return {
      orderNumber,
      status: orderStatus,
    }
  }

  async lookupOrder(orderNumber: string, email: string) {
    return prisma.order.findFirst({
      where: { orderNumber, shippingEmail: email },
    })
  }

  async listAdminOrders({ query = '', page = 1, limit = 10 }: { query?: string; page?: number; limit?: number }) {
    const skip = (page - 1) * limit
    const where = query ? {
      OR: [
        { orderNumber: { contains: query, mode: 'insensitive' as const } },
        { shippingEmail: { contains: query, mode: 'insensitive' as const } },
      ]
    } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return {
      orders,
      total,
      pages: Math.ceil(total / limit),
    }
  }

  async getAdminOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
    })
  }

  async updateOrderStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status },
    })
  }
}

export const orderService = new OrderService()
