import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

/** Allowed image MIME types */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])

/** Allowed file extensions (derived from filename — secondary check) */
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif'])

/** 5 MB limit */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum allowed size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.` },
        { status: 413 }
      )
    }

    // Validate MIME type (from Content-Type metadata the browser sends)
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 415 }
      )
    }

    // Validate extension (secondary guard — never trust the filename alone)
    const rawExt = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only jpg, jpeg, png, webp, and gif are allowed.' },
        { status: 415 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Use a UUID-based name to prevent path traversal / filename collisions
    const fileName = `${uuidv4()}.${rawExt}`
    const uploadPath = join(process.cwd(), 'public', 'uploads', 'products', fileName)

    await writeFile(uploadPath, buffer)

    return NextResponse.json({ url: `/uploads/products/${fileName}` })
  } catch (error) {
    console.error('[Upload API]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
