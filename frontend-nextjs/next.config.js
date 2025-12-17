/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable SWC to avoid architecture issues
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    // Use environment variable for API URL, fallback to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    // Extract base URL (remove /api suffix if present)
    const baseUrl = apiUrl.replace(/\/api$/, '');
    
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

