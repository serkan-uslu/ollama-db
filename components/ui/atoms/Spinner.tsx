import { cn } from '@/lib/utils/cn';

type Size = 'sm' | 'md' | 'lg';

interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: Size;
}

const sizeMap: Record<Size, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

export function Spinner({ size = 'md', className, ...rest }: SpinnerProps) {
  const px = sizeMap[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('animate-spin text-[var(--color-text-subtle)]', className)}
      aria-label="Loading"
      role="status"
      {...rest}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="40"
        strokeDashoffset="30"
      />
    </svg>
  );
}
