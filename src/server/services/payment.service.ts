import { prisma } from '@/lib/prisma'
import { stripe, createPaymentIntent as createStripePaymentIntent } from '@/lib/stripe'

export interface PaymentCartItem {
  id: string
  qty: number
}

export class PaymentService {
  async createPaymentIntent(cartItems: PaymentCartItem[], idempotencyKey: string) {
    if (process.env.NODE_ENV !== 'production' && process.env.E2E_MOCK === 'true') {
      const mockSecret = 'pi_mock_secret_' + Math.random().toString(36).slice(2)
      return { clientSecret: mockSecret }
    }

    const productIds = cartItems.map(i => i.id)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })
    const priceMap = Object.fromEntries(dbProducts.map(p => [p.id, p]))

    let serverTotal = 0
    for (const item of cartItems) {
      const product = priceMap[item.id]
      if (!product) throw new Error('Product not found')
      if (!product.inStock) throw new Error('Product is out of stock')
      serverTotal += product.price * item.qty
    }

    const pi = await createStripePaymentIntent(serverTotal, 'usd', idempotencyKey)
    return { clientSecret: pi.client_secret }
  }

  async handleStripeWebhook(rawBody: string, signature: string) {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

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

    return { received: true }
  }
}

export const paymentService = new PaymentService()
