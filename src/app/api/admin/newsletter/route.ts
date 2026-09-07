import { newsletterController } from '@/server/controllers/newsletter.controller'

export async function GET() {
  return newsletterController.listSubscribers()
}
