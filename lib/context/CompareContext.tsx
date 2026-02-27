'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

const MAX_COMPARE = 4;

interface CompareContextValue {
  ids: string[];
  names: Record<string, string>;
  toggle: (id: string, name: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  const toggle = useCallback((id: string, name: string) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
    setNames((prev) => ({ ...prev, [id]: name }));
  }, []);

  const clear = useCallback(() => {
    setIds([]);
    setNames({});
  }, []);

  const isSelected = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <CompareContext.Provider value={{ ids, names, toggle, clear, isSelected }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
