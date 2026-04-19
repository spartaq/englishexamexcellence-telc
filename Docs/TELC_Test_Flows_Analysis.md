# TELC Test Flows Analysis

## Overview

This document describes the routing, data flow, and component architecture of the TELC exam practice application.

---

## 1. Routes Overview

### 1.1 Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Main landing page |
| `/telc-info` | `ExamDescription` | Public TELC info page (SEO) |
| `/free-mock` | `App` | Free B2 mini test |
| `/free-mock/b1` | `App` | Free B1 mini test |
| `/free-mock/b2` | `App` | Free B2 mini test |
| `/free-mock/c1` | `App` | Free C1 mini test |

### 1.2 Protected Routes (Require Login)

| Path | initialView | Description |
|------|-------------|-------------|
| `/telc/b1` | `telc-b1-hub` | B1 level hub |
| `/telc/b1/mini-test` | `telc-b1-mini-test` | B1 mini test |
| `/telc/b1/reading` | `telc_b1_reading` | B1 reading practice |
| `/telc/b1/writing` | `telc_b1_writing` | B1 writing practice |
| `/telc/b1/speaking` | `telc_b1_speaking` | B1 speaking practice |
| `/telc/b1/listening` | `telc_b1_listening` | B1 listening practice |
| `/telc/b2` | `telc-b2-hub` | B2 level hub |
| `/telc/b2/mini-test` | `telc-b2-mini-test` | B2 mini test |
| `/telc/b2/reading` | `telc_b2_reading` | B2 reading practice |
| `/telc/b2/writing` | `telc_b2_writing` | B2 writing practice |
| `/telc/b2/speaking` | `telc_b2_speaking` | B2 speaking practice |
| `/telc/b2/listening` | `telc_b2_listening` | B2 listening practice |
| `/telc/c1` | `telc-c1-hub` | C1 level hub |
| `/telc/c1/mini-test` | `telc-c1-mini-test` | C1 mini test |
| `/telc/c1/reading` | `telc_c1_reading` | C1 reading practice |
| `/telc/c1/writing` | `telc_c1_writing` | C1 writing practice |
| `/telc/c1/speaking` | `telc_c1_speaking` | C1 speaking practice |
| `/telc/c1/listening` | `telc_c1_listening` | C1 listening practice |
| `/telc/vocabulary` | `vocabulary` | Vocabulary hub |
| `/telc/mywords` | `mywords` | Saved words |
| `/telc/drillshub` | `drillshub` | Drills hub |
| `/telc/langcert` | `langcert-hub` | Language cert hub |

---

## 2. Initial View System

### 2.1 How It Works

The `App` component accepts an `initialView` prop from the Router. This prop determines:
- The initial view state
- What data to load
- How to navigate

```jsx
// Router.jsx passes initialView
<Route path="/telc/b2" element={
  <ProtectedRoute>
    <App initialView="telc-b2-hub" />
  </ProtectedRoute>
} />
```

### 2.2 InitialView Values

| initialView | View State | Description |
|-------------|------------|-------------|
| `telc-b1-hub` | BrandTestHub | B1 hub with mock list |
| `telc-b2-hub` | BrandTestHub | B2 hub with mock list |
| `telc-c1-hub` | BrandTestHub | C1 hub with mock list |
| `telc-b1-mini-test` | lesson | Start mini test immediately |
| `telc-b2-mini-test` | lesson | Start mini test immediately |
| `telc-c1-mini-test` | lesson | Start mini test immediately |
| `telc_b1_reading` | lesson | B1 reading exercise |
| `vocabulary` | drillsHub | Vocabulary hub |
| `drillshub` | drillsHub | Drills hub |
| `mywords` | mywords | Saved vocabulary |

### 2.3 NavigationResolver Flow

`NavigationResolver.resolvePath(initialView)` returns a plan object:

```javascript
{
  view: 'telc-b2-hub',           // Main view to render
  viewHistory: ['telc-b2-hub'],   // For back navigation
  activeCategory: null,          // For drills/vocab hubs
  activeSection: null,           // For task selection
  triggerTask: null,             // If present, start this task
  triggerFullTest: null          // If present, start full test
}
```

---

## 3. App Component State & Props

### 3.1 Main State Variables

```javascript
const [view, setView] = useState(initialView || 'telc-b2-hub');
const [viewHistory, setViewHistory] = useState([initialView || 'telc-b2-hub']);
const [activeTest, setActiveTest] = useState(null);
const [activeCategory, setActiveCategory] = useState(null);
const [activeSection, setActiveSection] = useState(null);
const [activeLesson, setActiveLesson] = useState(null);
const [activeSectionIndex, setActiveSectionIndex] = useState(0);
const [activePassageIndex, setActivePassageIndex] = useState(0);
const [activeSkillTab, setActiveSkillTab] = useState(0);
const [userAnswers, setUserAnswers] = useState({});
const [lessonResults, setLessonResults] = useState({ accuracy: 0, earnedXP: 0, isPerfect: false });
const [isReviewMode, setIsReviewMode] = useState(false);
```

### 3.2 Key Handler Functions

