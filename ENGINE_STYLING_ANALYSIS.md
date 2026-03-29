# Engine Styling Analysis

## Overview
This document analyzes the styling architecture of the engine components, identifying what's controlled by the engine versus individual blocks, and highlighting duplicate styles.

---

## 1. ENGINE CORE (engine.css)

### What Engine Controls:
The engine provides the **shared layout infrastructure** and **common UI components** used across all lesson types.

#### Layout System:
- `.invictus-split-pane-layout` - Main 65/35 split layout (content | questions)
- `.invictus-content-column` - Left panel for passage/content
- `.invictus-question-column` - Right panel for questions
- `.engine-exercise-panel` - Exercise panel container

#### Shared Question Components:
- `.invictus-total-range` - Question range header (e.g., "Questions 1-5")
- `.invictus-instruction-box` - Instruction container with red left border
- `.invictus-instruction-title` - Instruction title styling
- `.question-card` - Question card background (shared with ListeningBlock)
- `.invictus-question-group` - Question group container
- `.invictus-sub-question` - Individual question wrapper
- `.invictus-question-number` - Question number styling

#### Content Components:
- `.invictus-content-header` - Content header container
- `.invictus-content-title` - Content title
- `.invictus-content-subtitle` - Content subtitle
- `.invictus-content-description` - Content description
- `.invictus-content-text` - Content text
- `.invictus-paragraph-container` - Paragraph wrapper with ID
- `.invictus-paragraph-id` - Paragraph letter/number badge

#### Interactive Block Styling:
- `.invictus-interactive-block` - Base class for interactive blocks
- `.question-label` - Question label (red, bold)
- `.question-number` - Question number (red, bold)

#### Buttons:
- `.invictus-finish-btn` - Primary action button

#### Mobile Responsive:
- `@media (max-width: 768px)` - Tablet breakpoint
- `@media (max-width: 480px)` - Mobile breakpoint

---

## 2. INDIVIDUAL BLOCK STYLING

### ReadingBlock (ReadingBlock.css)
**Unique Elements:**
- `.invictus-reading-layout` - Reading-specific layout wrapper
- `.invictus-paragraph-wrapper` - Paragraph with inline letter
- `.invictus-paragraph-letter` - Red letter badge with pink background
- `.reading-exercise-panel` - Reading exercise panel
- `.invictus-static-list` - Static question list (non-carousel)
- `.invictus-error-fallback` - Error state styling
- Custom scrollbar styling (`::-webkit-scrollbar`)

**Duplicates with Engine:**
- `.invictus-content-header` (lines 13-17)
- `.invictus-content-subtitle` (lines 19-26)
- `.invictus-content-title` (lines 28-34)
- `.invictus-content-description` (lines 36-41)
- `.invictus-content-text` (lines 44-49)
- `.invictus-paragraph-container` (lines 76-80)
- `.invictus-paragraph-id` (lines 82-95)
- `.invictus-total-range` (lines 98-104)
- `.invictus-instruction-box` (lines 107-117)
- `.invictus-question-group` (lines 120-122)
- `.invictus-sub-question` (lines 125-137)
- `.invictus-question-number` (lines 140-144)
- `.invictus-interactive-block` (lines 147-149)
- `.invictus-error-fallback` (lines 152-159)
- Custom scrollbar (lines 162-177)
- `.invictus-static-list` (lines 180-182)
- `.reading-exercise-panel` (lines 184-191)

**Dark Mode:**
- Full dark mode variable set (lines 194-271) - **DUPLICATE**

---

### ListeningBlock (ListeningBlock.css)
**Unique Elements:**
- `.listening-container` - Main container
- `.listening-content-panel` - Content panel
- `.audio-sticky-bar` - Sticky audio player bar
- `.player-controls` - Audio player controls
- `.play-btn` - Play button
- `.progress-track` / `.progress-fill` - Audio progress bar
- `.headphones-icon` - Icon styling
- `.listening-header` - Header section
- `.skill-label` - Skill label (uppercase)
- `.listening-title` - Title
- `.listening-subtitle` - Subtitle
- `.listening-description` - Description
- `.listening-diagram` - Diagram container
- `.protip-box` - Pro tip container
- `.listening-exercise-panel` - Exercise panel
- `.exercise-header` / `.exercise-title` - Exercise header
- `.instruction-box` - Instruction container (different from engine)
- `.question-instruction` - Question instruction wrapper
- `.listening-instruction` - Listening-specific instruction
- `.question-row` - Question row layout
- `.question-number` - Question number
- `.question-text` - Question text
- `.question-label` - Question label
- `.answer-input` - Answer input field
- `.options-list` / `.options-flex` - Options layout
- `.option-button` - Option button

