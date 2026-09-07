import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { paymentService } from '@/server/services/payment.service'
import { checkRateLimit, getClientIp } from '@/server/middlewares'

const CartItemSchema = z.object({
  id: z.string(),
  qty: z.number().int().positive(),
})

const PaymentIntentSchema = z.object({
  cartItems: z.array(CartItemSchema).min(1),
  idempotencyKey: z.string().min(1),
})

export class PaymentController {
  async createPaymentIntent(req: NextRequest) {
    try {
      const ip = getClientIp(req)
      const rl = await checkRateLimit(`payment_rate:${ip}`, 10, 60)
      if ('response' in rl) return rl.response

      const body = await req.json()
      const parsed = PaymentIntentSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }

      const result = await paymentService.createPaymentIntent(
        parsed.data.cartItems,
        parsed.data.idempotencyKey
      )

      return NextResponse.json(result)
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        return NextResponse.json({ error: 'Product not found' }, { status: 400 })
      }
      if (error instanceof Error && error.message.includes('out of stock')) {
        return NextResponse.json({ error: 'Product is out of stock' }, { status: 400 })
      }
      console.error('Payment intent error:', error)
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }
  }

  async handleStripeWebhook(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    try {
      const result = await paymentService.handleStripeWebhook(body, sig)
      return NextResponse.json(result, { status: 200 })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : ''
      if (errorMsg.includes('signature') || errorMsg.includes('webhook')) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
      console.error('Webhook processing error:', err)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }
}

export const paymentController = new PaymentController()
