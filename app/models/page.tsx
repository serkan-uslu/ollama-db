import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllModels } from '@/lib/data/models';
import { deriveFilterOptions } from '@/lib/data/filters';
import { ModelsBrowser } from '@/components/features/models/ModelsBrowser';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Browse AI Models',
  description:
    'Browse, search and filter 200+ open-source AI models available on Ollama by capability, domain, RAM, complexity and parameter size.',
  alternates: {
    canonical: 'https://ollama-explorer.vercel.app/models',
  },
  openGraph: {
    url: 'https://ollama-explorer.vercel.app/models',
    title: 'Browse AI Models | Ollama Model Explorer',
    description: 'Browse, search and filter 200+ open-source AI models available on Ollama.',
  },
};

export default function ModelsPage() {
  const models = getAllModels();
  const filterOptions = deriveFilterOptions(models);

  return (
    <div className="min-h-[calc(100dvh-3.5rem)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-text)]">Models</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {models.length} models indexed from ollama.com
          </p>
        </div>
      </div>
      <Suspense>
        <ModelsBrowser allModels={models} filterOptions={filterOptions} />
      </Suspense>
    </div>
  );
}
