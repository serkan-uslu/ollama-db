/**
 * App-wide constants.
 * Keep sort options, pagination config and other scalar constants here
 * so they are never mixed with formatting utilities.
 */

export const ITEMS_PER_PAGE = 24;

export const DEFAULT_SORT = 'pulls_desc';

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'pulls_desc', label: 'Most Popular' },
  { value: 'pulls_asc', label: 'Least Popular' },
  { value: 'ram_asc', label: 'Smallest Model' },
  { value: 'ram_desc', label: 'Largest Model' },
  { value: 'updated_desc', label: 'Recently Updated' },
  { value: 'name_asc', label: 'A – Z' },
];
