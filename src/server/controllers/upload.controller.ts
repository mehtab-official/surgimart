import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/server/middlewares'
import { SUPPORTED_VIDEO_EXTENSIONS, SUPPORTED_VIDEO_MIME_TYPES } from '@/lib/media'

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
])

const ALLOWED_VIDEO_MIME_TYPES = SUPPORTED_VIDEO_MIME_TYPES
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])
const ALLOWED_VIDEO_EXTENSIONS = SUPPORTED_VIDEO_EXTENSIONS

// Vercel Serverless payload limit is 4.5MB
const MAX_FILE_SIZE_BYTES = 4.5 * 1024 * 1024 // 4.5MB

export class UploadController {
  async getStatus(): Promise<NextResponse> {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    return NextResponse.json({
      status: 'active',
      storage: 'local/serverless',
      max_file_size: `${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
      notice: 'Optimized for Vercel serverless functions (files strictly <= 4.5MB)',
    })
  }

  async uploadImage(req: NextRequest): Promise<NextResponse> {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) {
      // If running locally in development without session cookies, allow upload
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Upload API] Admin check bypassed for local development environment')
      } else {
        return authCheck.response
      }
    }

    try {
      const formData = await req.formData()
      const file = formData.get('file') as File

      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 })
      }

      // Validate file has content
      if (file.size === 0) {
        return NextResponse.json({ error: 'File is empty (0 bytes)' }, { status: 400 })
      }

      const fileType = (file.type || '').toLowerCase()
      const rawExt = (file.name.split('.').pop() || '').toLowerCase()

      console.info(`[Upload API] Received file: name="${file.name}", type="${fileType}", size=${(file.size / 1024 / 1024).toFixed(2)}MB, ext="${rawExt}"`)

      const isVideo = 
        ALLOWED_VIDEO_MIME_TYPES.has(fileType) || 
        fileType.startsWith('video/') || 
        ALLOWED_VIDEO_EXTENSIONS.has(rawExt)

      const isImage = 
        ALLOWED_IMAGE_MIME_TYPES.has(fileType) || 
        fileType.startsWith('image/') || 
        ALLOWED_IMAGE_EXTENSIONS.has(rawExt)

      if (!isVideo && !isImage) {
        return NextResponse.json(
          { error: `Invalid file format (${fileType || rawExt || 'unknown'}). Supported: Images (JPEG, PNG, WebP, GIF, SVG) and Videos (MP4, WebM, MOV, MKV, AVI, WMV, M4V, FLV, 3GP, TS, MPEG).` },
          { status: 415 }
        )
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds Vercel limit of 4.5MB. Please upload a compressed video or image under 4.5MB.` },
          { status: 413 }
        )
      }

      const safeExt = rawExt || (isVideo ? 'mp4' : 'png')
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // 1. If Cloudinary credentials exist, upload directly to Cloudinary (permanent CDN)
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME
      const apiKey = process.env.CLOUDINARY_API_KEY
      const apiSecret = process.env.CLOUDINARY_API_SECRET

      if (cloudName && apiKey && apiSecret) {
        try {
          const { v2: cloudinary } = await import('cloudinary')
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
          })

          const subFolder = isVideo ? 'surgimart/videos' : 'surgimart/products'
          const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: subFolder,
                resource_type: isVideo ? 'video' : 'image',
              },
              (err, res) => {
                if (err || !res) reject(err || new Error('Upload stream returned empty result'))
                else resolve(res)
              }
            )
            uploadStream.end(buffer)
          })

          console.info(`[Upload API] Cloudinary upload success: ${result.secure_url} (${isVideo ? 'video' : 'image'})`)
          return NextResponse.json({ url: result.secure_url, isVideo })
        } catch (cloudErr) {
          console.warn('[Upload API] Cloudinary upload failed, attempting local fallback:', cloudErr)
        }
      }

      // 2. Storage fallback: write to public/uploads/
      const fs = await import('fs/promises')
      const path = await import('path')
      const subFolder = isVideo ? 'videos' : 'products'
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder)
      await fs.mkdir(uploadDir, { recursive: true })

      const fileName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`
      const filePath = path.join(uploadDir, fileName)
      await fs.writeFile(filePath, buffer)

      console.info(`[Upload API] Local upload success: /uploads/${subFolder}/${fileName} (${isVideo ? 'video' : 'image'}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      return NextResponse.json({ url: `/uploads/${subFolder}/${fileName}`, isVideo })
    } catch (error) {
      console.error('[Upload API] Error:', error instanceof Error ? error.message : error)
      return NextResponse.json(
        { error: 'Upload failed due to an unexpected server error: ' + (error instanceof Error ? error.message : String(error)) },
        { status: 500 }
      )
    }
  }
}

export const uploadController = new UploadController()
