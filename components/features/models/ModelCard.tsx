import Link from 'next/link';
import { Badge } from '@/components/ui/atoms/Badge';
import { CopyCommand } from '@/components/ui/molecules/CopyCommand';
import { CompareToggle } from '@/components/ui/atoms/CompareToggle';
import { cn } from '@/lib/utils/cn';
import { formatPulls, formatRam, formatContextWindow } from '@/lib/utils/format';
import { normalizeCreatorOrg } from '@/lib/utils/normalize';
import { getDomainAccent } from '@/lib/utils/domain';
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
  | 'context_window'
  | 'speed_tier'
  | 'parameter_sizes'
  | 'pulls'
  | 'last_updated_str'
  | 'complexity'
  | 'creator_org'
  | 'model_family'
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
  const rawParams =
    model.parameter_sizes && model.parameter_sizes.length > 0
      ? model.parameter_sizes
      : model.labels.filter((l) => !isNaN(parseFloat(l)));
  const paramLabels = rawParams.slice(0, 5);
  const extraCount = rawParams.length - 5;
  const ctx = model.context_window ?? 0;
  const accentColor = getDomainAccent(model.domain);
  const creatorDisplay = normalizeCreatorOrg(model.creator_org);

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-4 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-[0_2px_8px_0_rgb(0_0_0/0.08)] hover:border-[var(--color-border-strong)] hover:shadow-[0_4px_16px_0_rgb(0_0_0/0.12)] transition-all duration-200',
        className,
      )}
    >
      {/* Full-card clickable overlay — sits below interactive children */}
      <Link
        href={`/models/${model.id}`}
        className="absolute inset-0 rounded-[var(--radius-lg)]"
        aria-label={`View details for ${model.model_name}`}
        tabIndex={-1}
      />
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full shrink-0"
              style={{ background: accentColor }}
            />
            <Link
              href={`/models/${model.id}`}
              className="text-sm font-semibold text-[var(--color-text)] hover:underline underline-offset-2 truncate relative z-10"
            >
              {model.model_name}
            </Link>
          </div>
          <Badge
            variant={(DOMAIN_COLORS[model.domain] as 'default' | 'outline' | 'muted') ?? 'default'}
          >
            {model.domain}
          </Badge>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 relative z-10">
          <CompareToggle modelId={model.id} modelName={model.model_name} />
          <div className="flex flex-col items-end gap-1 text-xs text-[var(--color-text-subtle)]">
            <span className="font-medium text-[var(--color-text-muted)]">
              {formatPulls(model.pulls)} pulls
            </span>
            <span>{model.last_updated_str}</span>
          </div>
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
      <div className="flex flex-col gap-2 pt-3 pb-3 mt-auto border-t border-[var(--color-border)] -mx-5 px-5 rounded-b-[var(--radius-lg)] bg-[var(--color-bg-subtle)]">
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-subtle)]">
          <span>
            Min RAM:{' '}
            <span className="font-medium text-[var(--color-text-muted)]">
              {formatRam(model.min_ram_gb)}
            </span>
          </span>
          {ctx > 0 && (
            <span>
              Ctx:{' '}
              <span className="font-medium text-[var(--color-text-muted)]">
                {formatContextWindow(ctx)}
              </span>
            </span>
          )}
          {model.speed_tier && (
            <span className="ml-auto">
              <Badge variant="muted" size="sm">
                {model.speed_tier}
              </Badge>
            </span>
          )}
        </div>
        {(creatorDisplay || model.model_family) && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-subtle)]">
            {creatorDisplay && <span className="truncate">{creatorDisplay}</span>}
            {creatorDisplay && model.model_family && <span aria-hidden>·</span>}
            {model.model_family && <span className="truncate">{model.model_family}</span>}
          </div>
        )}
        <CopyCommand command={`ollama run ${model.model_identifier}`} className="relative z-10" />
      </div>
    </article>
  );
}
