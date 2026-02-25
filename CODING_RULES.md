# Coding Rules & Conventions

> **Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4  
> **Last updated:** 2026-02-25

---

## 1. Project Architecture

### 1.1 Folder Structure

```
app/
  layout.tsx                    # Root layout — providers, fonts, global metadata, FOUC script
  page.tsx                      # Home — hero + stats (force-static)
  models/
    page.tsx                    # Model browser with filters (force-static)
    [id]/
      page.tsx                  # Model detail page (generateStaticParams)
      opengraph-image.tsx       # Dynamic per-model OG image (edge ImageResponse)
  about/
    page.tsx                    # About page (force-static)
  opengraph-image.tsx           # Global OG image (edge ImageResponse)
  robots.ts                     # /robots.txt
  sitemap.ts                    # /sitemap.xml
  globals.css                   # Design tokens + base reset

components/
  ui/
    atoms/                      # Button, Badge, Input, Divider, Spinner, JsonLd
      index.ts                  # Barrel export
    molecules/                  # SearchInput, FilterChip, StatCard, CopyCommand
      index.ts                  # Barrel export
  features/
    layout/                     # Header, Footer, ThemeToggle
      index.ts                  # Barrel export
    models/                     # ModelCard, ModelFilters, ModelGrid, ModelsBrowser
      index.ts                  # Barrel export
  templates/                    # BrowseLayout, DetailLayout
    index.ts                    # Barrel export

lib/
  constants.ts                  # App-wide constants (sort options, pagination)
  data/                         # Data access layer
    models.ts                   # Model loaders, filtering, sorting
    filters.ts                  # Dynamic filter option derivation
    index.ts                    # Barrel export
  types/                        # TypeScript type definitions
    model.ts
    filter.ts
    index.ts                    # Barrel export
  utils/                        # Pure utility functions
    cn.ts
    format.ts
    index.ts                    # Barrel export
  hooks/                        # Custom React hooks
    useFilters.ts
    useTheme.ts
    useDebounce.ts
    index.ts                    # Barrel export

public/
  models.json                   # Source data — 214 models from ollama.com/library
```

### 1.2 Barrel Exports (`index.ts`)

Every directory that groups related modules **must** have an `index.ts` barrel file.
This enables clean grouped imports and decouples import consumers from file locations.

```ts
// ✅ Good — barrel import
import { Button, Badge, Divider } from '@/components/ui/atoms';
import { useFilters, useDebounce } from '@/lib/hooks';
import { getAllModels, getModelById } from '@/lib/data';

// ❌ Bad — noisy deep-path imports
import { Button } from '@/components/ui/atoms/Button';
import { Badge } from '@/components/ui/atoms/Badge';
import { getAllModels } from '@/lib/data/models';
```

**Exception**: sibling components within the same directory import each other using **relative paths** to avoid circular barrel references:

```ts
// ✅ Inside ModelsBrowser.tsx — siblings use relative imports
import { ModelFilters } from './ModelFilters';
import { ModelGrid } from './ModelGrid';

// ❌ Would create circular ref via the barrel
import { ModelFilters, ModelGrid } from '@/components/features/models';
```

---

## 2. SOLID Principles

### S — Single Responsibility

- Every file/component does **one thing** only.
- Data fetching, transformation, and rendering live in separate layers.
- A component that renders a `ModelCard` never fetches data — it only receives props.

### O — Open/Closed

- Components are **open for extension via props/composition**, closed for internal modification.
- Use `variant` props pattern for UI variants instead of conditional class hacks.

```tsx
// ✅ Good
<Badge variant="capability" label="Tools" />

// ❌ Bad
<Badge className={isCapability ? 'bg-black' : 'bg-zinc-200'} />
```

### L — Liskov Substitution

- Component props extend HTML element props so they are drop-in replacements.
- Never restrict inherited HTML attributes without justification.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
}
```

### I — Interface Segregation

- Keep prop interfaces minimal. Split large prop objects into focused sub-interfaces.
- Avoid passing entire model objects into leaf UI components — destructure only what is needed.

```tsx
// ✅ Good
interface ModelCardProps {
  name: string;
  description: string;
  domain: string;
  pulls: number;
  capabilities: string[];
}
```

### D — Dependency Inversion

- Components depend on **abstractions (interfaces/types)**, not concrete data shapes.
- Data layer (lib/data) is consumed via typed functions — never import raw JSON from components.

```tsx
// ✅ Good — component depends on type, not raw JSON
import type { Model } from '@/lib/types/model';

