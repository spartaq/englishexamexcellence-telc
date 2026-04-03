# English Exam Excellence - Layout Specification

This document describes the unified layout structure used across ALL content pages and lessons in the application.

---

## Navigation Paths & Test Types

This section defines all the paths users can take to access different test types. Use these terms when communicating about layout issues.

### Path 0: Hub Entry
**Route:** `/dashboard/ielts-hub`

This is the entry point for IELTS tests. When accessed, it shows BrandTestHub which provides access to:
- Mini Tests (General & Academic)
- Full Mocks (General & Academic)
- Skill Tests (Individual Skills)

### Path 1: IELTS Full Individual Hub (Individual Skills)
**Route:** `/dashboard/ielts-full-individual` → User clicks "View All Mocks"

| Test Type | Route | initialView | Data Source | Notes |
|-----------|-------|-------------|-------------|-------|
| Academic Reading (Full Mock) | `/dashboard/reading-academic` | `reading_academic` | IELTS_READING_AC hub → Academic Mock #1 | Full mock with sections |
| General Reading (Full Mock) | `/dashboard/reading-general` | `reading_general` | IELTS_READING_GT hub → General Mock | Full mock with sections |
| Academic Writing | `/dashboard/writing-academic` | `writing_academic` | IELTS_WRITING_AC hub | Full mock with sections |
| General Writing | `/dashboard/writing-general` | `writing_general` | IELTS_WRITING_GT hub | Full mock with sections |
| Listening | `/dashboard/listening` | `listening` | IELTS_LISTENING hub | Full mock with sections |
| Speaking | `/dashboard/speaking` | `speaking` | IELTS_SPEAKING hub | Full mock with sections |

### Path 2: IELTS Mini Individual Hub (Individual Skills)
**Route:** `/dashboard/ielts-mini-individual` → View shows individual skill options

| Test Type | Route | initialView | pluckRandom Function | Data |
|-----------|-------|-------------|---------------------|------|
| Reading | `/dashboard/reading-gt` | `reading-gt` | `pluckRandom('reading')` | Single passage |
| Listening | `/dashboard/listening` | `listening` | `pluckRandom('listening')` | Single section |
| Writing | `/dashboard/writing-gt` | `writing-gt` | `pluckRandom('writing')` | Single task |

### Path 3: Mini & Full Tests (Combined Flows)
| Test Type | Route | initialView | Type | Skills |
|-----------|-------|-------------|------|--------|
| General Mini Test | `/dashboard/ielts-general-mini-test` | `ielts-general-mini-test` | `flow` | Vocab + Reading + Listening + Speaking + Writing |
| Academic Mini Test | `/dashboard/ielts-academic-mini-test` | `ielts-academic-mini-test` | `academic-flow` | Vocab + Reading + Listening + Speaking + Writing |
| General Full Test | `/dashboard/ielts-general-full-test` | `ielts-general-full-test` | `full-mock` | Reading + Writing + Listening + Speaking |
| Academic Full Test | `/dashboard/ielts-academic-full-test` | `ielts-academic-full-test` | `full-mock` | Reading + Writing + Listening + Speaking |

---

## Application Screens / Views

This section lists all the major screens/views in the application for reference when discussing layout issues.

### Hub / Navigation Screens
| Screen Name | File | Description |
|-------------|------|-------------|
| LandingPage | `src/components/LandingPage/LandingPage.jsx` | Main landing page |
| Dashboard | `src/components/ui/Dashboard.jsx` | Main dashboard after login |
| SkillHub | `src/components/ui/SkillHub.jsx` | Generic skill hub - displays skill categories. Used for Vocab Lab and general skill practice |
| BrandTestHub | `src/components/ui/BrandTestHub.jsx` | Test hub for different brands (IELTS, LangCert, etc.) |
| TaskSelection | `src/components/ui/TaskSelection.jsx` | Task selection screen |
| ExamStrategy | `src/components/ui/ExamStrategy.jsx` | Exam strategy page |
| ExamDescription | `src/components/ui/ExamDescription.jsx` | Exam description page |
| LoadingScreen | `src/components/ui/LoadingScreen.jsx` | Loading overlay |

### IELTS Test Types (Available Routes)