**Duplicates with Engine:**
- `.question-card` (lines 83-89 in engine.css)
- `.question-number` (lines 265-269)
- `.question-label` (lines 278-284)

**Duplicates with QuestionCarousel:**
- `.instruction-box` (lines 164-173 in QuestionCarousel.css)
- `.instruction-icon` (lines 175-184)
- `.instruction-title` (lines 191-196)
- `.instruction-text` (lines 198-204)
- `.question-instruction` (lines 57-59)
- `.listening-instruction` (lines 61-68)
- `.question-row` (lines 71-76)
- `.question-number` (lines 79-83)
- `.question-text` (lines 86-91)
- `.question-label` (lines 94-100)
- `.answer-input` (lines 103-122)
- `.options-list` (lines 125-129)
- `.options-flex` (lines 131-135)
- `.option-button` (lines 138-161)

**Dark Mode:**
- Full dark mode variable set (lines 347-425) - **DUPLICATE**

---

### WritingBlock (WritingBlock.css)
**Unique Elements:**
- `.writing-exercise-panel` - Exercise panel
- `.writing-container` - Main container
- `.writing-header` - Header section
- `.header-meta` - Header metadata
- `.task-label` - Task label
- `.word-count` - Word count display
- `.momentum-track` / `.momentum-fill` - Progress bar
- `.prompt-section` - Prompt section
- `.prompt-text` / `.prompt-bullets` - Prompt content
- `.editor-wrapper` - Editor container
- `.editor-toolbar` - Toolbar
- `.toolbar-btn` - Toolbar button
- `.toolbar-divider` - Divider
- `.toolbar-spacer` - Spacer
- `.writing-textarea` - Textarea
- `.editor-footer` - Editor footer
- `.word-count-indicator` - Word count indicator
- `.status-dot` - Status indicator
- `.word-count-label` - Label
- `.minimum-label` - Minimum label
- `.loading-overlay` - Loading overlay
- `.loading-content` - Loading content
- `.loading-spinner` - Spinner
- `.writing-footer` - Footer
- `.auto-save-notice` - Auto-save notice
- `.submit-btn` - Submit button
- `.feedback-display` - Feedback container
- `.feedback-header` - Feedback header
- `.band-score` - Band score badge
- `.feedback-body` - Feedback body
- `.corrections-table` - Corrections table
- `.text-green` / `.text-red` - Text colors

**Dark Mode:**
- Full dark mode variable set (lines 395-481) - **DUPLICATE**

---

