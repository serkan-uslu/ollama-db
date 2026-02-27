'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { GoogleAnalytics } from '@next/third-parties/google';

const COOKIE_CONSENT_KEY = 'cookie-consent';

function GoogleAnalyticsWrapper() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(COOKIE_CONSENT_KEY) as 'accepted' | 'declined' | null;
  });

  useEffect(() => {
    // Listen for storage changes
    const handleStorageChange = () => {
      const newConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as 'accepted' | 'declined' | null;
      setConsent(newConsent);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Only load GA4 if user accepted and GA_ID is configured
  if (consent === 'accepted' && process.env.NEXT_PUBLIC_GA_ID) {
    return <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />;
  }

  return null;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <>
      <GoogleAnalyticsWrapper />

      {!isVisible ? null : (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl shadow-2xl border border-[var(--color-border-strong)] p-4 sm:p-6 bg-[var(--color-bg)] relative">
              {/* Close button */}
              <button
                onClick={handleDecline}
                aria-label="Close cookie banner"
                className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 text-3xl">🍪</div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    We use cookies to analyze site traffic and improve your experience. By using our
                    site, you agree to our{' '}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-2 text-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors font-medium"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] transition-colors order-2 sm:order-1"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:opacity-90 transition-opacity order-1 sm:order-2"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(COOKIE_CONSENT_KEY) as 'accepted' | 'declined' | null;
  });

  useEffect(() => {
    // Listen for storage changes (in case user accepts/declines in another tab)
    const handleStorageChange = () => {
      const newConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as 'accepted' | 'declined' | null;
      setConsent(newConsent);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return consent;
}
