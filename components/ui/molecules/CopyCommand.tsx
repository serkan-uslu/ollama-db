'use client';

import { Check, Copy, Terminal } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface CopyCommandProps {
  command: string;
  className?: string;
}

export function CopyCommand({ command, className }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] group',
        className,
      )}
    >
      <Terminal size={14} className="shrink-0 text-[var(--color-text-subtle)]" aria-hidden />
      <code className="flex-1 text-xs font-mono text-[var(--color-text-muted)] truncate">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px] text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
        aria-label={copied ? 'Copied!' : `Copy command: ${command}`}
      >
        {copied ? (
          <Check size={14} className="text-[var(--color-text-muted)]" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
}
