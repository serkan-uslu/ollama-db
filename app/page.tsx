import Link from 'next/link';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { Button } from '@/components/ui/atoms/Button';
import { getAllModels, getTopModel, getSmallestModel } from '@/lib/data/models';
import { formatPulls, formatRam } from '@/lib/utils/format';
import { deriveFilterOptions } from '@/lib/data/filters';

export const dynamic = 'force-static';

export default function HomePage() {
  const models = getAllModels();
  const topModel = getTopModel();
  const smallestModel = getSmallestModel();
  const options = deriveFilterOptions(models);

  return (
    <main id="main" className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-28 text-center">
        <p className="text-5xl sm:text-6xl mb-6 select-none" aria-hidden>
          ⬡
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-text)] max-w-xl leading-tight">
          Browse open-source AI models
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md leading-relaxed">
          Search, filter and discover {models.length}+ models available on Ollama by capability,
          domain, size and more.
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
    </main>
  );
}
