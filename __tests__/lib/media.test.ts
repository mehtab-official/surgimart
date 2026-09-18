import { isVideoUrl, getVideoMimeType, SUPPORTED_VIDEO_EXTENSIONS } from '@/lib/media'

describe('media utilities', () => {
  it('identifies standard and extended video extensions', () => {
    const videoFiles = [
      'clip.mp4',
      'demo.webm',
      'surgery.mov',
      'procedure.mkv',
      'instrument.avi',
      'presentation.wmv',
      'clip.m4v',
      'video.flv',
      'mobile.3gp',
      'record.ts',
      'stream.mpeg',
      'stream.mpg',
      'recording.ogg',
      'recording.ogv',
      'https://res.cloudinary.com/demo/video/upload/v12345/surgimart/videos/sample.mp4',
      '/uploads/videos/upload-12345.webm',
    ]

    for (const file of videoFiles) {
      expect(isVideoUrl(file)).toBe(true)
    }
  })

  it('rejects image files and invalid paths', () => {
    const nonVideoFiles = [
      'image.png',
      'photo.jpg',
      'photo.jpeg',
      'graphic.webp',
      'icon.svg',
      'animated.gif',
      '/uploads/products/Forceps.png',
      '',
      null,
      undefined,
    ]

    for (const file of nonVideoFiles) {
      expect(isVideoUrl(file as any)).toBe(false)
    }
  })

  it('returns appropriate MIME types for extensions', () => {
    expect(getVideoMimeType('sample.mp4')).toBe('video/mp4')
    expect(getVideoMimeType('sample.webm')).toBe('video/webm')
    expect(getVideoMimeType('sample.mov')).toBe('video/quicktime')
    expect(getVideoMimeType('sample.mkv')).toBe('video/x-matroska')
    expect(getVideoMimeType('sample.avi')).toBe('video/x-msvideo')
    expect(getVideoMimeType('sample.wmv')).toBe('video/x-ms-wmv')
  })
})
