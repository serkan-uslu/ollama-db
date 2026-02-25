import Link from 'next/link';
import { ArrowRight, Cpu, MemoryStick, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/atoms/Badge';
import { formatPulls, formatRam, formatContextWindow } from '@/lib/utils';
import type { Model } from '@/lib/types';

interface ModelOfTheDayProps {
  model: Model;
}

export function ModelOfTheDay({ model }: ModelOfTheDayProps) {
  const maxCtx = Math.max(
    ...(model.memory_requirements ?? []).map((r) => r.context_window ?? 0),
    0,
  );

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-20 py-12">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-subtle)]">
            Model of the Day
          </span>
          <span className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Card */}
        <Link
          href={`/models/${model.id}`}
          className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 sm:p-8 hover:border-[var(--color-border-strong)] hover:shadow-md transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Left — name + meta */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-text)] tracking-tight">
                  {model.model_name}
                </h2>
                {model.domain && (
                  <Badge variant="outline" size="sm">
                    {model.domain}
                  </Badge>
                )}
              </div>

              {model.description && (
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                  {model.description}
                </p>
              )}

              {/* Capabilities */}
              {model.capabilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {model.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" size="sm">
                      {cap}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Best for */}
              {model.best_for && (
                <p className="text-xs text-[var(--color-text-subtle)]">
                  <span className="font-medium text-[var(--color-text-muted)]">Best for:</span>{' '}
                  {model.best_for}
                </p>
              )}
            </div>

            {/* Right — stats */}
            <div className="shrink-0 flex sm:flex-col gap-4 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                <MemoryStick size={14} className="text-[var(--color-text-subtle)]" />
                <span>{formatRam(model.min_ram_gb)} RAM</span>
              </div>
              {maxCtx > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                  <BookOpen size={14} className="text-[var(--color-text-subtle)]" />
                  <span>{formatContextWindow(maxCtx)} ctx</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                <Cpu size={14} className="text-[var(--color-text-subtle)]" />
                <span>{formatPulls(model.pulls)} pulls</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] group-hover:gap-2.5 transition-all mt-auto">
                <span>View model</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Use cases */}
          {model.use_cases.length > 0 && (
            <div className="mt-5 pt-5 border-t border-[var(--color-border)] flex flex-wrap gap-1.5">
              {model.use_cases.map((uc) => (
                <span
                  key={uc}
                  className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                >
                  {uc}
                </span>
              ))}
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}
