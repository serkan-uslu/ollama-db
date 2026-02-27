import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Header, Footer } from '@/components/features/layout';
import { CompareWrapper } from '@/components/features/compare/CompareWrapper';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Ollama Model Explorer',
    template: '%s | Ollama Model Explorer',
  },
  description:
    'Browse, search and filter 200+ open-source AI models available via Ollama. Find the right model by capability, domain, RAM requirement and more.',
  metadataBase: new URL('https://ollama-explorer.vercel.app'),
  keywords: [
    'ollama',
    'AI models',
    'open-source LLM',
    'large language model',
    'local AI',
    'llama',
    'deepseek',
    'mistral',
    'gemma',
    'model explorer',
  ],
  authors: [{ name: 'Serkan Uslu', url: 'https://github.com/serkan-uslu' }],
  creator: 'Serkan Uslu',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ollama-explorer.vercel.app',
    siteName: 'Ollama Model Explorer',
    title: 'Ollama Model Explorer',
    description: 'Browse, search and filter 200+ open-source AI models available via Ollama.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Ollama Model Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ollama Model Explorer',
    description: 'Browse, search and filter 200+ open-source AI models available via Ollama.',
    images: ['/opengraph-image'],
    creator: '@serkanuslu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Injected before first paint to prevent FOUC
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = stored || preferred;
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <CompareWrapper>
          <div className="flex-1">{children}</div>
          <Footer />
          <Analytics />
        </CompareWrapper>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
