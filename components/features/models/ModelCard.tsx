import Link from 'next/link';
import { Badge } from '@/components/ui/atoms/Badge';
import { CopyCommand } from '@/components/ui/molecules/CopyCommand';
import { cn } from '@/lib/utils/cn';
import { formatPulls, formatRam, formatContextWindow } from '@/lib/utils/format';
import type { Model } from '@/lib/types/model';

export type ModelCardModel = Pick<
  Model,
  | 'id'
  | 'model_identifier'
  | 'model_name'
  | 'description'
  | 'domain'
  | 'capabilities'
  | 'labels'
  | 'memory_requirements'
  | 'min_ram_gb'
  | 'pulls'
  | 'last_updated_str'
  | 'complexity'
>;

interface ModelCardProps {
  model: ModelCardModel;
  className?: string;
}

const DOMAIN_COLORS: Record<string, string> = {
  General: 'default',
  Code: 'outline',
  Vision: 'outline',
  Math: 'outline',
  Medical: 'outline',
  Language: 'outline',
  Embedding: 'muted',
} as const;

export function ModelCard({ model, className }: ModelCardProps) {
  const numericLabels = model.labels.filter((l) => !isNaN(parseFloat(l)));
  const paramLabels = numericLabels.slice(0, 5);
  const extraCount = numericLabels.length - 5;
  const maxCtx = Math.max(
    ...(model.memory_requirements ?? []).map((r) => r.context_window ?? 0),
    0,
  );

  return (
    <article
      className={cn(
        'group flex flex-col gap-4 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-200',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <Link
            href={`/models/${model.id}`}
            className="text-sm font-semibold text-[var(--color-text)] hover:underline underline-offset-2 truncate"
          >
            {model.model_name}
          </Link>
          <Badge
            variant={(DOMAIN_COLORS[model.domain] as 'default' | 'outline' | 'muted') ?? 'default'}
          >
            {model.domain}
          </Badge>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 text-xs text-[var(--color-text-subtle)]">
          <span className="font-medium text-[var(--color-text-muted)]">
            {formatPulls(model.pulls)} pulls
          </span>
          <span>{model.last_updated_str}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs leading-5 text-[var(--color-text-muted)] line-clamp-2 flex-1">
        {model.description}
      </p>

      {/* Param sizes */}
      {paramLabels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {paramLabels.map((l) => (
            <Badge key={l} variant="muted" size="sm">
              {l}
            </Badge>
          ))}
          {extraCount > 0 && (
            <Badge variant="muted" size="sm">
              +{extraCount}
            </Badge>
          )}
        </div>
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

      {/* Footer */}
      <div className="flex flex-col gap-2 pt-1 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-subtle)]">
          <span>
            Min RAM:{' '}
            <span className="font-medium text-[var(--color-text-muted)]">
              {formatRam(model.min_ram_gb)}
            </span>
          </span>
          {maxCtx > 0 && (
            <span>
              Ctx:{' '}
              <span className="font-medium text-[var(--color-text-muted)]">
                {formatContextWindow(maxCtx)}
              </span>
            </span>
          )}
        </div>
        <CopyCommand command={`ollama run ${model.model_identifier}`} />
      </div>
    </article>
  );
}
