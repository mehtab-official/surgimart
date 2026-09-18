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
