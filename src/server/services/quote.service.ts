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

export class QuoteService {
  async createQuote(data: CreateQuoteInput) {
    const quote = await prisma.quoteRequest.create({
      data: { ...data, status: 'pending' },
    })

    // Emails are non-blocking
    Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM || 'orders@submedortho.com',
        to: data.email,
        subject: `Quote Request Received — ${data.productName}`,
        html: `<p>Hi ${data.name}, we received your quote for ${data.qty} units of ${data.productName}. We will respond within 24 hours.</p>`,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM || 'orders@submedortho.com',
        to: process.env.SALES_EMAIL || 'sales@submedortho.com',
        subject: `New Quote: ${data.productName}`,
        html: `<p>From: ${data.name} (${data.email})<br>Product: ${data.productName}<br>Qty: ${data.qty}</p>`,
      }),
    ]).catch(err => console.error('Quote email error:', err))

    return quote
  }

  async updateQuoteStatus(id: string, status: string) {
    return prisma.quoteRequest.update({
      where: { id },
      data: { status },
    })
  }
}

export const quoteService = new QuoteService()
