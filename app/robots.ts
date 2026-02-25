import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://ollama-explorer.vercel.app/sitemap.xml',
    host: 'https://ollama-explorer.vercel.app',
  };
}
