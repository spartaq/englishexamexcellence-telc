# Plan: Audit globals.css for Unused Classes

## Goal
Identify which CSS classes defined in `src/styles/globals.css` are not used anywhere in the codebase, so they can be safely removed.

---

## What Is in globals.css

### Sections 1–3 (Fonts, Custom Properties, Reset)
Not analyzed for unused variables in this pass — 363 `var(--*)` references span 18+ CSS files and require a separate token-audit pass.

### Section 4 — Utility Classes
These are the **only** class-based rules in globals.css:

| Class | Lines | Tag |
|---|---|---|
| `.card` | 157–168 | 🔴 UNUSED |
| `.card:hover` | 166–168 | 🔴 UNUSED |
| `.xp-badge` | 171–179 | 🔴 UNUSED (globally shadowed) |
| `.xp-text` | 181–186 | 🔴 UNUSED |

---

## Detailed Findings

### 1. `.card` / `.card:hover` — **UNUSED. DELETE.**

Defined at `globals.css:157–168` as a white card with border, `border-radius: var(--radius-lg)`, shadow, and hover state. A duplicate also appears in the dark-mode media query at `globals.css:253–257`.

No JSX file anywhere uses bare `className="card"`. All card styling uses component-scoped classes:
- `.question-card` (`engine.css`) — used in MCQBlock, ShortAnswerBlock, HeadingMatchBlock, MatchingInfoBlock, etc.
- `.lp-level-card`, `.lp-feature-card` (`LandingPage.jsx`)
- `.quick-card` (`BrandTestHub.jsx`)
- `.drill-card` (`DrillsHub.jsx`)
- `.prof-card`, `.topic-card-minimal` (`VocabHub.jsx`)
- `.word-card` (`MyWords.jsx`)
- `.results-card`, `.paywall-card`, `.sitemap-card`, `.pricing-card`, `.skill-test-card`, etc.

**Action: Delete `.card`, `.card:hover`, and the dark-mode `.card` override.**

---

### 2. `.xp-badge` — **DEFINED IN 4 FILES, GLOBALS DEFINITION NEVER WINS. DELETE FROM GLOBALS.**

Defined at `globals.css:171–179`. Identically redefined in **three** more CSS files (`gamified.css:1`, `hub.css:147`, `DrillsHub.css:458`), each with their own distinct style.

JSX that uses `className="xp-badge"`:

| File | Line | Imports |
|---|---|---|
| `XPBadge.jsx` | 19 | `./gamified.css` → wins |
| `LessonTimer.jsx` | 18 | `../gamified/gamified.css` → wins |
| `AtomHubScreen.jsx` | 38 | `./hub.css` → wins |
| `DrillsHub.jsx` | 209, 237 | `./DrillsHub.css` → wins |

Every component that uses `.xp-badge` imports its own CSS file *after* globals.css is loaded, so the globals.css definition is always overridden. It is **dead weight**.

**Action: Delete `.xp-badge` block (lines 171–179) from globals.css.**

---

### 3. `.xp-text` — **UNUSED. DELETE.**

Defined at `globals.css:181–186` as purple XP text (`color: var(--xp-amethyst)`, `font-weight: 800`).

The only JSX reference to `xp-text` is `sidebar.jsx:39`.
However, `sidebar.jsx` is an **orphan component** — it is not imported anywhere in the app. `App.jsx` imports `AppShell.jsx` (which renders a different sidebar with `className="invictus-sidebar"`). No combination of imports resolves to `sidebar.jsx`.

Additionally, `hub.css` defines `.xp-text`-adjacent styling via `.task-xp span:first-child` (`hub.css:141–145`), and `gamified.css` styles `.xp-badge span` — neither targets bare `xp-text` on its own.

**Action: Delete `.xp-text` block (lines 181–186) from globals.css.**

---

## Not Changed / Out of Scope

- **CSS custom properties** (`--primary`, `--bg-app`, `--text-primary`, `--invictus-font`, etc.): 363 matches across 18+ CSS files. Audit deferred to a follow-up token-dedup pass.
- **`sidebar.jsx`** — orphan, never imported. Recommend deletion in a separate cleanup pass.
- **`--radius-lg`**: Used in 7 files (`SitemapPage.css`, `GapFillBlock.css`, `HeadingMatchBlock.css`, `DiagramLabelBlock.css`, `TableCompletionBlock.css`, `hub.css`, and the `.card` class in globals.css itself). Only referenced inside the now-targeted `.card` block in globals.css. Once `.card` is removed, no remaining globals.css usage of `--radius-lg`.

---

## Implementation Steps

1. Delete `.card { }` block (lines 157–168) from `globals.css`
2. Delete `.card:hover { }` (lines 166–168) — included in step 1
3. Delete `.xp-badge { }` block (lines 171–179) from `globals.css`
4. Delete `.xp-text { }` block (lines 181–186) from `globals.css`
5. Verify `index.css`, `App.css`, `engine.css`, and all component `.css` files still compile without errors or cascading breakage
