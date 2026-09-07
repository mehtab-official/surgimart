import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { orderService } from '@/server/services/order.service'
import { requireAdmin, requireCsrf, checkRateLimit, getClientIp } from '@/server/middlewares'
import { orderStatusSchema } from '@/lib/validations'

const CartItemSchema = z.object({
  id: z.string(),
  slug: z.string().optional().default(''),
  qty: z.number().int().positive(),
  price: z.number().positive().optional(),
})

const ShippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  address1: z.string().min(5),
  city: z.string().min(1),
  country: z.string().length(2),
  postalCode: z.string().optional(),
})

const OrderSchema = z.object({
  cartItems: z.array(CartItemSchema).min(1),
  shippingData: ShippingSchema,
  paymentMethod: z.enum(['cod', 'bank_transfer']).optional(),
  paymentIntentId: z.string().optional(),
})

export class OrderController {
  async createOrder(req: NextRequest) {
    try {
      const ip = getClientIp(req)
      const rl = await checkRateLimit(`order_rate:${ip}`, 5, 60)
      if ('response' in rl) return rl.response

      const body = await req.json()
      const parsed = OrderSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
      }

      if (!parsed.data.paymentMethod && !parsed.data.paymentIntentId) {
        return NextResponse.json({ error: 'Payment method or paymentIntentId is required' }, { status: 400 })
      }

      const result = await orderService.createOrder(parsed.data)
      if ((result as any).isExisting) {
        return NextResponse.json({ orderNumber: result.orderNumber }, { status: 200 })
      }

      return NextResponse.json(result, { status: 201 })
    } catch (error: any) {
      if (error?.statusCode) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode })
      }
      if (error instanceof Error && error.message.includes('Insufficient stock')) {
        return NextResponse.json({ error: error.message }, { status: 409 })
      }
      if (error instanceof Error && (error.message === 'Product not found' || error.message.includes('out of stock') || error.message === 'Payment not confirmed' || error.message.includes('mismatch') || error.message.includes('Invalid paymentIntentId'))) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      console.error('Order creation error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async lookupOrder(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const orderNumber = searchParams.get('orderNumber')
      const email = searchParams.get('email')

      if (!orderNumber || !email) {
        return NextResponse.json({ error: 'orderNumber and email required' }, { status: 400 })
      }

      const ip = getClientIp(req)
      const rl = await checkRateLimit(`order_lookup:${ip}`, 20, 60)
      if ('response' in rl) return rl.response

      const order = await orderService.lookupOrder(orderNumber, email)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      return NextResponse.json(order)
    } catch (error) {
      console.error('Order lookup error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async listAdminOrders(req: NextRequest) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const { searchParams } = new URL(req.url)
      const query = searchParams.get('q') || ''
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const result = await orderService.listAdminOrders({ query, page, limit })
      return NextResponse.json(result)
    } catch (error) {
      console.error('[Admin Orders GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async getAdminOrderById(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const { id } = await params
      const order = await orderService.getAdminOrderById(id)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    } catch (error) {
      console.error('[Admin Order GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async updateAdminOrderStatus(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const csrfCheck = requireCsrf(req)
    if ('response' in csrfCheck) return csrfCheck.response

    try {
      const { id } = await params
      const body = await req.json()
      const { status } = orderStatusSchema.parse(body)

      const order = await orderService.updateOrderStatus(id, status)
      return NextResponse.json(order)
    } catch (error) {
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
      }
      console.error('[Admin Order PUT]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const orderController = new OrderController()
