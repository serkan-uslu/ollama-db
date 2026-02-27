'use client';

import { useCallback, useMemo, useState } from 'react';
import type { ActiveFilters } from '@/lib/types/filter';
import type { Capability, Complexity, Domain, SpeedTier } from '@/lib/types/model';
import { DEFAULT_SORT } from '@/lib/constants';

const INITIAL: ActiveFilters = {
  search: '',
  capabilities: [],
  domains: [],
  useCases: [],
  complexities: [],
  languages: [],
  speedTiers: [],
  modelFamilies: [],
  creatorOrgs: [],
  applications: [],
  isFineTuned: null,
  isUncensored: null,
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

  const toggleSpeedTier = useCallback((tier: SpeedTier) => {
    setFilters((prev) => ({
      ...prev,
      speedTiers: prev.speedTiers.includes(tier)
        ? prev.speedTiers.filter((t) => t !== tier)
        : [...prev.speedTiers, tier],
    }));
  }, []);

  const toggleModelFamily = useCallback((family: string) => {
    setFilters((prev) => ({
      ...prev,
      modelFamilies: prev.modelFamilies.includes(family)
        ? prev.modelFamilies.filter((f) => f !== family)
        : [...prev.modelFamilies, family],
    }));
  }, []);

  const toggleCreatorOrg = useCallback((org: string) => {
    setFilters((prev) => ({
      ...prev,
      creatorOrgs: prev.creatorOrgs.includes(org)
        ? prev.creatorOrgs.filter((o) => o !== org)
        : [...prev.creatorOrgs, org],
    }));
  }, []);

  const toggleApplication = useCallback((app: string) => {
    setFilters((prev) => ({
      ...prev,
      applications: prev.applications.includes(app)
        ? prev.applications.filter((a) => a !== app)
        : [...prev.applications, app],
    }));
  }, []);

  const toggleFineTuned = useCallback(() => {
    setFilters((prev) => ({ ...prev, isFineTuned: prev.isFineTuned === true ? null : true }));
  }, []);

  const toggleUncensored = useCallback(() => {
    setFilters((prev) => ({ ...prev, isUncensored: prev.isUncensored === true ? null : true }));
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
      filters.speedTiers.length +
      filters.modelFamilies.length +
      filters.creatorOrgs.length +
      filters.applications.length +
      (filters.isFineTuned === true ? 1 : 0) +
      (filters.isUncensored === true ? 1 : 0) +
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
    toggleSpeedTier,
    toggleModelFamily,
    toggleCreatorOrg,
    toggleApplication,
    toggleFineTuned,
    toggleUncensored,
    setRamBucket,
    setParamSizeBucket,
    setContextWindowBucket,
    setSort,
    reset,
  };
}
