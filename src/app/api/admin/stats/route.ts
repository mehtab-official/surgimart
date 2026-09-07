import { statsController } from '@/server/controllers/stats.controller'

export async function GET() {
  return statsController.getAdminStats()
}
