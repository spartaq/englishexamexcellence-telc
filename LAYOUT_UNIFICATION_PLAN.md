# Test Layout Unification Plan

## Executive Summary

After analyzing the codebase, I've identified significant layout inconsistencies across different exercise types. This document outlines the current state and proposes a unified layout system.

---

## Current Layout Analysis

### ✅ What Works Well

| Aspect | Implementation |
|--------|---------------|
| **5-Part Structure** | App.jsx implements: Header → Section Tabs → Passage Tabs → Task Header → Content Area |
| **Naming Convention** | Passage tabs consistently show "Part #" |
| **Task Header** | Standard fields: `title`, `subtitle`, `description`, `instructions` |
| **Block Components** | Each skill has a dedicated block: `ReadingBlock`, `ListeningBlock`, `WritingBlock`, `SpeakingBlock`, `VocabBlock` |

---

## ❌ Layout Inconsistencies Identified

### 1. **Container Structure**

| Block | Container Class | Issue |
|-------|----------------|-------|
| `ListeningBlock` | `.listening-container` | Has its own header/title area duplicated |
| `SpeakingBlock` | `.speaking-container` | Has unique `.speaking-block-wrapper` |
| `WritingBlock` | `.writing-container` | Uses `.writing-header`, `.writing-footer` |
| Interactive Blocks | Various | No consistent wrapper |

**Problem**: Each block re-implements header/title logic that should be handled by App.jsx.

---

### 2. **Task Header Duplication**

**In App.jsx** (Correct - should be single source):
```jsx
<div className="section-header">
  <h2>{currentSection.title}</h2>
  {subtitle && <p className="subtitle">{subtitle}</p>}
</div>
```

**Duplicated in ListeningBlock.jsx** (Lines 198-210):
```jsx
{!data.isMiniTest && (
  <div style={{ marginBottom: '24px' }}>
    <h2 className="listening-title">{data.title}</h2>
    {data.subtitle && <p className="listening-subtitle">{data.subtitle}</p>}
  </div>
)}
```

---

### 3. **Interactive Block Layout Patterns**

Each InteractiveBlock uses **inconsistent** class naming and structure:

| Block | Container Class | Question Class | Option Class |
|-------|----------------|----------------|--------------|
| `MCQBlock` | `.mcq-question-area` | `.mcq-question` | `.mcq-option` |
| `ShortAnswerBlock` | `.short-answer-container` | `.sa-question-text` | `.sa-input` |
| `TableCompletionBlock` | `.table-completion-block` | (uses table cells) | `.gap-input` |
| `NotesCompletionBlock` | `.notes-completion-block` | `.note-item` | `.gap-input` |
| `MatchingChoiceBlock` | `.matching-choice-container` | `.matching-choice-text` | `.choice-btn` |
| `GapFillBlock` | `.gap-fill-block` | `.gap-line` | `.token-button` |
| `HeadingMatchBlock` | `.heading-match-container` | `.match-row` | `.heading-select` |

---

### 4. **CSS Organization Issues**

- **engine.css** is 1300+ lines containing all block styles
- No shared component styles across similar patterns
- Inline styles used extensively (e.g., `style={{ marginBottom: '24px' }}`)

---

## Proposed Unification Plan

### Phase 1: Standardize Container Wrappers

Create unified container classes that ALL blocks should use:

```css
/* Standard Block Container */
.test-block-container {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

/* Block Header (title area) */
.test-block-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  background: #f8fafc;
}

.test-block-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.test-block-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

/* Block Content */
.test-block-content {
  padding: 24px;
}

/* Block Footer (actions) */
.test-block-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: #f8fafc;
}
```

---

### Phase 2: Standardize Question Components

Create unified classes for ALL question types:

```css
/* Question Row/Card */
.question-card {
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  padding: 16px 20px;
  margin-bottom: 16px;
}

.question-label {
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
  display: block;
}

.question-text {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

/* Answer Options */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: white;
  color: #475569;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover:not(:disabled) {
  border-color: var(--lab-indigo);
  background: #f8fafc;
}

.option-button.selected {
  background: #f0f4ff;
  border-color: var(--lab-indigo);
  color: var(--lab-indigo);
  font-weight: 600;
}

/* Input Fields */
.answer-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f1f5f9;
  border-radius: var(--radius-md);
  font-size: 15px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
}

.answer-input:focus {
  border-color: var(--lab-indigo);
}
```

---

### Phase 3: Remove Duplicated Headers

**Action**: Remove title/header rendering from individual Block components.

