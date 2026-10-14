/** @type {import('next').NextConfig} */
const strapiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const nextConfig = {
  // Allow the Strapi admin to embed this site for Live Preview
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${strapiUrl}` }],
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '1337', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '*.strapiapp.com' },
    ],
  },
};

export default nextConfig;
