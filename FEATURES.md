# Feature List — Ollama Model Explorer

> **Data source:** 214 Ollama models (scraped & processed from ollama.com)  
> **Stack:** Next.js 16 App Router · React 19 · TypeScript 5 · Tailwind CSS v4  
> **Last updated:** 2026-02-25

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Must have (MVP) |
| 🔵 | Should have (v1 polish) |
| 🟡 | Nice to have (v2) |
| 🔴 | Future / research phase |

---

## Pages Overview

| Route | Description |
|---|---|
| `/` | Minimal hero landing page |
| `/models` | Full model browser with search, filter, sort |
| `/models/[id]` | Individual model detail page |
| `/about` | About the project |

---

## Page 1 — Home (`/`)

### Layout & Design
- ✅ **Minimal hero section** — single-screen, no scroll required on desktop
- ✅ **Headline + subline** — short, typographic, black/white only
- ✅ **CTA button** — "Explore Models" → navigates to `/models`
- ✅ **Model count badge** — displays total number of indexed models (dynamic, from data)
- 🔵 **Stats row** — 3–4 key data highlights derived from `models.json`:
  - Total models indexed (214)
  - Total unique domains (7)
  - Highest pull count model
  - Smallest runnable model (min RAM)
- 🔵 **Dark/Light mode toggle** — top-right, icon only (sun/moon)
- 🔵 **Minimal navigation header** — logo/wordmark left, nav links right

---

## Page 2 — Models (`/models`)

### 2A. Search

- ✅ **Full-text keyword search** — searches across `model_name`, `description`, `use_cases`, `best_for`
- ✅ **Debounced input** — 300ms delay before triggering filter evaluation
- ✅ **URL-synced search** — query is stored in `?q=` param for shareable/bookmarkable URLs
- ✅ **Result count indicator** — "Showing 42 of 214 models"
- ✅ **Clear search button** — `×` icon clears input and resets results
- 🔵 **Search highlights** — matched terms are highlighted in card text
- 🟡 **Semantic search (client-side)** — using lightweight TF-IDF or cosine similarity on pre-computed vectors stored alongside `models.json`. No server/API required. Triggered by toggle "Smart Search".
- 🔴 **Semantic search (server-side / embeddings)** — integration with an embedding model (e.g., `nomic-embed-text` via Ollama API) for vector similarity search. Optional future feature gated behind env flag.

### 2B. Filtering (All Options Derived Dynamically from Data)

All filter values are computed at build time from `models.json` via `lib/data/filters.ts`. No hardcoded option lists in UI components.

#### Capability filter (multi-select pills)
From `capabilities` field — **5 values**:
- `Tools` · `Thinking` · `Embedding` · `Vision` · `Cloud`

#### Domain filter (single-select or multi-select pills)
From `domain` field — **7 values**:
- `General` · `Code` · `Language` · `Vision` · `Math` · `Medical` · `Embedding`

#### Use Case filter (multi-select dropdown)
From `use_cases[]` — **14 values**:
- Chat Assistant · Code Generation · Code Review · Creative Writing · Function Calling · Image Understanding · Math · Question Answering · RAG / Retrieval · Reasoning · Role Play · Text Embedding · Text Summarization · Translation

#### Complexity filter (toggle group)
From `complexity` — **2 values**:
- `Intermediate` · `Advanced`

#### AI Language filter (multi-select dropdown)
From `ai_languages[]` — **9 values**:
- English · Multilingual · Chinese · Arabic · Japanese · German · French · Spanish · Korean

#### Parameter Size filter (multi-select chips)
From `labels[]` — e.g.:
- `≤ 1B` · `1B–4B` · `4B–14B` · `14B–35B` · `35B+`  
  *(buckets computed dynamically from numeric label values)*

#### RAM Requirement filter (range slider or preset buckets)
From `min_ram_gb` — **5 buckets**:
- `< 4 GB` · `4–8 GB` · `8–16 GB` · `16–32 GB` · `32 GB+`

#### Sort options (select / toggle)
- Most Popular (pulls, descending) — **default**
- Least Popular (pulls, ascending)
- Smallest Model (min_ram_gb ascending)
- Largest Model (min_ram_gb descending)
- Recently Updated (last_updated descending)
- A–Z (model_name)

### 2C. Filter UX
- ✅ **Active filter chips** — each applied filter shown as a dismissible chip above the grid
- ✅ **Reset all filters** button — clears all active filters + search
- ✅ **Filter state in URL** — all active filters serialized into query params for shareability
- 🔵 **Filter count badge** — button/icon shows how many filters are currently active
- 🔵 **Collapsible filter sidebar** on desktop; **bottom sheet/drawer** on mobile
- 🔵 **Filter option counts** — show how many models match each option: e.g., `Code (31)`
- 🔵 **No results state** — friendly empty state with clear instructions + reset CTA

### 2D. Model Grid / List
- ✅ **Card grid layout** — responsive: 1 col mobile → 2 col tablet → 3 col desktop
- ✅ **ModelCard** displays:
  - Model name (prominent)
  - Domain badge
  - Short description (truncated to 2 lines)
  - Capability badges (Tools, Vision, Thinking, etc.)
  - Min RAM requirement
  - Pull count (formatted: `110.5M`)
  - Available parameter sizes (from `labels[]`)
  - Last updated date
