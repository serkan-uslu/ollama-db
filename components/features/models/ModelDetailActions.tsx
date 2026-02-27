'use client';

import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { trackModelView, trackExternalLinkClick } from '@/lib/utils/ga';

interface ModelDetailActionsProps {
  modelName: string;
  modelId: string;
  domain: string;
  ollamaUrl: string;
  huggingFaceUrl?: string;
}

export function ModelDetailActions({
  modelName,
  modelId,
  domain,
  ollamaUrl,
  huggingFaceUrl,
}: ModelDetailActionsProps) {
  // Track model view on mount
  useEffect(() => {
    trackModelView(modelName, modelId, domain);
  }, [modelName, modelId, domain]);

  return (
    <>
      {/* External links with event tracking */}
      <div className="flex flex-col gap-2">
        <a
          href={ollamaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackExternalLinkClick(ollamaUrl, 'ollama')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ExternalLink size={14} />
          View on ollama.com
        </a>
        {huggingFaceUrl && (
          <a
            href={huggingFaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackExternalLinkClick(huggingFaceUrl, 'huggingface')}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ExternalLink size={14} />
            View on Hugging Face
          </a>
        )}
      </div>
    </>
  );
}
