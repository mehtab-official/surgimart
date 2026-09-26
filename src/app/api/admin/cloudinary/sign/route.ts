import { NextResponse } from 'next/server'

// Deprecated endpoint: video uploading has reverted to standard direct Vercel uploads under 4.5MB
export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Cloudinary direct signing is deprecated. Please use standard upload under 4.5MB.' },
    { status: 410 }
  )
}
