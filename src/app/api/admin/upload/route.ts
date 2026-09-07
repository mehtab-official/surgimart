import { NextRequest } from 'next/server'
import { uploadController } from '@/server/controllers/upload.controller'

export async function GET() {
  return uploadController.getStatus()
}

export async function POST(req: NextRequest) {
  return uploadController.uploadImage(req)
}
