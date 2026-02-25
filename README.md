# ⬡ Ollama Explorer

A fast, minimal directory for browsing **214 open-source AI models** available via [Ollama](https://ollama.com). Built with Next.js App Router, React 19 and Tailwind CSS v4.

🌐 **Live** → [ollama-explorer.vercel.app](https://ollama-explorer.vercel.app)  
📦 **Source** → [github.com/serkan-uslu/ollama-explorer](https://github.com/serkan-uslu/ollama-explorer)

---

## Features

- 🔍 **Full-text search** across model name, description, use-cases and domain
- 🎛 **Multi-dimensional filters** — capability, domain, complexity, RAM, parameter size, language, use-case
- 🌗 **Dark / light mode** with FOUC-free theme persistence
- 📋 **One-click copy** for `ollama run <model>` commands
- 📱 **Fully responsive** — mobile bottom-sheet filters, desktop sticky sidebar
- ⚡ **Zero JS on initial load** — fully statically generated (`force-static`)
- 🗺 **Sitemap + robots.txt** auto-generated via Next.js metadata API
- 🖼 **Dynamic OG images** per page via edge `ImageResponse`
- 📊 **JSON-LD structured data** — `WebSite`, `SoftwareApplication`, `BreadcrumbList`

---

## Tech Stack

| Layer        | Technology                                                        |
| ------------ | ----------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Server Components)                        |
| Language     | TypeScript 5 — strict mode                                        |
| Styling      | Tailwind CSS v4 (CSS-native tokens, no config file)               |
| Components   | Atomic Design — atoms → molecules → organisms → templates → pages |
| Icons        | Lucide React                                                      |
| Fonts        | Geist Sans + Geist Mono (next/font)                               |
| Linting      | ESLint (Next.js core-web-vitals + TypeScript rules)               |
| Formatting   | Prettier                                                          |
| Commit hooks | Husky + lint-staged + Commitlint (Conventional Commits)           |

---

## Project Structure

```
ollama-explorer/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout, metadata, FOUC-prevention script
│   ├── page.tsx                  # Home — hero + stats
│   ├── models/
│   │   ├── page.tsx              # Model browser with filters
│   │   └── [id]/
│   │       ├── page.tsx          # Model detail + JSON-LD
│   │       └── opengraph-image.tsx  # Dynamic per-model OG image
│   ├── about/page.tsx            # About page
│   ├── opengraph-image.tsx       # Global OG image (edge ImageResponse)
│   ├── robots.ts                 # /robots.txt
│   └── sitemap.ts                # /sitemap.xml (217 URLs)
│
├── components/
│   ├── ui/
│   │   ├── atoms/                # Button, Badge, Input, Divider, Spinner, JsonLd
│   │   └── molecules/            # SearchInput, FilterChip, StatCard, CopyCommand
│   ├── features/
│   │   ├── layout/               # Header, Footer, ThemeToggle
│   │   └── models/               # ModelCard, ModelGrid, ModelFilters, ModelsBrowser
│   └── templates/                # BrowseLayout, DetailLayout
│
├── lib/
│   ├── constants.ts              # App-wide constants (sort options, pagination)
│   ├── types/                    # model.ts, filter.ts
│   ├── data/                     # models.ts, filters.ts — data access layer
│   ├── hooks/                    # useFilters, useTheme, useDebounce
│   └── utils/                    # cn.ts, format.ts
│
└── public/
    └── models.json               # 214 models scraped from ollama.com/library
```

---

## Getting Started

```bash
git clone https://github.com/serkan-uslu/ollama-explorer.git
cd ollama-explorer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start development server             |
| `npm run build`  | Production build                     |
| `npm run start`  | Start production server              |
| `npm run lint`   | Run ESLint                           |
| `npm run format` | Run Prettier across all source files |

---

## Architecture Decisions

### Atomic Design

Components are organised into **atoms → molecules → organisms → templates → pages**. Each layer may only import from layers below it. This prevents circular dependencies and makes every component independently testable.

### Static Generation First

All pages use `force-static` export. Model detail pages are pre-rendered via `generateStaticParams` at build time — no runtime server needed after deploy.

### CSS Custom Properties as Design Tokens

All colours, radii, shadows and typography are defined as CSS custom properties in `globals.css`. Tailwind is used for layout utilities only. Swapping themes or redesigning takes one file.

### Data Layer Isolation

`public/models.json` is only accessed through `lib/data/models.ts`. No component imports JSON directly. This means swapping to an API/database later is a one-file change.

---

## Data

214 models scraped from [ollama.com/library](https://ollama.com/library), enriched with:

- Domain classification (General, Code, Vision, Math, Medical, Language, Embedding)
- Use-case tagging (14 categories)
- RAM requirement buckets
- Complexity ratings (Advanced / Intermediate)
- Language support (9 languages)

---

## License

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
