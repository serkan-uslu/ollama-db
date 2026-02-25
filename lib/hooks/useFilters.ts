'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ActiveFilters } from '@/lib/types/filter';
import type { Capability, Complexity, Domain } from '@/lib/types/model';
import { DEFAULT_SORT } from '@/lib/constants';

const INITIAL: ActiveFilters = {
  search: '',
  capabilities: [],
  domains: [],
  useCases: [],
  complexities: [],
  languages: [],
  paramSizeBucket: null,
  ramBucket: null,
  contextWindowBucket: null,
  sort: DEFAULT_SORT,
};

export function useFilters() {
  const [filters, setFilters] = useState<ActiveFilters>(INITIAL);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleCapability = useCallback((cap: Capability) => {
    setFilters((prev) => ({
      ...prev,
      capabilities: prev.capabilities.includes(cap)
        ? prev.capabilities.filter((c) => c !== cap)
        : [...prev.capabilities, cap],
    }));
  }, []);

  const toggleDomain = useCallback((domain: Domain) => {
    setFilters((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  }, []);

  const toggleUseCase = useCallback((uc: string) => {
    setFilters((prev) => ({
      ...prev,
      useCases: prev.useCases.includes(uc)
        ? prev.useCases.filter((u) => u !== uc)
        : [...prev.useCases, uc],
    }));
  }, []);

  const toggleComplexity = useCallback((c: Complexity) => {
    setFilters((prev) => ({
      ...prev,
      complexities: prev.complexities.includes(c)
        ? prev.complexities.filter((x) => x !== c)
        : [...prev.complexities, c],
    }));
  }, []);

  const toggleLanguage = useCallback((lang: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  }, []);

  const setRamBucket = useCallback((bucket: string | null) => {
    setFilters((prev) => ({
      ...prev,
      ramBucket: prev.ramBucket === bucket ? null : bucket,
    }));
  }, []);

  const setParamSizeBucket = useCallback((bucket: string | null) => {
    setFilters((prev) => ({
      ...prev,
      paramSizeBucket: prev.paramSizeBucket === bucket ? null : bucket,
    }));
  }, []);

  const setContextWindowBucket = useCallback((bucket: string | null) => {
    setFilters((prev) => ({
      ...prev,
      contextWindowBucket: prev.contextWindowBucket === bucket ? null : bucket,
    }));
  }, []);

  const setSort = useCallback((sort: string) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const reset = useCallback(() => setFilters(INITIAL), []);

  const activeCount = useMemo(() => {
    return (
      filters.capabilities.length +
      filters.domains.length +
      filters.useCases.length +
      filters.complexities.length +
      filters.languages.length +
      (filters.paramSizeBucket ? 1 : 0) +
      (filters.ramBucket ? 1 : 0) +
      (filters.contextWindowBucket ? 1 : 0)
    );
  }, [filters]);

  return {
    filters,
    activeCount,
    setSearch,
    toggleCapability,
    toggleDomain,
    toggleUseCase,
    toggleComplexity,
    toggleLanguage,
    setRamBucket,
    setParamSizeBucket,
    setContextWindowBucket,
    setSort,
    reset,
  };
}
