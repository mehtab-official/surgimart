import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { quoteService } from '@/server/services/quote.service'
import { requireAdmin, requireCsrf, checkRateLimit } from '@/server/middlewares'

const QuoteSchema = z.object({
  // Accept productId/productName OR fallback from items/subject
  productId: z.string().optional(),
  productName: z.string().optional(),
  items: z.string().optional(),
  qty: z.union([z.number(), z.string()]).optional(),
  quantity: z.union([z.number(), z.string()]).optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  organization: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
})

export class QuoteController {
  async createQuote(req: NextRequest) {
    try {
      const body = await req.json()
      const parsed = QuoteSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
      }

      const raw = parsed.data
      const rl = await checkRateLimit(
        `quote_rate:${raw.email}`,
        10,
        3600,
        'Too many inquiries submitted. Please wait a short while.'
      )
      if ('response' in rl) return rl.response

      // Normalize fields across Contact Us, RFQ Page, and Product Quote Modal
      const productName = raw.productName || raw.items || 'General Surgical Instrument Inquiry'
      const productId = raw.productId || (raw.items ? `RFQ-${Date.now().toString(36).toUpperCase()}` : 'CONTACT-INQUIRY')
      
      let numericQty = 1
      const rawQty = raw.qty ?? raw.quantity
      if (typeof rawQty === 'number') {
        numericQty = rawQty
      } else if (typeof rawQty === 'string') {
        const parsedNum = parseInt(rawQty, 10)
        numericQty = isNaN(parsedNum) || parsedNum < 1 ? 1 : parsedNum
      }

      const organization = raw.organization || raw.company || (raw.phone ? `Phone: ${raw.phone}` : undefined)
      const country = raw.country || 'Global'
      const combinedMessage = [
        raw.phone && raw.phone !== 'N/A' ? `Contact Phone: ${raw.phone}` : null,
        typeof rawQty === 'string' && isNaN(Number(rawQty)) ? `Volume Requested: ${rawQty}` : null,
        raw.message
      ].filter(Boolean).join('\n\n')

      const quote = await quoteService.createQuote({
        productId,
        productName,
        qty: numericQty,
        name: raw.name,
        email: raw.email,
        organization,
        country,
        message: combinedMessage,
      })

      return NextResponse.json({ message: 'Inquiry submitted successfully', quote }, { status: 201 })
    } catch (error) {
      console.error('Quote request error:', error)
      return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
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
