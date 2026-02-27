import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { getAllModels, getModelById, getRelatedModels } from '@/lib/data/models';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { Divider } from '@/components/ui/atoms/Divider';
import { JsonLd } from '@/components/ui/atoms/JsonLd';
import { CopyCommand } from '@/components/ui/molecules/CopyCommand';
import { DetailLayout } from '@/components/templates/DetailLayout';
import { ModelDetailActions } from '@/components/features/models/ModelDetailActions';
import { formatPulls, formatRam, formatDate, formatContextWindow } from '@/lib/utils/format';
import { getDomainAccent } from '@/lib/utils/domain';
import { normalizeCreatorOrg } from '@/lib/utils/normalize';

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

  const url = `https://ollama-explorer.vercel.app/models/${model.id}`;
  const keywords = [
    model.model_name,
    model.domain,
    ...model.capabilities,
    ...(model.use_cases ?? []),
    'ollama',
    'AI model',
    'LLM',
  ].filter(Boolean);

  return {
    title: model.model_name,
    description: model.description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${model.model_name} | Ollama Model Explorer`,
      description: model.description,
    },
    twitter: {
      card: 'summary',
      title: `${model.model_name} | Ollama Model Explorer`,
      description: model.description,
    },
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { id } = await params;
  const model = getModelById(id);
  if (!model) notFound();

  const url = `https://ollama-explorer.vercel.app/models/${model.id}`;
  const related = getRelatedModels(model, 4);

  const strengths = model.strengths ?? [];
  const limitations = model.limitations ?? [];
  const accentColor = getDomainAccent(model.domain);
  const creatorDisplay = normalizeCreatorOrg(model.creator_org);

  // Deduplicate memory_requirements: keep first occurrence of each normalised base tag
  // e.g. "llama3.1:latest" and "latest" both normalise to "latest" — keep the full-qualified one
  const seenBaseTags = new Set<string>();
  const dedupedRequirements = model.memory_requirements.filter((r) => {
    const base = r.tag.includes(':') ? r.tag.split(':')[1] : r.tag;
    if (seenBaseTags.has(base)) return false;
    seenBaseTags.add(base);
    return true;
  });

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: model.model_name,
    description: model.description,
    url,
    applicationCategory: 'AI / Machine Learning',
    operatingSystem: 'Linux, macOS, Windows',
    keywords: [model.domain, ...model.capabilities, ...(model.use_cases ?? [])]
      .filter(Boolean)
      .join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://ollama-explorer.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Models',
        item: 'https://ollama-explorer.vercel.app/models',
      },
      { '@type': 'ListItem', position: 3, name: model.model_name, item: url },
    ],
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)]">
      <JsonLd data={softwareSchema} />
      <JsonLd data={breadcrumbSchema} />
      <DetailLayout
        back={
          <div className="flex flex-col gap-2">
            {/* Breadcrumb nav — visible UI */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]"
            >
              <Link href="/" className="hover:text-[var(--color-text-muted)] transition-colors">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link
                href="/models"
                className="hover:text-[var(--color-text-muted)] transition-colors"
              >
                Models
              </Link>
              <span aria-hidden>/</span>
              <span className="text-[var(--color-text-muted)] truncate max-w-[160px]">
                {model.model_name}
              </span>
            </nav>
            <Link href="/models">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={14} />
                Back to models
              </Button>
            </Link>
          </div>
        }
        header={
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="default"
                style={{ background: accentColor, color: '#fff', borderColor: accentColor }}
              >
                {model.domain}
              </Badge>
              <Badge variant="outline">{model.complexity}</Badge>
              {model.capabilities.map((cap) => (
                <Badge key={cap} variant="outline">
                  {cap}
                </Badge>
              ))}
            </div>
            <h1 className="flex items-center gap-2.5 text-2xl sm:text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              <span
                className="inline-block w-3 h-3 rounded-full shrink-0"
                style={{ background: accentColor }}
              />
              {model.model_name}
            </h1>
            {(creatorDisplay || model.model_family) && (
              <p className="flex items-center gap-1.5 text-sm text-[var(--color-text-subtle)]">
                {creatorDisplay && <span>{creatorDisplay}</span>}
                {creatorDisplay && model.model_family && <span aria-hidden>·</span>}
                {model.model_family && <span>{model.model_family}</span>}
              </p>
            )}
            <p className="text-base text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              {model.description}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-subtle)]">
              <span>{formatPulls(model.pulls)} pulls</span>
              <span>Updated {formatDate(model.last_updated)}</span>
              <span>{model.tags} tags</span>
              {model.context_window > 0 && (
                <span>{formatContextWindow(model.context_window)} context</span>
              )}
            </div>
          </div>
        }
        main={
          <>
            {/* Quick run command */}
            <section>
              <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Quick start</h2>
              <CopyCommand
                command={`ollama run ${model.model_identifier}`}
                modelName={model.model_name}
                modelIdentifier={model.model_identifier}
              />
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
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
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
                    {dedupedRequirements.map((r, i) => (
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

            <Divider />

            {/* Applications */}
            {model.applications && model.applications.length > 0 && (
              <>
                <section>
                  <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Run with</h2>
                  <div className="flex flex-col gap-2">
                    {model.applications.map((app) => (
                      <div
                        key={app.name}
                        className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)]"
                      >
                        <div className="flex items-center gap-2 min-w-0 sm:w-32 shrink-0">
                          <Terminal
                            size={13}
                            className="shrink-0 text-[var(--color-text-subtle)]"
                          />
                          <span className="text-xs font-medium text-[var(--color-text)]">
                            {app.name}
                          </span>
                        </div>
                        <code className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg-muted)] px-2 py-1 rounded truncate">
                          {app.launch_command}
                        </code>
                      </div>
                    ))}
                  </div>
                </section>
                <Divider />
              </>
            )}

            {/* Strengths & Limitations */}
            {(strengths.length > 0 || limitations.length > 0) && (
              <section>
                <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">
                  Strengths &amp; Limitations
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {strengths.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                        Strengths
                      </p>
                      <ul className="flex flex-col gap-2">
                        {strengths.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2 text-xs text-[var(--color-text-muted)] leading-relaxed"
                          >
                            <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-emerald-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {limitations.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                        Limitations
                      </p>
                      <ul className="flex flex-col gap-2">
                        {limitations.map((l) => (
                          <li
                            key={l}
                            className="flex items-start gap-2 text-xs text-[var(--color-text-muted)] leading-relaxed"
                          >
                            <XCircle size={13} className="shrink-0 mt-0.5 text-orange-400" />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Benchmark Scores */}
            {model.benchmark_scores && model.benchmark_scores.length > 0 && (
              <>
                <Divider />
                <section>
                  <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
                    Benchmarks
                  </h2>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="min-w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                          {['Benchmark', 'Score', 'Unit'].map((h) => (
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
                        {model.benchmark_scores.map((b) => (
                          <tr
                            key={b.name}
                            className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                          >
                            <td className="px-4 sm:px-3 py-2.5 font-medium text-[var(--color-text-muted)] whitespace-nowrap first:pl-4 sm:first:pl-0">
                              {b.name}
                            </td>
                            <td className="px-4 sm:px-3 py-2.5 text-[var(--color-text)] tabular-nums whitespace-nowrap">
                              {b.score !== null ? b.score : '—'}
                            </td>
                            <td className="px-4 sm:px-3 py-2.5 text-[var(--color-text-subtle)] whitespace-nowrap">
                              {b.unit ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {/* Related models */}
            {related.length > 0 && (
              <>
                <Divider />
                <section>
                  <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">
                    Related models
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/models/${rel.id}`}
                        className="group flex flex-col gap-1.5 p-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[var(--shadow-sm)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-muted)] transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[var(--color-text)] group-hover:underline underline-offset-2">
                            {rel.model_name}
                          </span>
                          <Badge variant="muted" size="sm">
                            {rel.domain}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--color-text-subtle)] line-clamp-2 leading-relaxed">
                          {rel.description}
                        </p>
                        <span className="text-xs text-[var(--color-text-subtle)]">
                          {formatPulls(rel.pulls)} pulls
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        }
        sidebar={
          <div className="flex flex-col gap-5">
            {/* Creator / Family info */}
            {(creatorDisplay || model.model_family) && (
              <>
                <div className="flex flex-col gap-2">
                  {creatorDisplay && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-1">
                        Creator
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">{creatorDisplay}</p>
                    </div>
                  )}
                  {model.model_family && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-1">
                        Model family
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">{model.model_family}</p>
                    </div>
                  )}
                  {model.license && (
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-1">
                        License
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">{model.license}</p>
                    </div>
                  )}
                </div>
                <Divider />
              </>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {model.is_multimodal && <Badge variant="default">Multimodal</Badge>}
              {model.is_fine_tuned && <Badge variant="outline">Fine-tuned</Badge>}
              {model.is_uncensored && <Badge variant="outline">Uncensored</Badge>}
            </div>

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

            {model.target_audience && model.target_audience.length > 0 && (
              <>
                <Divider />
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2.5">
                    Target audience
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {model.target_audience.map((t) => (
                      <Badge key={t} variant="muted">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

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
            <div className="rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border-strong)] p-4">
              <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide mb-2">
                Best for
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {model.best_for}
              </p>
            </div>

            <Divider />

            {/* External links with analytics tracking */}
            <ModelDetailActions
              modelName={model.model_name}
              modelId={model.id}
              domain={model.domain}
              ollamaUrl={model.url}
              huggingFaceUrl={model.huggingface_url ?? undefined}
            />
          </div>
        }
      />
    </div>
  );
}
