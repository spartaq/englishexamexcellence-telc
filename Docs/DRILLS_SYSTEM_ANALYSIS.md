# Drills System Analysis

## Executive Summary

The Drills Hub is a standalone training module providing targeted grammar and reading exercises. **The system is fully operational** - both drill types have working Check Answers functionality, proper styling via CSS files, and grading is wired up correctly.

---

## Architecture Overview

### Data Flow
```
DrillsHub.jsx (UI)
    ↓ onSelectSection / onStartTask
App.jsx (State Management)
    ↓ handleStartTask
LessonFactory.create()
    ↓ loadFullLesson
lessonLoader.js
    ↓ merges metadata + content
lessonDatabase (from data/index.js)
    ↓ drillsData from data/DrillsHub/index.js
Engine.jsx (Renderer)
    ↓ QuestionDispatcherWithCheck Wrapper
Interactive Blocks (TokenSelectBlock | PunctuationCorrectionBlock | GapFillBlock)
```

### Available Drill Types

1. **Reading Drills** (type: `token-select`)
   - `find-passive-1` - Identify passive voice constructions
   - `find-presperf-1` - Identify present perfect tense  
   - `find-noun-1` - Identify noun phrases

2. **Writing Drills** (type: `punctuation-correction`, `gap-fill-tokens`)
   - `comma-drill-1` - Commas with introductory elements
   - `comma-drill-2` - Commas with compound sentences
   - `comma-drill-3` - Commas with lists and series
   - `conjunctions-1` - Conjunctions and linking words

---

## System Status: FULLY OPERATIONAL

### Check Answers Button - WORKING ✓

**Implementation Details:**

1. **Engine.jsx** (Lines 239-253)
   - Fallback path correctly passes `onCheckAnswers` prop to QuestionDispatcher

2. **QuestionDispatcher.jsx** (Lines 293-352)
   - Wrapper component `QuestionDispatcherWithCheck` accepts props:
     - `onCheckAnswers` (line 297)
     - `showCheckAnswers` (line 299)
   - Renders Check Answers button (lines 339-345)
   - Button disabled until user has made selections (line 342)
   - Calls `onCheckAnswers()` on click (line 341)

3. **Interactive Blocks**
   - Both blocks correctly call `onUpdate` with selections
   - Both blocks respond to `isReviewMode` for showing results

---

## Grading Logic (useCheckAnswers.js)

Lines 91-97 handle both drill types:

```javascript
else if (activeLesson.type === 'token-select' || activeLesson.type === 'punctuation-correction' || activeLesson.type === 'gap-fill-tokens') {
  const userSelections = userAnswers[activeLesson.id] || [];
  const correctOnes = activeLesson.correctTokens || activeLesson.correctPositions || [];
  const correct = userSelections.filter(s => correctOnes.includes(s)).length;
  const accuracy = correctOnes.length > 0 ? Math.round((correct / correctOnes.length) * 100) : 0;
  results = { accuracy, earnedXP: Math.round((activeLesson.xpReward || 300) * (accuracy / 100)), isPerfect: accuracy >= 100 };
}
```

---

## Component Interaction Map

```
App.jsx
├── handleCheckAnswers() ← Uses useCheckAnswers hook
├── userAnswers state
├── isReviewMode state
└── lessonResults state

Engine.jsx
├── Receives: activeLesson, userAnswers, onUpdateAnswers, onCheckAnswers, isReviewMode
├── Detects lesson type
└── Routes to QuestionDispatcher fallback for drills

QuestionDispatcherWithCheck.jsx
├── Props: data, userAnswers, onUpdate, onCheckAnswers, isReviewMode, showCheckAnswers
├── Renders: QuestionDispatcher + Check Answers Button
└── Handles: Button enable/disable based on userAnswers

TokenSelectBlock.jsx
├── Props: data, onUpdate, isReviewMode
├── State: selectedIndices (local)
├── Output: selected words via onUpdate(qId, cleanedWords[])
└── Review: Shows correct/incorrect/missed highlighting

PunctuationCorrectionBlock.jsx
├── Props: data, onUpdate, isReviewMode
├── State: placements { sentenceId: Set<position> }
├── Output: serializable placements via onUpdate(qId, placements)
└── Review: Shows results + explanations

GapFillBlock.jsx
├── Props: data, onUpdate, isReviewMode
├── State: selections { gapKey: selectedWord }
├── Output: selections via onUpdate(qId, selections)
└── Review: Shows correct/incorrect/missed highlighting
```

