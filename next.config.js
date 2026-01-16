/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;
