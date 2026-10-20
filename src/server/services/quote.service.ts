import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export interface CreateQuoteInput {
  productId: string
  productName: string
  qty: number
  name: string
  email: string
  organization?: string
  country: string
  message?: string
}

// In-memory runtime cache for quotes when database is unreachable
const globalForQuotes = globalThis as unknown as {
  runtimeQuoteStore?: Map<string, any>
}

const runtimeQuoteStore =
  globalForQuotes.runtimeQuoteStore ?? new Map<string, any>()

if (!globalForQuotes.runtimeQuoteStore) {
  globalForQuotes.runtimeQuoteStore = runtimeQuoteStore
}

export class QuoteService {
  async createQuote(data: CreateQuoteInput) {
    let quote: any = null

    try {
      quote = await prisma.quoteRequest.create({
        data: { ...data, status: 'pending' },
      })
      runtimeQuoteStore.set(quote.id, quote)
    } catch (err) {
      console.warn('[QuoteService] Database write error, saving to memory store:', err)
      quote = {
        id: `quote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        status: 'pending',
        createdAt: new Date(),
      }
      runtimeQuoteStore.set(quote.id, quote)
    }

    // Always attempt email notification (non-blocking)
    const officialSalesEmail = process.env.SALES_EMAIL || 'sales@submedortho.com'
    const fromSender = process.env.RESEND_FROM || 'orders@submedortho.com'

    Promise.allSettled([
      // 1. Confirmation to inquirer
      resend.emails.send({
        from: fromSender,
        to: data.email,
        subject: `Inquiry / RFQ Received — SubMedOrtho Export Desk`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
            <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">SubMedOrtho Export Inquiry Confirmation</h2>
            <p>Dear <strong>${data.name}</strong>,</p>
            <p>Thank you for reaching out to SubMedOrtho Precision Surgical Instruments. We have received your inquiry / quotation request:</p>
            <ul style="line-height: 1.8; color: #334155;">
              <li><strong>Subject / Instrument:</strong> ${data.productName}</li>
              <li><strong>Quantity / Volume:</strong> ${data.qty} units</li>
              <li><strong>Organization / Phone:</strong> ${data.organization || 'Direct'}</li>
              <li><strong>Country:</strong> ${data.country}</li>
            </ul>
            ${data.message ? `<p style="background: #f8fafc; padding: 12px; border-left: 3px solid #3b82f6; color: #475569;"><em>"${data.message.replace(/\n/g, '<br/>')}"</em></p>` : ''}
            <p>Our sales and engineering export desk in Sialkot, Pakistan will review your specifications and respond with factory-direct pricing within 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8;">SubMedOrtho Precision Surgical & Orthopedic Instruments • www.submedortho.com • sales@submedortho.com</p>
          </div>
        `,
      }),
      // 2. Alert to official SubMedOrtho sales desk
      resend.emails.send({
        from: fromSender,
        to: officialSalesEmail,
        subject: `🚨 [NEW WEBSITE INQUIRY] ${data.name} (${data.country}) — ${data.productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; rounded: 8px;">
            <h2 style="color: #1e3a8a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">New Inquiry via SubMedOrtho Website</h2>
            <p><strong>From:</strong> ${data.name} (&lt;<a href="mailto:${data.email}">${data.email}</a>&gt;)</p>
            <p><strong>Organization / Phone:</strong> ${data.organization || 'Not provided'}</p>
            <p><strong>Country / Region:</strong> ${data.country}</p>
            <p><strong>Requested Instrument / Item:</strong> ${data.productName} (ID: ${data.productId})</p>
            <p><strong>Volume:</strong> ${data.qty} units</p>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; margin: 15px 0;">
              <strong>Inquiry Message:</strong><br/>
              ${(data.message || 'No additional message provided').replace(/\n/g, '<br/>')}
            </div>
            <p style="font-size: 12px; color: #64748b;">This inquiry has been logged into the SubMedOrtho B2B Admin Inquiries Desk.</p>
          </div>
        `,
      }),
    ]).catch(err => console.error('[QuoteService] Resend email dispatch caught error:', err))

    return quote
  }

  async listQuotes(query = '', page = 1, limit = 10) {
    const skip = (page - 1) * limit
    try {
      const where = query ? {
        OR: [
          { productName: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
          { name: { contains: query, mode: 'insensitive' as const } },
        ]
      } : {}

      const [dbQuotes, dbTotal] = await Promise.all([
        prisma.quoteRequest.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.quoteRequest.count({ where }),
      ])

      if (dbQuotes && dbQuotes.length > 0) {
        return { quotes: dbQuotes, total: dbTotal }
      }
    } catch (err) {
      console.warn('[QuoteService] Prisma DB query failed in listQuotes, using runtime store:', err)
    }

    // Fallback to runtime store
    const all = Array.from(runtimeQuoteStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const filtered = query
      ? all.filter(
          q =>
            q.productName?.toLowerCase().includes(query.toLowerCase()) ||
            q.email?.toLowerCase().includes(query.toLowerCase()) ||
            q.name?.toLowerCase().includes(query.toLowerCase())
        )
      : all
    return {
      quotes: filtered.slice(skip, skip + limit),
      total: filtered.length,
    }
  }

  async getQuoteById(id: string) {
    try {
      const quote = await prisma.quoteRequest.findUnique({ where: { id } })
      if (quote) return quote
    } catch (err) {
      console.warn('[QuoteService] DB error in getQuoteById, using runtime store:', err)
    }
    return runtimeQuoteStore.get(id) || null
  }

  async updateQuoteStatus(id: string, status: string) {
    try {
      const updated = await prisma.quoteRequest.update({
        where: { id },
        data: { status },
      })
      runtimeQuoteStore.set(id, updated)
      return updated
    } catch (err) {
      console.warn('[QuoteService] DB error in updateQuoteStatus, updating runtime store:', err)
      const existing = runtimeQuoteStore.get(id)
      if (existing) {
        const updated = { ...existing, status }
        runtimeQuoteStore.set(id, updated)
        return updated
      }
      return { id, status }
    }
  }
}


export const quoteService = new QuoteService()
