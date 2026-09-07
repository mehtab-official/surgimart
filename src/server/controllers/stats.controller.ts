import { NextResponse } from 'next/server'
import { statsService } from '@/server/services/stats.service'
import { requireAdmin } from '@/server/middlewares'

export class StatsController {
  async getAdminStats() {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const stats = await statsService.getAdminStats()
      return NextResponse.json(stats)
    } catch (error) {
      console.error('[Admin Stats GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const statsController = new StatsController()