// ❌ Bad — direct JSON import in a component
import models from '@/public/models.json';
```

---

## 3. TypeScript Rules

- `strict: true` is required in `tsconfig.json` — no exceptions.
- Never use `any`. Use `unknown`, generics, or proper types.
- All component props must have an explicit TypeScript interface or type alias.
- All utility functions must have typed parameters and explicit return types.
- Prefer `type` for unions/primitives, `interface` for object shapes.
- All data types must be co-located in `lib/types/`.

```ts
// ✅
export type Domain = 'General' | 'Code' | 'Vision' | 'Math' | 'Medical' | 'Language' | 'Embedding';
export type Complexity = 'advanced' | 'intermediate';
export type Capability = 'Tools' | 'Thinking' | 'Embedding' | 'Vision' | 'Cloud';
```

---

## 4. Component Rules

### 4.1 File Naming

| Type            | Convention                               | Example         |
| --------------- | ---------------------------------------- | --------------- |
| React component | `PascalCase.tsx`                         | `ModelCard.tsx` |
| Hook            | `camelCase.ts` starting with `use`       | `useFilters.ts` |
| Utility         | `camelCase.ts`                           | `format.ts`     |
| Type definition | `camelCase.ts`                           | `model.ts`      |
| Page            | `page.tsx` (Next.js App Router standard) | `page.tsx`      |

### 4.2 Component Structure Order

Each component file must follow this order:

1. Imports (external → internal → types → styles)
2. Type/interface definitions
3. Subcomponents (if any, colocated when small)
4. Default export — main component
5. Named exports (helpers, constants)

### 4.3 Composition Over Configuration

Prefer composable child components over a single component with many boolean props.

```tsx
// ✅ Good
<ModelCard>
  <ModelCard.Header name={model.model_name} />
  <ModelCard.Body description={model.description} />
  <ModelCard.Footer capabilities={model.capabilities} pulls={model.pulls} />
</ModelCard>

// ❌ Bad
<ModelCard showHeader showFooter showCapabilities model={model} />
```

### 4.4 Server vs. Client Components

- Default to **Server Components** in the App Router.
- Add `'use client'` **only** when the component uses:
  - `useState` / `useReducer` / `useEffect`
  - Browser APIs
  - Event handlers bound to user interaction (click, input, etc.)
  - React context consumers
- Data fetching and static rendering stays in Server Components.

---

## 5. Atomic Design System

All UI components are organized using **Atomic Design** methodology. Every component belongs to exactly one level. Never skip levels or mix responsibilities across levels.

### 5.1 Levels

| Level         | Location                | Description                                                                              | Examples                                                                                                     |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Atoms**     | `components/ui/`        | Smallest indivisible UI primitives. No business logic. No data dependencies.             | `Button`, `Badge`, `Input`, `Icon`, `Spinner`, `Divider`                                                     |
| **Molecules** | `components/ui/`        | Combinations of 2–4 atoms forming a cohesive unit with a single purpose.                 | `SearchInput` (Input + Icon + Button), `FilterChip` (Badge + dismiss Icon), `StatCard` (label + value atoms) |
| **Organisms** | `components/features/`  | Complex UI sections composed of molecules and atoms. May be domain-aware.                | `ModelCard`, `FilterPanel`, `ModelGrid`, `Header`, `Footer`                                                  |
| **Templates** | `components/templates/` | Page-level layout scaffolds. Define regions (sidebar, main, header slot). No real data.  | `BrowseLayout`, `DetailLayout`                                                                               |
| **Pages**     | `app/**/page.tsx`       | Next.js pages. Wire templates with real data. Only place that connects data layer to UI. | `app/models/page.tsx`                                                                                        |

### 5.2 Folder Mapping

```
components/
  ui/                     # Atoms + Molecules
    atoms/
      Button.tsx
      Badge.tsx
      Input.tsx
      Icon.tsx
      Spinner.tsx
      Divider.tsx
    molecules/
      SearchInput.tsx
      FilterChip.tsx
      StatCard.tsx
      CopyCommand.tsx
  features/               # Organisms
    models/
      ModelCard.tsx
      ModelGrid.tsx
      ModelFilters.tsx
    layout/
      Header.tsx
      Footer.tsx
      ThemeToggle.tsx
  templates/              # Templates
    BrowseLayout.tsx
    DetailLayout.tsx
