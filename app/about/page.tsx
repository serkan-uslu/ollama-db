import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllModels } from '@/lib/data/models';
import { deriveFilterOptions } from '@/lib/data/filters';
import { Divider } from '@/components/ui/atoms/Divider';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { formatDate } from '@/lib/utils/format';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the Ollama Model Explorer project.',
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
        <p className="text-4xl select-none">⬡</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          About Ollama Explorer
        </h1>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          A minimal, fast directory for browsing open-source AI models available via{' '}
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
          >
            Ollama
          </a>
          . Search by name, filter by capability, domain, RAM requirement, parameter size and more.
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
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {['Next.js 16', 'React 19', 'TypeScript 5', 'Tailwind CSS v4', 'Lucide Icons'].map(
            (t) => (
              <Badge key={t} variant="outline" size="md">
                {t}
              </Badge>
            ),
          )}
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
