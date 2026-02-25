export function formatPulls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function formatRam(gb: number): string {
  if (gb < 1) return `${Math.round(gb * 1024)} MB`;
  return `${gb} GB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

export const ITEMS_PER_PAGE = 24;

export const DEFAULT_SORT: string = 'pulls_desc';

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'pulls_desc', label: 'Most Popular' },
  { value: 'pulls_asc', label: 'Least Popular' },
  { value: 'ram_asc', label: 'Smallest Model' },
  { value: 'ram_desc', label: 'Largest Model' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'name_asc', label: 'A – Z' },
];
