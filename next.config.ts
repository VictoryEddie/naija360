import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow all external image domains for news articles
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
