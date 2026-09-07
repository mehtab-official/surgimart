import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/server/middlewares'
import { v2 as cloudinary } from 'cloudinary'

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])
const ALLOWED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
])
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])
const ALLOWED_VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogg', 'mov'])

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024 // 100MB

export class UploadController {
  async getStatus() {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    return NextResponse.json({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ set' : '❌ missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
    })
  }

  async uploadImage(req: NextRequest) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const hasCloudinary = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET !== 'your_api_secret'

    try {
      const formData = await req.formData()
      const file = formData.get('file') as File

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
      }

      const isVideo = ALLOWED_VIDEO_MIME_TYPES.has(file.type) || file.type.startsWith('video/')
      const isImage = ALLOWED_IMAGE_MIME_TYPES.has(file.type) || file.type.startsWith('image/')

      if (!isVideo && !isImage) {
        return NextResponse.json(
          { error: 'Invalid file type. Supported formats: MP4, WebM, QuickTime MOV, JPEG, PNG, WebP.' },
          { status: 415 }
        )
      }

      const maxBytes = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File too large. Maximum size is ${maxBytes / 1024 / 1024}MB.` },
          { status: 413 }
        )
      }

      const rawExt = file.name.split('.').pop()?.toLowerCase() ?? (isVideo ? 'mp4' : 'png')
      const isAllowedExt = isVideo ? ALLOWED_VIDEO_EXTENSIONS.has(rawExt) : ALLOWED_IMAGE_EXTENSIONS.has(rawExt)
      if (!isAllowedExt) {
        return NextResponse.json(
          { error: `Invalid file extension .${rawExt}.` },
          { status: 415 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      if (hasCloudinary) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(base64, {
          folder: isVideo ? 'surgimart/videos' : 'surgimart/products',
          resource_type: isVideo ? 'video' : 'image',
        })
        return NextResponse.json({ url: result.secure_url, isVideo })
      }

      // Local storage fallback: write directly to public/uploads/
      const fs = await import('fs/promises')
      const path = await import('path')
      const subFolder = isVideo ? 'videos' : 'products'
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder)
      await fs.mkdir(uploadDir, { recursive: true })

      const fileName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${rawExt}`
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)

      return NextResponse.json({ url: `/uploads/${subFolder}/${fileName}`, isVideo })
    } catch (error) {
      console.error('[Upload API] Error:', error instanceof Error ? error.message : error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Upload failed' },
        { status: 500 }
      )
    }
  }
}

export const uploadController = new UploadController()
