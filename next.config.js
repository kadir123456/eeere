/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
