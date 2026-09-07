import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stockNotifyService } from '@/server/services/stock-notify.service'
import { checkRateLimit, getClientIp } from '@/server/middlewares'

const StockNotifySchema = z.object({
  email: z.string().email(),
  productId: z.string(),
})

export class StockNotifyController {
  async subscribe(req: NextRequest) {
    try {
      const body = await req.json()
      const parsed = StockNotifySchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

      const ip = getClientIp(req)
      const rl = await checkRateLimit(`stocknotify_rate:${ip}`, 10, 3600)
      if ('response' in rl) return rl.response

      const result = await stockNotifyService.subscribe(parsed.data.email, parsed.data.productId)
      if (result.status === 'already_subscribed') {
        return NextResponse.json({ message: result.message }, { status: 200 })
      }

      return NextResponse.json({ message: result.message }, { status: 201 })
    } catch (error) {
      console.error('Stock notification error:', error)
      return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
  }
}

export const stockNotifyController = new StockNotifyController()
