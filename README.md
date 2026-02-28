# Ollama Explorer

[![GitHub Stars](https://img.shields.io/github/stars/serkan-uslu/ollama-explorer?style=social)](https://github.com/serkan-uslu/ollama-explorer/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/serkan-uslu/ollama-explorer?style=social)](https://github.com/serkan-uslu/ollama-explorer/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://ollama-explorer.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

> **Ollama has 200+ open-source AI models. Finding the right one is painful.**
>
> The official library shows a wall of model cards with almost no filtering. To pick the right model you end up opening dozens of tabs, reading raw descriptions, and guessing whether your machine can even run it.
>
> **Ollama Explorer fixes this.** It's a fast, searchable directory where every model is enriched with structured metadata: RAM requirements, context window size, speed tier, parameter sizes, domain, capabilities, supported languages, strengths, limitations, and benchmark scores. Filter across all dimensions at once, compare models side by side, and get to the right model in seconds — not hours.

🌐 **Live** → [ollama-explorer.vercel.app](https://ollama-explorer.vercel.app)  
📦 **Source** → [github.com/serkan-uslu/ollama-explorer](https://github.com/serkan-uslu/ollama-explorer)

---

<table>
<tr>
<td width="240">
  <img src="public/olli.jpg" alt="Olli — Ollama Explorer mascot" width="220" style="border-radius: 16px;" />
</td>
<td>

### 🤖 Find the Perfect AI Model in Seconds

Browse, filter and compare **214+ open-source AI models** from [Ollama](https://ollama.com) with advanced search, multi-dimensional filtering, and side-by-side comparison.

**⚡ Built for speed:**

- Next.js 16 (App Router) + React 19
- Fully statically generated — zero JS on load
- Atomic Design architecture

**🎯 Key features:**

- Filter by RAM, domain, language, use-case
- Compare up to 4 models side-by-side
- One-click copy `ollama run` commands

🌐 **[ollama-explorer.vercel.app](https://ollama-explorer.vercel.app)**

</td>
</tr>
</table>

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

## 🤝 Contributing

We welcome contributions! Check out [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

**Looking for help with:**

- 🎨 UI/UX improvements
- 📊 Model data enrichment (benchmarks, ratings)
- 🌍 Internationalization (translations)
- ⚡ Performance optimizations
- 📝 Documentation improvements

[Good First Issues](https://github.com/serkan-uslu/ollama-explorer/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

---

## 🗺 Roadmap

- [ ] AI-powered chat interface to help users discover the right model through natural conversation
- [ ] Model rating & review system
- [ ] User favorites & collections
- [ ] Advanced comparison features
- [ ] API for model data access
- [ ] Dark mode schedule (auto-switch)
- [ ] More language support
- [ ] Export comparison results
- [ ] Model recommendations based on use case

---

## 💬 Support & Community

- 📖 [Documentation](https://github.com/serkan-uslu/ollama-explorer/wiki)
- 💬 [Discussions](https://github.com/serkan-uslu/ollama-explorer/discussions)
- 🐛 [Bug Reports](https://github.com/serkan-uslu/ollama-explorer/issues?q=is%3Aissue+label%3Abug)
- 💡 [Feature Requests](https://github.com/serkan-uslu/ollama-explorer/issues?q=is%3Aissue+label%3Aenhancement)

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.com) for the amazing AI model platform
- All model creators and maintainers in the open-source AI community
- Next.js team for the incredible framework

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=serkan-uslu/ollama-explorer&type=Date)](https://star-history.com/#serkan-uslu/ollama-explorer&Date)

---

## 📄 License

MIT &copy; [Serkan Uslu](https://github.com/serkan-uslu)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
