# TELC Test Flows Analysis

## Overview

This document analyzes the test flows in the TELC section of the application. The app supports B1, B2, and C1 level exams with various test types and entry points.

---

## 1. ENTRY POINTS & HIERARCHY

### 1.1 Main Navigation Flow
```
Landing Page
    ├── /telc/b1 → TELC B1 Hub
    ├── /telc/b2 → TELC B2 Hub  
    └── /telc/c1 → TELC C1 Hub
```

### 1.2 Free Mock (Landing Page)
- **Entry:** "Ready to test your skills?" section on LandingPage
- **Routes:** `/free-mock`, `/free-mock/b1`, `/free-mock/b2`, `/free-mock/c1`
- **Flow:**
  1. User clicks B1/B2/C1 button in free mock section
  2. `handleStartFreeMock(level)` → navigates to `/free-mock/${level}`
  3. Router passes `initialView="telc-{level}-mini-test"` to App
  4. App resolves path → generates mini test via `resolvePath()`
  5. `LessonFactory.create()` calls `generateMiniTest(level)`
- **Public Access:** No login required - free tier users can access
- **Content:** Mini test with all 5 skills pre-generated

### 1.3 Hub Components (BrandTestHub)
Each level hub (B1/B2/C1) displays:
- **Mock List** - All available mocks for that level with tier access control
- **Specific Skills** - Opens Skill Tests view for individual skill practice
- **Extra Tools** - Vocab Hub and Drills Hub

---

## 2. TEST FLOW TYPES

### 2.1 Full Mock Test (Complete Exam)
- **Entry:** Click "Start Mock" on any mock card in the hub
- **Path:** `telc-b2-mock-1`, `telc-b1-mock-1`, `telc-c1-mock-1`, etc.
- **Flow:**
  1. User clicks mock card → `onSelectPath(mock.id)`
  2. App checks `path.startsWith('telc-')` → calls `handleFullTestSelection(level, path)`
  3. `LessonFactory.createFullMockFromMock()` processes the raw mock
  4. Returns lesson with all 6 skills
- **Sections:** 6 skills in sequence (vocab → reading → writing → listening → speaking → language-elements)
- **XP Reward:** 5000 (mock.xpReward from JSON)

### 2.2 Quick Start (Hub Page)
- **Entry:** "Quick Start" button in hero section of BrandTestHub
- **Path:** `telc-b2-single-exercise` (or level-specific variant)
- **Flow:**
  1. User clicks "Quick Start" → `onSelectPath(singleExercisePath)`
  2. `handleStartTask({ id: path })` is called
  3. `LessonFactory.create()` matches task and calls `pluckRandomFullMock(level)`
  4. Returns a full mock lesson (same structure as full test but initiated differently)
- **Content:** Random mock with all 6 sections

### 2.3 Skill Tests (Individual Skills)
- **Entry:** "Specific Skills" card in hub
- **View:** `skillTests`
- **Flow:**
  1. User clicks "Specific Skills" → `onSelectPath('skill-tests')`
  2. App checks `path === 'skill-tests'` → `navigateToView('skillTests')`
  3. SkillTests view renders 6 skill cards
  4. User clicks a skill → `pluckRandom(skill)` → sets activeLesson → navigates to 'lesson'
- **Skills Available:**
  | Skill | Function | XP |
  |-------|----------|-----|
  | Reading | `pluckRandom('reading')` | +300 |
  | Listening | `pluckRandom('listening')` | +250 |
  | Writing | `pluckRandom('writing')` | +400 |
  | Speaking | `pluckRandom('speaking')` | +350 |
  | Vocabulary | `pluckRandom('vocabulary')` | +150 |
  | Language Elements | `pluckRandom('language-elements')` | +200 |

