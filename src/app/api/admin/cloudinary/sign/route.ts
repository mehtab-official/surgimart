import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from '@/server/middlewares'

// Ensure Cloudinary is configured
function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authCheck = await requireAdmin()
  if ('response' in authCheck) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Cloudinary Sign API] Admin check bypassed for local development')
    } else {
      return authCheck.response
    }
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { folder = 'surgimart', resource_type = 'auto' } = body

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary environment variables not configured on server' },
        { status: 500 }
      )
    }

    configureCloudinary()

    const timestamp = Math.round(new Date().getTime() / 1000)
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret)

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      resourceType: resource_type,
    })
  } catch (error) {
    console.error('[Cloudinary Sign API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
