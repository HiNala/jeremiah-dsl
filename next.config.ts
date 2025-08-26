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
      // Allow server actions from production domains
      allowedOrigins: process.env.NODE_ENV === 'production' 
        ? [process.env.VERCEL_URL || 'jeremiah-miller.vercel.app']
        : ['localhost:3000']
    }
  }
}

export default nextConfig
