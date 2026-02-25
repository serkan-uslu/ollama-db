import { cn } from '@/lib/utils/cn';

interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ orientation = 'horizontal', className, ...rest }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('w-px self-stretch bg-[var(--color-border)]', className)}
        role="separator"
        aria-orientation="vertical"
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      />
    );
  }
  return (
    <hr className={cn('border-none h-px bg-[var(--color-border)] w-full', className)} {...rest} />
  );
}
