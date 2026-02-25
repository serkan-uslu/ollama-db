import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { Button } from '@/components/ui/atoms/Button';
import { JsonLd } from '@/components/ui/atoms/JsonLd';
import { getAllModels, getTopModel, getSmallestModel, getModelOfTheDay } from '@/lib/data/models';
import { formatPulls, formatRam } from '@/lib/utils/format';
import { deriveFilterOptions } from '@/lib/data/filters';
import { ModelOfTheDay } from '@/components/features/models/ModelOfTheDay';
import { UseCaseShowcase } from '@/components/features/models/UseCaseShowcase';

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
      <section className="flex-1 flex items-center px-6 sm:px-10 lg:px-20 py-16 sm:py-24">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Image */}
          <div className="shrink-0">
            <Image
              src="/olli.jpg"
              alt="Olli — the Ollama Explorer mascot"
              width={320}
              height={320}
              className="rounded-3xl shadow-xl select-none"
              priority
            />
          </div>
          {/* Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-text)] leading-tight">
              Find the right AI model,
              <br />
              <span className="text-[var(--color-text-muted)]">without the guesswork.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md leading-relaxed">
              Ollama has {models.length}+ open-source models — but discovering which one fits your
              use case, hardware, or language is hard. Ollama Explorer makes it easy.
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