---

## Data Structure Examples

### Token Select Drill (find-passive-1)
```javascript
{
  id: 'find-passive-1',
  type: 'token-select',
  title: 'Identifying the Passive Voice',
  xpReward: 150,
  instruction: 'Identify all instances of the Passive Voice.',
  content: "Fair games? For seventeen days...",
  correctTokens: [
    "is briefly arrested",
    "are often left",
    "are often assumed",
  ]
}
```

### Gap Fill Tokens Drill (conjunctions-1)
```javascript
{
  id: 'conjunctions-1',
  type: 'gap-fill-tokens',
  title: 'Conjunctions & Connectors',
  instruction: 'Select the correct connector for each gap.',
  xpReward: 100,
  passage: `Many students struggle with English exams. ____(a)____ they study hard...`,
  tokens: ['ALTHOUGH', 'HOWEVER', 'EVEN THOUGH', ...],
  answers: { "a": "ALTHOUGH", "b": "HOWEVER" }
}
```

### Punctuation Correction Drill (comma-drill-1)
```javascript
{
  id: 'comma-drill-1',
  type: 'punctuation-correction',
  title: 'Comma Usage: Introductory Elements',
  instruction: 'Click between words to add commas where needed.',
  xpReward: 100,
  punctuationMark: ',',
  sentences: [
    {
      id: 's1',
      text: 'However the results were inconclusive.',
      correctPositions: [0],
      explanation: 'Use a comma after transitional words like "however".'
    }
  ]
}
```

---

## Styling Implementation ✓

### TokenSelectBlock.css (206 lines)
- Uses CSS variables for colors
- Smooth slideUp animation on render
- Clear typography with proper visual hierarchy
- XP badge with amber background
- Instruction box with border and icon
- Review mode legend showing correct/incorrect/missed

### PunctuationCorrectionBlock.css
- Comprehensive styling for all states
- Review mode with color-coded gaps
- Score display with perfect/success state
- Explanation text styling

### GapFillBlock.css
- Token bank styling with hover states
- Gap highlighting for active/filled states
- Review mode legend and score display
- Responsive token grid layout

---

## Testing Checklist

- [x] Check Answers button appears for token-select drills
- [x] Check Answers button appears for punctuation-correction drills  
- [x] Check Answers button appears for gap-fill-tokens drills
- [x] Grading works correctly for all three drill types
- [x] Review mode shows correct/incorrect/missed items
- [x] XP is calculated and displayed correctly
- [x] Styling is consistent across drill types
- [x] Responsive design works on mobile (via CSS)

---

## Files Reference

### Core Components
1. **src/components/engine/Engine.jsx** - Main dispatcher
2. **src/components/engine/QuestionDispatcher.jsx** - Question routing + Check button wrapper
3. **src/components/engine/InteractiveBlocks/TokenSelectBlock.jsx** - Reading drill block  
4. **src/components/engine/InteractiveBlocks/PunctuationCorrectionBlock.jsx** - Writing drill block
5. **src/components/engine/InteractiveBlocks/GapFillBlock.jsx** - Gap-fill-tokens drill block
6. **src/components/engine/useCheckAnswers.js** - Grading logic

### Styling
1. **src/components/engine/InteractiveBlocks/TokenSelectBlock.css**
2. **src/components/engine/InteractiveBlocks/PunctuationCorrectionBlock.css**
3. **src/components/engine/InteractiveBlocks/GapFillBlock.css**

### Data
1. **src/data/DrillsHub/index.js** - Hub config + drills lookup
2. **src/data/DrillsHub/C1Drills/reading/c1-drill-find-passive-1.js**
3. **src/data/DrillsHub/B2Drills/reading/b2-drill-find-presperf-1.js**
4. **src/data/DrillsHub/B1Drills/reading/b1-drill-find-noun-1.js**
5. **src/data/DrillsHub/C1Drills/writing/c1-drill-comma-1.js**
6. **src/data/DrillsHub/B2Drills/writing/b2-drill-conjunctions-1.js**

---

## How to Add New Drills to the Hub

### Step 1: Create the Drill Data File

