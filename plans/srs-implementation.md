# Spaced Repetition System (SRS) Implementation Plan

## Overview
Complete the SRS implementation for vocabulary flashcards. The structure exists but needs functional fixes, persistence, and integration with the flashcard session logic.

## User Requirements
1. **'Uncertain' button**: Treat as mild success (slightly increase level, review in a few days)
2. **Persistence**: Save vocabProgress to localStorage via Zustand persist middleware
3. **Session behavior**: Show words due for review first, then fill with new words

---

## Implementation Steps

### Step 1: Add Zustand Persist Middleware
**File**: `src/store/useExamStore.js`

- Import `persist` from `zustand/middleware`
- Wrap the store creator with `persist()`
- Configure storage name (e.g., `'exam-store'`)
- Optionally filter which state to persist (only `vocabProgress` and `totalXp`)

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useExamStore = create(
  persist(
    (set) => ({
      // ... existing state
    }),
    {
      name: 'exam-store',
      partialize: (state) => ({ 
        vocabProgress: state.vocabProgress,
        totalXp: state.totalXp 
      }),
    }
  )
);
```

---

### Step 2: Fix `updateVocabMastery` to Handle 'good' Difficulty
**File**: `src/store/useExamStore.js`

Current algorithm:
- `'easy'` → level + 1
- `'hard'` → level - 1
- `'good'` → **ignored** (bug)

New algorithm:
- `'easy'` → level + 1 (full success)
- `'good'` → level + 0.5 (mild success, rounded down to nearest integer for interval lookup)
- `'hard'` → level - 1 (failure)

Interval calculation:
- Use `Math.floor(level)` for interval lookup
- `'good'` adds 0.5 to level, so Level 1 + 'good' = 1.5 → interval index 1 (1 day)
- `'easy'` adds 1 to level, so Level 1 + 'easy' = 2 → interval index 2 (3 days)

```javascript
updateVocabMastery: (term, difficulty) => set((state) => {
  const current = state.vocabProgress[term] || { level: 0 };
  let newLevel = current.level;
  
  if (difficulty === 'easy') newLevel += 1;
  if (difficulty === 'good') newLevel += 0.5;
  if (difficulty === 'hard') newLevel = Math.max(0, newLevel - 1);

  const intervals = [0, 1, 3, 7, 14, 30];
  const intervalIndex = Math.min(Math.floor(newLevel), intervals.length - 1);
  const daysToAdd = intervals[intervalIndex];
  const nextReview = Date.now() + daysToAdd * 24 * 60 * 60 * 1000;

  return {
    vocabProgress: {
      ...state.vocabProgress,
      [term]: { level: newLevel, nextReview }
    }
  };
}),
```

---

### Step 3: Update FlashcardBlock to Prioritize Due Words
**File**: `src/components/engine/FlashcardBlock.jsx`

Add logic to filter and sort words by SRS status:

1. **Get vocabProgress from store**:
   ```javascript
   const vocabProgress = useExamStore(state => state.vocabProgress);
   ```

2. **Create helper to sort words by priority**:
   ```javascript
   const prioritizeWords = (words, progress) => {
     const now = Date.now();
     return [...words].sort((a, b) => {
       const aProgress = progress[a.term];
       const bProgress = progress[b.term];
       
       // Due words first
       const aDue = aProgress ? aProgress.nextReview <= now : true;
       const bDue = bProgress ? bProgress.nextReview <= now : true;
       
       if (aDue && !bDue) return -1;
       if (!aDue && bDue) return 1;
       
       // Among due words, lower level first (need more practice)
       if (aDue && bDue) {
         const aLevel = aProgress?.level || 0;
         const bLevel = bProgress?.level || 0;
         return aLevel - bLevel;
       }
       
       // Among non-due words, earlier review date first
       const aReview = aProgress?.nextReview || 0;
       const bReview = bProgress?.nextReview || 0;
       return aReview - bReview;
     });
   };
   ```

3. **Apply sorting when building word list**:
   - In the `useEffect` that sets `words`, apply `prioritizeWords()` before slicing
   - This ensures due words appear first in the session

---

### Step 4: Update VocabHub to Show Real Progress
**File**: `src/components/ui/VocabHub.jsx`

Replace hardcoded percentages with real data:

1. **Import useExamStore**:
   ```javascript
   import { useExamStore } from '../../store/useExamStore';
   ```

2. **Get vocabProgress**:
   ```javascript
   const vocabProgress = useExamStore(state => state.vocabProgress);
   ```

3. **Calculate real completion percentages**:
   ```javascript
   const calculateCompletion = (words, progress) => {
     if (!words || words.length === 0) return 0;
     const mastered = words.filter(w => {
       const p = progress[w.term];
       return p && p.level >= 3; // Level 3+ = mastered
     }).length;
     return Math.round((mastered / words.length) * 100);
   };
   ```

4. **Replace hardcoded values**:
   - Line 85-86: Replace `65%` with calculated value
   - Line 97-98: Replace `12%` with calculated value
   - Line 122-123: Replace `18%` with calculated value

---

### Step 5: Update SRS Button Labels
**File**: `src/components/engine/FlashcardBlock.jsx`

Update the review time labels to match the actual algorithm:

- **Recall Failure** (hard): "Review soon" or "Review tomorrow"
- **Uncertain** (good): "Review in 2-3 days"
- **Mastered** (easy): "Review in 1 week"

These are approximate labels since the exact interval depends on the current level.

---

## Files to Modify
1. `src/store/useExamStore.js` - Persist middleware + 'good' handler
2. `src/components/engine/FlashcardBlock.jsx` - Due word prioritization + label fixes
3. `src/components/ui/VocabHub.jsx` - Real progress display

## Testing Checklist
- [ ] Vocab progress persists across page refresh
- [ ] 'Uncertain' button increases level by 0.5
- [ ] 'Mastered' button increases level by 1
- [ ] 'Recall Failure' button decreases level by 1 (min 0)
- [ ] Flashcard session shows due words first
- [ ] VocabHub shows real completion percentages
- [ ] Review intervals match algorithm (0/1/3/7/14/30 days)
