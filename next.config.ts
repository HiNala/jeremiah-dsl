import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during production builds on Vercel to avoid legacy option errors
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      // Adjust for production domain as needed
      allowedOrigins: ['localhost:3000']
    }
  }
}

export default nextConfig
