# Mock Test Layout Assessment

## Architecture

The mock test pages use a **split-pane layout** with two vertical columns inside a flex container. Each column scrolls internally; the outer viewport never scrolls.

### Layout tree

```
.app-shell (grid: auto 1fr rows)
└── .main-container
    └── SplitPaneTest (.spt-root)
        ├── .spt-toolbar (fixed 56px header bar)
        └── .spt-split (flex: 1, overflow: hidden)
            ├── .spt-content         (flex: 1, left column — passage)
            │   └── .spt-content-inner (max-width: none; padding)
            │       ├── .spt-header        (badge + eyebrow, title stacked below)
            │       │   ├── .spt-header-top  (badge + eyebrow side by side)
            │       │   └── .spt-title-main (serif title below eyebrow)
            │       └── .spt-passage       (paragraphs, overflow-wrap break-word)
            └── .spt-questions           (flex column, right column — questions)
                ├── .spt-questions-inner (flex: 1, overflow-y auto, scrolls internally)
                │   ├── .spt-part-nav      (arrows + part title — between parts)
                │   ├── .spt-subpart-tabs  (numbered 1/2/3 — within part)
                │   ├── .spt-q-header      (question count + progress)
                │   └── .spt-question-card ×N (card per question with options)
                └── .spt-nav               (Previous / Next / Check Answers — pinned bottom)
```

## What controls what

| Selector | Controls |
|---|---|
| `.app-shell` | Overall viewport grid: header row (`auto`) + content row (`1fr`) |
| `.spt-root` | Full-height flex column; `overflow-x: hidden` |
| `.spt-split` | Splits viewport between content & questions; `overflow: hidden` |
| `.spt-content` | Left/passage column: `flex: 1`, internal scroll |
| `.spt-content-inner` | Inner wrapper: max-width constraint + padding |
| `.spt-questions` | Right/questions column: fixed flex-basis desktop, stacked mobile |
| `.spt-questions-inner` | Scrollable questions area; nav pinned outside it |
| `.spt-part-nav` | Part-switch arrows (← Reading Part A →) |
| `.spt-subpart-tabs` | Numbered subpart buttons (1 2 3) |
| `.spt-question-card` | Individual question card with options |
| `.spt-nav` | Bottom action row (Previous / Next / Check Answers) |

## Breakpoints

| Width | Layout |
|---|---|
| > 768px | Two columns side-by-side: content `flex: 1`, questions `flex: 0 0 340px` |
| ≤ 768px | Stacked vertically: content `min-height: 45vh`, questions `min-height: 40vh` / `max-height: 60vh`, both scroll internally |

## Known layout trap (root cause & fix)

The horizontal bleed between 480–768px had **three combined causes**:

### 1. `100vw` includes scrollbar width
`.app-shell` used `width: 100vw` which includes the vertical scrollbar width, making the page wider than the visible viewport. Fixed by changing to `width: 100%`.

### 2. `100vw` in the `@media (max-width: 1268px)` rule
Same issue — `.app-shell` was set to `width: 100vw` in this media query. Fixed to `width: 100%`.

### 3. Missing `overflow-x: hidden` on `.main-container`
The main scroll container only had `overflow-y: auto` without `overflow-x: hidden`, allowing horizontal overflow to leak through. Added `overflow-x: hidden`.

### 4. Fixed widths without `max-width: 100%` on flex children
`.spt-content` and `.spt-questions` had fixed sizes (`flex: 1` and `flex: 0 0 340px`) but no `max-width: 100%` constraint, allowing them to exceed the viewport. Added `max-width: 100%`.

### 5. Missing `min-width: 0` on flex containers
Flex items default to `min-width: auto` (content's intrinsic width), preventing them from shrinking below their content size. Added `min-width: 0` to `.spt-split`, `.spt-content`, `.spt-questions`, `.spt-option`.

### 6. Missing `overflow-wrap: break-word` on text content
Long words/strings in `.spt-para`, `.spt-q-text`, `.spt-option span:last-child` could force horizontal overflow. Added `overflow-wrap: break-word` / `word-wrap: break-word`.

### 7. `.spt-content-inner` had `max-width: 720px`
This fixed width could exceed the viewport on smaller screens. Removed the fixed max-width and added `overflow-x: hidden` instead.

## Mobile behavior

- Stacked columns (not side-by-side)
- All four nav zones remain visible (part arrows, subpart tabs, question cards, bottom actions)
- Nav buttons stack full-width for touch targeting
- Padding reduced from `2rem` → `1rem` on all cards/bars