**Combined Flow Tests:**
| Test Name | Route | Skills Included | Description |
|-----------|-------|-----------------|-------------|
| General Mini Test | `/dashboard/ielts-general-mini-test` | Vocab + Reading + Listening + Speaking + Writing | Quick blast of all 4 skills plus vocab |
| Academic Mini Test | `/dashboard/ielts-academic-mini-test` | Vocab + Reading + Listening + Speaking + Writing | Academic-focused test |
| General Full Test | `/dashboard/ielts-general-full-test` | Reading + Writing + Speaking + Listening | Complete IELTS General test |
| Academic Full Test | `/dashboard/ielts-academic-full-test` | Reading + Writing + Speaking + Listening | Complete IELTS Academic test |

**Individual Skill Tests:**
| Test Name | Route | Description |
|-----------|-------|-------------|
| Academic Reading | `/dashboard/reading-ac` | Random Academic Reading exercise |
| General Reading | `/dashboard/reading-gt` | Random General Training Reading exercise |
| Academic Writing | `/dashboard/writing-ac` | Random Academic Writing exercise |
| General Writing | `/dashboard/writing-gt` | Random General Training Writing exercise |
| Listening | `/dashboard/listening` | Random Listening exercise |
| Speaking | `/dashboard/speaking` | Random Speaking exercise |

### Data Hubs (Rendered via App.jsx)
| Hub Name | Data File | Route | Description |
|----------|-----------|-------|-------------|
| General Drills | `src/data/DrillsHub/index.js` | `/dashboard/general-drills` | Grammar, punctuation, and core drills |
| Vocabulary | `src/data/vocabulary.js` | `/dashboard/vocabulary` | Vocabulary exercises |

### Test Block Components
| Block Name | File | Description |
|------------|------|-------------|
| ReadingBlock | `src/components/engine/ReadingBlock.jsx` | IELTS Reading test block |
| ListeningBlock | `src/components/engine/ListeningBlock.jsx` | IELTS Listening test block |
| WritingBlock | `src/components/engine/WritingBlock.jsx` | IELTS Writing test block |
| SpeakingBlock | `src/components/engine/SpeakingBlock.jsx` | IELTS Speaking test block |
| VocabBlock | `src/components/engine/VocabBlock.jsx` | Vocabulary exercises |

### Gate / Flow Components
| Component | File | Description |
|-----------|------|-------------|
| ReflectionGate | `src/components/engine/ReflectionGate.jsx` | Post-test reflection screen |
| ResultScreen | `src/components/engine/ResultScreen.jsx` | Results display |
| TestPage | `src/components/TestPage.jsx` | Main test page wrapper |

### Interactive Block Components
All located in `src/components/engine/InteractiveBlocks/`:
| Block | File | Question Type |
|-------|------|---------------|
| ShortAnswerBlock | `ShortAnswerBlock.jsx` | `short-answer` |
| MatchingInfoBlock | `MatchingInfoBlock.jsx` | `matching-choice`, `matching-info` |
| MCQBlock | `MCQBlock.jsx` | `mcq` / `multiple-choice` |
| TrinaryBlock | `TrinaryBlock.jsx` | `trinary` (TRUE/FALSE/NOT GIVEN) |
| HeadingMatchBlock | `HeadingMatchBlock.jsx` | `heading-match` |
| MatchingFeaturesBlock | `MatchingFeaturesBlock.jsx` | `matching-features` |
| GapFillBlock | `GapFillBlock.jsx` | `gap-fill` |
| SentenceCompleteBlock | `SentenceCompleteBlock.jsx` | `sentence-complete` |
| TableCompletionBlock | `TableCompletionBlock.jsx` | `table-completion` |
| DiagramLabelBlock | `DiagramLabelBlock.jsx` | `diagram-label` |
| NotesCompletionBlock | `NotesCompletionBlock.jsx` | `notes-completion` |
| FlowChartCompletionBlock | `FlowChartCompletionBlock.jsx` | `flow-chart` |
| TokenSelectBlock | `TokenSelectBlock.jsx` | `token-select` |
| PunctuationCorrectionBlock | `PunctuationCorrectionBlock.jsx` | `punctuation` |

---

## Key Terms & Concepts

### Reading Passage Types
| Type | Description | Used In |
|------|-------------|---------|
| `ielts-complex` | Reading passage with subTasks (questions) | Full mocks, Academic/General Reading |
| `reading-practice` | Fallback type if passage has no type | pluckRandom fallback |

### Layout Branches in App.jsx
The main rendering logic has two branches:

1. **Mock Flow** (`mock-flow`): For tests with sections/passages
   - Condition: `activeLesson.sections || activeLesson.passages || activeLesson.parts || activeLesson.type === 'ielts-complex'`
   - Renders unified skill tabs for combined flows
   - Uses `handlesOwnQuestions` to determine if section renders its own questions