### 2.4 Mini Test (All Skills Combined)
- **Path:** `telc-b2-mini-test` (or level-specific)
- **Trigger:** Route `/free-mock` or `/free-mock/b2`
- **Flow:**
  1. Navigation to mini-test path
  2. `resolvePath()` returns task with `triggerTask: { id: 'telc-b2-mini-test', skill: 'mini-test', level }`
  3. `handleStartTask()` processes the trigger
  4. `LessonFactory.create()` calls `generateMiniTest(level)`
- **Content:** Returns object with all 6 skills pre-generated
- **Structure:**
  ```javascript
  {
    id: `mini-test-${Date.now()}`,
    type: 'mini-test',
    title: 'TELC Mini Test',
    skills: {
      vocab: pluckRandom('vocabulary', level),
      reading: pluckRandom('reading', level),
      listening: pluckRandom('listening', level),
      speaking: pluckSingleSpeakingPart(level),
      writing: pluckRandom('writing', level),
      'language-elements': pluckRandom('language-elements', level)
    }
  }
  ```

### 2.5 Extra Tools (Vocab & Drills)
- **Entry:** Cards in "Practice Exercises" section
- **Flow:**
  1. User clicks tool card → `onSelectModule(hubKey)`
  2. `handleSelectModule(hubKey)` sets activeCategory and navigates to 'drillsHub'
  3. VocabHub or DrillsHub renders based on hubKey
- **Hub Keys:**
  - `vocabulary` → VocabHub
  - `drillshub` → DrillsHub

---

## 3. DATA FLOW & PROCESSING

### 3.1 Mock Data Sources
Located in `src/data/TELC/mocks/`:
- `telc-b1-mock-1.json`
- `telc-b2-mock-1.json`
- `telc-b2-mock-2.json`
- `telc-c1-mock-1.json`
- `telc-c1-mock-2.json`

### 3.2 Mock Structure (JSON)
```javascript
{
  id: "telc-b2-mock-1",
  level: "b2",
  mockNumber: 1,
  title: "TELC B2 Mock Test 1",
  testBrand: "telc",
  type: "general",
  xpReward: 5000,
  tier: "bronze", // bronze, silver, gold
  vocabulary: { /* vocab words */ },
  reading: {
    title: "Reading",
    time: 20,
    sections: [ /* reading sections with passages */ ]
  },
  writing: {
    title: "Writing", 
    time: 60,
    sections: [ /* writing tasks */ ]
  },
  listening: {
    title: "Listening",
    time: 30,
    sections: [ /* listening parts */ ]
  },
  speaking: {
    title: "Speaking",
    time: 15,
    parts: [ /* 3 speaking parts */ ]
  },
languageElements: {
    title: "Language Elements",
    time: 90,
    sections: [
      {
        id: "le-part1",
        section: 1,
        title: "Part 1 Title",
        description: "Read the following...",
        passages: [
          {
            id: "p1",
            subtitle: "Subtitle",
            title: "Passage Title",
            type: "LANGUAGE-ELEMENTS",
            content: [
              {
                id: "1",
                text: "Passage text with ____(21)____ gap markers..."
              }
            ],
            subTasks: [
              {
                type: "mcq",
                instruction: "Choose the correct answer...",
                questions: [
                  { id: "21", text: "Question text...", options: ["a", "b", "c"], answer: 0 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "le-part2",
        section: 2,
        title: "Part 2 Title",
        description: "Read the following...",
        passages: [
          {
            id: "p2",
            subtitle: "Subtitle",
            title: "Passage Title",
            type: "LANGUAGE-ELEMENTS",
            content: [
              {
                id: "1",
                text: "Passage text with ____(31)____ gap markers..."
              }
            ],
            subTasks: [
              {
                type: "gap-fill-tokens",
                instruction: "Choose correct word...",
                tokens: ["a WORD", "b WORD", ...],
                answers: ["a WORD", "b WORD", ...]
              }
            ]
          }
        ]
      }
    ]
  }
}
}
```

### 3.3 Key Functions (mockPlucker.js)

