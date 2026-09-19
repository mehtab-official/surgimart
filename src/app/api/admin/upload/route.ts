import { NextRequest } from 'next/server'
import { uploadController } from '@/server/controllers/upload.controller'

// Note: Body size limit is set globally in next.config.ts (experimental.serverActions.bodySizeLimit)
// App Router does NOT support per-route `export const config = { api: { bodyParser } }`.
// The maxDuration export controls serverless function timeout on Vercel.
export const maxDuration = 60 // seconds — allow time for large video uploads

export async function GET(): Promise<Response> {
  return uploadController.getStatus()
}

export async function POST(req: NextRequest): Promise<Response> {
  return uploadController.uploadImage(req)
}
