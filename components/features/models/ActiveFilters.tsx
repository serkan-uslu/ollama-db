'use client';

import { X } from 'lucide-react';
import type { FilterOptions } from '@/lib/types/filter';
import type { useFilters } from '@/lib/hooks/useFilters';
import type { Capability, Complexity, Domain, SpeedTier } from '@/lib/types/model';

type FiltersHook = ReturnType<typeof useFilters>;

interface ActiveFiltersProps {
  hook: FiltersHook;
  options: FilterOptions;
}

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilters({ hook, options }: ActiveFiltersProps) {
  const {
    filters,
    toggleCapability,
    toggleDomain,
    toggleUseCase,
    toggleComplexity,
    toggleLanguage,
    toggleSpeedTier,
    toggleModelFamily,
    toggleCreatorOrg,
    toggleApplication,
    setRamBucket,
    setParamSizeBucket,
    setContextWindowBucket,
    reset,
  } = hook;

  const chips: Chip[] = [];

  filters.capabilities.forEach((cap) => {
    chips.push({
      key: `cap-${cap}`,
      label: cap,
      onRemove: () => toggleCapability(cap as Capability),
    });
  });

  filters.domains.forEach((d) => {
    chips.push({
      key: `domain-${d}`,
      label: d,
      onRemove: () => toggleDomain(d as Domain),
    });
  });

  filters.complexities.forEach((c) => {
    chips.push({
      key: `complexity-${c}`,
      label: c ? c.charAt(0).toUpperCase() + c.slice(1) : c,
      onRemove: () => toggleComplexity(c as Complexity),
    });
  });

  filters.useCases.forEach((uc) => {
    chips.push({
      key: `uc-${uc}`,
      label: uc,
      onRemove: () => toggleUseCase(uc),
    });
  });

  filters.languages.forEach((lang) => {
    chips.push({
      key: `lang-${lang}`,
      label: lang,
      onRemove: () => toggleLanguage(lang),
    });
  });

  filters.speedTiers.forEach((tier) => {
    chips.push({
      key: `speed-${tier}`,
      label: `Speed: ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
      onRemove: () => toggleSpeedTier(tier as SpeedTier),
    });
  });

  filters.modelFamilies.forEach((family) => {
    chips.push({
      key: `family-${family}`,
      label: `Family: ${family}`,
      onRemove: () => toggleModelFamily(family),
    });
  });

  filters.creatorOrgs.forEach((org) => {
    chips.push({
      key: `creator-${org}`,
      label: `Creator: ${org}`,
      onRemove: () => toggleCreatorOrg(org),
    });
  });

  filters.applications.forEach((app) => {
    chips.push({
      key: `app-${app}`,
      label: `App: ${app}`,
      onRemove: () => toggleApplication(app),
    });
  });

  if (filters.paramSizeBucket) {
    const bucket = options.paramSizeBuckets.find(
      (b) => `${b.min}-${b.max}` === filters.paramSizeBucket,
    );
    chips.push({
      key: 'paramSize',
      label: bucket?.label ?? filters.paramSizeBucket,
      onRemove: () => setParamSizeBucket(null),
    });
  }

  if (filters.ramBucket) {
    const bucket = options.ramBuckets.find((b) => `${b.min}-${b.max}` === filters.ramBucket);
    chips.push({
      key: 'ram',
      label: `RAM: ${bucket?.label ?? filters.ramBucket}`,
      onRemove: () => setRamBucket(null),
    });
  }

  if (filters.contextWindowBucket) {
    const bucket = options.contextWindowBuckets.find(
      (b) => `${b.min}-${b.max}` === filters.contextWindowBucket,
    );
    chips.push({
      key: 'ctx',
      label: `Ctx: ${bucket?.label ?? filters.contextWindowBucket}`,
      onRemove: () => setContextWindowBucket(null),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 px-2.5 h-7 rounded-[var(--radius-full)] text-xs font-medium bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.label} filter`}
            className="flex items-center justify-center ml-0.5 hover:opacity-60 transition-opacity"
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={reset}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 transition-colors ml-1"
      >
        Clear all
      </button>
    </div>
  );
}