| Function | Purpose | Returns |
|----------|---------|---------|
| `pluckRandom(skill, level)` | Get random exercise for a skill | Single exercise object |
| `pluckRandomFullMock(level)` | Get random full mock | Raw mock object |
| `pluckFullMock1(level)` | Get specific Mock 1 | Built full mock object |
| `pluckSingleSpeakingPart(level)` | Get single speaking part | Single part object |
| `generateMiniTest(level)` | Generate mini test with all skills | Object with skills property |
| `findVocabFromReading(reading)` | Extract vocab from reading | Vocab exercise |

### 3.4 Skill Types Supported
- `reading` - Reading passages with subTasks
- `writing` - Writing tasks with prompts
- `listening` - Listening sections with audio
- `speaking` - Speaking parts with prompts
- `vocabulary` - Vocabulary word lists
- `language-elements` - Grammar/vocab tests

---

## 4. ACCESS CONTROL (TIER SYSTEM)

### 4.1 User Tiers
- **Bronze** - Free tier (default for non-signed-in users)
- **Silver** - Basic tier (signed-in users)
- **Gold** - Premium tier

### 4.2 Mock Tiers
Each mock has a `tier` property: `bronze`, `silver`, or `gold`

### 4.3 Access Logic
```javascript
const canAccess = (mockTier) => {
  if (mockTier === 'bronze') return true;
  if (mockTier === 'silver' && (userTier === 'silver' || userTier === 'gold')) return true;
  if (mockTier === 'gold' && userTier === 'gold') return true;
  return false;
};
```

---

## 5. ROUTING SUMMARY

### Routes
| Path | View | Description |
|------|------|-------------|
| `/` | LandingPage | Main landing page |
| `/telc/b1` | telc-b1-hub | B1 level hub |
| `/telc/b2` | telc-b2-hub | B2 level hub |
| `/telc/c1` | telc-c1-hub | C1 level hub |
| `/free-mock` | lesson (mini-test) | Free B2 mini test (default) |
| `/free-mock/b1` | lesson (mini-test) | B1 mini test |
| `/free-mock/b2` | lesson (mini-test) | B2 mini test |
| `/free-mock/c1` | lesson (mini-test) | C1 mini test |

### View States
| View | Description |
|------|-------------|
| `telc-b1-hub` / `telc-b2-hub` / `telc-c1-hub` | Level-specific hub |
| `skillTests` | Individual skill selection |
| `drillsHub` | Vocab or Drills hub |
| `mywords` | Saved vocabulary |
| `selection` | Task selection within hub |
| `lesson` | Active test/lesson |
| `results` | Test results screen |

---

## 6. SPEAKING PART TYPES

| Part | Type | Structure |
|------|------|-----------|
| Part 1 | `interview` | Topics with questions |
| Part 2 | `discussion` | Text + discussion questions |
| Part 3 | `collaborative` | Topic with suggestions + questions |

---

## 7. SPEAKING IN DIFFERENT CONTEXTS

### Full Mock
- Returns all 3 parts as sections
- Engine renders Part 1/2/3 tabs
- Type: `telc-speaking`

### Mini Test / Skill Test
- Returns single random part
- Engine renders without tabs
- Type: `telc-speaking`

---

## 8. KEY DIFFERENCES: TEST TYPES

| Feature | Full Mock | Quick Start | Skill Tests | Mini Test |
|---------|-----------|-------------|-------------|------------|
| Sections | All 6 skills | All 6 skills | Single skill | All 6 pre-generated |
| Entry | Mock card click | Quick Start button | Specific Skills card | /free-mock route |
| Skills | vocab, reading, writing, listening, speaking, language-elements | Same as Full Mock | User-selected | Same as Full Mock |
| XP | 5000 | 5000 | 150-400 | Varies |
| Data Source | Selected mock | Random full mock | Random single | generateMiniTest() |

---

