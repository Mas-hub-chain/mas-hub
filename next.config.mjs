/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Redirects for security
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },

  // Bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')()
      config.plugins.push(new BundleAnalyzerPlugin())
      return config
    },
  }),

  // Output configuration for Docker
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['blob.v0.dev'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Power by header removal
  poweredByHeader: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
