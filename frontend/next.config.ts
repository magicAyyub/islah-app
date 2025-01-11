import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
        {
            source: '/api/:path*',
            destination: 'http://localhost:5050/api/:path*', // Redirige les appels API
        },
    ];
  },
};

export default nextConfig;
