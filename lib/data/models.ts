import Fuse from 'fuse.js';
import type { Model, SortOption } from '@/lib/types/model';
import type { ActiveFilters } from '@/lib/types/filter';
import modelsJson from '@/public/models.json';

const rawData = modelsJson as Model[];

// Singleton Fuse index — built once at module load time
const fuse = new Fuse(rawData, {
  keys: [
    { name: 'model_name', weight: 4 },
    { name: 'description', weight: 2 },
    { name: 'use_cases', weight: 2 },
    { name: 'best_for', weight: 1.5 },
    { name: 'domain', weight: 1 },
    { name: 'capabilities', weight: 0.5 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,
});

export function getAllModels(): Model[] {
  return rawData;
}

export function getModelById(id: string): Model | undefined {
  return rawData.find((m) => m.id === id);
}

export function getModelByIdentifier(identifier: string): Model | undefined {
  return rawData.find((m) => m.model_identifier === identifier);
}

export function getTotalCount(): number {
  return rawData.length;
}

export function getTopModel(): Model {
  return [...rawData].sort((a, b) => (b.pulls ?? 0) - (a.pulls ?? 0))[0];
}

export function getSmallestModel(): Model {
  return [...rawData].sort((a, b) => (a.min_ram_gb ?? 999) - (b.min_ram_gb ?? 999))[0];
}

export function filterAndSortModels(filters: ActiveFilters): Model[] {
  let results = [...rawData];

  if (filters.search.trim()) {
    const fuseResults = fuse.search(filters.search.trim());
    results = fuseResults.map((r) => r.item);
  }

  if (filters.capabilities.length > 0) {
    results = results.filter((m) =>
      filters.capabilities.every((cap) => m.capabilities.includes(cap)),
    );
  }

  if (filters.domains.length > 0) {
    results = results.filter((m) => filters.domains.includes(m.domain));
  }

  if (filters.useCases.length > 0) {
    results = results.filter((m) => filters.useCases.every((uc) => m.use_cases.includes(uc)));
  }

  if (filters.complexities.length > 0) {
    results = results.filter((m) => filters.complexities.includes(m.complexity));
  }

  if (filters.languages.length > 0) {
    results = results.filter((m) =>
      filters.languages.every((lang) => m.ai_languages.includes(lang)),
    );
  }

  if (filters.ramBucket) {
    const [min, max] = filters.ramBucket.split('-').map(Number);
    results = results.filter((m) => {
      const ram = m.min_ram_gb ?? 0;
      if (max === Infinity || isNaN(max)) return ram >= min;
      return ram >= min && ram < max;
    });
  }

  if (filters.paramSizeBucket) {
    const [min, max] = filters.paramSizeBucket.split('-').map(Number);
    results = results.filter((m) => {
      const sizes = m.labels.map((l) => parseFloat(l)).filter((n) => !isNaN(n));
      if (sizes.length === 0) return false;
      const minSize = Math.min(...sizes);
      if (isNaN(max)) return minSize >= min;
      return minSize >= min && minSize < max;
    });
  }

  if (filters.contextWindowBucket) {
    const [min, max] = filters.contextWindowBucket.split('-').map(Number);
    results = results.filter((m) => {
      const ctx = Math.max(...(m.memory_requirements ?? []).map((r) => r.context_window ?? 0), 0);
      if (ctx === 0) return false;
      if (isNaN(max)) return ctx >= min;
      return ctx >= min && ctx < max;
    });
  }

  results = sortModels(results, filters.sort as SortOption);
  return results;
}

export function getRelatedModels(model: Model, limit = 4): Model[] {
  const sameDomain = rawData
    .filter((m) => m.id !== model.id && m.domain === model.domain)
    .sort((a, b) => (b.pulls ?? 0) - (a.pulls ?? 0));

  if (sameDomain.length >= limit) return sameDomain.slice(0, limit);

  // Fallback: same capabilities
  const capSet = new Set(model.capabilities);
  const byCap = rawData.filter(
    (m) => m.id !== model.id && m.capabilities.some((c) => capSet.has(c)),
  );
  const merged = [...new Map([...sameDomain, ...byCap].map((m) => [m.id, m])).values()];
  return merged.sort((a, b) => (b.pulls ?? 0) - (a.pulls ?? 0)).slice(0, limit);
}

export function sortModels(models: Model[], sort: SortOption): Model[] {
  const sorted = [...models];
  switch (sort) {
    case 'pulls_asc':
      return sorted.sort((a, b) => (a.pulls ?? 0) - (b.pulls ?? 0));
    case 'ram_asc':
      return sorted.sort((a, b) => (a.min_ram_gb ?? 0) - (b.min_ram_gb ?? 0));
    case 'ram_desc':
      return sorted.sort((a, b) => (b.min_ram_gb ?? 0) - (a.min_ram_gb ?? 0));
    case 'updated_desc':
      return sorted.sort(
        (a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime(),
      );
    case 'name_asc':
      return sorted.sort((a, b) => a.model_name.localeCompare(b.model_name));
    case 'pulls_desc':
    default:
      return sorted.sort((a, b) => (b.pulls ?? 0) - (a.pulls ?? 0));
  }
}
