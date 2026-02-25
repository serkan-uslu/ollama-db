import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ollama Model Explorer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#09090b',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '60px',
      }}
    >
      {/* Hexagon icon */}
      <div style={{ fontSize: 96, lineHeight: 1 }}>⬡</div>

      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: '#fafafa',
          marginTop: 32,
          letterSpacing: '-1px',
          textAlign: 'center',
        }}
      >
        Ollama Model Explorer
      </div>

      <div
        style={{
          fontSize: 26,
          color: '#a1a1aa',
          marginTop: 20,
          textAlign: 'center',
          maxWidth: 720,
          lineHeight: 1.5,
        }}
      >
        Browse, search and filter 200+ open-source AI models
      </div>

      {/* Bottom badge row */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 48,
        }}
      >
        {['214 Models', 'Filter by domain', 'Filter by RAM', 'Run with Ollama'].map((label) => (
          <div
            key={label}
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 18,
              color: '#71717a',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* URL watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          fontSize: 18,
          color: '#3f3f46',
        }}
      >
        ollama-explorer.vercel.app
      </div>
    </div>,
    { ...size },
  );
}
