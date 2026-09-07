import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { wholesaleService } from '@/server/services/wholesale.service'
import { requireAdmin, requireCsrf, checkRateLimit, getClientIp } from '@/server/middlewares'

const WholesaleSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  organization: z.string().min(1),
  country: z.string().min(2),
  monthlyVolume: z.string().min(1),
  categories: z.array(z.string()).min(1),
  message: z.string().optional(),
})

export class WholesaleController {
  async createWholesale(req: NextRequest) {
    try {
      const body = await req.json()
      const parsed = WholesaleSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

      const ip = getClientIp(req)
      const rl = await checkRateLimit(`wholesale_rate:${ip}`, 3, 3600)
      if ('response' in rl) return rl.response

      try {
        await wholesaleService.createApplication(parsed.data)
      } catch (e: unknown) {
        const prismaError = e as { code?: string }
        if (prismaError.code === 'P2002') {
          return NextResponse.json({ error: 'Email already submitted' }, { status: 409 })
        }
        throw e
      }

      return NextResponse.json({ message: 'Application submitted' }, { status: 201 })
    } catch (error) {
      console.error('Wholesale application error:', error)
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
    }
  }

  async updateAdminWholesaleStatus(
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
      const { status, message } = body

      const updated = await wholesaleService.updateApplicationStatus(id, status, message)
      if (!updated) {
        return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      }

      return NextResponse.json(updated)
    } catch (error) {
      console.error('[Admin Wholesale PUT]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const wholesaleController = new WholesaleController()