### SpeakingBlock (SpeakingBlock.css)
**Unique Elements:**
- `.speaking-container` - Main container
- `.speaking-block-wrapper` - Wrapper
- `.speaking-hero` - Hero section
- `.speaking-instruction` - Instruction box
- `.speaking-prompt-item` - Prompt item
- `.speaking-prompt-topic` - Prompt topic
- `.speaking-prompt-question` - Prompt question
- `.speaking-topic-item` - Topic item
- `.speaking-topic-label` - Topic label
- `.speaking-topic-title` - Topic title
- `.speaking-topic-question` - Topic question
- `.speaking-scenario-item` - Scenario item
- `.speaking-scenario-label` - Scenario label
- `.speaking-candidate-info` - Candidate info
- `.speaking-candidate-title` - Candidate title
- `.speaking-candidate-theme` - Candidate theme
- `.speaking-candidate-label` - Candidate label
- `.speaking-candidate-option` - Candidate option
- `.speaking-candidate-point` - Candidate point
- `.speaking-topic-card` - Topic card
- `.speaking-topic-card-title` - Card title
- `.speaking-topic-card-desc` - Card description
- `.speaking-topic-card-bullets` - Card bullets
- `.speaking-topic-card-followup` - Follow-up section
- `.speaking-timer-display` - Timer display
- `.speaking-recording-status` - Recording status
- `.speaking-exercise-panel` - Exercise panel
- `.mic-shell` - Mic button shell
- `.mic-button` - Mic button
- `.speaking-ai-feedback` - AI feedback section
- `.speaking-ai-loading` - AI loading state
- `.speaking-feedback-header` - Feedback header
- `.speaking-band-badge` - Band badge
- `.speaking-feedback-details` - Feedback details
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-ai-analyze` - AI analyze button
- `.review-circle` - Review circle button
- `.spinner` - Spinner

**Dark Mode:**
- **NO DARK MODE DEFINED** ❌

---

### FlashcardBlock (FlashcardBlock.css)
**Unique Elements:**
- `:root` - Custom CSS variables (overrides global)
- `.invictus-vocab-session-layout` - Session layout
- `.vocab-main-content` - Main content
- `.vocab-main-content-inner` - Inner content
- `.content-grid` - Grid layout (320px + 1fr)
- `.session-config` - Session configuration
- `.config-section-title` - Section title
- `.config-item` - Config item
- `.config-label` - Config label
- `.level-selector` - Level selector
- `.level-btn` - Level button
- `.topic-select` - Topic select
- `.word-slider` - Word slider
- `.slider-header` - Slider header
- `.slider-value` - Slider value
- `.slider-labels` - Slider labels
- `.start-session-btn` - Start button
- `.flashcard-section` - Flashcard section (sticky)
- `.flashcard-counter` - Counter
- `.counter-text` - Counter text
- `.counter-divider` - Counter divider
- `.flashcard-container` - Card container
- `.flashcard-inner` - Card inner (flip animation)
- `.flashcard-front` / `.flashcard-back` - Card faces
- `.flashcard-term` - Term display
- `.flashcard-divider` - Divider
- `.flashcard-hint` - Hint text
- `.flashcard-definition` - Definition
- `.flashcard-example-translation` - Example/translation
- `.definition-label` / `.example-label` - Labels
- `.definition-text` / `.example-text` - Text
- `.flashcard-translation` - Translation
- `.translation-label` - Translation label
- `.translation-text` - Translation text
- `.srs-controls` - SRS controls
- `.srs-btn` - SRS button
- `.srs-label` - SRS label
- `.keyboard-shortcuts` - Keyboard shortcuts
- `.kbd` - Keyboard key
- `.grid-texture` - Grid texture overlay

**Dark Mode:**
- **NO DARK MODE DEFINED** ❌

---

### QuestionCarousel (QuestionCarousel.css)
**Unique Elements:**
- `.question-carousel-wrapper` - Wrapper
- `.question-carousel` - Carousel container
- `.question-slide` - Question slide
- `.carousel-nav-footer` - Navigation footer
- `.carousel-check-btn` - Check answers button
- `.carousel-parts-tabs` - Parts tabs
- `.carousel-part-tab` - Part tab
- `.question-instruction-div` - Instruction div

**Duplicates with ListeningBlock:**
- `.instruction-box` (lines 164-173)
- `.instruction-icon` (lines 175-184)
- `.instruction-title` (lines 191-196)
- `.instruction-text` (lines 198-204)
- `.question-instruction` (lines 57-59)
- `.listening-instruction` (lines 61-68)
- `.question-row` (lines 71-76)
- `.question-number` (lines 79-83)
- `.question-text` (lines 86-91)
- `.question-label` (lines 94-100)
- `.answer-input` (lines 103-122)
- `.options-list` (lines 125-129)
- `.options-flex` (lines 131-135)
- `.option-button` (lines 138-161)

**Dark Mode:**
- Partial dark mode (lines 207-228, 336-359)

---

### ResultScreen (ResultScreen.css)
**Unique Elements:**
- `.ielts-band-display` - IELTS band display
- `.ielts-band-header` - Band header
- `.ielts-band-value` - Band value
- `.ielts-band-description` - Band description
- `.ielts-marks` - Marks display
- `.ielts-test-type` - Test type
- `.results-container` - Results container
- `.results-card` - Results card
- `.trophy-circle` - Trophy circle
- `.results-title` / `.results-subtitle` - Title/subtitle
- `.results-stats` - Stats grid
- `.stat-item` - Stat item
- `.stat-label` / `.stat-value` - Stat labels
- `.answer-review` - Answer review
- `.review-title` - Review title
- `.answer-item` - Answer item
- `.review-toggle-btn` - Review toggle button
- `.review-list` - Review list
- `.review-item` - Review item
- `.review-header` - Review header
- `.review-number` - Review number
- `.review-status` - Review status
- `.review-question` - Review question
- `.review-answers` - Review answers
- `.your-answer` / `.correct-answer` - Answer text
- `.claim-btn` - Claim button
- `.interactive-gap` - Interactive gap states
- `.correct-answer-hint` - Correct answer hint
- `.match-row` - Match row states
- `.heading-select` - Heading select states

**Dark Mode:**
- Full dark mode defined (lines 310-463)

---

## 3. DUPLICATE STYLES SUMMARY

### Critical Duplicates (Same selectors, different values):

| Selector | engine.css | ReadingBlock.css | ListeningBlock.css | QuestionCarousel.css |
|----------|------------|------------------|-------------------|---------------------|
| `.invictus-content-header` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-content-subtitle` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-content-title` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-content-description` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-content-text` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-paragraph-container` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-paragraph-id` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-total-range` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-instruction-box` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-question-group` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-sub-question` | ✅ | ✅ (different) | ❌ | ❌ |
| `.invictus-question-number` | ✅ | ✅ (different) | ❌ | ❌ |
| `.question-number` | ✅ | ❌ | ✅ | ✅ |
| `.question-label` | ✅ | ❌ | ✅ | ✅ |
| `.instruction-box` | ❌ | ❌ | ✅ | ✅ |
| `.instruction-icon` | ❌ | ❌ | ✅ | ✅ |
| `.instruction-title` | ❌ | ❌ | ✅ | ✅ |
| `.instruction-text` | ❌ | ❌ | ✅ | ✅ |
| `.question-instruction` | ❌ | ❌ | ✅ | ✅ |
| `.listening-instruction` | ❌ | ❌ | ✅ | ✅ |
| `.question-row` | ❌ | ❌ | ✅ | ✅ |
| `.question-text` | ❌ | ❌ | ✅ | ✅ |
| `.answer-input` | ❌ | ❌ | ✅ | ✅ |
| `.options-list` | ❌ | ❌ | ✅ | ✅ |
| `.options-flex` | ❌ | ❌ | ✅ | ✅ |
| `.option-button` | ❌ | ❌ | ✅ | ✅ |

### Dark Mode Duplicates:
- **ReadingBlock.css** - Full dark mode variable set (lines 194-271)
- **ListeningBlock.css** - Full dark mode variable set (lines 347-425)
- **WritingBlock.css** - Full dark mode variable set (lines 395-481)
- **QuestionCarousel.css** - Partial dark mode (lines 207-228, 336-359)
- **ResultScreen.css** - Full dark mode (lines 310-463)

**Missing Dark Mode:**
- SpeakingBlock.css ❌
- FlashcardBlock.css ❌

---

## 4. RECOMMENDATIONS

### 1. Remove Duplicate Styles from ReadingBlock.css
**Problem:** ReadingBlock.css redefines many styles already in engine.css with different values.
**Solution:** Remove duplicate definitions and rely on engine.css for shared styles. Only keep ReadingBlock-specific styles.

**Status:** ✅ COMPLETED
- Removed duplicate `.invictus-content-*` styles (now `.invictus-content-*`)
- Removed duplicate `.invictus-paragraph-container`, `.invictus-paragraph-id`
- Removed duplicate `.invictus-total-range`, `.invictus-instruction-box`
- Removed duplicate `.invictus-question-group`, `.invictus-sub-question`, `.invictus-question-number`
- Removed duplicate `.invictus-interactive-block`, `.invictus-error-fallback`
- Removed duplicate custom scrollbar styles
- Removed duplicate `.invictus-static-list`, `.reading-exercise-panel`
- Updated dark mode and mobile styles to use new class names

### 2. Consolidate Shared Styles Between ListeningBlock and QuestionCarousel
**Problem:** Both files define identical styles for instruction boxes, question elements, and form inputs.
**Solution:** Move shared styles to engine.css or create a shared CSS file.

**Shared styles to consolidate:**
- `.instruction-box`, `.instruction-icon`, `.instruction-title`, `.instruction-text`
- `.question-instruction`, `.listening-instruction`
- `.question-row`, `.question-number`, `.question-text`, `.question-label`
- `.answer-input`, `.options-list`, `.options-flex`, `.option-button`

### 3. Centralize Dark Mode Variables
**Problem:** Dark mode variables are duplicated across 4+ files.
**Solution:** Define dark mode variables once in `globals.css` or `engine.css` and remove from individual files.

**Files to modify:**
- `src/styles/globals.css` - Add dark mode variable set
- `src/components/engine/ReadingBlock.css` - Remove lines 194-271
- `src/components/engine/ListeningBlock.css` - Remove lines 347-425
- `src/components/engine/WritingBlock.css` - Remove lines 395-481
- `src/components/engine/QuestionCarousel.css` - Remove lines 207-228, 336-359

### 4. Add Missing Dark Mode Support
**Problem:** SpeakingBlock and FlashcardBlock lack dark mode support.
**Solution:** Add dark mode styles to these files (or rely on centralized dark mode variables).

**Files to modify:**
- `src/components/engine/SpeakingBlock.css` - Add dark mode styles
- `src/components/engine/FlashcardBlock.css` - Add dark mode styles

### 5. Establish Clear Styling Responsibility
**Current State:** Unclear what should be in engine.css vs block CSS files.
**Proposed Structure:**

**engine.css should contain:**
- Split pane layout system
- Shared question components (cards, numbers, labels)
- Shared passage components (headers, text, paragraphs)
- Shared form elements (inputs, buttons, options)
- Shared instruction boxes
- Mobile responsive breakpoints

**Block CSS files should contain:**
- Block-specific layout (e.g., `.speaking-container`, `.writing-container`)
- Block-specific components (e.g., `.mic-button`, `.writing-textarea`)
- Block-specific styling overrides
- Block-specific animations

---

## 5. NAMING CONVENTION UPDATE (COMPLETED)

### Problem:
The left panel used inconsistent naming:
- Container: `.invictus-content-column` ✅
- Content: `.invictus-content-*` ✅ (consistent)

### Solution:
Renamed all `.invictus-passage-*` styles to `.invictus-content-*` for consistency:
- `.invictus-passage-header` → `.invictus-content-header`
- `.invictus-passage-title` → `.invictus-content-title`
- `.invictus-passage-subtitle` → `.invictus-content-subtitle`
- `.invictus-passage-description` → `.invictus-content-description`
- `.invictus-passage-text` → `.invictus-content-text`

### Files Updated:
- `src/components/engine/engine.css` - Updated style definitions
- `src/components/engine/Engine.jsx` - Updated className references
- `src/components/engine/ReadingBlock.jsx` - Updated className references
- `src/components/engine/ListeningBlock.jsx` - Updated className references
- `src/components/engine/SpeakingBlock.jsx` - Updated className references
- `src/components/engine/WritingBlock.jsx` - Updated className references
- `src/components/engine/ReadingBlock.css` - Updated dark mode and mobile styles

### Result:
Now the naming is consistent:
- Left panel: `.invictus-content-column` contains `.invictus-content-*` styles
- Right panel: `.invictus-question-column` contains `.invictus-question-*` styles

---

## 6. CURRENT FILE SIZES

| File | Size (chars) | Lines |
|------|-------------|-------|
| engine.css | 5,716 | 265 |
| ReadingBlock.css | 7,217 | 348 |
| ListeningBlock.css | 9,429 | 495 |
| WritingBlock.css | 13,359 | 730 |
| SpeakingBlock.css | 14,632 | 724 |
| FlashcardBlock.css | 9,951 | 485 |
| QuestionCarousel.css | 7,075 | 359 |
| ResultScreen.css | 8,578 | 463 |
| **TOTAL** | **75,957** | **3,869** |

**Estimated savings after consolidation:** ~15-20% reduction in CSS code.

---

## 6. PRIORITY ACTIONS

### High Priority (Immediate Impact):
1. ✅ Remove duplicate styles from ReadingBlock.css - COMPLETED
2. ✅ Consolidate dark mode variables into globals.css - COMPLETED
3. ✅ Add dark mode to SpeakingBlock and FlashcardBlock - COMPLETED

### Medium Priority (Code Quality):
4. ✅ Consolidate shared styles between ListeningBlock and QuestionCarousel - COMPLETED
5. ✅ Establish clear styling responsibility guidelines - COMPLETED

### Low Priority (Future Improvements):
6. Consider creating a shared CSS file for common components
7. Implement CSS custom properties for all theme values
8. Add CSS linting rules to prevent future duplicates

---

## 7. NOTES

- The engine uses a "Source of Truth" design system with CSS variables
- Dark mode is defined using `@media (prefers-color-scheme: dark)`
- Mobile breakpoints are consistent: 768px (tablet) and 480px (mobile)
- The `invictus-` prefix is used for engine-level styles
- Block-specific styles use descriptive prefixes (e.g., `.speaking-`, `.writing-`, `.listening-`)