- 🔵 **List view toggle** — switch between card grid and compact list
- 🔵 **Infinite scroll or pagination** — 24 models per page
- 🔵 **Hover state** — subtle border/shadow lift effect
- 🔵 **ollama run command** — `ollama run {model_identifier}` shown on hover or card footer, one-click copy

### 2E. Model Detail (`/models/[id]`)
- ✅ **Full model info** — all available fields rendered
- ✅ **Memory requirements table** — all tags with size, quantization, RAM, context window
- ✅ **Capabilities + Use cases** displayed as badge groups
- ✅ **`ollama run` install command** — copyable code block
- ✅ **Supported languages** list
- ✅ **Ollama.com link** — external link to source page
- 🔵 **Complexity indicator** — visual meter or badge
- 🔵 **"More like this"** — 3–4 similar models by domain + capability
- 🔵 **Back to results** — returns to `/models` preserving filter/search state (via URL params)

---

## Page 3 — About (`/about`)

- ✅ **Project description** — what this site is and why it exists
- ✅ **Data source attribution** — credit to Ollama.com, explain scraping approach
- ✅ **Tech stack section** — Next.js, React, TypeScript, Tailwind
- ✅ **Data freshness** — last updated timestamp derived from `timestamp` field in data
- 🔵 **Stats summary** — total models, total domains, capabilities covered

---

## Global / Cross-Cutting Features

### Theme
- ✅ **Light / Dark mode** — CSS variable tokens, Tailwind `dark:` strategy, `localStorage` persistence
- ✅ **System preference detection** — respects `prefers-color-scheme` on first visit
- ✅ **No flash of unstyled content (FOUC)** — theme script injected in `<head>` before paint

### Layout
- ✅ **Header** — site wordmark + nav links (`Home`, `Models`, `About`) + theme toggle
- ✅ **Footer** — minimal: copyright + data source link
- ✅ **Responsive** — mobile-first, breakpoints: `sm:640` `md:768` `lg:1024` `xl:1280`

### Accessibility
- ✅ **Keyboard navigation** — all interactive elements focusable and operable via keyboard
- ✅ **ARIA labels** on icon-only buttons (theme toggle, close, copy)
- ✅ **Focus rings** — visible, token-consistent outline on focus
- ✅ **Skip to main content** link — screen reader / keyboard shortcut
- ✅ **Semantic HTML** — proper use of `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`

### Performance
- ✅ **Static generation** — all pages statically generated at build time (no server runtime required)
- ✅ **Lazy client components** — filter panel, search, theme toggle loaded as client bundles; list/grid is server-rendered
- 🔵 **Virtual list** — only visible model cards rendered in DOM when list is long

---

## Data Model Reference

```ts
interface Model {
  id: string;
  model_identifier: string;       // e.g. "llama3.1"
  model_name: string;             // display name
  model_type: 'official';
  namespace: string | null;
  url: string;                    // ollama.com source URL
  description: string;
  capabilities: Capability[];     // Tools | Thinking | Embedding | Vision | Cloud
  capability: string;             // primary capability
  labels: string[];               // ["8b", "70b", "405b"]
  memory_requirements: MemoryRequirement[];
  min_ram_gb: number;
  use_cases: string[];
  domain: Domain;                 // General | Code | Vision | Math | Medical | Language | Embedding
  ai_languages: string[];
  complexity: 'advanced' | 'intermediate';
  best_for: string;
  pulls: number;
  tags: number;
  last_updated: string;           // ISO date
  last_updated_str: string;       // e.g. "1 year ago"
  timestamp: string;              // scrape timestamp
}

interface MemoryRequirement {
  tag: string;
  size: string;
  size_gb: number;
  recommended_ram_gb: number;
  quantization: string;           // q4_k_m | q8_0 | f16 | etc.
  context: string;
  context_window: number;
}
```

---

## Dynamic Filter Derivation Strategy

All filter options are derived in `lib/data/filters.ts` at build time:

```ts
export function deriveFilterOptions(models: Model[]): FilterOptions {
  return {
    capabilities: unique(models.flatMap(m => m.capabilities)).sort(),
    domains:      unique(models.map(m => m.domain)).sort(),
    useCases:     unique(models.flatMap(m => m.use_cases)).sort(),
    complexities: unique(models.map(m => m.complexity)).sort(),
    languages:    unique(models.flatMap(m => m.ai_languages)).sort(),
    paramSizes:   deriveParamSizeBuckets(models),
    ramBuckets:   deriveRamBuckets(models),
  };
}
```

This ensures: adding new models to `models.json` automatically makes new filter values appear — no manual UI maintenance required.

---

## Semantic Search Plan (v2)

### Option A — Client-side TF-IDF (No Backend)
1. At build time, generate a lightweight inverted index from `model_name + description + use_cases + best_for`.
2. Store as a JSON artifact in `public/search-index.json`.
3. On the client, load index lazily on first keystroke.
4. Score query against index using TF-IDF cosine similarity.
5. Return ranked results beyond exact keyword matches.

**Trade-off:** Adds ~50–100KB to client bundle (JSON index). No API dependency.

### Option B — Ollama Embedding API (Future)
1. When user has a local Ollama instance running, POST search query to `localhost:11434/api/embeddings` using `nomic-embed-text`.
2. Compare query embedding against pre-computed model embeddings (stored in `public/embeddings.json`).
3. Return top-k results by cosine similarity.

**Trade-off:** Requires running Ollama locally. Gate behind env flag or opt-in toggle.

**Recommended for MVP:** Option A (no server needed, fully static deployment).