```

### 5.3 Atom Rules

- Must be **fully stateless** or hold only local interaction state (hover, focus).
- Must accept and forward all native HTML attributes via `...rest` spread.
- Must never import from `lib/data/` or any domain type.
- Must be usable in any context without side effects.
- Styled exclusively via props (`variant`, `size`) and design tokens.

```tsx
// ✅ Correct Atom
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'muted';
  size?: 'sm' | 'md';
}

export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...rest}>
      {children}
    </span>
  );
}

// ❌ Atom importing domain data — violates atom rule
import type { Capability } from '@/lib/types/model'; // ← NOT allowed in atoms
```

### 5.4 Molecule Rules

- Compose **2–4 atoms** only. If more are needed, it is an organism.
- May have **local state** (e.g., input value before debounce).
- Accept typed, focused props — never accept raw `Model` objects.
- Must not trigger data fetching or side effects.

```tsx
// ✅ Correct Molecule
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}
```

### 5.5 Organism Rules

- May be **domain-aware** — can accept domain types (e.g., `Model`, `FilterOptions`) as props.
- Must **not** fetch data directly. Data is passed via props from pages or layouts.
- Should be independently testable with mock data.
- One organism = one distinct UI section (a card, a panel, a grid row).

```tsx
// ✅ Correct Organism — domain-aware but data is passed in
interface ModelCardProps {
  model: Pick<
    Model,
    'model_name' | 'description' | 'domain' | 'capabilities' | 'pulls' | 'min_ram_gb' | 'labels'
  >;
}
```

### 5.6 Template Rules

- Define **slot-based layout** using React children or named slot props.
- Contain **no real content** — only layout structure (grid, sidebar, padding).
- Are always **Server Components**.

```tsx
// ✅ Template
interface BrowseLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  header?: React.ReactNode;
}

export function BrowseLayout({ sidebar, main, header }: BrowseLayoutProps) {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-8">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}
```

### 5.7 Cross-Level Import Rules

Import direction is **strictly top-down**. Lower levels must never import from higher levels.

```
Pages  →  Templates  →  Organisms  →  Molecules  →  Atoms
```

| From \ To     | Atoms   | Molecules | Organisms | Templates | Pages   |
| ------------- | ------- | --------- | --------- | --------- | ------- |
| **Atoms**     | ✅ self | ❌        | ❌        | ❌        | ❌      |
| **Molecules** | ✅      | ✅ self   | ❌        | ❌        | ❌      |
| **Organisms** | ✅      | ✅        | ✅ self   | ❌        | ❌      |
| **Templates** | ✅      | ✅        | ✅        | ✅ self   | ❌      |
| **Pages**     | ✅      | ✅        | ✅        | ✅        | ✅ self |

---

## 6. Design System & Tokens

### 6.1 Color Palette (Minimal Monochrome)

All colors are defined as CSS custom properties in `globals.css` and consumed via Tailwind.

```css
/* Light Mode */
:root {
  --color-bg: #ffffff;
  --color-bg-subtle: #f9f9f9;
  --color-bg-muted: #f3f3f3;
  --color-border: #e5e5e5;
  --color-border-strong: #d4d4d4;
  --color-text: #0a0a0a;
  --color-text-muted: #525252;
  --color-text-subtle: #a3a3a3;
  --color-accent: #0a0a0a;
  --color-accent-hover: #262626;
  --color-on-accent: #ffffff;
}

/* Dark Mode */
.dark {
  --color-bg: #0a0a0a;
  --color-bg-subtle: #111111;
  --color-bg-muted: #1a1a1a;
  --color-border: #262626;
  --color-border-strong: #404040;
  --color-text: #fafafa;
  --color-text-muted: #a3a3a3;
  --color-text-subtle: #525252;
  --color-accent: #fafafa;
  --color-accent-hover: #e5e5e5;
  --color-on-accent: #0a0a0a;
}
```

### 6.2 Typography Scale

```css
:root {
  --font-sans: 'Geist', 'Inter', system-ui, sans-serif;
  --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;

  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.125rem; /* 18px */
  --text-xl: 1.25rem; /* 20px */
  --text-2xl: 1.5rem; /* 24px */
  --text-3xl: 1.875rem; /* 30px */
  --text-4xl: 2.25rem; /* 36px */
}
```

### 6.3 Spacing Scale (4px base grid)

Use only multiples of 4 (Tailwind's default 4px base):  
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`

### 6.4 Border Radius

```css
:root {
  --radius-sm: 0.25rem; /* 4px  — tags, badges */
  --radius-md: 0.5rem; /* 8px  — cards, inputs */
  --radius-lg: 0.75rem; /* 12px — panels */
  --radius-full: 9999px; /* pills, avatars */
}
```

### 6.5 Shadow

Keep shadows minimal and monochromatic. Avoid colored shadows.

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.08);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### 6.6 Motion / Transition