2. **Drill Flow** (`drill-flow`): For single exercises
   - Fallback for exercises without sections

### handlesOwnQuestions Check
Determines if a section/block renders both content AND questions internally:

```javascript
const handlesOwnQuestions = 
  ['LISTENING', 'SPEAKING', 'WRITING', 'VOCAB', 'ielts-speaking', 
   'discussion', 'interview', 'long-turn', 'READING', 'reading', 
   'reading-practice', 'ielts-complex'].includes(currentSection.type) 
  || currentSection.skill === 'listening' 
  || currentSection.skill === 'speaking' 
  || currentSection.skill === 'writing' 
  || currentSection.skill === 'vocab' 
  || currentSection.skill === 'reading'
  || sectionHasReading; // checks if passages have type: 'ielts-complex'
```

---

## Core Layout Pattern

All content pages follow a **split-pane layout**:
- **Left/Top Pane**: Content/Source material (reading text, audio, prompts)
- **Right/Bottom Pane**: Question/Exercise carousel

### Desktop
```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER                               │
├─────────────────────────────────────────────────────────────┤
│                          │                                  │
│    CONTENT PANE         │      EXERCISE CAROUSEL           │
│    (Reading/Audio/      │      (One question at a time)   │
│     Writing prompt)     │                                  │
│                         │      ┌─────────────────────┐     │
│    - Full display       │      │ Exercise 1 of N     │     │
│    - Scrollable         │      ├─────────────────────┤     │
│                         │      │                     │     │
│                         │      │   Question/Input    │     │
│                         │      │                     │     │
│                         │      └─────────────────────┘     │
│                         │                                  │
│                         │      ◉ ● ● ● ● (navigation)     │
│                         │                                  │
└─────────────────────────┴──────────────────────────────────┘
```

### Mobile
```
┌─────────────────────┐
│       HEADER       │
├─────────────────────┤
│                     │
│   CONTENT PANE     │
│   (Full width)      │
│                     │
├─────────────────────┤
│                     │
│   EXERCISE 1 OF N  │
│   ─────────────────  │
│                     │
│   [Question/Input]  │
│                     │
├─────────────────────┤
│   ◉ ● ● ● (dots)   │
└─────────────────────┘
```

---

## CSS Specifications

### Desktop
- **Carousel max-width**: `800px`
- **Carousel margin**: `0 auto` (centered)
- **Scroll behavior**: Horizontal with snap (`scroll-snap-type: x mandatory`)

### Mobile (breakpoint: 768px)
- **Carousel max-width**: `100%`
- **No margin** (full width)
- **Touch-friendly**: Swipe gestures supported

---

## Components Using This Layout

### 1. IELTS Reading
- **Component**: [`ReadingBlock.jsx`](src/components/engine/ReadingBlock.jsx)
- **Content**: Reading passages (HTML paragraphs)
- **Questions**: 15 types supported

### 2. IELTS Listening
- **Component**: [`ListeningBlock.jsx`](src/components/engine/ListeningBlock.jsx)
- **Content**: Audio player + transcript
- **Questions**: Multiple types

### 3. IELTS Writing
- **Component**: [`WritingBlock.jsx`](src/components/engine/WritingBlock.jsx)
- **Content**: Writing prompts/tasks
- **Questions**: Essay writing tasks

### 4. IELTS Speaking
- **Component**: [`SpeakingBlock.jsx`](src/components/engine/SpeakingBlock.jsx)
- **Content**: Speaking prompts
- **Questions**: Audio recording tasks

### 5. LangCert Tests
- Similar structure for LangCert reading/speaking tests

### 6. Drills
- Grammar, vocabulary, and finding drills

---

## SplitPane Component

**File**: [`SplitPane.jsx`](src/components/engine/SplitPane.jsx)

A reusable component that implements the split-pane layout pattern for all desktop exercises.

### Props
```javascript
<SplitPane
  content={ReactNode}  // Left pane content (reading text, prompts, etc.)
  exercise={ReactNode} // Right pane content (questions, editor, recording)
  className={string}   // Optional additional CSS classes
/>
```

### Features
- Desktop (>768px): Side-by-side layout with content on left, exercise on right
- Mobile (≤768px): Stacked vertically
- Automatically applies `.desktop-split-pane`, `.content-pane`, and `.exercise-pane` classes
- Single source of truth for layout behavior across all exercise blocks

