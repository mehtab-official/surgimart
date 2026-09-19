// Utility functions for media detection and format validation

export const SUPPORTED_VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'ogg',
  'ogv',
  'mov',
  'mkv',
  'avi',
  'wmv',
  'm4v',
  'flv',
  '3gp',
  '3g2',
  'ts',
  'mts',
  'm2ts',
  'vob',
  'mpg',
  'mpeg',
  'asf',
  'rm',
  'rmvb',
  'divx',
])

export const SUPPORTED_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-matroska',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-m4v',
  'video/x-flv',
  'video/3gpp',
  'video/3gpp2',
  'video/mp2t',
  'video/mpeg',
  'video/vnd.dlna.mpeg-tts',
  'video/avi',
  'video/msvideo',
])

export const VIDEO_FILE_ACCEPT = 
  'video/*,.mp4,.webm,.ogg,.ogv,.mov,.mkv,.avi,.wmv,.m4v,.flv,.3gp,.3g2,.ts,.mts,.m2ts,.vob,.mpg,.mpeg'

export const ALL_MEDIA_FILE_ACCEPT = 
  'image/*,video/*,.mp4,.webm,.ogg,.ogv,.mov,.mkv,.avi,.wmv,.m4v,.flv,.3gp,.3g2,.ts,.mts,.m2ts,.vob,.mpg,.mpeg'

/**
 * Checks if a given URL or filename is a video.
 */
export function isVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase()

  // Match extension
  const ext = cleanUrl.split('.').pop() || ''
  if (SUPPORTED_VIDEO_EXTENSIONS.has(ext)) {
    return true
  }

  // Common video storage path conventions
  if (
    cleanUrl.includes('/uploads/videos/') ||
    cleanUrl.includes('/video/upload/') ||
    cleanUrl.includes('res.cloudinary.com/') && cleanUrl.includes('/video/')
  ) {
    return true
  }

  return false
}

/**
 * Returns a suitable MIME type for a video extension or filename.
 */
export function getVideoMimeType(urlOrExt: string): string {
  const ext = (urlOrExt.split('?')[0].split('.').pop() || urlOrExt).toLowerCase()
  switch (ext) {
    case 'webm':
      return 'video/webm'
    case 'ogg':
    case 'ogv':
      return 'video/ogg'
    case 'mov':
      return 'video/quicktime'
    case 'mkv':
      return 'video/x-matroska'
    case 'avi':
      return 'video/x-msvideo'
    case 'wmv':
      return 'video/x-ms-wmv'
    case 'm4v':
      return 'video/x-m4v'
    case 'flv':
      return 'video/x-flv'
    case '3gp':
      return 'video/3gpp'
    case '3g2':
      return 'video/3gpp2'
    case 'ts':
    case 'mts':
    case 'm2ts':
      return 'video/mp2t'
    case 'mpg':
    case 'mpeg':
    case 'vob':
      return 'video/mpeg'
    case 'mp4':
    default:
      return 'video/mp4'
  }
}

export interface DirectUploadResult {
  url: string
  isVideo: boolean
}

/**
 * Uploads media directly to Cloudinary to bypass Vercel's 4.5MB serverless payload limit.
 * Falls back to /api/admin/upload if Cloudinary signing fails or in local development.
 */
export async function uploadMediaDirectly(
  file: File,
  folder = 'surgimart',
  onProgress?: (percent: number) => void
): Promise<DirectUploadResult> {
  const isVideo = isVideoUrl(file.name) || (file.type || '').startsWith('video/')
  const resourceType = isVideo ? 'video' : 'image'
  const subFolder = isVideo ? `${folder}/videos` : `${folder}/products`

  try {
    // 1. Request upload signature from server
    const signRes = await fetch('/api/admin/cloudinary/sign', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: subFolder, resource_type: resourceType }),
    })

    if (signRes.ok) {
      const signData = await signRes.json()
      const { signature, timestamp, apiKey, cloudName } = signData

      if (signature && apiKey && cloudName) {
        // 2. Direct upload to Cloudinary API (streaming directly from browser)
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('api_key', apiKey)
        uploadFormData.append('timestamp', String(timestamp))
        uploadFormData.append('signature', signature)
        uploadFormData.append('folder', subFolder)

        const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

        const cloudRes = await fetch(cloudinaryEndpoint, {
          method: 'POST',
          body: uploadFormData,
        })

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json()
          if (cloudData.secure_url) {
            return {
              url: cloudData.secure_url,
              isVideo,
            }
          }
        } else {
          const errData = await cloudRes.json().catch(() => ({}))
          console.warn('[Direct Upload] Cloudinary upload returned error:', errData)
        }
      }
    }
  } catch (directErr) {
    console.warn('[Direct Upload] Direct Cloudinary upload failed, falling back to server route:', directErr)
  }

  // Fallback to /api/admin/upload
  const fallbackFormData = new FormData()
  fallbackFormData.append('file', file)

  const serverRes = await fetch('/api/admin/upload', {
    method: 'POST',
    credentials: 'include',
    body: fallbackFormData,
  })

  const serverData = await serverRes.json()
  if (!serverRes.ok) {
    throw new Error(serverData.error || `Upload failed with status ${serverRes.status}`)
  }

  return {
    url: serverData.url,
    isVideo: Boolean(serverData.isVideo ?? isVideo),
  }
}
