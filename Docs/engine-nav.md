# Engine Navigation Documentation

## Components & Flow

### QuestionCarousel
Located: `src/components/engine/QuestionCarousel.jsx`

**Purpose**: Displays questions in a horizontal carousel with navigation

**Props**:
- `questions` - Array of questions to display
- `sections` - All skill sections (Vocab, Reading, Writing, etc.)
- `activeSectionIndex` - Current section index
- `setActiveSectionIndex` - **REQUIRED** - State setter to change sections
- `setActivePassageIndex` - For navigating passages
- `setIsReviewMode` - Toggle review mode
- `hasNextSection` - Boolean, is there a next section?

### Navigation Behavior

#### Parts Tabs (1, 2, 3...)
- **Click** calls `setActiveSectionIndex(sidx)` → navigates to that section
- **DO NOT** just use `setCurrentIndex()` - that only changes carousel position within current section
- Uses `activeSectionIndex` for active styling

#### Nav Arrows (← →)
- **Right arrow** on last question → calls `setActiveSectionIndex(activeSectionIndex + 1)` → next section
- **Left arrow** on first question → calls `setActiveSectionIndex(activeSectionIndex - 1)` → previous section
- Uses both carousel index AND parent state

### Key Code Patterns

**CORRECT - Tab click handler:**
```javascript
onClick={() => { 
  if (setActiveSectionIndex) setActiveSectionIndex(sidx); 
  if (setActivePassageIndex) setActivePassageIndex(0); 
  if (setIsReviewMode) setIsReviewMode(false);
  setCurrentIndex(idx);
  // scroll
}}
```

**WRONG - Just internal navigation:**
```javascript
// This doesn't update parent state - breaks navigation!
onClick={() => { 
  setCurrentIndex(idx); // ONLY updates internal state
}}
```

### questionFlattener.js
Located: `src/utils/questionFlattener.js`

**IMPORTANT**: `heading-match` should be in `ALWAYS_SELF_CONTAINED`
```javascript
// heading-match contains multiple passages (A, B, C, D paragraphs inside)
// It should stay as 1 carousel item that handles multiple questions internally
export const ALWAYS_SELF_CONTAINED = ['heading-match', 'notes-completion'];
```

**Why**: heading-match blocks have paragraphs A, B, C, D inside them. Each paragraph has questions. The heading-match component renders all paragraphs in one view - it's NOT designed to be split into multiple carousel slides.

If you see only 1 tab showing, check the data structure - the multiple passages might be nested differently in that specific mock.

### ReadingBlock.jsx
Located: `src/components/engine/ReadingBlock.jsx`

Must pass `hasNextSection` prop to QuestionCarousel:
```javascript
const currentSectionIdx = allSections.findIndex(s => s.skill === data?.skill);
const hasNextSection = currentSectionIdx >= 0 && currentSectionIdx < allSections.length - 1;

// Pass to QuestionCarousel
hasNextSection={hasNextSection}
```

## Testing Checklist

1. ✓ Parts tabs click navigates to correct section
2. ✓ Right arrow on last question → next section
3. ✓ Left arrow on first question → previous section  
4. ✓ Active tab highlights correctly: `className={\`carousel-part-tab ${activeSectionIndex === sidx ? 'active' : ''}\`}`
5. ✓ Check Answers button visible and functional

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Tabs don't navigate | Missing `setActiveSectionIndex()` call | Call parent state setter |
| Only 1 tab shows | Expected for multi-passage `heading-match` (see IMPORTANT section) | No fix needed |
| Tabs always show 1,2,3 same content | `questions.length === 1` | Check data structure |
| Arrows don't go to next section | `hasNextSection` not passed | Calculate and pass prop |