### Usage
All exercise blocks (ReadingBlock, ListeningBlock, WritingBlock, SpeakingBlock) now use this component instead of manually applying layout classes.

---

## Question Carousel Component

**File**: [`QuestionCarousel.jsx`](src/components/engine/QuestionCarousel.jsx)

### Props
```javascript
<QuestionCarousel
  questions={Array}        // Array of question objects
  renderQuestion={Function} // Render function for each question
  showInstruction={Boolean} // Show question counter (default: true)
/>
```

### Features
- Horizontal scroll with snap
- Dot navigation
- Touch/swipe support
- Keyboard accessible

### CSS Classes
| Class | Purpose |
|-------|---------|
| `.question-carousel-wrapper` | Container for carousel |
| `.question-carousel` | Scrollable container |
| `.question-slide` | Individual question slide |
| `.carousel-dots` | Navigation dots |

---

## Question Expansion Logic

Some question types are **expanded** into individual questions in the carousel, while others remain as **single blocks** with multiple questions.

### Types Expanded in Carousel (One by One)
These question types are expanded into individual questions in the carousel:

**IELTS Reading**
- `short-answer` - Each question becomes a separate slide
- `matching-info` - Each paragraph match becomes a separate slide
- `trinary` - Each TRUE/FALSE/NOT GIVEN becomes a separate slide
- `heading-match` - Each heading match becomes a separate slide
- `matching-features` - Each feature match becomes a separate slide

**IELTS Listening**
- `short-answer` - Each question becomes a separate slide
- `diagram-label` - Each label becomes a separate slide
- `notes-completion` - Each note gap becomes a separate slide

### Types NOT Expanded (Single Block)
These question types render as a single block with all questions:

**IELTS Reading**
- `mcq` / `multiple-choice`
- `matching-choice`
- `sentence-complete`
- `gap-fill`
- `token-select`
- `diagram-label`
- `table-completion`
- `flow-chart`
- `notes-completion`
- `punctuation`

**IELTS Listening**
- `mcq`
- `matching-choice`
- `table-completion` - Renders all table cells together

---

## Supported Question Types

### By Test Type

**IELTS Reading**
1. `short-answer` - Short answer questions
2. `matching-info` - Which paragraph contains information
3. `mcq` / `multiple-choice` - Multiple choice
4. `matching-choice` - Matching options
5. `heading-match` - Matching headings
6. `sentence-complete` - Sentence completion
7. `gap-fill` - Gap fill with word bank
8. `trinary` - TRUE/FALSE/NOT GIVEN or YES/NO/NOT GIVEN
9. `matching-features` - Feature matching
10. `token-select` - Token selection
11. `diagram-label` - Diagram labeling
12. `table-completion` - Table completion
13. `flow-chart` - Flow chart completion
14. `notes-completion` - Notes completion
15. `punctuation` - Punctuation correction

**IELTS Listening**
- `mcq` - Multiple choice
- `gap-fill` - Gap fill
- `matching-choice` - Matching
- `table-completion` - Table completion (block)
- `short-answer` - Short answer (expanded)
- `diagram-label` - Diagram labeling (expanded)
- `notes-completion` - Notes completion (expanded)

---

## Question Type to Block Mapping

Different question types should use different block components:

| Question Type | Block Component | Notes |
|---------------|-----------------|-------|
| `short-answer` | ShortAnswerBlock | Text input for answers |
| `matching-info` | MatchingInfoBlock | Button options (A, B, C...) |
| `trinary` | TrinaryBlock | TRUE/FALSE/NOT GIVEN buttons |
| `mcq` | MCQBlock | Multiple choice with radio/button options |
| `matching-choice` | MatchingInfoBlock | Match options to questions |
| `heading-match` | HeadingMatchBlock | Match paragraphs to headings |
| `gap-fill` | GapFillBlock | Fill gaps from word bank |
| `sentence-complete` | SentenceCompleteBlock | Complete sentences |
| `notes-completion` | NotesCompletionBlock | Complete notes (block) or expanded |
| `table-completion` | TableCompletionBlock | Complete table (block) |
| `diagram-label` | DiagramLabelBlock | Label diagram (expanded) |

### ReadingBlock switch statement example:
```javascript
const qt = q.type;  // Always use q.type from flattened questions
switch (qt) {
  case 'short-answer':
    return <ShortAnswerBlock data={q} userAnswers={{}} onUpdate={() => {}} ... />;
  case 'matching-info':
    return <MatchingInfoBlock data={q} ... />;  // NOT ShortAnswerBlock!
  case 'trinary':
    return <TrinaryBlock data={q} ... />;
  // ... etc
}
```

