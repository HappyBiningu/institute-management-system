/** @type {import('next').NextConfig} */

// =============================================================================
// Rand Training College Management System - Production Next.js Configuration
// =============================================================================

const nextConfig = {
  // =============================================================================
  // PRODUCTION OPTIMIZATIONS
  // =============================================================================

  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Enable SWC minification for better performance
  swcMinify: true,

  // Output configuration for standalone deployment
  output: 'standalone',

  // Compress responses
  compress: true,

  // =============================================================================
  // SECURITY CONFIGURATION
  // =============================================================================

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Content Security Policy
  // Note: rewrites function is defined later in the file

  // =============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // =============================================================================

  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Experimental features for better performance
  experimental: {
    // Optimize server components
    serverComponentsExternalPackages: ['@prisma/client']
  },

  // =============================================================================
  // WEBPACK CONFIGURATION
  // =============================================================================

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev) {
      // Minimize bundle size
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      };

      // Add bundle analyzer in production (optional)
      if (process.env.ANALYZE === 'true') {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
          })
        );
      }
    }

    // Handle Prisma client
    if (isServer) {
      config.externals.push('@prisma/client');
    }

    return config;
  },

  // =============================================================================
  // ENVIRONMENT CONFIGURATION
  // =============================================================================

  // Environment variables to expose to the client
  env: {
    // Add any client-side environment variables here if needed
  },

  // Public runtime configuration
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static'
  },

  // Server runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: process.env.JWT_SECRET
  },

  // =============================================================================
  // REDIRECTS AND REWRITES
  // =============================================================================

  // Redirects for SEO and user experience
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true
      }
    ];
  },

  // =============================================================================
  // INTERNATIONALIZATION (if needed)
  // =============================================================================

  // i18n: {
  //   locales: ['en', 'es', 'fr'],
  //   defaultLocale: 'en',
  // },

  // =============================================================================
  // TYPESCRIPT CONFIGURATION
  // =============================================================================

  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. (Not recommended for production)
    ignoreBuildErrors: false
  },

  // =============================================================================
  // ESLINT CONFIGURATION
  // =============================================================================

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. (Not recommended for production)
    ignoreDuringBuilds: false
  },

  // =============================================================================
  // POWEREDBY HEADER
  // =============================================================================

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // =============================================================================
  // TRAILING SLASH
  // =============================================================================

  // Ensure consistent URL structure
  trailingSlash: false,

  // =============================================================================
  // ASSET PREFIX (for CDN)
  // =============================================================================

  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.yourdomain.com' : '',

  // =============================================================================
  // CUSTOM SERVER (if needed)
  // =============================================================================

  // distDir: 'build',
  // generateEtags: false,
  // onDemandEntries: {
  //   maxInactiveAge: 25 * 1000,
  //   pagesBufferLength: 2,
  // },

  // =============================================================================
  // PRODUCTION LOGGING
  // =============================================================================

  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // =============================================================================
  // API CONFIGURATION
  // =============================================================================

  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
