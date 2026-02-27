import type { Metadata } from 'next';
import Link from 'next/link';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { Button } from '@/components/ui/atoms/Button';
import { JsonLd } from '@/components/ui/atoms/JsonLd';
import { getAllModels, getTopModel, getSmallestModel, getModelOfTheDay } from '@/lib/data/models';
import { formatPulls, formatRam } from '@/lib/utils/format';
import { deriveFilterOptions } from '@/lib/data/filters';
import { ModelOfTheDay } from '@/components/features/models/ModelOfTheDay';
import { UseCaseShowcase } from '@/components/features/models/UseCaseShowcase';
import { OlliVideo } from '@/components/features/home/OlliVideo';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Ollama Model Explorer — Browse Open-Source AI Models',
  description:
    'Discover and compare 200+ open-source AI models available via Ollama. Filter by capability, domain, RAM requirement and parameter size.',
  alternates: {
    canonical: 'https://ollama-explorer.vercel.app',
  },
  openGraph: {
    url: 'https://ollama-explorer.vercel.app',
    title: 'Ollama Model Explorer',
    description: 'Discover and compare 200+ open-source AI models available via Ollama.',
  },
};

export default function HomePage() {
  const models = getAllModels();
  const topModel = getTopModel();
  const smallestModel = getSmallestModel();
  const modelOfTheDay = getModelOfTheDay();
  const options = deriveFilterOptions(models);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ollama Model Explorer',
    url: 'https://ollama-explorer.vercel.app',
    description: 'Browse, search and filter 200+ open-source AI models available via Ollama.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ollama-explorer.vercel.app/models?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main id="main" className="flex-1 flex flex-col">
      <JsonLd data={websiteSchema} />
      {/* Hero */}
      <section className="flex-1 flex items-center px-6 sm:px-10 lg:px-20 py-16 sm:py-12">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Mascot video */}
          <div className="shrink-0">
            <OlliVideo />
          </div>
          {/* Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-text)] leading-tight text-balance">
              Discover open-source <br />
              AI models, built for Ollama.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md leading-relaxed">
              Ollama&rsquo;s infrastructure gives you {models.length}+ open-source models to run
              locally — but finding the one that fits your use case, hardware, or language is hard.
              Ollama Explorer makes that search instant.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/models">
                <Button size="lg">Explore Models</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  About this project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Models indexed"
            value={models.length}
            description="Scraped from ollama.com"
          />
          <StatCard
            label="Domains"
            value={options.domains.length}
            description={options.domains.join(' · ')}
          />
          <StatCard
            label="Most popular"
            value={topModel.model_name}
            description={`${formatPulls(topModel.pulls)} pulls`}
          />
          <StatCard
            label="Smallest model"
            value={smallestModel.model_name}
            description={`Runs on ${formatRam(smallestModel.min_ram_gb)} RAM`}
          />
        </div>
      </section>

      {/* Model of the Day */}
      {modelOfTheDay && <ModelOfTheDay model={modelOfTheDay} />}

      {/* Use Case Showcase */}
      <UseCaseShowcase />
    </main>
  );
}
