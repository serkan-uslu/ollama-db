'use client';

import { useRouter } from 'next/navigation';
import { X, Scale } from 'lucide-react';
import { useCompare } from '@/lib/context/CompareContext';
import { Button } from '@/components/ui/atoms/Button';

export function CompareBar() {
  const { ids, names, clear } = useCompare();
  const router = useRouter();

  if (ids.length === 0) return null;

  function handleCompare() {
    const params = ids.map((id) => `ids=${encodeURIComponent(id)}`).join('&');
    router.push(`/models/compare?${params}`);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-5 px-4 pointer-events-none">
      <div className="pointer-events-auto flex flex-wrap items-center gap-3 px-5 py-3 rounded-2xl bg-(--color-bg) border border-(--color-border) shadow-lg">
        <span className="text-sm font-medium text-(--color-text)">{ids.length} / 4 selected</span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {ids.map((id) => (
            <span
              key={id}
              className="text-xs px-2.5 py-0.5 rounded-full bg-(--color-bg-muted) border border-(--color-border) text-(--color-text-muted) font-medium"
            >
              {names[id] ?? id}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-1">
          <Button variant="ghost" size="sm" onClick={clear} aria-label="Clear selection">
            <X size={14} />
            Clear
          </Button>
          <Button size="sm" onClick={handleCompare} disabled={ids.length < 2}>
            <Scale size={14} />
            Compare
          </Button>
        </div>
      </div>
    </div>
  );
}
