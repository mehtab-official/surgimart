import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // H-7: Timing-safe comparison to prevent timing attacks on the secret
    const secret = body.secret ?? ''
    const expected = process.env.REVALIDATE_SECRET ?? ''
    if (
      secret.length !== expected.length ||
      !timingSafeEqual(Buffer.from(secret), Buffer.from(expected))
    ) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    if (body.slug) {
      revalidatePath(`/product/${body.slug}`)
      revalidatePath('/shop')
      revalidatePath('/')
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