```css
:root {
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
}
```

---

## 7. Tailwind CSS Rules

- Tailwind v4 with native CSS variables — do not override `tailwind.config.js` color palette manually if tokens are set in CSS.
- Use semantic token class names, not raw color values (e.g., `text-[var(--color-text-muted)]` or mapped aliases).
- **No inline styles** unless absolutely necessary for computed dynamic values.
- Class order: layout → flexbox/grid → sizing → spacing → typography → color → border → effect → transition.
- Use `cn()` utility (clsx + tailwind-merge) for conditional class merging.

```tsx
// ✅ Good
const cn = (...args) => twMerge(clsx(args));

<div
  className={cn(
    'flex items-center gap-4 px-4 py-3 text-sm rounded-md border',
    isActive && 'bg-[var(--color-bg-muted)]',
  )}
/>;
```

---

## 8. Data Layer Rules

- All data access is isolated in `lib/data/`.
- Raw JSON is never imported outside of `lib/data/models.ts`. Use typed `import` (not `require`) with `resolveJsonModule: true`.
- Filter option derivation must be **dynamic** — extracted programmatically from the data, never hardcoded.
- Server-side data functions are synchronous (static JSON) but must return typed responses.
- Client-side filtering/sorting works on a pre-loaded dataset passed via props — no re-fetching.
- **App-wide constants** (sort options, pagination limits, magic numbers) live in `lib/constants.ts`, not in utility or data files.

```ts
// ✅ lib/data/models.ts
import type { Model } from '@/lib/types/model';
import modelsJson from '@/public/models.json';
const rawData = modelsJson as Model[];

export function getAllModels(): Model[] { ... }
export function getModelById(id: string): Model | undefined { ... }

// ✅ lib/constants.ts
export const ITEMS_PER_PAGE = 24;
export const DEFAULT_SORT = 'pulls_desc';
export const SORT_OPTIONS = [ ... ];
```

---

## 9. State Management

- Prefer URL search params (`useSearchParams`, `useRouter`) for filter/search state — enables sharable URLs and correct browser history.
- Avoid global state managers (Zustand, Redux) unless clearly justified.
- Local UI state (hover, open/closed) stays in local `useState`.

---

## 10. Naming Conventions

| Entity         | Example                                       |
| -------------- | --------------------------------------------- |
| Component      | `ModelCard`, `FilterPanel`, `SearchInput`     |
| Hook           | `useModelFilters`, `useDebounce`, `useSearch` |
| Utility fn     | `formatPulls`, `deriveFilters`, `sortModels`  |
| Type/Interface | `Model`, `FilterOptions`, `SearchResult`      |
| CSS variable   | `--color-text`, `--radius-md`                 |
| Constant       | `DEFAULT_SORT_ORDER`, `ITEMS_PER_PAGE`        |

---

## 11. Code Quality Rules

- No `console.log` in production code. Use a logger utility or remove before committing.
- All magic numbers must be extracted to named constants.
- File length limit: **200 lines**. If a file grows beyond this, split it.
- No commented-out code committed to the repository.
- Every `async` function must handle errors gracefully (try/catch or error boundaries).
- Accessibility (a11y): all interactive elements must have ARIA labels, keyboard navigation support, and visible focus rings.

---

## 12. Light / Dark Mode Implementation

