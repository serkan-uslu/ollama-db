import { ImageResponse } from 'next/og';
import { getModelById } from '@/lib/data/models';

export const alt = 'Model detail';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

const DOMAIN_COLORS: Record<string, string> = {
  General: '#3b82f6',
  Code: '#10b981',
  Vision: '#8b5cf6',
  Math: '#f59e0b',
  Medical: '#ef4444',
  Language: '#06b6d4',
  Embedding: '#64748b',
};

export default async function ModelOgImage({ params }: Props) {
  const { id } = await params;
  const model = getModelById(id);

  const name = model?.model_name ?? 'AI Model';
  const description = model?.description
    ? model.description.length > 120
      ? model.description.slice(0, 117) + '...'
      : model.description
    : '';
  const domain = model?.domain ?? '';
  const pulls = model?.pulls
    ? model.pulls >= 1_000_000
      ? `${(model.pulls / 1_000_000).toFixed(1)}M pulls`
      : `${(model.pulls / 1_000).toFixed(0)}K pulls`
    : '';
  const domainColor = DOMAIN_COLORS[domain] ?? '#3b82f6';

  return new ImageResponse(
    <div
      style={{
        background: '#09090b',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'sans-serif',
        padding: '60px 72px',
      }}
    >
      {/* Top: site name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 28, color: '#71717a' }}>⬡</div>
        <div style={{ fontSize: 18, color: '#52525b', fontWeight: 500 }}>Ollama Model Explorer</div>
      </div>

      {/* Middle: model info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Domain badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              background: domainColor + '22',
              border: `1px solid ${domainColor}44`,
              borderRadius: 6,
              padding: '4px 14px',
              fontSize: 18,
              color: domainColor,
              fontWeight: 600,
            }}
          >
            {domain}
          </div>
          {pulls && (
            <div
              style={{
                fontSize: 18,
                color: '#71717a',
              }}
            >
              {pulls}
            </div>
          )}
        </div>

        {/* Model name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#fafafa',
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: 22,
              color: '#a1a1aa',
              lineHeight: 1.55,
              maxWidth: 900,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Bottom: run command */}
      {model && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 10,
            padding: '14px 22px',
            maxWidth: 500,
          }}
        >
          <div style={{ fontSize: 18, color: '#52525b' }}>$</div>
          <div
            style={{ fontSize: 20, fontFamily: 'monospace', color: '#71717a', letterSpacing: 0 }}
          >
            ollama run {model.model_identifier}
          </div>
        </div>
      )}
    </div>,
    { ...size },
  );
}
