import Link from 'next/link';
import { Github } from 'lucide-react';
import { Divider } from '@/components/ui/atoms/Divider';

export function Footer() {
  return (
    <footer className="w-full mt-auto">
      <Divider />
      {/* Disclaimer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-2.5 border-b border-[var(--color-border)]">
        <p className="text-[11px] text-[var(--color-text-subtle)] leading-relaxed">
          ⚠️ Model metadata is automatically enriched and may contain errors or outdated
          information. Always verify with the{' '}
          <Link
            href="https://ollama.com/library"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--color-text-muted)] transition-colors"
          >
            official Ollama library
          </Link>{' '}
          before use. This site is not affiliated with Ollama.
        </p>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-text-subtle)]">
          © {new Date().getFullYear()} Ollama Explorer
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/serkan-uslu/ollama-explorer/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] transition-colors"
          >
            Report an issue
          </Link>
          <Link
            href="https://github.com/serkan-uslu/ollama-explorer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] transition-colors"
            aria-label="View source on GitHub"
          >
            <Github size={14} aria-hidden />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
          <p className="text-xs text-[var(--color-text-subtle)]">
            Data from{' '}
            <Link
              href="https://ollama.com/library"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-[var(--color-text-muted)] transition-colors"
            >
              ollama.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