## 9. NOTABLE IMPLEMENTATION DETAILS

### 9.1 LessonFactory Integration
- `LessonFactory.createFullMockFromMock(rawMock, level)` - Processes raw JSON mock into lesson
- `LessonFactory.create({ id, skill, level })` - Creates lessons from task definitions
- Handles both full mocks and mini tests

### 9.2 Speaking Section Handling
- Full mocks: `sections` contains all 3 parts
- Mini/Skill: `sections` contains single part (no tabs in UI)

### 9.3 Tier-Based UI
- Locked mocks show "Unlock Gold" button
- Opens paywall modal for tier-gated content

### 9.4 Language Elements Section
- **Data Structure**: `languageElements.sections` contains LE parts (le-part1, le-part2)
- **Each Part**: Has `passages` array with passage objects containing:
  - `content`: Array of text objects with `id` and `text` properties
  - `subTasks`: Array of question tasks
- **Question Types**:
  - `mcq`: Multiple choice questions for Part 1 (gaps 21-30)
  - `gap-fill-tokens`: Token selection for Part 2 (gaps 31-40)
- **Gap Markers**: Text contains `____(21)____` style markers for interactive gaps
- **Engine Flow**: 
  1. Full mock passes `languageElements` object as a section
  2. Engine detects `skill === 'language-elements'` and renders LanguageElementsBlock
  3. LanguageElementsBlock receives `sections` prop = [le-part1, le-part2]
  4. Tabs for part switching, content from `passages[0].content`
- **Practice Atoms Integration**:
  - When `pluckRandom('language-elements')` is called (Skill Tests), it returns a single LE part (atom)
  - The atom has the same structure: `passages[0].content` as array of text objects
  - `QuestionDispatcher` normalizes `gap-fill-tokens` passage content:
    - Receives `passageContent` as array `[{ id, text }]`
    - Converts array to string by extracting `text` fields and joining with `\n\n`
    - Passes string to `GapFillBlock` which expects `passage` prop for `.split()`
  - `GapFillBlock` includes defensive check: `typeof passage === 'string' ? passage : ''` to prevent TypeErrors if malformed data is passed

### 9.5 Data Normalization for Structured Content
- **Problem**: Some question types (e.g., `gap-fill-tokens`) need a plain string passage, but LanguageElementsBlock provides structured `content` arrays
- **Solution**: `QuestionDispatcher` normalizes structured data before passing to components:
  ```javascript
  // gap-fill-tokens case
  let normalizedPassage = data.passage;
  if (passageContent) {
    if (Array.isArray(passageContent)) {
      normalizedPassage = passageContent.map(item =>
        typeof item === 'object' ? (item.text || item.passage || '') : item
      ).join('\n\n');
    } else if (typeof passageContent === 'string') {
      normalizedPassage = passageContent;
    }
  }
  ```
- Applies similarly for `matching-info` with `parentContent` field
- Ensures backward compatibility with both full mock (array) and practice atom (array) structures

### 9.6 Listening Block Normalization
- **Problem**: `ListeningBlock` expects `data` to have a `sections` array of parts. During practice atom flow, `pluckRandom('listening')` passes a listening part directly (no `sections` wrapper), causing `listeningSections` to be empty and resulting in missing audio/questions.
- **Solution**: `ListeningBlock` normalizes the data shape:
  ```javascript
  const listeningData = data.listening || data;
  const listeningSections = Array.isArray(listeningData?.sections)
    ? listeningData.sections
    : [listeningData]; // fallback to treat data itself as a single part
  const currentPart = listeningSections[activeSectionIndex] || listeningSections[0];
  ```
- Covers both formats:
  - **Full mock**: `data` is full mock → `listeningData = data.listening` (has sections array)
  - **Practice atom**: `data` is raw listening part → fallback creates single-element array
- This ensures audio, transcript, and subTasks are correctly displayed for practice atoms and skill tests.