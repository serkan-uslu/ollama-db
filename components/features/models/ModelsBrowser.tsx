'use client';

import { useMemo } from 'react';
import { ModelFilters } from './ModelFilters';
import { ModelGrid } from './ModelGrid';
import { SearchInput } from '@/components/ui/molecules';
import { BrowseLayout } from '@/components/templates';
import { useFilters, useDebounce } from '@/lib/hooks';
import { filterAndSortModels } from '@/lib/data';
import type { Model } from '@/lib/types';
import type { FilterOptions } from '@/lib/types';

interface ModelsBrowserProps {
  allModels: Model[];
  filterOptions: FilterOptions;
}

export function ModelsBrowser({ allModels, filterOptions }: ModelsBrowserProps) {
  const hook = useFilters();
  const debouncedSearch = useDebounce(hook.filters.search, 300);

  const results = useMemo(() => {
    return filterAndSortModels({ ...hook.filters, search: debouncedSearch });
  }, [hook.filters, debouncedSearch, allModels]); // allModels is stable (server prop)

  return (
    <BrowseLayout
      search={
        <SearchInput
          value={hook.filters.search}
          onChange={hook.setSearch}
          className="w-full max-w-xl"
        />
      }
      sidebar={
        <ModelFilters
          options={filterOptions}
          hook={hook}
          totalResults={results.length}
          totalModels={allModels.length}
        />
      }
      count={
        <p className="text-sm text-[var(--color-text-muted)]">
          Showing <span className="font-medium text-[var(--color-text)]">{results.length}</span> of{' '}
          {allModels.length} models
        </p>
      }
      results={<ModelGrid models={results} />}
    />
  );
}
