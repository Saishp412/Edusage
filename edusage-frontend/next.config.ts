import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  /* Enhanced configuration for better routing */
  // Handle trailing slashes consistently
  trailingSlash: false,
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Enable strict mode for better error handling
  reactStrictMode: true,
  // Allow images from backend server (local and Render)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'edusage-backend.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
  // Handle rewrites for API calls and file serving
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
      // Proxy /uploads requests to backend so diagram images load
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
