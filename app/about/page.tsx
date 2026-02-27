import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllModels } from '@/lib/data/models';
import { deriveFilterOptions } from '@/lib/data/filters';
import { Divider } from '@/components/ui/atoms/Divider';
import { Button } from '@/components/ui/atoms/Button';
import { formatDate } from '@/lib/utils/format';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ollama Model Explorer is a fast, minimal directory for browsing 200+ open-source AI models scraped from ollama.com. Built with Next.js, React and Tailwind CSS.',
  alternates: {
    canonical: 'https://ollama-explorer.vercel.app/about',
  },
  openGraph: {
    url: 'https://ollama-explorer.vercel.app/about',
    title: 'About | Ollama Model Explorer',
    description: 'Learn about the Ollama Model Explorer project, its data sources and tech stack.',
  },
};

export default function AboutPage() {
  const models = getAllModels();
  const options = deriveFilterOptions(models);
  const lastUpdated = models
    .map((m) => m.timestamp)
    .sort()
    .at(-1);

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          About Ollama Explorer
        </h1>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          Open-source AI has never been more accessible — but that accessibility comes with a new
          problem:{' '}
          <strong className="text-[var(--color-text)]">
            too many choices, too little structure.
          </strong>
        </p>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
          >
            Ollama
          </a>{' '}
          provides the infrastructure to run open-source large language models locally with a single
          command. Its library lists 200+ models — but with minimal filtering, discovering which
          open-source model fits your hardware, use case, or language takes time you shouldn&rsquo;t
          have to spend.
        </p>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          Ollama Explorer solves this. Every model is enriched with structured metadata: capability
          tags, domain classification, RAM requirements, context window sizes, parameter size
          buckets, and language support. You can filter across all of these dimensions at once,
          search with fuzzy matching (tolerates typos), and get to the right model in seconds — not
          minutes.
        </p>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          Whether you’re a developer picking a coding assistant, a researcher comparing reasoning
          models, or someone running AI on a laptop with 8 GB of RAM — Ollama Explorer gets you to
          the right starting point faster.
        </p>
      </div>

      <Divider />

      {/* Data */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Data</h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          Model data was scraped from{' '}
          <a
            href="https://ollama.com/library"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
          >
            ollama.com/library
          </a>{' '}
          and processed into structured JSON, enriching each entry with domain classification,
          use-case tagging, RAM requirements and complexity ratings.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Total models', value: models.length },
            { label: 'Domains', value: options.domains.length },
            { label: 'Capabilities', value: options.capabilities.length },
            { label: 'Use cases', value: options.useCases.length },
            { label: 'Languages', value: options.languages.length },
            { label: 'Last indexed', value: lastUpdated ? formatDate(lastUpdated) : '—' },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
            >
              <p className="text-xs text-[var(--color-text-subtle)] mb-1">{s.label}</p>
              <p className="text-lg font-semibold text-[var(--color-text)]">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Tech stack */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Tech stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Next.js 16', desc: 'App Router, force-static, generateStaticParams' },
            { name: 'React 19', desc: 'Server Components + client interactivity' },
            { name: 'TypeScript 5', desc: 'Strict mode, zero errors' },
            { name: 'Tailwind CSS v4', desc: 'CSS-native design tokens, no config file' },
            { name: 'Fuse.js', desc: 'Fuzzy search with field weights and typo tolerance' },
            { name: 'Lucide Icons', desc: 'Consistent icon system' },
            { name: 'Atomic Design', desc: 'atoms → molecules → templates → pages' },
            { name: 'Geist Font', desc: 'Geist Sans + Geist Mono via next/font' },
          ].map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-0.5 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
            >
              <span className="text-sm font-medium text-[var(--color-text)]">{t.name}</span>
              <span className="text-xs text-[var(--color-text-subtle)]">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/models">
          <Button size="md">Browse models</Button>
        </Link>
        <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="md">
            Visit Ollama
          </Button>
        </a>
      </div>
    </main>
  );
}
