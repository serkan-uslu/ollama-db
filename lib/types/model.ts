export type Domain =
  | 'General'
  | 'Code'
  | 'Vision'
  | 'Math'
  | 'Medical'
  | 'Language'
  | 'Embedding'
  | 'Multimodal'
  | 'Reasoning'
  | 'Science';

export type Complexity = 'advanced' | 'intermediate' | 'beginner';

export type Capability = 'Tools' | 'Thinking' | 'Embedding' | 'Vision' | 'Cloud';

export type SpeedTier = 'fast' | 'medium' | 'slow';

export interface Application {
  name: string;
  launch_command: string;
}

export interface BenchmarkScore {
  name: string;
  score: number | null;
  unit: string | null;
}

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
  applications: Application[];
  memory_requirements: MemoryRequirement[];
  min_ram_gb: number;
  context_window: number;
  speed_tier: SpeedTier | null;
  use_cases: string[];
  domain: Domain;
  ai_languages: string[];
  complexity: Complexity;
  best_for: string;
  model_family: string | null;
  base_model: string | null;
  is_fine_tuned: boolean;
  is_uncensored: boolean;
  is_multimodal: boolean;
  license: string | null;
  strengths: string[];
  limitations: string[];
  target_audience: string[];
  creator_org: string | null;
  huggingface_url: string | null;
  benchmark_scores: BenchmarkScore[];
  parameter_sizes: string[];
  pulls: number;
  tags: number;
  last_updated: string;
  last_updated_str: string;
  timestamp: string;
  enrich_version: number;
  validated: boolean;
  validation_failed: string | null;
}

export type SortOption =
  | 'pulls_desc'
  | 'pulls_asc'
  | 'ram_asc'
  | 'ram_desc'
  | 'updated_desc'
  | 'name_asc';
