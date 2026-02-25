# SEO Guide — Ollama Model Explorer

## Current State

### Implemented ✅

| Item                                 | Location                                   | Notes                                                                                |
| ------------------------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `<title>` with template              | `app/layout.tsx`                           | `%s \| Ollama Model Explorer`                                                        |
| `metadataBase`                       | `app/layout.tsx`                           | `https://ollama-explorer.vercel.app`                                                 |
| `description`                        | all pages                                  | unique per page                                                                      |
| `keywords`                           | `app/layout.tsx`, `/models/[id]`           | global + per-model dynamic keywords                                                  |
| `authors` + `creator`                | `app/layout.tsx`                           | serkan-uslu                                                                          |
| `robots` directive                   | `app/layout.tsx`                           | index + follow, googleBot extended                                                   |
| OpenGraph tags                       | `app/layout.tsx` (global) + all pages      | type, url, title, description, image                                                 |
| Twitter Card                         | `app/layout.tsx` (global) + `/models/[id]` | `summary_large_image` on layout, `summary` on detail                                 |
| `canonical` links                    | all pages                                  | `alternates.canonical` per page                                                      |
| `robots.ts`                          | `app/robots.ts`                            | auto-generates `/robots.txt`                                                         |
| `sitemap.ts`                         | `app/sitemap.ts`                           | static routes + all 214 model detail pages                                           |
| **Dynamic OG image (global)**        | `app/opengraph-image.tsx`                  | Next.js `ImageResponse` (edge runtime), dark bg, badges row                          |
| **Dynamic OG image (per model)**     | `app/models/[id]/opengraph-image.tsx`      | model name, domain badge, description, run command preview                           |
| **JSON-LD — WebSite + SearchAction** | `app/page.tsx`                             | Google Sitelinks Searchbox eligible                                                  |
| **JSON-LD — SoftwareApplication**    | `app/models/[id]/page.tsx`                 | per-model structured data                                                            |
| **JSON-LD — BreadcrumbList**         | `app/models/[id]/page.tsx`                 | rich breadcrumb results in Google                                                    |
| **Breadcrumb UI**                    | `app/models/[id]/page.tsx`                 | visible `<nav aria-label="Breadcrumb">` above back button                            |
| **X-Robots-Tag: noindex**            | `next.config.ts`                           | auto-applied on non-production Vercel deployments                                    |
| FOUC-free theme                      | `app/layout.tsx`                           | inline script before first paint                                                     |
| Static generation                    | all pages                                  | `force-static` + `generateStaticParams`                                              |
| Semantic HTML                        | all pages                                  | `<main id="main">`, `<header>`, `<footer>`, `<nav>`, `<article>`, headings hierarchy |
| Skip-to-main                         | `Header.tsx`                               | `href="#main"`, sr-only, visible on focus                                            |
| `lang="en"`                          | `app/layout.tsx`                           |                                                                                      |
| `suppressHydrationWarning`           | `<html>`                                   | prevents theme-related hydration mismatch                                            |
| GitHub source link                   | `Footer.tsx`                               | `https://github.com/serkan-uslu/ollama-explorer`                                     |

---

## Pending / Recommended ⚠️

### High Priority

#### ~~1. OG Social Image~~ ✅ Done

`app/opengraph-image.tsx` — dynamic `ImageResponse` (edge runtime). Renders dark background, hexagon icon, title, description, four feature badges.

#### ~~2. Per-Model OG Image~~ ✅ Done

`app/models/[id]/opengraph-image.tsx` — per-model dynamic image with name, domain badge, description, run command preview.

#### ~~3. JSON-LD Structured Data~~ ✅ Done

- **Homepage** — `WebSite` + `SearchAction` (Sitelinks Searchbox eligible)
- **Model detail pages** — `SoftwareApplication` + `BreadcrumbList`
- Reusable `<JsonLd>` atom at `components/ui/atoms/JsonLd.tsx`

#### ~~4. Breadcrumb Navigation on Detail Pages~~ ✅ Done

Visible `<nav aria-label="Breadcrumb">` + `BreadcrumbList` JSON-LD on every `/models/[id]` page.

#### ~~5. X-Robots-Tag for Non-Production~~ ✅ Done

`next.config.ts` — sets `X-Robots-Tag: noindex, nofollow` on all routes when `VERCEL_ENV !== 'production'`.

---

### Medium Priority

---

## Lighthouse / Core Web Vitals Targets

| Metric                         | Target   | Current Risk                                                                      |
| ------------------------------ | -------- | --------------------------------------------------------------------------------- |
| LCP (Largest Contentful Paint) | < 2.5 s  | Low — all pages are statically generated                                          |
| FID / INP                      | < 200 ms | Low — minimal JS on initial load                                                  |
| CLS                            | < 0.1    | Medium — theme toggle could cause layout shift if OG image placeholder mismatches |
| FCP                            | < 1.8 s  | Low                                                                               |
| TTFB                           | < 600 ms | Low — Vercel edge cache on static pages                                           |

---

## Quick Wins Checklist

- [x] Create `/public/og-image.png` → replaced by `app/opengraph-image.tsx` (dynamic, edge)
- [x] Add `app/opengraph-image.tsx` for dynamic OG image
- [x] Add `app/models/[id]/opengraph-image.tsx` for per-model OG image
- [x] Add JSON-LD `WebSite` + `SearchAction` schema to homepage
- [x] Add JSON-LD `SoftwareApplication` schema to model detail pages
- [x] Add breadcrumb UI + `BreadcrumbList` JSON-LD to detail pages
- [x] Add `X-Robots-Tag: noindex` to non-production environments
- [ ] Migrate filter state to URL search params (shareable filtered views)
- [ ] Add `hreflang` if multilingual support is added
- [ ] Add PWA manifest (`public/manifest.json`)
