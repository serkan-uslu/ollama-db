import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getAllModels, getModelById } from '@/lib/data/models';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { Divider } from '@/components/ui/atoms/Divider';
import { CopyCommand } from '@/components/ui/molecules/CopyCommand';
import { DetailLayout } from '@/components/templates/DetailLayout';
import { formatPulls, formatRam, formatDate } from '@/lib/utils/format';

export const dynamic = 'force-static';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const models = getAllModels();
  return models.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) return {};
  return {
    title: model.model_name,
    description: model.description,
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) notFound();

  return (
    <div className="min-h-[calc(100dvh-3.5rem)]">
      <DetailLayout
        back={
          <Link href="/models">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={14} />
              Back to models
            </Button>
          </Link>
        }
        header={
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{model.domain}</Badge>
              <Badge variant="outline">{model.complexity}</Badge>
              {model.capabilities.map((cap) => (
                <Badge key={cap} variant="outline">
                  {cap}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              {model.model_name}
            </h1>
            <p className="text-base text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              {model.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-subtle)]">
              <span>{formatPulls(model.pulls)} pulls</span>
              <span>Updated {formatDate(model.last_updated)}</span>
              <span>{model.tags} tags</span>
            </div>
          </div>
        }
        main={
          <>
            {/* Quick run command */}
            <section>
              <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Quick start</h2>
              <CopyCommand command={`ollama run ${model.model_identifier}`} />
            </section>

            <Divider />

            {/* Memory requirements table */}
            <section>
              <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                Available sizes
              </h2>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      {['Tag', 'Size', 'Quantization', 'Context', 'Min RAM'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 sm:px-3 py-2.5 font-medium text-[var(--color-text-subtle)] whitespace-nowrap first:pl-4 sm:first:pl-0"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {model.memory_requirements.map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                      >
                        <td className="px-4 sm:px-3 py-2.5 font-mono text-[var(--color-text-muted)] whitespace-nowrap first:pl-4 sm:first:pl-0">
                          {r.tag}
                        </td>
                        <td className="px-4 sm:px-3 py-2.5 text-[var(--color-text-muted)] whitespace-nowrap">
                          {r.size}
                        </td>
                        <td className="px-4 sm:px-3 py-2.5 text-[var(--color-text-subtle)] whitespace-nowrap">
                          {r.quantization}
                        </td>
                        <td className="px-4 sm:px-3 py-2.5 text-[var(--color-text-subtle)] whitespace-nowrap">
                          {r.context}
                        </td>
                        <td className="px-4 sm:px-3 py-2.5 text-[var(--color-text-muted)] whitespace-nowrap">
                          {formatRam(r.recommended_ram_gb)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        }
        sidebar={
          <div className="flex flex-col gap-5">
            {/* Use cases */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2.5">
                Use cases
              </p>
              <div className="flex flex-wrap gap-1.5">
                {model.use_cases.map((uc) => (
                  <Badge key={uc} variant="default">
                    {uc}
                  </Badge>
                ))}
              </div>
            </div>

            <Divider />

            {/* Languages */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2.5">
                Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {model.ai_languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <Divider />

            {/* Best for */}
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2">
                Best for
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {model.best_for}
              </p>
            </div>

            <Divider />

            {/* External link */}
            <a
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <ExternalLink size={14} />
              View on ollama.com
            </a>
          </div>
        }
      />
    </div>
  );
}
