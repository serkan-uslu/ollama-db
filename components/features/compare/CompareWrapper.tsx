'use client';

import type { ReactNode } from 'react';
import { CompareProvider } from '@/lib/context/CompareContext';
import { CompareBar } from './CompareBar';

export function CompareWrapper({ children }: { children: ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <CompareBar />
    </CompareProvider>
  );
}
