import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getModelById } from '@/lib/data/models';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { formatPulls, formatRam, formatContextWindow } from '@/lib/utils/format';
import type { Model } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Compare Models',
  description: 'Side-by-side comparison of Ollama AI models.',
};

interface Props {
  searchParams: Promise<{ ids?: string | string[] }>;
}

function resolveIds(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

interface Row {
  label: string;
  render: (m: Model) => ReactNode;
}

function maxCtx(m: Model): number {
  return m.context_window ?? 0;
}

const ROWS: Row[] = [
  {
    label: 'Domain',
    render: (m) => <Badge variant="default">{m.domain}</Badge>,
  },
  {
    label: 'Creator',
    render: (m) => (
      <span className="text-sm text-(--color-text-muted)">{m.creator_org ?? '—'}</span>
    ),
  },
  {
    label: 'Model Family',
    render: (m) => (
      <span className="text-sm text-(--color-text-muted)">{m.model_family ?? '—'}</span>
    ),
  },
  {
    label: 'Speed',
    render: (m) =>
      m.speed_tier ? (
        <Badge variant="outline">
          {m.speed_tier.charAt(0).toUpperCase() + m.speed_tier.slice(1)}
        </Badge>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      ),
  },
  {
    label: 'Multimodal',
    render: (m) => (
      <span className="text-sm font-medium text-(--color-text)">
        {m.is_multimodal ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    label: 'Complexity',
    render: (m) => <Badge variant="outline">{m.complexity}</Badge>,
  },
  {
    label: 'Min RAM',
    render: (m) => (
      <span className="text-sm font-medium text-(--color-text)">{formatRam(m.min_ram_gb)}</span>
    ),
  },
  {
    label: 'Max Context',
    render: (m) => {
      const ctx = maxCtx(m);
      return (
        <span className="text-sm font-medium text-(--color-text)">
          {ctx > 0 ? formatContextWindow(ctx) : '—'}
        </span>
      );
    },
  },
  {
    label: 'Pulls',
    render: (m) => (
      <span className="text-sm font-medium text-(--color-text)">{formatPulls(m.pulls)}</span>
    ),
  },
  {
    label: 'Parameters',
    render: (m) => {
      const params =
        m.parameter_sizes && m.parameter_sizes.length > 0
          ? m.parameter_sizes
          : m.labels.filter((l) => !isNaN(parseFloat(l)));
      return params.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {params.map((p) => (
            <Badge key={p} variant="muted" size="sm">
              {p}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      );
    },
  },
  {
    label: 'Capabilities',
    render: (m) =>
      m.capabilities.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {m.capabilities.map((c) => (
            <Badge key={c} variant="outline" size="sm">
              {c}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      ),
  },
  {
    label: 'Use Cases',
    render: (m) =>
      m.use_cases.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {m.use_cases.map((u) => (
            <Badge key={u} variant="muted" size="sm">
              {u}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      ),
  },
  {
    label: 'Languages',
    render: (m) =>
      m.ai_languages.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {m.ai_languages.map((l) => (
            <Badge key={l} variant="muted" size="sm">
              {l}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      ),
  },
  {
    label: 'Best For',
    render: (m) => (
      <p className="text-xs text-(--color-text-muted) leading-relaxed">{m.best_for ?? '—'}</p>
    ),
  },
  {
    label: 'Applications',
    render: (m) =>
      m.applications && m.applications.length > 0 ? (
        <div className="flex flex-col gap-1">
          {m.applications.map((app) => (
            <div key={app.name} className="flex items-start gap-1.5 text-xs">
              <span className="font-medium text-(--color-text) shrink-0">{app.name}:</span>
              <code className="text-(--color-text-subtle) font-mono break-all">
                {app.launch_command}
              </code>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      ),
  },
  {
    label: 'Benchmarks',
    render: (m) =>
      m.benchmark_scores && m.benchmark_scores.length > 0 ? (
        <div className="flex flex-col gap-1">
          {m.benchmark_scores.map((b) => (
            <div key={b.name} className="flex items-center gap-1.5 text-xs">
              <span className="text-(--color-text-subtle)">{b.name}:</span>
              <span className="font-medium text-(--color-text)">
                {b.score !== null ? b.score : '—'}
                {b.unit ? ` ${b.unit}` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-(--color-text-subtle)">—</span>
      ),
  },
];

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const ids = resolveIds(params.ids);
  const models = ids.map((id) => getModelById(id)).filter((m): m is Model => m !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10 min-h-[calc(100dvh-3.5rem)]">
      {/* Back */}
      <div className="mb-6">
        <Link href="/models">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={14} />
            Back to models
          </Button>
        </Link>
      </div>

      <h1 className="text-xl sm:text-2xl font-semibold text-(--color-text) tracking-tight mb-2">
        Compare Models
      </h1>
      <p className="text-sm text-(--color-text-muted) mb-8">
        {models.length} model{models.length !== 1 ? 's' : ''} selected for comparison
      </p>

      {models.length < 2 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-(--color-text-muted)">
            Select at least 2 models from the model list to compare.
          </p>
          <Link href="/models">
            <Button variant="outline" size="sm">
              <ArrowLeft size={14} />
              Go to models
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-(--color-border) shadow-[var(--shadow-sm)]">
          <table className="min-w-full border-collapse">
            {/* Model headers */}
            <thead>
              <tr className="border-b border-(--color-border) bg-(--color-bg-subtle)">
                <th className="text-left px-5 py-4 w-36 text-xs font-semibold uppercase tracking-widest text-(--color-text-subtle)">
                  Field
                </th>
                {models.map((m) => (
                  <th key={m.id} className="text-left px-5 py-4 min-w-[200px]">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/models/${m.id}`}
                        className="text-sm font-semibold text-(--color-text) hover:underline underline-offset-2"
                      >
                        {m.model_name}
                      </Link>
                      <p className="text-xs text-(--color-text-subtle) line-clamp-2 leading-relaxed font-normal">
                        {m.description}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Rows */}
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-(--color-border) last:border-0 ${
                    i % 2 === 0 ? 'bg-(--color-bg)' : 'bg-(--color-bg-subtle)'
                  }`}
                >
                  <td className="px-5 py-4 text-xs font-semibold text-(--color-text-subtle) uppercase tracking-wide whitespace-nowrap align-top">
                    {row.label}
                  </td>
                  {models.map((m) => (
                    <td key={m.id} className="px-5 py-4 align-top">
                      {row.render(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
