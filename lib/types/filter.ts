import type { Capability, Complexity, Domain, SpeedTier } from './model';

export interface ParamSizeBucket {
  label: string;
  min: number;
  max: number;
}

export interface RamBucket {
  label: string;
  min: number;
  max: number;
}

export interface ContextWindowBucket {
  label: string;
  min: number;
  max: number;
}

export interface FilterOptions {
  capabilities: Capability[];
  domains: Domain[];
  useCases: string[];
  complexities: Complexity[];
  languages: string[];
  speedTiers: SpeedTier[];
  modelFamilies: string[];
  creatorOrgs: string[];
  applications: string[];
  paramSizeBuckets: ParamSizeBucket[];
  ramBuckets: RamBucket[];
  contextWindowBuckets: ContextWindowBucket[];
}

export interface ActiveFilters {
  search: string;
  capabilities: Capability[];
  domains: Domain[];
  useCases: string[];
  complexities: Complexity[];
  languages: string[];
  speedTiers: SpeedTier[];
  modelFamilies: string[];
  creatorOrgs: string[];
  applications: string[];
  paramSizeBucket: string | null;
  ramBucket: string | null;
  contextWindowBucket: string | null;
  sort: string;
}
