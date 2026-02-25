import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}

export function StatCard({ label, value, description, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]',
        className,
      )}
    >
      <span className="text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wide">
        {label}
      </span>
      <span className="text-2xl font-semibold text-[var(--color-text)] leading-tight">{value}</span>
      {description && (
        <span className="text-xs text-[var(--color-text-muted)] leading-snug">{description}</span>
      )}
    </div>
  );
}
