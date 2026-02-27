import { ImageResponse } from 'next/og';
import { getModelById } from '@/lib/data/models';

export const alt = 'Ollama Model - Detail View';
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
        background: `linear-gradient(135deg, #09090b 0%, ${domainColor}11 100%)`,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '60px 72px',
        position: 'relative',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.02,
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #fafafa 1px, transparent 1px), radial-gradient(circle at 75% 75%, #fafafa 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${domainColor} 0%, ${domainColor}88 100%)`,
        }}
      />

      {/* Top: site name */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}
      >
        <div style={{ fontSize: 28, color: domainColor }}>⬡</div>
        <div style={{ fontSize: 16, color: '#71717a', fontWeight: 600, letterSpacing: '0.5px' }}>
          OLLAMA EXPLORER
        </div>
      </div>

      {/* Middle: model info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          position: 'relative',
          zIndex: 1,
        }}
      >
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
              border: `1px solid ${domainColor}55`,
              borderRadius: 6,
              padding: '6px 16px',
              fontSize: 16,
              color: domainColor,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: `0 0 20px ${domainColor}33`,
            }}
          >
            {domain}
          </div>
          {pulls && (
            <div
              style={{
                fontSize: 16,
                color: '#71717a',
                fontWeight: 500,
              }}
            >
              ⚡ {pulls}
            </div>
          )}
        </div>

        {/* Model name */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: '#fafafa',
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textShadow: '0 2px 30px rgba(0, 0, 0, 0.5)',
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
              lineHeight: 1.6,
              maxWidth: 900,
              fontWeight: 400,
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
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: '16px 24px',
            maxWidth: 600,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ fontSize: 20, color: domainColor }}>$</div>
          <div
            style={{
              fontSize: 20,
              fontFamily: 'monospace',
              color: '#e4e4e7',
              letterSpacing: '0.3px',
            }}
          >
            ollama run {model.model_identifier}
          </div>
        </div>
      )}
    </div>,
    { ...size },
  );
}
