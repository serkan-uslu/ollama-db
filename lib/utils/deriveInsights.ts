import { formatContextWindow } from './format';
import type { Model } from '@/lib/types/model';

export interface ModelInsights {
  strengths: string[];
  limitations: string[];
}

/**
 * Derives human-readable strengths and limitations from structured model fields.
 * No AI inference — purely rule-based from domain, capabilities, context window, etc.
 */
export function deriveInsights(model: Model): ModelInsights {
  const strengths: string[] = [];
  const limitations: string[] = [];

  const maxCtx = Math.max(
    ...(model.memory_requirements ?? []).map((r) => r.context_window ?? 0),
    0,
  );

  // ── Capabilities ──────────────────────────────────────────────────────────
  if (model.capabilities.includes('Tools')) {
    strengths.push('Native function and tool calling support');
  }
  if (model.capabilities.includes('Thinking')) {
    strengths.push('Extended chain-of-thought (CoT) reasoning');
  }
  if (model.capabilities.includes('Vision')) {
    strengths.push('Multimodal — understands both images and text');
  }
  if (model.capabilities.includes('Embedding')) {
    strengths.push('Generates high-quality vector embeddings for search & retrieval');
  }

  // ── Domain ────────────────────────────────────────────────────────────────
  if (model.domain === 'Code') {
    strengths.push('Optimized for code generation, debugging, and analysis');
    limitations.push('Less suitable for open-ended creative or general conversation');
  }
  if (model.domain === 'Math') {
    strengths.push('Specialized in mathematical reasoning and problem solving');
    limitations.push('Narrowly focused — not designed for general-purpose tasks');
  }
  if (model.domain === 'Medical') {
    strengths.push('Domain-specific clinical and biomedical knowledge');
    limitations.push(
      'Outputs require professional verification — not a substitute for medical advice',
    );
  }
  if (model.domain === 'Embedding') {
    limitations.push('Produces embeddings only — not designed for text generation');
  }

  // ── Context window ────────────────────────────────────────────────────────
  if (maxCtx >= 1_000_000) {
    strengths.push(
      `Extremely large context window (${formatContextWindow(maxCtx)}) — handles very long documents`,
    );
  } else if (maxCtx >= 128_000) {
    strengths.push(
      `Long context window (${formatContextWindow(maxCtx)}) — suitable for large codebases and documents`,
    );
  } else if (maxCtx >= 32_000) {
    strengths.push(`Extended context window (${formatContextWindow(maxCtx)})`);
  } else if (maxCtx > 0 && maxCtx < 8_000) {
    limitations.push(
      `Short context window (${formatContextWindow(maxCtx)}) — limited input length per conversation`,
    );
  }

  // ── Language coverage ─────────────────────────────────────────────────────
  if (model.ai_languages.includes('Multilingual')) {
    strengths.push('Strong multilingual support across many languages');
  } else if (model.ai_languages.length <= 2) {
    limitations.push('Primarily English-focused — limited multilingual capabilities');
  }

  // ── RAM / hardware ────────────────────────────────────────────────────────
  if (model.domain !== 'Embedding') {
    if (model.min_ram_gb >= 100) {
      limitations.push(
        `Very high memory requirements (${model.min_ram_gb}GB+ RAM) — needs dedicated high-end hardware`,
      );
    } else if (model.min_ram_gb >= 40) {
      limitations.push(
        `High memory requirements (${model.min_ram_gb}GB+ RAM) — requires a powerful workstation`,
      );
    } else if (model.min_ram_gb >= 16) {
      limitations.push(`Moderate memory requirements — minimum ${model.min_ram_gb}GB RAM`);
    }
  }

  // ── Complexity ────────────────────────────────────────────────────────────
  if (model.complexity === 'advanced') {
    strengths.push('State-of-the-art performance in its category');
  } else {
    strengths.push('Efficient and accessible — runs well on consumer hardware');
  }

  return { strengths, limitations };
}
