'use client';

import { useRef, useState } from 'react';

export function OlliVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    if (!videoRef.current) return;
    const nextMuted = !muted;
    videoRef.current.muted = nextMuted;
    setMuted(nextMuted);
  }

  return (
    <div className="relative select-none" style={{ width: 'fit-content' }}>
      <video
        ref={videoRef}
        src="/olli.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-[220px] h-[390px] sm:w-[260px] sm:h-[462px] rounded-3xl shadow-xl object-cover"
      />

      {/* Bottom sound button */}
      <div className="absolute bottom-5 inset-x-0 flex items-center justify-center pointer-events-none">
        <button
          onClick={toggleSound}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="pointer-events-auto flex flex-col items-center gap-2 cursor-pointer"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          {/* Ripple rings — only when muted */}
          <span className="relative flex items-center justify-center">
            {muted && (
              <>
                <span
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'rgba(255,255,255,0.25)',
                    animationDuration: '1.4s',
                  }}
                />
                <span
                  className="absolute rounded-full animate-ping"
                  style={{
                    width: 88,
                    height: 88,
                    background: 'rgba(255,255,255,0.12)',
                    animationDuration: '1.4s',
                    animationDelay: '0.3s',
                  }}
                />
              </>
            )}

            {/* Icon circle */}
            <span
              className="relative flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: 56,
                height: 56,
                background: muted ? 'rgba(255,255,255,0.22)' : 'rgba(34,197,94,0.80)',
                backdropFilter: 'blur(10px)',
                boxShadow: muted ? '0 4px 24px rgba(0,0,0,0.35)' : '0 4px 24px rgba(34,197,94,0.5)',
              }}
            >
              {muted ? (
                /* Speaker off */
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
                  <line
                    x1="23"
                    y1="9"
                    x2="17"
                    y2="15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="17"
                    y1="9"
                    x2="23"
                    y2="15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Speaker on */
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="white" />
                  <path
                    d="M15.54 8.46a5 5 0 0 1 0 7.07"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M19.07 4.93a10 10 0 0 1 0 14.14"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </span>

          {/* Label */}
          <span
            className="text-xs font-semibold tracking-wide transition-all duration-300"
            style={{
              color: 'white',
              textShadow: '0 1px 6px rgba(0,0,0,0.7)',
              opacity: muted ? 1 : 0.85,
            }}
          >
            {muted ? 'Tap to hear Olli' : 'Sound on'}
          </span>
        </button>
      </div>
    </div>
  );
}
