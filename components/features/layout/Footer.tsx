import Link from 'next/link';
import { Divider } from '@/components/ui/atoms/Divider';

export function Footer() {
  return (
    <footer className="w-full mt-auto">
      <Divider />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-text-subtle)]">
          © {new Date().getFullYear()} Ollama Explorer
        </p>
        <p className="text-xs text-[var(--color-text-subtle)]">
          Data sourced from{' '}
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
    </footer>
  );
}
