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
    ],
  },
  serverExternalPackages: ['@prisma/client'],
  transpilePackages: ['until-async', 'msw', '@mswjs'],
}
export default nextConfig
