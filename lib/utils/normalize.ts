/**
 * Maps known creator_org variants to their canonical display name.
 * Handles inconsistent data from the enrichment pipeline.
 */
const CREATOR_ORG_ALIASES: Record<string, string> = {
  // Cohere variants
  CohereForAI: 'Cohere',
  'Cohere For AI': 'Cohere',
  // Nous Research variants
  NousResearch: 'Nous Research',
  // 01-AI variants
  '01-ai': '01-AI',
  // TII variants
  'Technology Innovation Institute': 'TII',
};

export function normalizeCreatorOrg(org: string | null | undefined): string | null {
  if (!org || org === 'null') return null;
  return CREATOR_ORG_ALIASES[org] ?? org;
}
