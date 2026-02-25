'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  className?: string;
}

export function FilterChip({
  label,
  active = false,
  onToggle,
  onRemove,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 h-8 rounded-[var(--radius-full)] text-xs font-medium border transition-colors cursor-pointer select-none',
        active
          ? 'bg-[var(--color-accent)] text-[var(--color-on-accent)] border-[var(--color-accent)]'
          : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]',
        className,
      )}
      aria-pressed={active}
    >
      {label}
      {active && onRemove && (
        <span
          role="button"
          aria-label={`Remove ${label} filter`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex items-center justify-center"
        >
          <X size={12} />
        </span>
      )}
    </button>
  );
}
