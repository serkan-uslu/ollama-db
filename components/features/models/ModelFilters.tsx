'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { FilterChip } from '@/components/ui/molecules/FilterChip';
import { Button } from '@/components/ui/atoms/Button';
import { Divider } from '@/components/ui/atoms/Divider';
import { cn } from '@/lib/utils/cn';
import type { FilterOptions } from '@/lib/types/filter';
import type { Capability, Complexity, Domain } from '@/lib/types/model';
import type { useFilters } from '@/lib/hooks/useFilters';
import { SORT_OPTIONS } from '@/lib/constants';

type FiltersHook = ReturnType<typeof useFilters>;

interface ModelFiltersProps {
  options: FilterOptions;
  hook: FiltersHook;
  totalResults: number;
  totalModels: number;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterContent({ options, hook }: { options: FilterOptions; hook: FiltersHook }) {
  const {
    filters,
    toggleCapability,
    toggleDomain,
    toggleUseCase,
    toggleComplexity,
    toggleLanguage,
    setRamBucket,
    setParamSizeBucket,
    setSort,
  } = hook;

  return (
    <div className="flex flex-col gap-5">
      {/* Sort */}
      <Section title="Sort by">
        <select
          value={filters.sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full h-9 px-3 text-sm rounded-[var(--radius-md)] bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] focus:border-[var(--color-border-strong)] outline-none cursor-pointer"
          aria-label="Sort models"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Section>

      <Divider />

      {/* Capabilities */}
      <Section title="Capability">
        <div className="flex flex-wrap gap-1.5">
          {options.capabilities.map((cap) => (
            <FilterChip
              key={cap}
              label={cap}
              active={filters.capabilities.includes(cap)}
              onToggle={() => toggleCapability(cap as Capability)}
            />
          ))}
        </div>
      </Section>

      <Divider />

      {/* Domain */}
      <Section title="Domain">
        <div className="flex flex-wrap gap-1.5">
          {options.domains.map((d) => (
            <FilterChip
              key={d}
              label={d}
              active={filters.domains.includes(d)}
              onToggle={() => toggleDomain(d as Domain)}
            />
          ))}
        </div>
      </Section>

      <Divider />

      {/* Complexity */}
      <Section title="Complexity">
        <div className="flex flex-wrap gap-1.5">
          {options.complexities.map((c) => (
            <FilterChip
              key={c}
              label={c ? c.charAt(0).toUpperCase() + c.slice(1) : c}
              active={filters.complexities.includes(c)}
              onToggle={() => toggleComplexity(c as Complexity)}
            />
          ))}
        </div>
      </Section>

      <Divider />

      {/* Param Size */}
      <Section title="Parameter Size">
        <div className="flex flex-wrap gap-1.5">
          {options.paramSizeBuckets.map((b) => {
            const key = `${b.min}-${b.max}`;
            return (
              <FilterChip
                key={key}
                label={b.label}
                active={filters.paramSizeBucket === key}
                onToggle={() => setParamSizeBucket(key)}
              />
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* RAM */}
      <Section title="RAM Required">
        <div className="flex flex-wrap gap-1.5">
          {options.ramBuckets.map((b) => {
            const key = `${b.min}-${b.max}`;
            return (
              <FilterChip
                key={key}
                label={b.label}
                active={filters.ramBucket === key}
                onToggle={() => setRamBucket(key)}
              />
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* Use Cases */}
      <Section title="Use Case">
        <div className="flex flex-wrap gap-1.5">
          {options.useCases.map((uc) => (
            <FilterChip
              key={uc}
              label={uc}
              active={filters.useCases.includes(uc)}
              onToggle={() => toggleUseCase(uc)}
            />
          ))}
        </div>
      </Section>

      <Divider />

      {/* Language */}
      <Section title="Language">
        <div className="flex flex-wrap gap-1.5">
          {options.languages.map((lang) => (
            <FilterChip
              key={lang}
              label={lang}
              active={filters.languages.includes(lang)}
              onToggle={() => toggleLanguage(lang)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

export function ModelFilters({ options, hook, totalResults, totalModels }: ModelFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeCount, reset } = hook;

  return (
    <>
      {/* ── Mobile: trigger bar ── */}
      <div className="lg:hidden flex items-center justify-between gap-3 py-3 border-b border-[var(--color-border)]">
        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="font-medium text-[var(--color-text)]">{totalResults}</span> of{' '}
          {totalModels} models
        </p>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}>
            <SlidersHorizontal size={14} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </Button>
        </div>
      </div>

      {/* ── Mobile: bottom sheet ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="relative z-10 bg-[var(--color-bg)] rounded-t-[var(--radius-lg)] max-h-[85dvh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <p className="font-semibold text-sm text-[var(--color-text)]">
                Filters{activeCount > 0 ? ` (${activeCount})` : ''}
              </p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center min-h-[44px] min-w-[44px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-5">
              <FilterContent options={options} hook={hook} />
            </div>
            <div className="px-5 py-4 border-t border-[var(--color-border)] flex gap-3">
              <Button variant="ghost" size="md" className="flex-1" onClick={reset}>
                Reset all
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => setMobileOpen(false)}
              >
                Show {totalResults} results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop: sidebar ── */}
      <aside
        className={cn('hidden lg:flex flex-col gap-5 w-64 xl:w-72 shrink-0')}
        aria-label="Filter sidebar"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </p>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset all
            </Button>
          )}
        </div>
        <FilterContent options={options} hook={hook} />
      </aside>
    </>
  );
}
