import type { MetadataRoute } from 'next';
import { getAllModels } from '@/lib/data/models';

const BASE_URL = 'https://ollama-explorer.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const models = getAllModels();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/models`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const modelRoutes: MetadataRoute.Sitemap = models.map((model) => ({
    url: `${BASE_URL}/models/${model.id}`,
    lastModified: model.timestamp ? new Date(model.timestamp) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...modelRoutes];
}