| Function | Purpose |
|----------|---------|
| `handleStartTask(taskMetadata)` | Creates lesson via LessonFactory and navigates to 'lesson' view |
| `handleFullTestSelection(testType, path)` | Creates full mock test |
| `handleCheckAnswers()` | Validates answers, calculates score |
| `handleFinishLesson()` | Navigate to results |
| `handleFinalClaim()` | Claim XP and navigate back to hub |

### 3.3 BrandTestHub Props

```jsx
<BrandTestHub 
  activeTest={{ title: 'TELC B2' }}  // Exam title for display
  level="b2"                          // Current level
  EXTRA_TOOLS={EXTRA_TOOLS}          // Array of extra practice tools
  onSelectModule={handleSelectModule} // Navigate to vocab/drils hub
  onOpenPaywall={() => setShowPaywall(true)} // Show paywall modal
  onSelectPath={(path, skill) => {...}} // Handle mock/skill selection
  onStartSkill={(skill, level) => {...}} // Start random skill exercise
  onShowDescription={() => navigateToView('description')} // Show exam info
/>
```

---

## 4. Lesson Creation Flow

### 4.1 LessonFactory.create()

Central entry point for creating lessons:

```javascript
const lesson = LessonFactory.create(taskMetadata);
```

**taskMetadata patterns:**

| ID Pattern | Creates | Source |
|------------|---------|--------|
| `telc-b2-mini-test` | Full mini test with all 6 skills | `generateMiniTest()` |
| `telc-b2-single-exercise` | Single random exercise | `createMiniTest()` |
| `random-mock` | Full random mock | `pluckRandomFullMock()` |
| `atom-skill` | Random skill exercise | `pluckRandom()` |

### 4.2 Full Mock Creation

```javascript
handleFullTestSelection(path.split('-')[1], path);
// path: 'telc-b2-mock-1'
// Creates: Full mock with 6 skill sections
```

### 4.3 Section Order in Full Mock

```javascript
// LessonFactory.createFullMockFromMock()
sections order:
1. vocabulary (unshifted - appears first)
2. reading passages (flattened)
3. language-elements
4. listening sections
5. speaking sections
6. writing sections
```

---

## 5. Engine Component & Skill Rendering

### 5.1 Engine Props

```jsx
<Engine 
  activeLesson={activeLesson}        // Current lesson object
  activeSectionIndex={0}             // Current section index
  activePassageIndex={0}             // Current passage index
  userAnswers={userAnswers}          // User's answers { questionId: value }
  onUpdateAnswers={handleUpdateAnswer} // Update single answer
  onCheckAnswers={handleCheckAnswers}  // Submit/check all answers
  isReviewMode={false}               // Review mode flag
  availableSections={[]}             // All sections for nav
  activeSkillTab={0}                 // Current skill tab
  setActiveSectionIndex={fn}         // Navigate sections
  setActivePassageIndex={fn}         // Navigate passages
  setIsReviewMode={fn}               // Toggle review
  setActiveSkillTab={fn}             // Switch skill tabs
  availableSkills={[]}               // List of skills
/>
```

### 5.2 Skill Detection Logic

Engine determines which block to render based on:

```javascript
const skill = activeLesson?.skill || currentSection?.skill;
const lessonType = activeLesson?.type;

// Render priority:
// 1. ReadingBlock: 'ielts-complex', 'full-mock' + reading, 'READING', skill='reading'
// 2. LanguageElementsBlock: skill='language-elements', 'LANGUAGE_ELEMENTS'
// 3. ListeningBlock: skill='listening', 'LISTENING'
// 4. WritingBlock: skill='writing', 'WRITING'
// 5. SpeakingBlock: skill='speaking', 'SPEAKING'
// 6. FlashcardBlock: skill='vocab', 'VOCAB', 'VOCAB_FLASHCARDS'
// 7. QuestionDispatcher: fallback for drills
```

### 5.3 Block-Specific Props

**ReadingBlock / ListeningBlock:**
```jsx
<ReadingBlock 
  data={currentPassage}           // Passage/question data
  userAnswers={userAnswers}
  onUpdate={onUpdateAnswers}
  onCheckAnswers={onCheckAnswers}
  isReviewMode={isReviewMode}
  showCheckAnswers={true}
  sections={availableSections}   // For section navigation
  activeSkillTab={0}
  activeSectionIndex={0}
  setActiveSectionIndex={fn}
  setActivePassageIndex={fn}
  setIsReviewMode={fn}
  setActiveSkillTab={fn}
  availableSkills={[]}
  allSections={availableSections}
/>
```

**WritingBlock / SpeakingBlock:**
```jsx
<WritingBlock 
  data={writingTask}              // Writing task with prompt
  onComplete={onCheckAnswers}      // Submit response
  onCheckAnswers={onCheckAnswers}
  isReviewMode={isReviewMode}
  showCheckAnswers={true}
  sections={availableSections}
  // ... navigation props
/>
```

**FlashcardBlock:**
```jsx
<FlashcardBlock 
  data={vocabData}                // Vocab with words array
  onComplete={onCheckAnswers}
  onNavigateToMyWords={fn}       // Save word to mywords
  sections={availableSections}
  // ... navigation props
/>
```

