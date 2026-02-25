import { ModelCard } from './ModelCard';
import type { Model } from '@/lib/types/model';
import { cn } from '@/lib/utils/cn';

interface ModelGridProps {
  models: Model[];
  className?: string;
}

export function ModelGrid({ models, className }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <p className="text-4xl mb-4">⬡</p>
        <p className="text-base font-medium text-[var(--color-text)]">No models found</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xs">
          Try adjusting your search or removing some filters.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}
