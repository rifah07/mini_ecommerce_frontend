import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Proxy /api/* to backend so cookies work on same origin in dev
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/:path*`,
      },
    ]
  },
}

export default nextConfig