---

## 6. Data Flow Summary

### 6.1 Free Mock Flow

```
/free-mock/b2 
  → Router passes initialView="telc-b2-mini-test"
  → App useEffect calls resolvePath("telc-b2-mini-test")
  → Returns plan with triggerTask: { id: 'telc-b2-mini-test', skill: 'mini-test', level: 'b2' }
  → handleStartTask(taskMetadata)
  → LessonFactory.create() detects 'mini-test' in id
  → generateMiniTest('b2') returns lesson with 6 sections
  → setActiveLesson(lesson), navigateToView('lesson')
  → Engine renders first section (vocab)
```

### 6.2 Hub to Skill Test Flow

```
BrandTestHub → click "Specific Skills"
  → onSelectPath('skill-tests')
  → navigateToView('skillTests')
  → Render skillTests view with 6 skill cards
  → click "Reading"
  → pluckRandom('reading')
  → setActiveLesson(exercise), navigateToView('lesson')
  → Engine renders ReadingBlock
```

### 6.3 Full Mock Flow

```
BrandTestHub → click mock card "Start Mock"
  → onSelectPath('telc-b2-mock-1')
  → handleFullTestSelection('b2', 'telc-b2-mock-1')
  → LessonFactory.prepareFullTest('b2', 'telc-b2-mock-1')
  → getMockById('telc-b2-mock-1') → raw mock JSON
  → createFullMockFromMock(mock, 'b2') → structured lesson
  → setActiveLesson(fullMock), navigateToView('lesson')
  → Engine renders with all 6 skills in tabs
```

---

## 7. Mock Data Structure

### 7.1 Mock JSON Schema

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
    sections: [
      {
        id: "reading-part1",
        passages: [
          {
            id: "p1",
            title: "Passage Title",
            type: "reading-practice",
            content: [{ id: "1", text: "..." }],
            subTasks: [
              {
                type: "mcq",
                instruction: "...",
                questions: [
                  { id: "1", text: "?", options: ["a","b","c"], answer: 0 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  
  writing: {
    title: "Writing",
    time: 60,
    sections: [
      {
        id: "writing-1",
        title: "Task 1",
        type: "WRITING",
        prompt: "Write about..."
      }
    ]
  },
  
  listening: {
    title: "Listening",
    time: 30,
    sections: [
      {
        id: "listening-1",
        audio: "url",
        transcript: "...",
        subTasks: [...]
      }
    ]
  },
  
  speaking: {
    title: "Speaking",
    time: 15,
    sections: [
      { id: "s1", type: "interview", topics: [...] },
      { id: "s2", type: "discussion", ... },
      { id: "s3", type: "collaborative", ... }
    ]
  },
  
  languageElements: {
    title: "Language Elements",
    time: 90,
    sections: [
      {
        id: "le-part1",
        passages: [{
          content: [{ id: "1", text: "text with ____(21)____ gaps" }],
          subTasks: [{ type: "mcq", questions: [...] }]
        }]
      },
      {
        id: "le-part2",
        passages: [{
          content: [{ id: "1", text: "..." }],
          subTasks: [{ type: "gap-fill-tokens", tokens: [...], answers: [...] }]
        }]
      }
    ]
  }
}
```

---

## 8. Skill Types & XP Values

| Skill | Plucker Function | XP Reward | Block Component |
|-------|------------------|-----------|-----------------|
| Reading | `pluckRandom('reading', level)` | +300 | ReadingBlock |
| Listening | `pluckRandom('listening', level)` | +250 | ListeningBlock |
| Writing | `pluckRandom('writing', level)` | +400 | WritingBlock |
| Speaking | `pluckRandom('speaking', level)` | +350 | SpeakingBlock |
| Vocabulary | `pluckRandom('vocabulary', level)` | +150 | FlashcardBlock |
| Language Elements | `pluckRandom('language-elements', level)` | +200 | LanguageElementsBlock |

---

## 9. Access Control (Tier System)

### 9.1 User Tiers
- **Bronze**: Free tier (default for non-signed-in users)
- **Silver**: Basic tier (signed-in users)
- **Gold**: Premium tier

### 9.2 Mock Tiers
Each mock has `tier: "bronze" | "silver" | "gold"`

### 9.3 Access Logic
```javascript
const canAccess = (mockTier, userTier) => {
  if (mockTier === 'bronze') return true;
  if (mockTier === 'silver' && ['silver', 'gold'].includes(userTier)) return true;
  if (mockTier === 'gold' && userTier === 'gold') return true;
  return false;
};
```

---

## 10. Speaking Part Types

| Part | Type | Structure |
|------|------|-----------|
| Part 1 | `interview` | Topics with questions |
| Part 2 | `discussion` | Text + discussion questions |
| Part 3 | `collaborative` | Topic with suggestions + questions |

### Full Mock vs Mini Test
- **Full Mock**: Returns all 3 parts, Engine renders with tabs
- **Mini Test / Skill Test**: Returns single random part, no tabs
