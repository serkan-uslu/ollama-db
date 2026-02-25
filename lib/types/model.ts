export type Domain = 'General' | 'Code' | 'Vision' | 'Math' | 'Medical' | 'Language' | 'Embedding';

export type Complexity = 'advanced' | 'intermediate';

export type Capability = 'Tools' | 'Thinking' | 'Embedding' | 'Vision' | 'Cloud';

export interface MemoryRequirement {
  tag: string;
  size: string;
  size_gb: number;
  recommended_ram_gb: number;
  quantization: string;
  context: string;
  context_window: number;
}

export interface Model {
  id: string;
  model_identifier: string;
  model_name: string;
  model_type: 'official';
  namespace: string | null;
  url: string;
  description: string;
  readme: string;
  capabilities: Capability[];
  capability: string;
  labels: string[];
  memory_requirements: MemoryRequirement[];
  min_ram_gb: number;
  use_cases: string[];
  domain: Domain;
  ai_languages: string[];
  complexity: Complexity;
  best_for: string;
  pulls: number;
  tags: number;
  last_updated: string;
  last_updated_str: string;
  timestamp: string;
}

export type SortOption =
  | 'pulls_desc'
  | 'pulls_asc'
  | 'ram_asc'
  | 'ram_desc'
  | 'updated_desc'
  | 'name_asc';
