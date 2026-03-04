# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (outputs to `dist/`)
- `npm run lint` — ESLint check
- `npm run preview` — Preview production build locally
- Deployed to Firebase Hosting (`firebase deploy --only hosting`), project ID: `portfolio-v2-d2f2b`

## Tech Stack

- **React 19** + **TypeScript** on **Vite 7** (ES modules, `"type": "module"`)
- **Tailwind CSS** via PostCSS/config-based setup (`tailwind.config.js`, `postcss.config.js`, and `src/tailwind.css`), bundled by Vite (no CDN)
- **SCSS** for component-level styles (via `sass` + Vite preprocessor)
- **Framer Motion** for animations
- **React Router DOM v7** for routing
- **Zustand** for state management (WiNote module)
- **Firebase Hosting** for deployment
- **PWA** via `vite-plugin-pwa` with Workbox service worker

## Path Aliases

Configured in both `tsconfig.json` and `vite.config.js`:

- `@/*` → `./src/*`
- `@assets/*` → `./src/assets/*`

## Architecture

This repo contains two distinct apps served from one SPA:

### 1. Portfolio (`/` routes)

The main portfolio site for Thong Nguyen Trung. Components are lazy-loaded in `src/App.tsx`.

- `src/components/` — Portfolio sections: Hero, Ambition, Expertise, LatestWork, Contact, Navbar, Footer, Sidebars
- `src/components/Reveal.tsx` — Reusable scroll-reveal animation wrapper (framer-motion)
- `src/components/chatBot/` — In-browser AI chatbot panel
- `src/layouts/HomeScreen/` — Legacy layout with section components (JSX, not currently routed)
- `src/data/` — Static data files; `chatContext.ts` imports `ai-context.md` as raw string for AI system prompt

### 2. WiNote (`/winote/*` routes)

A note-taking app with a claymorphism design, mounted as a sub-route.

- `src/winote/index.tsx` — Route definitions (Home, Search, CreateNote, NoteDetail, Settings, Premium)
- `src/winote/screens/` — Page-level screen components
- `src/winote/components/` — Shared UI components (NoteCard, NoteGrid, CategoryPills, etc.)
- `src/winote/layout/` — WiNoteLayout (Outlet wrapper), Sidebar, AdBanner
- `src/winote/store/` — Zustand stores with `persist` middleware:
  - `useNotesStore` — Notes CRUD, filtering, sorting (persisted to `winote-notes`)
  - `useUserStore` — User profile & settings (persisted to `winote-user`)
  - `useUIStore` — Sidebar/overlay visibility (not persisted)
- `src/winote/types/index.ts` — Note, Category, User, UserSettings types
- `src/winote/styles/` — Clay component CSS and theme styles

### AI Chat System

The portfolio includes an in-browser AI chatbot with a hybrid backend strategy:

- `src/services/aiChatServiceInterface.ts` — Common `AIChatService` interface and `AIBackend` type
- `src/services/aiChatServiceHybrid.ts` — Orchestrator: tries WebGPU first, falls back to ONNX on shader/driver failures. Persists backend preference to localStorage with a 4-day TTL via `src/utils/aiBackendPersistence.ts`
- `src/services/aiChatServiceWebLLM.ts` — WebGPU backend using `@mlc-ai/web-llm` (model: `Qwen2.5-0.5B-Instruct-q4f16_1-MLC`)
- `src/services/aiChatServiceONNX.ts` — ONNX fallback using `@xenova/transformers` (model: `Xenova/Qwen1.5-0.5B-Chat`)
- `src/contexts/AIChatContext.tsx` — React context provider wrapping the hybrid service; exposes GPU check, model loading, generation, and error state

## Conventions

- Portfolio components use **named exports** (lazy-loaded with `.then(module => ({ default: module.X }))` pattern in App.tsx)
- WiNote components use **named exports** directly
- Tailwind utility classes are the primary styling approach; SCSS is used for more complex/scoped styles
- No test framework is currently configured
