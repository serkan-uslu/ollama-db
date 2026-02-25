import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'outline' | 'muted' | 'active';
type Size = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] border border-transparent',
  outline: 'bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)]',
  muted: 'bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)] border border-transparent',
  active:
    'bg-[var(--color-accent)] text-[var(--color-on-accent)] border border-[var(--color-accent)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-[var(--radius-sm)] whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
