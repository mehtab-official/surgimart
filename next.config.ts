import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // output: 'standalone' — only needed for self-hosted Docker, not Vercel
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      // Vercel Blob Storage
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
    // Allow local uploads
    unoptimized: process.env.NODE_ENV === 'development',
  },
  serverExternalPackages: ['@prisma/client'],
  transpilePackages: ['until-async', 'msw', '@mswjs'],
  // Add rewrites to properly serve uploaded files in dev mode
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ]
  },
}
export default nextConfig
