import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    // Prevent search engine indexing on non-production deployments (e.g. Vercel preview)
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
      return [
        {
          source: '/(.*)',
          headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