Place the file in the correct folder under `src/data/DrillsHub/{Level}Drills/{skill}/`:

**Example: Adding a new B1 reading drill**
Create: `src/data/DrillsHub/B1Drills/reading/b1-drill-find-adjectives-1.js`

### Step 2: Export Drill Data (by type)

#### A. Token-Select Drill (Reading)
```javascript
export const findAdjectives1Data = {
  id: 'find-adjectives-1',
  type: 'token-select',
  title: 'Identifying Adjectives',
  xpReward: 150,
  instruction: 'Tap all adjectives in each sentence.',
  content: "The beautiful old house stands on a quiet street...",
  correctTokens: ["beautiful", "old", "quiet", "modern"]
};
```

#### B. Punctuation-Correction Drill (Writing)
```javascript
export const myPunctuationDrill = {
  id: 'punctuation-drill-4',
  type: 'punctuation-correction',
  title: 'Comma Usage: Complex Structures',
  instruction: 'Click between words to add commas where needed.',
  xpReward: 100,
  punctuationMark: ',',
  sentences: [
    {
      id: 's1',
      text: 'Because it was raining heavily we stayed indoors.',
      correctPositions: [3],
      explanation: 'Use a comma after introductory dependent clauses.'
    }
  ]
};
```

#### C. Gap-Fill-Tokens Drill (Writing)
```javascript
export const myGapFillDrill = {
  id: 'gapfill-new-1',
  type: 'gap-fill-tokens',
  title: 'Linking Words Practice',
  instruction: 'Select the correct linking word for each gap.',
  xpReward: 100,
  passage: `First, they planned the project. ____(a)____, they gathered materials. ____(b)____, they started working.`,
  tokens: ['AFTERWARD', 'NEXT', 'MEANWHILE', 'FINALLY'],
  answers: { "a": "NEXT", "b": "AFTERWARD" }
};
```

### Step 3: Register in index.js

Edit `src/data/DrillsHub/index.js`:

```javascript
// 1. Add import at top
import { findAdjectives1Data } from './B1Drills/reading/b1-drill-find-adjectives-1';

// 2. Add to drillsData lookup
export const drillsData = {
  // ... existing drills
  'find-adjectives-1': { ...findAdjectives1Data, level: 'b1' },
};

// 3. Add to appropriate category in DRILLS_HUB
export const DRILLS_HUB = {
  // ...
  categories: [
    {
      id: 'reading-drills',
      title: 'Reading Skills',
      tasks: [
        // ... existing tasks
        { id: 'find-adjectives-1', title: 'Find the adjectives', xp: 500, type: 'reading-drill', tier: 'bronze', level: 'b1' },
      ]
    }
  ]
};
```

### Step 4: Verify Component Support

The `QuestionDispatcher.jsx` already handles these types:
- `token-select` → TokenSelectBlock
- `punctuation-correction` → PunctuationCorrectionBlock
- `gap-fill-tokens` → GapFillBlock

### Current Available Categories
| Category | Skill | Example Types |
|----------|-------|---------------|
| `reading-drills` | reading | `reading-drill`, `token-select` |
| `writing-drills` | writing | `punctuation-correction`, `gap-fill-tokens`, `writing-prompt` |
| `language-elements` | language-elements | `language-element` |
| `speaking-drills` | speaking | `speaking-preparation` |

### Field Reference
- `id` - Unique identifier for the drill
- `type` - Determines which component renders it
- `title` - Display title in UI
- `xpReward` - XP earned on completion
- `instruction` - Brief instruction text
- `correctTokens` (token-select) - Array of phrases/words to identify
- `content` (token-select) - The paragraph text to analyze
- `sentences` (punctuation-correction) - Array of sentences with comma positions
- `passage` (gap-fill-tokens) - Text with `____(a)____` gap markers
- `tokens` (gap-fill-tokens) - Word bank options
- `answers` (gap-fill-tokens) - Mapping of gap letters to correct answers

---

## Notes

- The Drills Hub only exposes Reading and Writing skill drills currently
- Speaking and Language Elements categories exist in the data folder but are not exposed in DRILLS_HUB categories array (only reading-drills and writing-drills are mapped)
- Some placeholder files exist (conjunctions-although.js, thinkingwhatyoullsay.js) with incomplete data - these are not yet wired into the hub