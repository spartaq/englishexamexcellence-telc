# TELC Mock Test Template

Use this template when creating new TELC mock tests. Follow the structure exactly and ensure vocabulary words from reading passages are also added to vocabulary.js.

---

### Question ID Format

> **IMPORTANT**: For Reading questions, use sequential IDs (1, 2, 3... through the parts). Language Elements uses IDs 21-30, 31-40, etc.

- **Reading**: Questions 1-20 across all 3 parts
- **Language Elements**: Questions 21-30 (Part 1), 31-40 (Part 2)
- **Listening**: Questions 41+ across all parts
- **Writing**: Use task IDs like "w-m[N]-t1", "w-m[N]-t2"
- **Speaking**: Use "p1q1", "p2q1", etc. (part + question)

---

## Section Summary

| Section | Number of Parts | Time |
|---------|---------------|------|
| Reading | **3 parts** | 20 min |
| Writing | **2 tasks** | 60 min |
| Listening | **3-4 parts** | 30 min |
| Speaking | **3 parts** | 15 min |
| Language Elements | **2 parts** | 90 min |

### Reading Details:
- **Part 1**: Various short texts (5 texts, questions 1-5) - Heading match
- **Part 2**: 1 passage (questions 6-10) - Multiple choice
- **Part 3**: Various short texts (questions 11-20) - Matching information
- Total: 20 questions

### Writing Details:
- **Task 1**: Letter (150 words)
- **Task 2**: Letter (250 words)

### Listening Details:
- **Part 1**: News items -Heading match (5 questions)
- **Part 2**: Interview - True/False (10 questions)
- **Part 3**: Short texts - Multiple choice (5 questions)
- Total: ~20 questions

### Speaking Details:
- **Part 1**: Introduction and Interview (1 topic)
- **Part 2**: Discussion (with text to discuss)
- **Part 3**: Collaborative task (with partner)

### Language Elements Details:
- **Part 1**: C-test / Multiple choice cloze (10 gaps)
- **Part 2**: Token selection (10 gaps)

---

## 1. Mock File Setup

### File Location
Create in: `src/data/IELTS/mocks/telc-b2-mock-[NUMBER].json`

### Header Fields
```json
{
  "id": "telc-b2-mock-[NUMBER]",
  "mockNumber": [NUMBER],
  "title": "TELC B2 Mock Test [NUMBER]",
  "testBrand": "telc",
  "type": "general",
  "description": "Complete TELC B2 test with all 4 skills",
  "xpReward": 5000,
  "tier": "bronze",
  "instructions": "Read the instructions for each part of the paper carefully. Answer all the questions. Write your answers in the answer sheet. You must complete the answer sheet within the time limit. At the end of the test, hand in both this question paper and your answer sheet.",
}
```

---

## 2. Vocabulary Section

### Structure
```json
"vocabulary": {
  "id": "vocab-general-[NUMBER]",
  "title": "Test Vocabulary",
  "level": "B2",
  "words": [
    // 15-20 words from the reading passages
  ]
}
```

### How to Create Vocabulary
1. Extract 15-20 important words from all reading passages
2. Each word needs:
   - `term`: English word (lowercase)
   - `hu`: Hungarian translation
   - `definition`: Simple English definition, no more than level B1, synonyms if possible
   - `example`: Example sentence in English

### Example
```json
{ "term": "perceive", "hu": "érzékel", "definition": "to become aware of, to sense", "example": "Fish perceive electrical signals in water." }
```

---

## 3. Reading Section

### Structure
```json
"reading": {
  "title": "Reading",
  "time": 20,
  "sections": [
    {
      "id": "s1",
      "section": 1,
      "title": "Part 1: Global Understanding",
      "description": "Questions 1-5",
      "passages": [
        {
          "id": "p1",
          "subtitle": "Short Texts 1-5",
          "title": "Various texts",
          "type": "ielts-complex",
          "vocabList": [
            // Words from this passage
          ],
          "content": [
            { "id": "1", "text": "First text content..." },
            { "id": "2", "text": "Second text content..." }
          ],
          "subTasks": [
            {
              "type": "heading-match",
              "instruction": "Choose the correct heading for each paragraph.",
              "questions": [...],
              "headings": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

### Format for Content
Use `id` and `text` format (NOT HTML paragraph tags):
```json
"content": [
  { "id": "A", "text": "Paragraph content here..." },
  { "id": "B", "text": "Another paragraph..." }
]
```
**Do NOT use**: `<p>(A) text...</p>` or any HTML tags inside content.

### TELC Reading Topics (Shorter texts):
- News stories
- Advertisements
- Announcements
- Letters
- Informational texts

### Question Types for Reading

**1. Heading Match**
- Match headings to paragraphs
- Type: `heading-match`
- Answer: index of correct heading (0-based)

**2. Multiple Choice (MCQ)**
- 3 options (A, B, C)
- Type: `mcq`

**3. Matching Information**
- Find paragraph containing specific info
- Type: `matching-info`
- Answer: paragraph letter (A, B, C...)

---

## 4. Writing Section

### Structure
```json
"writing": {
  "title": "Writing",
  "time": 60,
  "sections": [
    {
      "id": "w-m[N]-t1",
      "taskType": 1,
      "title": "Task 1: Letter",
      "subtitle": "Part 1: Writing",
      "intro": "Context introduction",
      "instruction": "Write a letter...",
      "context": "Full context/prompt for the task",
      "targetWords": 150,
      "xp": 250,
      "prompt": "What to write about",
      "bullets": [
        "Point 1",
        "Point 2",
        "Point 3"
      ],
      "type": "letter"
    }
  ]
}
```

### Task Types

**Task 1: Letter (150 words)**
- Context: advertisement, event, situation
- Must include bullet points in letter

**Task 2: Letter (250 words)**
- Informal letter to friend
- Give opinions and suggestions

---

## 5. Speaking Section

### Structure
```json
"speaking": {
  "title": "Speaking",
  "time": 15,
  "parts": [
    {
      "id": "part1",
      "title": "Introduction and Interview",
      "subtitle": "Part 1: Speaking",
      "type": "interview",
      "duration": "4-5 minutes",
      "instruction": "Answer questions about a topic...",
      "topics": [
        {
          "topic": "A topic name",
          "questions": [
            { "id": "p1q1", "text": "Question?" }
          ]
        }
      ]
    }
  ]
}
```

### Part 1 (Interview)
- 1 topic with question
- Topics: city, music, hobby, etc.

### Part 2 (Discussion)
```json
{
  "id": "part2",
  "title": "Discussion",
  "subtitle": "Part 2: Speaking",
  "type": "discussion",
  "duration": "3-4 minutes",
  "instruction": "Read the text and discuss...",
  "text": "Text from magazine/article...",
  "topics": [
    {
      "topic": "Theme",
      "questions": [
        { "id": "p2q1", "text": "Question?" }
      ]
    }
  ]
}
```

### Part 3 (Collaborative Task)
```json
{
  "id": "part3",
  "title": "Collaborative Task",
  "subtitle": "Part 3: Speaking",
  "type": "collaborative",
  "duration": "4-5 minutes",
  "instruction": "Discuss and decide together...",
  "topics": [
    {
      "topic": "Topic",
      "suggestions": [
        "Option 1",
        "Option 2"
      ],
      "questions": [
        { "id": "p3q1", "text": "Question?" }
      ]
    }
  ]
}
```

---

## 6. Listening Section

### Structure
```json
"listening": {
  "title": "Listening",
  "time": 30,
  "instructions": "You will hear...",
  "sections": [
    {
      "id": "part1",
      "part": 1,
      "title": "Title",
      "subtitle": "Part 1: Listening",
      "description": "Instructions for this part",
      "transcript": "Full transcript of audio",
      "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "context": "Context type",
      "type": "LISTENING",
      "skill": "listening",
      "subTasks": [...]
    }
  ]
}
```

### Audio Sources
Use SoundHelix free MP3s: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-[1-16].mp3`

