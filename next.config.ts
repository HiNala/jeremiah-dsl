import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Adjust for production domain as needed
      allowedOrigins: ['localhost:3000']
    }
  }
}

export default nextConfig