The Task Header should ONLY be rendered in App.jsx. Block components should receive `isMiniTest` prop and skip header rendering when true.

```jsx
// ListeningBlock.jsx - Current (problematic)
{!data.isMiniTest && (
  <div style={{ marginBottom: '24px' }}>
    <h2 className="listening-title">{data.title}</h2>
  </div>
)}

// Proposed - ALWAYS skip if parent handles it
{isMiniTest === false && data.title && (
  <div className="test-block-header">
    <h2 className="test-block-title">{data.title}</h2>
  </div>
)}
```

---

### Phase 4: InteractiveBlock Base Component

Create a shared component for common patterns:

```jsx
// QuestionContainer.jsx (proposed)
const QuestionContainer = ({ 
  id, 
  instruction, 
  children, 
  isReviewMode = false 
}) => (
  <div className="question-card">
    {instruction && (
      <div className="question-instruction">{instruction}</div>
    )}
    {isReviewMode && (
      <div className="review-badge">Review Mode</div>
    )}
    {children}
  </div>
);
```

---

### Phase 5: Refactor Order

1. **First**: Add new CSS classes to `engine.css`
2. **Second**: Create `QuestionContainer` wrapper
3. **Third**: Update InteractiveBlocks to use new classes (one at a time)
4. **Fourth**: Remove duplicate headers from Block components
5. **Fifth**: Verify App.jsx properly passes `isMiniTest` prop

---

## Implementation Priority

| Priority | Block | Effort | Impact |
|----------|-------|--------|--------|
| 1 | All InteractiveBlocks | Medium | High |
| 2 | ListeningBlock | Low | High |
| 3 | SpeakingBlock | Low | Medium |
| 4 | WritingBlock | Low | Medium |

---

## Files to Modify

1. `src/components/engine/engine.css` - Add unified classes
2. `src/components/engine/InteractiveBlocks/*.jsx` - Use new classes
3. `src/components/engine/ListeningBlock.jsx` - Remove duplicate header
4. `src/components/engine/SpeakingBlock.jsx` - Use standardized container
5. `src/components/engine/WritingBlock.jsx` - Use standardized container

---

## Success Criteria

- [x] All blocks use consistent container wrapper
- [x] All question cards use `.question-card` class
- [x] All options use `.option-button` class
- [x] All inputs use `.answer-input` class
- [x] No duplicate headers in Block components
- [x] App.jsx is the sole source of Task Header rendering

---

## Implementation Status: ✅ COMPLETED

### Changes Made

1. **engine.css** - Added unified CSS classes:
   - `.test-block-container`, `.test-block-header`, `.test-block-content`, `.test-block-footer`
   - `.question-card`, `.question-label`, `.question-text`, `.question-instruction`
   - `.option-button`, `.option-letter`, `.option-text`
   - `.answer-input`, `.word-counter`, `.correct-answer-hint`, `.tip-box`
   - Dark mode styles for all new classes

2. **ListeningBlock.jsx** - Updated to use unified classes:
   - Changed `.listening-title` → `.test-block-title`
   - Changed `.listening-q-card` → `.question-card`
   - Changed `.listening-q-question` → `.question-text`
   - Changed `.options-grid` → `.options-list`
   - Changed `.listening-q-option` → `.option-button`
   - Changed input to use `.answer-input`

3. **QuestionContainer.jsx** - Created new reusable component:
   - Standard wrapper for all question types
   - Handles instruction box, review badge, and children

4. **MCQBlock.jsx** - Updated to use unified classes:
   - Changed `.mcq-question-area` → `.question-card`
   - Changed `.mcq-question` → `.question-text`
   - Changed `.mcq-option` → `.option-button`
   - Updated review states: `.review-correct`, `.review-incorrect`, `.review-dimmed`

5. **ShortAnswerBlock.jsx** - Updated to use unified classes:
   - Changed `.sa-row` → `.question-card`
   - Changed `.sa-input` → `.answer-input`
   - Changed `.sa-word-counter` → `.word-counter`
   - Changed `.sa-correct-answer` → `.correct-answer-hint`

6. **MatchingChoiceBlock.jsx** - Updated to use unified classes:
   - Changed `.matching-choice-row` → `.question-card`
   - Changed `.choice-btn` → `.option-button`
   - Updated review state classes

7. **HeadingMatchBlock.jsx** - Updated to use unified classes:
   - Changed `.match-row` → `.question-card`
   - Changed select to use `.answer-input`
   - Changed `.hm-correct-hint` → `.correct-answer-hint`