- Theme is controlled via the `dark` class on `<html>` (Tailwind strategy: `class`).
- `ThemeProvider` wraps the root layout and reads/writes `localStorage` + `prefers-color-scheme`.
- All colors reference CSS variables — never hardcode `#000` or `#fff` directly in components.
- The `ThemeToggle` component is a `'use client'` component independent of data.
- Dark mode must be verified at **every breakpoint** — light/dark switching must not break responsive layouts.

---

## 13. Responsive Design Rules

This application must be **fully functional and visually correct on all screen sizes**. Every feature — search, filters, model grid, model detail, navigation — must work identically on mobile, tablet, and desktop. Responsive behaviour is not an afterthought; it is designed and implemented alongside the feature itself.

### 13.1 Mobile-First Approach

- **Write base styles for mobile first**, then add `sm:`, `md:`, `lg:`, `xl:` overrides to progressively enhance for larger screens.
- Never write desktop styles first and then try to "undo" them for mobile with overrides.

```tsx
// ✅ Mobile-first
<div className="flex flex-col gap-4 md:flex-row md:gap-8">

// ❌ Desktop-first undone for mobile
<div className="flex flex-row gap-8 flex-col-mobile">
```

### 13.2 Breakpoint System

Use only the standard Tailwind breakpoints. Do not introduce custom breakpoints unless absolutely justified and documented.

| Prefix   | Min Width | Target Device               |
| -------- | --------- | --------------------------- |
| _(none)_ | 0px       | Mobile (default)            |
| `sm:`    | 640px     | Large mobile / small tablet |
| `md:`    | 768px     | Tablet                      |
| `lg:`    | 1024px    | Laptop / desktop            |
| `xl:`    | 1280px    | Wide desktop                |
| `2xl:`   | 1536px    | Ultra-wide (use sparingly)  |

### 13.3 Layout Responsiveness

| UI Element   | Mobile                               | Tablet (`md:`)                   | Desktop (`lg:`)                |
| ------------ | ------------------------------------ | -------------------------------- | ------------------------------ |
| Navigation   | Hidden, hamburger menu or bottom bar | Inline top bar                   | Inline top bar with full links |
| Filter panel | Bottom drawer / slide-up sheet       | Collapsible sidebar              | Persistent left sidebar        |
| Model grid   | 1 column                             | 2 columns                        | 3 columns                      |
| Model card   | Full width, stacked info             | Normal card                      | Normal card with hover state   |
| Search bar   | Full width, sticky top               | Inline in header                 | Inline in header               |
| Detail page  | Single column                        | Single column with wider content | Two-column (info + sidebar)    |

### 13.4 Touch & Interaction Rules

- **Minimum tap target size: 44×44px** for all interactive elements (buttons, links, filter chips) — per Apple HIG and WCAG 2.5.5.
- No hover-only interactions. Every action accessible on hover must also have an equivalent tap/focus interaction.
- Avoid `title` attribute tooltips — they are inaccessible on touch devices. Use visible labels or accessible popovers instead.
- Swipe gestures (e.g., closing a drawer) are additive enhancements, never the sole interaction method.

```tsx
// ✅ Minimum tap target enforced
<button className="min-h-[44px] min-w-[44px] flex items-center justify-center">
  <Icon name="close" />
</button>
```

### 13.5 Component-Level Responsive Rules

#### Header / Navigation

- On mobile: show logo + theme toggle only. Navigation links collapse into a **hamburger menu** (slide-down or drawer).
- The nav drawer must be dismissible via: tap outside, swipe, or a close button.
- Active route is always visually indicated on all breakpoints.

#### Filter Panel

- On mobile/tablet: hidden by default, opened via a **"Filters" button** that triggers a bottom sheet or side drawer.
- The button shows the count of active filters: `Filters (3)`.
- When closed, active filters are shown as dismissible chips in a horizontal scroll row above the grid.
- On desktop: persistent left sidebar, always visible.

#### Model Grid

- Uses CSS Grid with responsive column count:

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

- Cards never overflow their column. Long text is truncated with `line-clamp`.

#### Model Card

- On mobile, the `ollama run` copy command is always visible (not hidden behind hover).
- Capability badges wrap onto multiple lines — no horizontal overflow.

#### Search Input

