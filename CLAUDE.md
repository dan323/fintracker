# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**Development Setup**
- Node.js 22+ required (check `.nvmrc`); use `nvm` or `nvm-windows` for version management
- Install: `npm install`
- Start dev server: `npm start` (runs on http://localhost:5173 with Vite)
- Tests: `npm test` (Vitest with jsdom environment)
- Build: `npm run build` (outputs to `dist/`)
- Deploy: `npm run deploy` (gh-pages to configured homepage)

**Run Single Test**
```powershell
npx vitest src/utils/__tests__/deduplicate.test.ts --run
```

## Architecture Overview

FinTracker is a personal finance management SPA built with React 19 + TypeScript + Vite. It supports importing transactions from CSV/JSON/MessagePack, deduplicating them, and visualizing data through multiple chart types. The app stores all data locally in the browser (via file system access APIs).

### High-Level Data Flow

1. **Upload** → CsvUploader parses CSV and creates Transaction objects
2. **Deduplication** → findDuplicates() checks against existing transactions; unresolved duplicates go to DuplicateResolver UI
3. **Filtering** → FilterContext global state holds active filters; useFilteredTransactions() hook applies them
4. **Rendering** → TabSelector switches between visualization modes (table, bar chart, pie chart, carbon footprint)
5. **Persistence** → saveFile() serializes to MessagePack; loadFile() deserializes back to Transaction[]

### Key Components & Responsibilities

**State Management**
- **FilterContext** (`src/context/FilterContext.tsx`) — React Context providing global filter state and setFilters dispatch
- **App.tsx** — Main component managing transactions, duplicates, and active tab; coordinates upload/load/save workflows
- No Redux or external state library; uses React hooks and Context API

**Core Components** (`src/components/`)
- `CsvUploader` — Parses CSV files into Transaction objects; fires onUpload callback
- `DuplicateResolver` — UI for resolving conflicts (keep, replace, ignore actions)
- `Filtering` — Filter input controls; writes to FilterContext
- `TransactionTable` — Renders transaction list with edit/delete handlers
- `pie-charts/`, `bar-charts/`, `line-charts/` — Lazy-loaded chart components using Recharts library
- `LanguageSwitcher` — Locale selector (tied to i18n hook)
- `common/ErrorBoundary` — React error boundary for fault isolation

**Models & Utilities** (`src/models/` & `src/utils/`)
- `Transaction` type — Core domain model with id, date, description, amount, category, account
- `deduplicate.test.ts` — Only test file; uses Vitest
- `message-pack.ts` — Serialization/deserialization for MessagePack and JSON formats; transforms dates to/from ISO strings
- `transaction.ts` — loadFile/saveFile (browser-fs-access), useFilteredTransactions hook
- `categories.ts` — Category definitions and color mappings for visualizations
- `color.ts` — Color utility functions
- `deduplicate.ts` — Duplicate detection logic (no test coverage yet; add to src/utils/__tests__/ if extending)

**Routing & Internationalization**
- `BrowserRouter` wraps App for gh-pages deployment (basename configured via import.meta.env.BASE_URL)
- i18n context in `src/i18n/` with locale files in `src/i18n/locales/` (es.json, en.json); defaults to Spanish

## Testing Strategy

- **Tool**: Vitest + @testing-library/react
- **Environment**: jsdom
- **Only test file**: `src/utils/__tests__/deduplicate.test.ts` (unit test for duplicate detection)
- **No E2E tests** yet; manual testing via dev server is the current validation approach
- When adding tests, follow the pattern: `src/{feature}/__tests__/{feature}.test.ts`
- Run with `npm test` to execute all or specify file path for single test

## Key Patterns & Conventions

**React Component Pattern**
- Functional components with TypeScript annotations
- Use `React.FC<Props>` type signature
- Lazy load heavy components with `React.lazy()` + `Suspense` (chart components in App.tsx show the pattern)
- Error boundaries wrap the app root for resilience

**State Handling**
- Component-level state: `useState` for local UI state
- Global state: React Context (FilterContext) for cross-component concerns
- Derived state: `useFilteredTransactions` hook computes filtered list on-the-fly

**CSS Strategy**
- Component-scoped CSS modules (`.css` files co-located with components)
- Global styles in `src/index.css` and `src/App.css`
- BEM-like naming conventions (e.g., `.app-container`, `.action-button`)

**File I/O**
- Uses `browser-fs-access` library for open/save dialogs (abstracting away Web File API boilerplate)
- MessagePack chosen for binary serialization to reduce file size vs. JSON
- Date handling: ISO string format in storage; converted to JS Date objects at load time

## Important Files & Purpose

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main entry point; orchestrates state, upload/load/save, tab routing |
| `src/models/transaction.ts` | Transaction type definition; Filters type for context |
| `src/context/FilterContext.tsx` | Global filter state provider |
| `src/utils/transaction.ts` | loadFile, saveFile, useFilteredTransactions hook |
| `src/utils/message-pack.ts` | Serialization utils; jsonTransformer, msgpackTransformer |
| `src/utils/deduplicate.ts` | Duplicate detection algorithm |
| `src/i18n/index.tsx` | i18n provider and useTranslation hook |
| `src/components/CsvUploader` | CSV parsing entry point |
| `public/index.html` | HTML shell (vite will inject into this) |
| `package.json` | Scripts: start, build, test, deploy |
| `tsconfig.json` | TS compiler options; path aliases allow `src/*` imports |
| `.nvmrc` | Node version lock (22); used by nvm |
| `vite.config.ts` | (not present) — Using Vite defaults |

## Common Development Tasks

**Run dev server**
```powershell
npm start
```
Vite will watch for changes and hot-reload.

**Add a new chart component**
1. Create `src/components/{chart-type}/{ChartName}.tsx`
2. Import Recharts components and Transaction type
3. Wrap with `React.lazy()` in App.tsx, add to TabSelector
4. Wrap render in `<Suspense>` with loading fallback

**Add a new translation key**
1. Add entry to `src/i18n/locales/es.json` and `src/i18n/locales/en.json`
2. Use via `const { t } = useTranslation()` then `t('key')`

**Test a CSV import locally**
1. Create a test file with columns: amount, date, description, category, account
2. Run dev server and use CsvUploader to import
3. Check browser DevTools console for any parse errors

**Deploy to gh-pages**
```powershell
npm run deploy
```
Requires GitHub Pages configured for the repo (see package.json homepage field).

## Notable Implementation Details

- **CSV Parsing**: PapaParse library; handles flexible date formats (ISO, MM/DD/YYYY) with fallback to current date + warning
- **Duplicate Detection**: Compares amount, date, and description fields; full match = duplicate (see deduplicate.ts)
- **Filter Application**: useFilteredTransactions reads FilterContext and returns filtered subset; no re-render side effects
- **Date Storage**: Always ISO string format in persisted files; parsed to Date object in-memory for sorting/display
- **Lazy Loading**: Charts use React.lazy to reduce initial bundle size; Suspense shows loading fallback
- **Error Handling**: ErrorBoundary at root; try-catch in async file operations with user-facing error messages
- **Accessibility**: Limited A11y testing currently; consider adding aria labels if expanding feature set

## Before Committing

✓ Run `npm test` and confirm all tests pass
✓ Run `npm run build` to check for TypeScript errors and successful build
✓ Test the feature manually in dev server (`npm start`)
✓ For i18n changes, test both Spanish (es) and English (en) locales

## Notes for Future Contributors

- **State scaling**: If app grows beyond current scope, consider migrating from Context to a state management library (Redux, Zustand) to avoid prop drilling
- **Testing coverage**: Currently minimal; unit tests exist only for deduplicate. Add E2E tests (Playwright) before scaling
- **Performance**: Consider memoization (useMemo, React.memo) if chart re-renders become a bottleneck with large transaction lists
- **Carbon footprint feature** (`CarbonFootPrint` component) is a POC; validate assumptions with domain experts before shipping