### Listening Question Types

**1. Heading Match**
- Match headlines to news items
- Type: `heading-match`

**2. True/False**
- True/False/Not Given
- Type: `trinary` (mode: "tfng")

**3. Multiple Choice**
- 3 options (A, B, C)
- Type: `mcq`

---

## 7. Language Elements Section

### Structure
```json
"languageElements": {
  "title": "Language Elements",
  "time": 90,
  "sections": [
    {
      "id": "le-part1",
      "section": 1,
      "title": "Language Elements, Part 1",
      "description": "Read the following letter.",
      "passages": [
        {
          "id": "p1",
          "title": "Text title",
          "type": "ielts-complex",
          "content": [
            { "id": "1", "text": "Full text with gaps like ____(21)____" }
          ],
          "subTasks": [
            {
              "type": "mcq",
              "instruction": "Choose the correct answer for each gap.",
              "questions": [
                { "id": "21", "text": "Text with gap", "options": ["a", "b", "c"], "answer": 0 }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Part 1: C-test / Multiple choice cloze
- 10 gaps (questions 21-30)
- Each gap needs 3 options (a, b, c)
- Answer is index (0, 1, 2)

### Part 2: Token selection
```json
{
  "type": "gap-fill-tokens",
  "instruction": "Choose the correct word (a-o) to complete each sentence.",
  "tokens": ["a WORD1", "b WORD2", "c WORD3", ...],
  "answers": ["a WORD1", "b WORD2", ...]
}
```
- 10 tokens (a-o)
- 10 answers matching

---

## 8. Register the Mock

Add to `src/data/IELTS/mocks/index.js`:

```javascript
import telcMock1 from './telc-b2-mock-1.json';

// Add to allMocks array
telcMock1,

// Add to telcMocks object
'telc-b2-mock-1': telcMock1,
```

---

## 9. Type Fields

### Required Type Fields

For hub routes to work correctly, the mock data must include `type` fields:

#### In Mock Root Header:
```json
{
  "id": "telc-b2-mock-1",
  "testBrand": "telc",
  "type": "general",
  ...
}
```

#### In Reading Sections:
```json
"reading": {
  "title": "Reading",
  "time": 20,
  "sections": [ ... ]
}
```

#### In Writing Sections:
```json
"writing": {
  "title": "Writing",
  "time": 60,
  "sections": [ ... ]
}
```

#### In Listening Sections:
```json
"listening": {
  "title": "Listening",
  "time": 30,
  "instructions": "...",
  "sections": [ ... ]
}
```

#### In Speaking Sections:
```json
"speaking": {
  "title": "Speaking",
  "time": 15,
  "parts": [ ... ]
}
```

#### In Language Elements:
```json
"languageElements": {
  "title": "Language Elements",
  "time": 90,
  "sections": [ ... ]
}
```

---

## Checklist

- [ ] Create mock JSON file in `src/data/IELTS/mocks/`
- [ ] Add mockNumber field
- [ ] Add `testBrand`: "telc"
- [ ] Create 3 reading parts with questions
- [ ] Add vocabulary words (15-20 words from readings)
- [ ] Add vocabulary to appropriate category in `vocabulary.js`
- [ ] Create 2 writing tasks (both letters)
- [ ] Create 3 speaking parts (interview, discussion, collaborative)
- [ ] Create 3-4 listening parts with questions
- [ ] Add `transcript` field to each listening part
- [ ] Create 2 language elements parts
- [ ] Register mock in `src/data/IELTS/mocks/index.js`
- [ ] Test the mock loads correctly