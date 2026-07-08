import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(),
  phone: z.string().optional(), organization: z.string().min(1), country: z.string().min(2),
  monthlyVolume: z.string().min(1), categories: z.array(z.string()).min(1), message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const rl = await rateLimit(`wholesale_rate:${ip}`, 3, 3600)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter ?? 3600) } }
      )
    }

    try {
      await prisma.wholesaleApplication.create({ data: { ...parsed.data, status: 'pending' } })
    } catch (e: unknown) {
      const prismaError = e as { code?: string }
      if (prismaError.code === 'P2002') return NextResponse.json({ error: 'Email already submitted' }, { status: 409 })
      throw e
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.SALES_EMAIL!,
      subject: `New Wholesale Application: ${parsed.data.organization}`,
      html: `<p>${parsed.data.firstName} ${parsed.data.lastName} (${parsed.data.email}) applied for wholesale. Org: ${parsed.data.organization}, Volume: ${parsed.data.monthlyVolume}</p>`,
    }).catch(err => console.error('Wholesale email error:', err))

    return NextResponse.json({ message: 'Application submitted' }, { status: 201 })
  } catch (error) {
    console.error('Wholesale application error:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
