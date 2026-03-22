# Check Answers Logic Documentation

## Overview

This document describes the logic flow for the "Check Answers" feature in the IELTS test application. The feature allows users to submit their answers and view results at the end of a Reading or Listening test.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User takes Reading/LListening test           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              QuestionCarousel (Question 40 / Last)             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  isLastQuestion && onCheckAnswers                        │   │
│  │         │                                                │   │
│  │         ▼                                                │   │
│  │  [Green "Check Answers" Button]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ (onClick)
┌─────────────────────────────────────────────────────────────────┐
│                    App.jsx handleCheckAnswers                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. Detect test type (IELTS Reading/Listening)          │   │
│  │  2. Get all questions via getFlattenedQuestions()       │   │
│  │  3. Calculate accuracy and XP                            │   │
│  │  4. Calculate IELTS band score (if applicable)           │   │
│  │  5. setLessonResults(results)                            │   │
│  │  6. setIsReviewMode(true)                                 │   │
│  │  7. setView('results')  ◄── Navigates to results screen   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ResultScreen                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  • Displays accuracy percentage                          │   │
│  │  • Displays XP earned                                    │   │
│  │  • Displays IELTS Band Score (if IELTS test)            │   │
│  │  • "Review Answers" button toggles question list         │   │
│  │  • Shows user answer vs correct answer for each question │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. QuestionCarousel.jsx

**Location:** `src/components/engine/QuestionCarousel.jsx`

**Logic:**
```javascript
// Show green button only on last question
{isLastQuestion && onCheckAnswers && (
  <button 
    className="check-answers-btn"
    onClick={onCheckAnswers}
  >
    Check Answers
  </button>
)}
```

**Props:**
- `isLastQuestion` - Boolean, true when current question index equals total questions - 1
- `onCheckAnswers` - Function callback, passed from parent (ReadingBlock/ListeningBlock)

### 2. ReadingBlock.jsx / ListeningBlock.jsx

**Location:** `src/components/engine/ReadingBlock.jsx`, `src/components/engine/ListeningBlock.jsx`

**Logic:**
- Determines if it's the last passage/section
- Passes `showCheckAnswers` and `onCheckAnswers` to QuestionCarousel

```javascript
// ReadingBlock.jsx (around line 995)
showCheckAnswers={!hasNextPassage && !hasNextSection}
onCheckAnswers={handleCheckAnswers}
```

```javascript
// ListeningBlock.jsx (around line 928)
showCheckAnswers={isLastListeningSection}
onCheckAnswers={handleCheckAnswers}
```

### 3. App.jsx - handleCheckAnswers

**Location:** `src/App.jsx` (lines 369-529)

**Key Functions:**

#### getFlattenedQuestions(lesson)
Flattens nested lesson structure to extract all questions.

**Important:** This function is now selective about what it considers a "question":
```javascript
const getFlattenedQuestions = (lesson) => {
  let flat = [];
  const crawl = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    // Only consider it a question if it has text/question/prompt AND an answer
    const hasText = obj.text || obj.question || obj.prompt || obj.stem;
    const hasAnswer = obj.answer !== undefined;
    if (obj.id !== undefined && hasText && hasAnswer) {
      flat.push(obj);
    }
    
    const childrenKeys = ['sections', 'passages', 'parts', 'questions', 'subTasks'];
    childrenKeys.forEach(key => {
      if (Array.isArray(obj[key])) obj[key].forEach(crawl);
      else if (obj[key] && typeof obj[key] === 'object') crawl(obj[key]);
    });
  };
  crawl(lesson);
  return flat;
};
```

#### handleCheckAnswers(drillAnswers)
Main handler function that:
1. Detects if it's a Writing or Speaking task → shows reflection instead
2. Detects if it's IELTS Reading or Listening test
3. Extracts all questions using `getFlattenedQuestions()`
4. Compares user answers to correct answers
5. Calculates accuracy percentage
6. Calculates IELTS Band Score (if applicable)
7. Sets results in state
8. **Navigates to results view**

```javascript
const handleCheckAnswers = (drillAnswers = null) => {
  // ... detection and calculation logic ...
  
  setLessonResults(results);
  setIsReviewMode(true);
  setView('results');  // <-- Key: navigates to results screen
};
```

### 4. ResultScreen.jsx

**Location:** `src/components/engine/ResultScreen.jsx`

**Props:**
- `lesson` - The lesson/test object
- `results` - Calculated results (accuracy, XP, IELTS score)
- `userAnswers` - Object containing user's answers (NEW - added to fix display issue)
- `onClaim` - Callback to claim rewards

**Key Function: getQuestionsForReview()**

Similar to `getFlattenedQuestions`, this function extracts questions for the review display:
- Uses a Map to deduplicate questions by ID
- Only includes objects that have both text content AND an answer
- Filters by skill (reading vs listening) if applicable

```javascript
const getQuestionsForReview = () => {
  const questionMap = new Map();
  
  const isQuestion = (obj) => {
    if (!obj || typeof obj !== 'object') return false;
    const hasText = obj.text || obj.question || obj.prompt || obj.stem;
    const hasAnswer = obj.answer !== undefined;
    return hasText && hasAnswer;
  };
  
  // ... extraction logic ...
  
  return Array.from(questionMap.values());
};
```

## How Questions Are Counted

### Before Fix
The old logic counted ANY object with `id` AND `answer` as a question. This caused duplicates because:
- The mock data had nested structures
- Objects like passages, sections, and tasks could have both id and answer fields
- Questions were being extracted from multiple paths in the data structure

### After Fix
Questions must have:
1. An `id`
2. A text field (`text`, `question`, `prompt`, or `stem`)
3. An `answer`

This ensures only actual questions are counted, not metadata objects.

## Displaying Results

### Results Screen Shows:
1. **Title** - "Perfect!" (100%) or "Complete!" (less than 100%)
2. **IELTS Band Score** - If it's an IELTS test
3. **Accuracy** - Percentage of correct answers
4. **XP Earned** - Experience points gained
5. **Review Toggle** - Button to show/hide answer review
6. **Answer Review** - List of all questions with:
   - Question number
   - Correct/Incorrect status
   - Question text
   - User's answer
   - Correct answer

## History of Changes

| Date | Change | File |
|------|--------|------|
| 2024 | Added green "Check Answers" button to QuestionCarousel | QuestionCarousel.jsx |
| 2024 | Added navigation to results in handleCheckAnswers | App.jsx |
| 2024 | Passed userAnswers to ResultScreen | App.jsx |
| 2024 | Made getFlattenedQuestions selective about questions | App.jsx |
| 2024 | Added deduplication to getQuestionsForReview | ResultScreen.jsx |

## Testing Checklist

- [ ] Green button appears only on last question
- [ ] Button navigates to results screen when clicked
- [ ] Results show correct number of questions (no duplicates)
- [ ] User answers are displayed correctly
- [ ] Correct answers are shown
- [ ] IELTS Band Score displays for IELTS tests
- [ ] Accuracy percentage is calculated correctly
