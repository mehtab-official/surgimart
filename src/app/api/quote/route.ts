import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { resend } from '@/lib/resend'
import { prisma } from '@/lib/prisma'

const QuoteSchema = z.object({
  productId: z.string(), productName: z.string(), qty: z.number().int().min(1),
  name: z.string().min(1), email: z.string().email(), organization: z.string().optional(),
  country: z.string().min(2), message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = QuoteSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    const data = parsed.data

    // Rate limiting via Redis (using shared utility)
    const rl = await rateLimit(`quote_rate:${data.email}`, 3, 3600)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many quote requests. Please wait an hour.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 3600) } }
      )
    }

    await prisma.quoteRequest.create({ data: { ...data, status: 'pending' } })

    // H-10: Emails are non-blocking — don't fail the request if email fails
    Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: data.email,
        subject: `Quote Request Received — ${data.productName}`,
        html: `<p>Hi ${data.name}, we received your quote for ${data.qty} units of ${data.productName}. We will respond within 24 hours.</p>`,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: process.env.SALES_EMAIL!,
        subject: `New Quote: ${data.productName}`,
        html: `<p>From: ${data.name} (${data.email})<br>Product: ${data.productName}<br>Qty: ${data.qty}</p>`,
      }),
    ]).catch(err => console.error('Quote email error:', err))

    return NextResponse.json({ message: 'Quote request submitted successfully' }, { status: 201 })
  } catch (error) {
    console.error('Quote request error:', error)
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
  }
}
