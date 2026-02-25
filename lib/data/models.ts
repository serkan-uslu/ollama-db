import type { Model, SortOption } from '@/lib/types/model';
import type { ActiveFilters } from '@/lib/types/filter';
import modelsJson from '@/public/models.json';

const rawData = modelsJson as Model[];

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
    const q = filters.search.toLowerCase();
    results = results.filter(
      (m) =>
        m.model_name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.use_cases.some((u) => u.toLowerCase().includes(q)) ||
        m.best_for.toLowerCase().includes(q) ||
        m.domain.toLowerCase().includes(q),
    );
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

  results = sortModels(results, filters.sort as SortOption);
  return results;
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
