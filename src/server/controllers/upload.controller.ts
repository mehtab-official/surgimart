import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/server/middlewares'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

import { SUPPORTED_VIDEO_EXTENSIONS, SUPPORTED_VIDEO_MIME_TYPES, getVideoMimeType } from '@/lib/media'

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

const MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024 // 20MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024 // 100MB

function hasCloudinaryConfig(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_api_secret'
  )
}

function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

/**
 * Upload a buffer to Cloudinary using upload_stream (works for both images and large videos).
 */
function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; resource_type: 'image' | 'video' }
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type,
        // For videos: set a reasonable chunk size to avoid memory issues
        ...(options.resource_type === 'video' ? { chunk_size: 6_000_000 } : {}),
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result)
        } else {
          reject(new Error('Cloudinary returned neither error nor result'))
        }
      }
    )
    stream.end(buffer)
  })
}

export class UploadController {
  async getStatus(): Promise<NextResponse> {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const configured = hasCloudinaryConfig()

    return NextResponse.json({
      cloudinary_configured: configured,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
      api_key: process.env.CLOUDINARY_API_KEY ? '✅ set' : '❌ missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing',
      local_fallback: !configured ? '✅ active (uploads saved to public/uploads/)' : '⏸️ standby',
      max_video_size: `${MAX_VIDEO_SIZE_BYTES / 1024 / 1024}MB`,
      max_image_size: `${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
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

      const maxBytes = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is ${maxBytes / 1024 / 1024}MB.` },
          { status: 413 }
        )
      }

      const safeExt = rawExt || (isVideo ? 'mp4' : 'png')
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Try Cloudinary first
      if (hasCloudinaryConfig()) {
        try {
          configureCloudinary()
          
          // Use upload_stream for both images and videos (avoids base64 memory issues for large files)
          const result = await uploadToCloudinary(buffer, {
            folder: isVideo ? 'surgimart/videos' : 'surgimart/products',
            resource_type: isVideo ? 'video' : 'image',
          })

          console.info(`[Upload API] Cloudinary upload success: ${result.secure_url} (${isVideo ? 'video' : 'image'})`)
          return NextResponse.json({ url: result.secure_url, isVideo })
        } catch (cloudinaryErr) {
          console.error('[Upload API] Cloudinary upload failed, falling back to local disk:', cloudinaryErr)
          // Fall through to local disk storage
        }
      }

      // Local storage fallback: write directly to public/uploads/
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
        { error: 'Upload failed due to an unexpected server error' },
        { status: 500 }
      )
    }
  }
}

export const uploadController = new UploadController()
