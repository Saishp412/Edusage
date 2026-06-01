import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Enhanced configuration for better routing */
  // Handle trailing slashes consistently
  trailingSlash: false,
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Enable strict mode for better error handling
  reactStrictMode: true,
  // Allow images from backend server
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  // Handle rewrites for API calls if needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      // Proxy /uploads requests to backend so diagram images load
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
