import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export interface CreateWholesaleInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization: string
  country: string
  monthlyVolume: string
  categories: string[]
  message?: string
}

// In-memory runtime cache for wholesale applications when database is unreachable
const globalForWholesale = globalThis as unknown as {
  runtimeWholesaleStore?: Map<string, any>
}

const runtimeWholesaleStore =
  globalForWholesale.runtimeWholesaleStore ?? new Map<string, any>()

if (!globalForWholesale.runtimeWholesaleStore) {
  globalForWholesale.runtimeWholesaleStore = runtimeWholesaleStore
}

export class WholesaleService {
  async createApplication(data: CreateWholesaleInput) {
    let application: any = null

    try {
      application = await prisma.wholesaleApplication.create({
        data: { ...data, status: 'pending' },
      })
      runtimeWholesaleStore.set(application.id, application)
    } catch (err) {
      console.warn('[WholesaleService] Database write error, saving to memory store:', err)
      application = {
        id: `wholesale-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        status: 'pending',
        createdAt: new Date(),
      }
      runtimeWholesaleStore.set(application.id, application)
    }

    const officialSalesEmail = process.env.SALES_EMAIL || 'sales@submedortho.com'
    const fromSender = process.env.RESEND_FROM || 'orders@submedortho.com'

    Promise.allSettled([
      resend.emails.send({
        from: fromSender,
        to: officialSalesEmail,
        subject: `🚨 [NEW WHOLESALE DISTRIBUTOR APPLICATION]: ${data.organization}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; rounded: 8px;">
            <h2 style="color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">New Wholesale / Distributor Application</h2>
            <p><strong>Applicant:</strong> ${data.firstName} ${data.lastName} (&lt;<a href="mailto:${data.email}">${data.email}</a>&gt;)</p>
            <p><strong>Organization:</strong> ${data.organization}</p>
            <p><strong>Country:</strong> ${data.country}</p>
            <p><strong>Monthly Volume Tier:</strong> ${data.monthlyVolume}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Categories:</strong> ${Array.isArray(data.categories) ? data.categories.join(', ') : data.categories}</p>
            ${data.message ? `<p><strong>Message / Specs:</strong><br/>${data.message.replace(/\n/g, '<br/>')}</p>` : ''}
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8;">SubMedOrtho Precision Surgical & Orthopedic Instruments • www.submedortho.com</p>
          </div>
        `,
      }),
    ]).catch(err => console.error('Wholesale email error:', err))

    return application
  }

  async listApplications(query = '', page = 1, limit = 10) {
    const skip = (page - 1) * limit
    try {
      const where = query ? {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' as const } },
          { lastName: { contains: query, mode: 'insensitive' as const } },
          { organization: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
        ]
      } : {}

      const [apps, total] = await Promise.all([
        prisma.wholesaleApplication.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.wholesaleApplication.count({ where }),
      ])

      if (apps && apps.length > 0) {
        return { apps, total }
      }
    } catch (err) {
      console.warn('[WholesaleService] DB error in listApplications, using runtime store:', err)
    }

    const all = Array.from(runtimeWholesaleStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const filtered = query
      ? all.filter(
          a =>
            a.organization?.toLowerCase().includes(query.toLowerCase()) ||
            a.email?.toLowerCase().includes(query.toLowerCase()) ||
            a.firstName?.toLowerCase().includes(query.toLowerCase())
        )
      : all
    return {
      apps: filtered.slice(skip, skip + limit),
      total: filtered.length,
    }
  }

  async getApplicationById(id: string) {
    try {
      const app = await prisma.wholesaleApplication.findUnique({ where: { id } })
      if (app) return app
    } catch (err) {
      console.warn('[WholesaleService] DB error in getApplicationById, using runtime store:', err)
    }
    return runtimeWholesaleStore.get(id) || null
  }

  async updateApplicationStatus(id: string, status: string, message?: string) {
    try {
      const existing = await prisma.wholesaleApplication.findUnique({
        where: { id },
      })

      if (existing) {
        const updated = await prisma.wholesaleApplication.update({
          where: { id },
          data: {
            status,
            message: message ? `${existing.message || ''}\n\n[Admin Note]: ${message}` : undefined,
          },
        })
        runtimeWholesaleStore.set(id, updated)
        return updated
      }
    } catch (err) {
      console.warn('[WholesaleService] DB error in updateApplicationStatus, using runtime store:', err)
    }

    const cached = runtimeWholesaleStore.get(id)
    if (cached) {
      const updated = {
        ...cached,
        status,
        message: message ? `${cached.message || ''}\n\n[Admin Note]: ${message}` : cached.message,
      }
      runtimeWholesaleStore.set(id, updated)
      return updated
    }

    return null
  }
}


export const wholesaleService = new WholesaleService()