---

## Data Structure

### Question Flattening

Questions in raw data are often stored as **subTasks** with nested question arrays. The `flattenQuestions()` function in each Block component expands these into individual questions for the carousel.

### IMPORTANT: Question Type Resolution

When flattening nested questions, the type should be derived from the **parent task**, not the individual question:

```javascript
// WRONG - Individual questions often don't have type field:
type: q.type  // undefined!

// CORRECT - Use parent task's type:
type: task.type  // 'short-answer', 'trinary', 'matching-info', etc.
```

The data structure typically looks like:
```javascript
{
  type: 'short-answer',  // Parent task type
  instruction: "Complete the notes...",
  questions: [
    { id: 1, text: "Question text", answer: "answer1" },
    { id: 2, text: "Question text", answer: "answer2" }
  ]
}
```

The individual questions (`q`) don't have a `type` field - only the parent task has it. Always use `task.type` as the fallback.

### Example: Reading subTasks
```javascript
{
  type: 'trinary',
  mode: 'tfng',
  questions: [
    { id: 1, text: "Question text", answer: "TRUE" },
    { id: 2, text: "Question text", answer: "FALSE" }
  ]
}
```

### Flattened for Carousel
```javascript
{
  id: 1,
  text: "Question text",
  answer: "TRUE",
  type: 'trinary',  // Derived from task.type, NOT q.type
  mode: 'tfng',
  parentType: 'trinary'
}
```

### Listening Notes Completion
```javascript
{
  type: 'notes-completion',
  notes: [
    { id: "31", type: "gap", label: "Buildings account for approximately ______ of global energy consumption.", answer: "40%" }
  ]
}
```

Expands to:
```javascript
{
  id: "31",
  type: 'notes-completion',
  text: "Buildings account for approximately ______ of global energy consumption.",
  answer: "40%",
  wordLimit: 2
}
```

---

## Key Files Reference

### Layout Components
- `src/components/engine/QuestionCarousel.jsx` - Universal carousel
- `src/components/engine/SplitPane.jsx` - Unified split-pane layout (SINGLE SOURCE OF TRUTH)
- `src/components/engine/ReadingBlock.jsx` - Reading tests
- `src/components/engine/ListeningBlock.jsx` - Listening tests
- `src/components/engine/WritingBlock.jsx` - Writing tasks
- `src/components/engine/SpeakingBlock.jsx` - Speaking tasks

### Interactive Blocks
- `src/components/engine/InteractiveBlocks/*.jsx` - All question type components

### Styling
- `src/components/engine/engine.css` - Main layout styles
- `src/App.css` - Application styles
- `src/styles/globals.css` - Global styles

### Test Data
- `src/data/IELTS/reading/mocks/` - IELTS Reading mocks
- `src/data/IELTS/listening/mocks/` - IELTS Listening mocks
- `src/data/IELTS/speaking/mocks/` - IELTS Speaking mocks
- `src/data/IELTS/writing/mocks/` - IELTS Writing mocks
- `src/data/LangCert/` - LangCert test data
- `src/data/DrillsHub/` - Drill exercises

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| > 768px (Desktop) | Split pane, carousel centered (max 800px) |
| ≤ 768px (Mobile) | Stacked, full width |

---

## Adding New Question Types

When adding a new question type:

1. **Create block component** in `src/components/engine/InteractiveBlocks/`
2. **Import** in ReadingBlock.jsx or ListeningBlock.jsx
3. **Add case** in `internalRenderQuestionBlock` or `renderQuestionBlock` switch statement
4. **Handle flattening** in `flattenQuestions()` or `getAllQs()` if nested questions
5. **Decide**: Should it be expanded (one by one) or stay as block?
6. **Add CSS** in engine.css if needed

Example - Expanded type:
```javascript
case 'new-type':
  // Add expansion logic in flattenQuestions()
  t.items.forEach(item => {
    flatQs.push({
      ...item,
      type: 'new-type',
      parentType: 'new-type'
    });
  });
  break;

// In renderQuestionBlock
case 'new-type':
  if (q.text && !q.items) {
    // Single expanded question - render inline
    return <div className="question-card">...</div>;
  }
  // Original block
  return <NewTypeBlock data={q} ... />;
```

Example - Block type (not expanded):
```javascript
// Don't add expansion logic - keep as single block
case 'new-type':
  return <NewTypeBlock data={q} ... />;
```