- On mobile: full width, sticky below the header.
- Clear (`×`) button appears whenever the input has a value.
- Keyboard `Escape` clears the search and dismisses the mobile keyboard.

#### Model Detail Page

- Memory requirements table: horizontally scrollable on mobile (`overflow-x-auto`) with the table retaining its full column set.
- Long `readme` text reflows naturally — no fixed-width prose containers.

### 13.6 Typography Responsiveness

Use fluid or step-based type scaling. Heading sizes reduce on smaller screens.

```tsx
// ✅ Responsive heading
<h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">

// ✅ Body text stays readable
<p className="text-sm leading-6 sm:text-base">
```

### 13.7 Spacing Responsiveness

Page-level padding and section gaps scale with breakpoints.

```tsx
// ✅ Responsive page padding
<main className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">

// ✅ Responsive section gap
<section className="flex flex-col gap-6 md:gap-10">
```

### 13.8 Viewport & Meta

The root layout must always include the viewport meta tag (Next.js sets this by default but must not be removed):

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### 13.9 Testing Requirements

Before any feature is considered complete, it must be validated at these viewport widths:

| Label    | Width  |
| -------- | ------ |
| Mobile S | 320px  |
| Mobile M | 375px  |
| Mobile L | 428px  |
| Tablet   | 768px  |
| Laptop   | 1024px |
| Desktop  | 1280px |

Use browser DevTools device emulation. Every interactive feature (search, filter, navigation, copy command, theme toggle) must be **fully operable** at all widths above.

---

## 14. Performance Rules

- Static data pages (models list, about) are **Statically Generated** at build time (`export const dynamic = 'force-static'`).
- Images use `next/image` with explicit `width`/`height`.
- Large lists use **virtualization** (e.g., `react-window` or CSS `content-visibility`) when item count > 100.
- Heavy client components are lazy-loaded with `React.lazy` / `next/dynamic`.
- Search debounce: minimum **300ms** before triggering filter recalculation.

---

## 15. Prettier — Code Formatting

All code is auto-formatted by Prettier. No manual formatting debates. Config lives in `.prettierrc`.

### Config (`.prettierrc`)

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### `.prettierignore`

```
.next/
node_modules/
public/
*.json
```

### Rules

- **Never disable Prettier** with `// prettier-ignore` unless the block is machine-generated or readability genuinely requires it (e.g., a long data table). Add a comment explaining why.
- Format is enforced on commit via a pre-commit hook (see Section 16).
- Do not configure Prettier options in ESLint — keep them separate.

---

## 16. Commitlint — Commit Message Rules

All commit messages must follow the **Conventional Commits** specification enforced by `commitlint` with `@commitlint/config-conventional`.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

- **Type** and **scope** are lowercase.
- **Short description** is imperative mood, no capital first letter, no trailing period.
- Max **72 characters** on the first line.

### Allowed Types

| Type       | When to use                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style`    | Formatting, whitespace — no logic change                |
| `chore`    | Tooling, config, dependency updates                     |
| `docs`     | Documentation only                                      |
| `perf`     | Performance improvement                                 |
| `test`     | Adding or updating tests                                |
| `revert`   | Reverting a previous commit                             |

### Allowed Scopes (project-specific)

`ui` · `models` · `filters` `search` · `layout` · `theme` · `data` · `types` · `hooks` · `config` · `deps`

### Examples

```bash
# ✅ Good
feat(models): add parameter size filter chips
fix(search): debounce not resetting on clear
refactor(ui): extract Badge atom from ModelCard
chore(deps): upgrade tailwindcss to v4.1
docs: add atomic design rules to CODING_RULES

# ❌ Bad — vague, wrong format, no type
git commit -m "fix stuff"
git commit -m "Updated filters"
git commit -m "WIP"
```

### Config (`commitlint.config.js`)

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'ui',
        'models',
        'filters',
        'search',
        'layout',
        'theme',
        'data',
        'types',
        'hooks',
        'config',
        'deps',
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'body-max-line-length': [1, 'always', 100],
  },
};
```

### Pre-commit Hook (`package.json`)

Use `husky` + `lint-staged` to enforce both Prettier and commitlint automatically:

```json
{
  "scripts": {
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"]
  }
}
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

```bash
# .husky/pre-commit
npx lint-staged
```
