# Test Screen Layout Specification

## Overview

This document defines the standard layout structure for all test/exam screens in the EnglishExamExcellence application. The goal is to ensure consistency across all test types (Reading, Listening, Writing, Speaking, Vocabulary).

---

## Layout Structure

Each test screen follows this 5-part structure:

```
┌─────────────────────────────────────────────────────┐
│  1. HEADER (Sticky Top Bar)                         │
│  - Back button                                      │
│  - Progress/Timer/XP Badge                          │
├─────────────────────────────────────────────────────┤
│  2. SECTION TABS (Skill Tabs)                       │
│  - [Reading] [Writing] [Speaking] [Listening]      │
│  - Only shown in combined/test flows                │
├─────────────────────────────────────────────────────┤
│  3. PASSAGE/PART TABS                               │
│  - [Part 1] [Part 2] [Part 3]                      │
│  - Shows "Part #" (NOT "Section" or "Passage")     │
├─────────────────────────────────────────────────────┤
│  4. TASK HEADER                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │ title: "The Rise of Theranos"                  ││
│  │ subtitle: "Questions 1-13"                     ││
│  │ description: "Read the passage and..."         ││
│  │ instructions: "Choose the correct heading..."  ││
│  └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│  5. CONTENT AREA                                    │
│  - Reading passage + questions                      │
│  - Audio player + questions (Listening)            │
│  - Text input (Writing)                             │
│  - Recording UI (Speaking)                          │
│  - Flashcards (Vocabulary)                          │
└─────────────────────────────────────────────────────┘
```

---

## Component Naming Convention

| Component | CSS Class | Location | Description |
|-----------|-----------|----------|-------------|
| **Header** | `.top-bar` | App.jsx | Sticky bar with back button + progress |
| **SectionTabs** | `.section-tabs` | App.jsx | Skill-level tabs (Reading/Writing/etc) |
| **PassageTabs** | `.passage-tabs` | App.jsx | Part-level tabs (Part 1/2/3) |
| **TaskHeader** | `.section-header` | App.jsx | The dynamic box with title |
| **Content** | `.workspace-grid` | App.jsx | Test content area |

---

## Naming Rules

### Tabs

- **ALWAYS use "Part #"** for passage/part tabs
- Never use "Section" or "Passage" in tab labels
- Example: `Part 1`, `Part 2`, `Part 3`

### Task Header Fields

| Field | Required | Example |
|-------|----------|---------|
| `title` | Yes | "The Rise of Theranos" |
| `subtitle` | No | "Questions 1-13" |
| `description` | No | "Read the passage and answer..." |
| `instructions` | No | "Choose the correct heading..." |

---

## Current Implementation

### App.jsx - Tab Rendering

```jsx
// Section tabs (skill-level)
<div className="section-tabs">
  {sections.map((s, idx) => (
    <button>{/* ... */}</button>
  ))}
</div>

// Passage tabs (part-level) - ALWAYS shows "Part #"
<div className="passage-tabs">
  {subPassages.map((p, idx) => (
    <button>
      {p.title || `Part ${idx + 1}`}
    </button>
  ))}
</div>
```

### Task Header

```jsx
<div className="section-header">
  <h2>{currentSection.title || `Part ${activeSectionIndex + 1}`}</h2>
  {currentSection.subtitle && (
    <p className="subtitle">{currentSection.subtitle}</p>
  )}
  {currentSection.description && (
    <p className="description">{currentSection.description}</p>
  )}
</div>
```

---

## Skill-Specific Blocks

Each skill has its own block component that handles the content area:

| Skill | Block Component | Location |
|-------|-----------------|----------|
| Reading | `ReadingBlock` | `src/components/engine/ReadingBlock.jsx` |
| Listening | `ListeningBlock` | `src/components/engine/ListeningBlock.jsx` |
| Writing | `WritingBlock` | `src/components/engine/WritingBlock.jsx` |
| Speaking | `SpeakingBlock` | `src/components/engine/SpeakingBlock.jsx` |
| Vocabulary | `FlashcardBlock` | `src/components/engine/FlashcardBlock.jsx` |

---

## Data Structure Example

```javascript
const mockSection = {
  id: 'reading-section-1',
  title: 'The Rise of Theranos',
  subtitle: 'Questions 1-13',
  description: 'Read the passage and answer the questions.',
  instructions: 'Choose the correct answer for each question.',
  passages: [
    { id: 'p1', title: 'Part 1', content: '...' },
    { id: 'p2', title: 'Part 2', content: '...' },
    { id: 'p3', title: 'Part 3', content: '...' },
  ],
  questions: [
    { id: 'q1', type: 'mcq', question: '...', options: [...] },
  ]
};
```

---

## CSS Classes Reference

| Class | File | Purpose |
|-------|------|---------|
| `.top-bar` | App.css | Main header bar |
| `.section-tabs` | App.css | Skill tabs container |
| `.passage-tabs` | App.css | Part tabs container |
| `.section-header` | App.css | Task header box |
| `.workspace-grid` | App.css | Content area layout |
| `.reading-pane` | App.css | Passage display |
| `.question-pane` | App.css | Questions display |

---

## Future Improvements

- Create a reusable `TestLayout` wrapper component
- Extract TaskHeader into its own component
- Add TypeScript interfaces for all data structures
- Implement responsive design for mobile
