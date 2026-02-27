export const DOMAIN_ACCENT: Record<string, string> = {
  General: '#3b82f6',
  Code: '#10b981',
  Vision: '#8b5cf6',
  Math: '#f59e0b',
  Medical: '#ef4444',
  Language: '#14b8a6',
  Embedding: '#6b7280',
  Multimodal: '#ec4899',
  Reasoning: '#6366f1',
  Science: '#06b6d4',
};

export function getDomainAccent(domain: string): string {
  return DOMAIN_ACCENT[domain] ?? '#a1a1aa';
}
