import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { quoteService } from '@/server/services/quote.service'
import { requireAdmin, requireCsrf, checkRateLimit } from '@/server/middlewares'

const QuoteSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  qty: z.number().int().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
  country: z.string().min(2),
  message: z.string().optional(),
})

export class QuoteController {
  async createQuote(req: NextRequest) {
    try {
      const body = await req.json()
      const parsed = QuoteSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

      const rl = await checkRateLimit(
        `quote_rate:${parsed.data.email}`,
        3,
        3600,
        'Too many quote requests. Please wait an hour.'
      )
      if ('response' in rl) return rl.response

      await quoteService.createQuote(parsed.data)
      return NextResponse.json({ message: 'Quote request submitted successfully' }, { status: 201 })
    } catch (error) {
      console.error('Quote request error:', error)
      return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
    }
  }

  async updateAdminQuoteStatus(
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
      const { status } = body

      const quote = await quoteService.updateQuoteStatus(id, status)
      return NextResponse.json(quote)
    } catch (error) {
      console.error('[Admin Quote PUT]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const quoteController = new QuoteController()
