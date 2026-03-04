---
name: WiNote Tailwind Design Refactor
overview: Refactor WiNote styles to Tailwind using design tokens from Figma exports, align components to pixel values, and ensure the design system is consistently applied across the app.
todos:
  - id: update-tokens
    content: Update winote-theme.css and tailwind.config.js with chosen tokens (1B, 2A, 3 #6F825F, 4B, 5A, 6B)
    status: pending
  - id: refactor-layout
    content: Refactor Sidebar, Header, WiNoteLayout, AdBanner to Tailwind + tokens only
    status: pending
  - id: refactor-screens
    content: Refactor all screens (Home, Search, Create, Detail, Settings, Premium) to match Figma pixels via tokens
    status: pending
  - id: refactor-components
    content: Refactor NoteCard, NoteGrid, modals, buttons, inputs to use tokens
    status: pending
  - id: clay-css-cleanup
    content: Update clay-components.css to reference --wn-* variables only
    status: pending
  - id: design-system-ensure
    content: Ensure design system in app - audit WiNote for stray hex/inline styles and document token usage
    status: pending
isProject: false
---

# WiNote Tailwind Design Refactor Plan

## Decided design tokens (user choices)

| Decision | Choice | Value |
|----------|--------|--------|
| 1. Background | **B** Match Figma | `#FAF5E4` |
| 2. Secondary text | **A** One token | `#7A8074` (grey-48) |
| 3. Primary CTA / button green | **Custom** | `#6F825F` (use for all primary buttons) |
| 4. Border radius | **B** Fewer tokens | Map 18→16, 28→24; no new 18/28 |
| 5. Font | **A** Inter only | Inter everywhere |
| 6. Card yellow (premium) | **B** Match Figma | `#E6D5A7` |

## Token implementation summary

- **--wn-bg**: `#FAF5E4`
- **--wn-text-primary**: `#4A4F46` (Figma grey-29)
- **--wn-text-secondary** / **--wn-text-muted**: `#7A8074`
- **--wn-cta-bg** / primary button green: `#6F825F`
- **--wn-card-yellow**: `#E6D5A7`
- Radii: keep existing scale; use 16 for inputs/buttons where Figma has 18, 24 where Figma has 28.
- Font: Inter only (--wn-font).
- Clay shadows from Figma: card `-8px -8px 16px rgba(255,255,255,0.8)`, card-sm `-5px -5px 10px rgba(255,255,255,0.8)`, inset `-4px -4px 8px rgba(255,255,255,0.9) inset`.

## Implementation steps

### 1. Update design tokens
- **File**: [src/winote/styles/winote-theme.css](src/winote/styles/winote-theme.css)
- Set CSS variables per table above. Add `--wn-cta-bg: #6F825F` (and any semantic alias). Ensure card yellow, background, text secondary use chosen values.
- **File**: [tailwind.config.js](tailwind.config.js) — expose new/updated tokens (e.g. `wn-cta-bg`) and ensure no conflicting hex.

### 2. Refactor layout and shared components
- [WiNoteLayout.tsx](src/winote/layout/WiNoteLayout.tsx), [Sidebar.tsx](src/winote/layout/Sidebar.tsx), [Header.tsx](src/winote/layout/Header.tsx), [AdBanner.tsx](src/winote/layout/AdBanner.tsx)
- Replace inline styles and hardcoded hex with Tailwind `wn-*` classes. Sidebar gradient, padding (e.g. 48/40/32), radius 40px from Figma via tokens where possible.

### 3. Refactor screens
- Home, Search, CreateNote, NoteDetail, Settings, Premium — use tokens for padding (e.g. 24px), header height, greeting (30px / 36px line-height), section titles (20px, 700).

### 4. Refactor reusable components
- NoteCard, NoteGrid, NoteCarousel, SearchBar, CategoryPills, buttons, FormatToolbar, RewardsOverlay, AIModelsModal, delete confirmation, etc. Use CTA green `#6F825F` for primary actions; clay shadows and radii from theme.

### 5. Clay CSS cleanup
- [clay-components.css](src/winote/styles/clay-components.css) — reference only `--wn-*` variables; no duplicate hex.

### 6. Ensure design system in the app
- **Audit**: Search WiNote sources for remaining hex codes, inline `style={{}}` with colors/fonts/shadows/radii and replace with tokens/Tailwind.
- **Document**: Short note in AGENTS.md or a comment in winote-theme.css listing token names and intended use (e.g. `wn-cta-bg` = primary button background).
- **Optional**: Add a lint or script that flags hardcoded color/shadow in `src/winote` if desired.

## Result
- Single source of truth: theme CSS + Tailwind; components use tokens only.
- Primary button green `#6F825F` everywhere; background `#FAF5E4`; muted text `#7A8074`; card yellow `#E6D5A7`; Inter only; radii 4B (16/24 where Figma used 18/28).
- Design system task ensures consistency and maintainability.
