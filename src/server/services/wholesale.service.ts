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

export class WholesaleService {
  async createApplication(data: CreateWholesaleInput) {
    const application = await prisma.wholesaleApplication.create({
      data: { ...data, status: 'pending' },
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM || 'orders@submedortho.com',
      to: process.env.SALES_EMAIL || 'sales@submedortho.com',
      subject: `New Wholesale Application: ${data.organization}`,
      html: `<p>${data.firstName} ${data.lastName} (${data.email}) applied for wholesale. Org: ${data.organization}, Volume: ${data.monthlyVolume}</p>`,
    }).catch(err => console.error('Wholesale email error:', err))

    return application
  }

  async updateApplicationStatus(id: string, status: string, message?: string) {
    const existing = await prisma.wholesaleApplication.findUnique({
      where: { id },
    })

    if (!existing) {
      return null
    }

    return prisma.wholesaleApplication.update({
      where: { id },
      data: {
        status,
        message: message ? `${existing.message || ''}\n\n[Admin Note]: ${message}` : undefined,
      },
    })
  }
}

export const wholesaleService = new WholesaleService()
