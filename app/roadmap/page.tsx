import type { Metadata } from 'next';
import Link from 'next/link';
import { Divider } from '@/components/ui/atoms/Divider';
import { Button } from '@/components/ui/atoms/Button';
import { CheckCircle2, Circle } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'Discover what is coming next to Ollama Explorer. Check out our roadmap for future features like AI-powered chat, model ratings, and advanced comparison.',
  alternates: {
    canonical: 'https://ollama-explorer.vercel.app/roadmap',
  },
  openGraph: {
    url: 'https://ollama-explorer.vercel.app/roadmap',
    title: 'Roadmap | Ollama Model Explorer',
    description: 'Discover what is coming next to Ollama Explorer.',
  },
};

const ROADMAP_ITEMS = [
  {
    title: 'AI-powered Chat Interface',
    description:
      'Help users discover the right model through natural conversation instead of manual filtering.',
    status: 'planned',
  },
  {
    title: 'Model Rating & Review System',
    description: 'Community-driven ratings to help surface the best models in each domain.',
    status: 'planned',
  },
  {
    title: 'User Favorites & Collections',
    description: 'Save models to custom lists for easy access later.',
    status: 'planned',
  },
  {
    title: 'Advanced Comparison Features',
    description: 'Deep dive side-by-side comparison of up to 4 models with benchmark data.',
    status: 'planned',
  },
  {
    title: 'API for Model Data Access',
    description: 'Public API endpoint to programmatically query our enriched model directory.',
    status: 'planned',
  },
  {
    title: 'Dark Mode Schedule (Auto-Switch)',
    description: 'Respect system level dark/light mode scheduling.',
    status: 'planned',
  },
  {
    title: 'More Language Support',
    description: 'Expand tagging for non-English language support in models.',
    status: 'planned',
  },
  {
    title: 'Export Comparison Results',
    description: 'Download model comparisons as CSV or sharing link.',
    status: 'planned',
  },
  {
    title: 'Model Recommendations Based on Use Case',
    description: 'Automatic algorithm to suggest alternatives when viewing a model.',
    status: 'planned',
  },
];

export default function RoadmapPage() {
  return (
    <main id="main" className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          Roadmap
        </h1>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          Ollama Explorer is actively being developed. Our goal is to make discovering and choosing
          the right open-source AI model as seamless as possible. Here is a look at what we are
          planning to build next.
        </p>
      </div>

      <Divider />

      {/* Roadmap List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Upcoming Features</h2>
        <div className="flex flex-col gap-3">
          {ROADMAP_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] transition-colors hover:border-[var(--color-border-strong)]"
            >
              <div className="mt-0.5 shrink-0 text-[var(--color-text-subtle)]">
                {item.status === 'completed' ? (
                  <CheckCircle2 size={18} className="text-[var(--color-accent)]" />
                ) : (
                  <Circle size={18} />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[var(--color-text)]">{item.title}</span>
                <span className="text-sm text-[var(--color-text-muted)]">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Support / OSS */}
      <div className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Help Build the Future</h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          This project is fully open-source and community-driven. If you&rsquo;re interested in
          helping out with any of these roadmap items, we would love your contributions on GitHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href="https://github.com/serkan-uslu/ollama-explorer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="md">Contribute on GitHub</Button>
          </a>
          <Link href="/models">
            <Button variant="outline" size="md">
              Browse current models
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
