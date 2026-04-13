# TELC Mock Test Template

Use this template when creating new TELC mock tests (B1, B2, C1). Follow the structure exactly.

---

## TELC Level Differences

| Level | Parts | Time | Notes |
|-------|-------|------|-------|
| **B1** | 3 Reading, 2 Writing, 3 Speaking, 4 Listening, 2 Language Elements | 20/60/15/30/90 min | Standard structure |
| **B2** | 3 Reading, 2 Writing, 3 Speaking, 4 Listening, 2 Language Elements | 20/60/15/30/90 min | Same as B1 |
| **C1** | 3 Reading, 2 Writing, 2 Speaking, 3 Listening, 1 Language Elements | 90/60/15/30/- | Different task types |

---

### Question ID Format

> **IMPORTANT**: For Reading questions, use sequential IDs (1, 2, 3... through the parts). Language Elements uses IDs 21-30, 31-40, etc.

- **Reading**: Questions 1-20 across all 3 parts
- **Language Elements**: Questions 21-30 (Part 1), 31-40 (Part 2)
- **Listening**: Questions 41+ across all parts
- **Writing**: Use task IDs like "w-m[N]-t1", "w-m[N]-t2"
- **Speaking**: Use "p1q1", "p2q1", etc. (part + question)

---

## 1. Mock File Header

### File Location
```
B1: src/data/TELC/Mocks/telc-b1-mock-[N].json
B2: src/data/TELC/Mocks/telc-b2-mock-[N].json
C1: src/data/TELC/mocks/telc-c1-mock-[N].json
```

### Header Fields (All Levels)
```json
{
  "id": "telc-[b1|b2|c1]-mock-[N]",
  "level": "b1|b2|c1",
  "mockNumber": [N],
  "title": "TELC [B1|B2|C1] Mock Test [N]",
  "testBrand": "telc",
  "type": "general",
  "description": "Complete TELC [B1|B2|C1] test with all 4 skills",
  "xpReward": 5000,
  "tier": "bronze",
  "instructions": "Read the instructions for each part of the paper carefully..."
}
```

---

## 2. Vocabulary Section

### Structure (All Levels)
```json
"vocabulary": {
  "id": "vocab-general-[N]",
  "title": "Test Vocabulary",
  "level": "B1|B2|C1",
  "words": [
    { "term": "word", "hu": "hungarian", "definition": "english definition", "example": "example sentence" }
  ]
}
```

---

## 3. Reading Section

### Structure
```json
"reading": {
  "title": "Reading",
  "time": 20|90,
  "sections": [
    {
      "id": "s1",
      "section": 1,
      "title": "Part 1: [Title]",
      "description": "Questions 1-[N]",
      "passages": [
        {
          "id": "p1",
          "title": "Passage Title",
          "subtitle": "Reading Passage 1",
          "type": "READING",
          "content": [
            { "id": "1", "text": "Paragraph content..." }
          ],
          "subTasks": [
            {
              "type": "heading-match|mcq|matching-info|sentence-insert|trinary",
              "instruction": "Question instruction...",
              "questions": [...],
              "options": [...],
              "headings": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

### Reading Question Types

| Type | Description | Answer Format |
|------|-------------|---------------|
| `heading-match` | Match headings to paragraphs | index (0, 1, 2...) |
| `mcq` | Multiple choice (3 options) | index or "a/b/c" |
| `matching-info` | Find paragraph with info | letter (a, b, c...) |
| `sentence-insert` | Insert missing sentences | letter (a, b, c...) |
| `trinary` | True/False/Not Given | "+", "-", "X" |

### Content Format
```json
"content": [
  { "id": "A", "text": "Paragraph content..." },
  { "id": "B", "text": "Another paragraph..." }
]
```
**Do NOT use HTML tags** inside content.

---

## 4. Writing Section

### B1/B2 Structure (2 independent tasks)
```json
"writing": {
  "title": "Writing",
  "time": 60,
  "sections": [
    {
      "id": "w-m[N]-t1",
      "taskType": 1,
      "title": "Task 1: [Type]",
      "subtitle": "Part 1: Writing",
      "instruction": "Write instructions...",
      "context": "Task context...",
      "targetWords": 150,
      "xp": 250,
      "prompt": "What to write about",
      "bullets": ["Point 1", "Point 2"],
      "type": "letter"
    },
    {
      "id": "w-m[N]-t2",
      "taskType": 2,
      "title": "Task 2: [Type]",
      "subtitle": "Part 2: Writing",
      "instruction": "Write instructions...",
      "context": "Task context...",
      "targetWords": 250,
      "xp": 500,
      "prompt": "What to write about",
      "bullets": ["Point 1", "Point 2"],
      "type": "letter"
    }
  ]
}
```

### C1 Structure (Compulsory task + Optional tasks with options array)
```json
"writing": {
  "title": "Writing",
  "time": 60,
  "sections": [
    {
      "id": "w-m[N]-t1",
      "taskType": 1,
      "title": "Task 1: Compulsory",
      "subtitle": "Part 1: Writing",
      "instruction": "Instructions for compulsory task...\nWrite at least 200 words.",
      "context": "Task context...",
      "targetWords": 200,
      "xp": 500,
      "prompt": "What to write about",
      "type": "letter"
    },
    {
      "id": "w-m[N]-t2",
      "taskType": 2,
      "title": "Task 2: Optional",
      "subtitle": "Part 2: Writing",
      "instruction": "Choose one of the following four tasks and write at least 150 words.",
      "options": [
        { "id": "optional-a", "title": "A: [Title]", "context": "...", "targetWords": 150, "xp": 300, "type": "letter" },
        { "id": "optional-b", "title": "B: [Title]", "context": "...", "targetWords": 150, "xp": 300, "type": "informative" },
        { "id": "optional-c", "title": "C: [Title]", "context": "...", "targetWords": 150, "xp": 300, "type": "letter" },
        { "id": "optional-d", "title": "D: [Title]", "context": "...", "targetWords": 150, "xp": 300, "type": "article" }
      ]
    }
  ]
}
```

---

## 5. Speaking Section

### B1/B2 (3 parts: Interview, Discussion, Collaborative)
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
      "instruction": "Instructions...",
      "topics": [
        { "topic": "Topic name", "questions": [{ "id": "p1q1", "text": "Question?" }] }
      ]
    },
    {
      "id": "part2",
      "title": "Discussion",
      "subtitle": "Part 2: Speaking",
      "type": "discussion",
      "duration": "3-4 minutes",
      "instruction": "Read the text and discuss...",
      "text": "Text from magazine...",
      "topics": [
        { "topic": "Theme", "questions": [{ "id": "p2q1", "text": "Question?" }] }
      ]
    },
    {
      "id": "part3",
      "title": "Collaborative Task",
      "subtitle": "Part 3: Speaking",
      "type": "collaborative",
      "duration": "4-5 minutes",
      "instruction": "Discuss and decide together...",
      "topics": [
        { "topic": "Topic", "suggestions": ["Option 1", "Option 2"], "questions": [{ "id": "p3q1", "text": "Question?" }] }
      ]
    }
  ]
}
```

### C1 (2 parts: Presentation, Discussion with quote)
```json
"speaking": {
  "title": "Speaking",
  "time": 15,
  "parts": [
    {
      "id": "part1",
      "title": "Presentation",
      "subtitle": "Part 1: Speaking",
      "type": "presentation",
      "duration": "3 minutes",
      "instruction": "Choose one of the two topics and give a short presentation...",
      "topics": [
        { "topic": "Topic 1", "questions": [{ "id": "p1q1", "text": "Follow-up question?" }] },
        { "topic": "Topic 2", "questions": [{ "id": "p1q2", "text": "Follow-up question?" }] }
      ]
    },
    {
      "id": "part2",
      "title": "Discussion",
      "subtitle": "Part 2: Discussion",
      "type": "discussion",
      "duration": "6 minutes",
      "instruction": "Discuss the following topic with your partner(s)",
      "text": "\"Quote or text to discuss...\" Author",
      "topics": [
        { "topic": "Discussion", "questions": [
          { "id": "p2q1", "text": "Question 1?" },
          { "id": "p2q2", "text": "Question 2?" },
          { "id": "p2q3", "text": "Question 3?" },
          { "id": "p2q4", "text": "Question 4?" }
        ]}
      ]
    }
  ]
}
```

### Speaking Types
- `interview` - Q&A format with single topic
- `presentation` - Short talk (1-2 topics with follow-up questions)
- `discussion` - Discuss text/quote with multiple questions
- `collaborative` - Partner discussion and decision

---

## 6. Listening Section

### Structure (All Levels)
```json
"listening": {
  "title": "Listening",
  "time": 30,
  "instructions": "General instructions...",
  "sections": [
    {
      "id": "part1",
      "part": 1,
      "title": "Title",
      "subtitle": "Part 1: Listening",
      "description": "Part instructions...",
      "transcript": "Transcript of audio...",
      "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-[1-16].mp3",
      "context": "Context type",
      "type": "LISTENING",
      "skill": "listening",
      "subTasks": [...]
    }
  ]
}
```

### Listening Question Types
- `heading-match` - Match headlines to news items
- `mcq` - Multiple choice (3 options)
- `trinary` - True/False/Not Given (mode: "tfng")
- `notes-completion` - Fill in notes from recording
- `matching-info` - Match speakers to statements

### Audio Sources
```
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-[1-16].mp3
```

---

## 7. Language Elements Section

### B1/B2 (2 parts)
```json
"languageElements": {
  "title": "Language Elements",
  "time": 90,
  "sections": [
    {
      "id": "le-part1",
      "section": 1,
      "title": "Language Elements, Part 1",
      "description": "Read the following text.",
      "passages": [
        {
          "id": "p1",
          "title": "Text Title",
          "type": "LANGUAGE-ELEMENTS",
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
    },
    {
      "id": "le-part2",
      "section": 2,
      "title": "Language Elements, Part 2",
      ...
    }
  ]
}
```

### C1 (1 part only)
```json
"languageElements": {
  "title": "Language Elements",
  "time": 90,
  "sections": [
    {
      "id": "le-part1",
      "section": 1,
      "title": "Language Elements, Part 1",
      ...
    }
  ]
}
```

### Language Elements Question Types
- `mcq` - Multiple choice cloze (3 options per gap)
- `gap-fill-tokens` - Token selection (a-o, 10 tokens)

---

## 8. Common Fields

### Required Type Fields for All Sections
```json
"reading": { "title": "Reading", "time": N, "sections": [...] }
"writing": { "title": "Writing", "time": 60, "sections": [...] }
"speaking": { "title": "Speaking", "time": 15, "parts": [...] }
"listening": { "title": "Listening", "time": 30, "instructions": "...", "sections": [...] }
"languageElements": { "title": "Language Elements", "time": 90, "sections": [...] }
```

---

## Checklist

### B1/B2
- [ ] Header with level, mockNumber, testBrand: "telc"
- [ ] Vocabulary (15-20 words from readings)
- [ ] 3 Reading parts (Heading Match, MCQ, Matching Info)
- [ ] 2 Writing tasks (separate sections, each with own task)
- [ ] 3 Speaking parts (Interview, Discussion, Collaborative)
- [ ] 4 Listening parts
- [ ] 2 Language Elements parts

### C1
- [ ] Header with level: "c1"
- [ ] Vocabulary
- [ ] 3 Reading parts (Gapped Sentences, Selective Understanding)
- [ ] 2 Writing tasks (1 compulsory task + 1 optional with 4 choices)
- [ ] 2 Speaking parts (Presentation + Discussion with quote)
- [ ] 3 Listening parts
- [ ] 1 Language Elements part

---

## 10. Register the Mock

After creating the mock JSON file, you must register it in `src/data/TELC/mocks/index.js`:

### Step 1: Import the mock
```javascript
import telcB2Mock2 from './telc-b2-mock-2.json';
```

### Step 2: Add to allMocks array
```javascript
const allMocks = [
  telcB1Mock1,
  telcB2Mock1,
  telcB2Mock2,  // Add here
  telcC1Mock1
];
```

### Step 3: Add to telcMocks object
```javascript
export const telcMocks = {
  'telc-b1-mock-1': telcB1Mock1,
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2,  // Add here
  'telc-c1-mock-1': telcC1Mock1
};
```

### Step 4: Add to level-specific export
```javascript
export const b2Mocks = {
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2  // Add here
};
```

### File Paths by Level
- B1: `src/data/TELC/Mocks/telc-b1-mock-[N].json`
- B2: `src/data/TELC/Mocks/telc-b2-mock-[N].json`
- C1: `src/data/TELC/mocks/telc-c1-mock-[N].json`

---

## Example: Creating telc-b2-mock-2.json

---

## 9. Content Creation Guide

### Reading Passages

#### B1/B2 Topics (Short, real-world texts)
- News stories (100-150 words each, 5 short texts for Part 1)
- Advertisements, announcements, letters
- Information texts about places, products, events
- Email exchanges

**Tips:**
- Keep passages short and simple for B1
- B2 can have slightly more complex sentences
- Use real, authentic English where possible
- Avoid overly academic or technical language

**5 texts for Part 1** (B1/B2):
- Each 80-150 words
- Topics: news, travel, shopping, health, entertainment

**Longer passage for Part 2/3**:
- 300-500 words
- Topic-based article (environment, technology, lifestyle, work)

#### C1 Topics (More complex)
- Academic-style texts
- Longer articles (400-600 words per passage)
- More sophisticated vocabulary and sentence structure

**Question Types:**

| Part | Type | Description | Questions |
|------|------|-------------|-----------|
| B1/B2 Part 1 | Heading Match | Match 5 headings to 5 short texts | 5 |
| B1/B2 Part 2 | MCQ | 4-option multiple choice | 5 |
| B1/B2 Part 3 | Matching Info | Match statements to paragraphs | 5 |
| C1 Part 1 | Sentence Insert | Insert missing sentences | 6 |
| C1 Part 2 | Selective Understanding | Find specific info in text | 6 |
| C1 Part 3 | True/False/Not Given | Verify statements against text | 6 |

---

### Writing Tasks

#### B1/B2 Task 1 (150 words)
**Types:**
- Formal letter (complaint, application, request)
- Email to editor
- Response to advertisement

**Common prompts:**
- Write a letter of complaint
- Write a letter applying for something
- Write a letter to a friend about an event
- Write about your favorite recipe

#### B1/B2 Task 2 (250 words)
**Types:**
- Informal letter to friend
- Article for magazine/website
- Review

**Common prompts:**
- Give advice to a friend
- Describe a place/experience
- Write about a topic you know well

#### C1 Task 1 - Compulsory (200 words)
**Types:**
- Formal letter to editor
- Opinion essay
- Proposal

**Common prompts:**
- Letter to newspaper about local issue (wind turbines example)
- Essay giving your opinion on a topic
- Proposal for changes

#### C1 Task 2 - Optional (150 words each, choose 1 of 4)
**Option types:**
- A: Letter to yourself (personal reflection)
- B: Promotional text (sports club, etc.)
- C: Complaint letter to manufacturer
- D: Contribution to website

---

### Speaking Tasks

#### B1/B2 Part 1 - Interview
- Single topic (city, music, hobby, etc.)
- 1-2 follow-up questions
- Answer from personal experience

**Example topics:**
- A city you particularly like
- Music you often listen to
- A hobby you enjoy

#### B1/B2 Part 2 - Discussion
- Text/quote to discuss (magazine excerpt)
- Questions about the text

**Example texts:**
- Short article on a topic
- Quotes from famous people
- Statistics or facts

#### B1/B2 Part 3 - Collaborative Task
- Topic with 2-3 suggestions/options
- Discuss and make a decision together

**Example:**
- Discuss advantages/disadvantages
- Choose the best option
- Plan something together

#### C1 Part 1 - Presentation
- 2 topics to choose from
- 3-minute presentation
- Follow-up questions

**Example topics:**
- "Is donating to charity popular in your country?"
- "How important is your mobile phone?"

#### C1 Part 2 - Discussion
- Quote to discuss
- 4 discussion questions

**Example quote:**
- "I do not like work, even when someone else does it." Mark Twain

**Questions:**
1. What do you understand by this statement?
2. In what way do you agree or disagree?
3. Give reasons and examples
4. React to your partner's arguments

---

### Listening Scripts

#### B1/B2 Part 1 - News Items
- 5 short news items
- Match to headlines (a-f, 2 don't fit)

#### B1/B2 Part 2 - Interview/Dialogue
- True/False questions
- 8-10 questions

#### B1/B2 Part 3 - Longer Talk/Announcement
- Multiple choice
- 5-6 questions

#### C1 Part 1 - Opinions (Matching)
- 8 speakers
- Match to statements (8 of 10 statements)

#### C1 Part 2 - Interview/Talk (MCQ)
- Multiple choice
- 10 questions

#### C1 Part 3 - Presentation (Notes)
- Note completion
- 10 items to fill in

---

### Language Elements

#### B1/B2 Part 1 - Multiple Choice Cloze
- 10 gaps (questions 21-30)
- Text: 150-200 words
- 3 options per gap (a, b, c)

**Topics:**
- Personal letters
- Informal emails
- Short articles

#### B1/B2 Part 2 - Word Formation OR Token Selection
- 10 gaps
- Either: transform word OR select from tokens (a-o)

#### C1 Part 1 - Multiple Choice Cloze
- 20 gaps (questions 21-40)
- Longer text (250-300 words)
- More complex grammar

---

### Vocabulary Creation

Extract 15-20 important words from ALL reading passages:

```json
{
  "term": "perceive",
  "hu": "érzékel",
  "definition": "to become aware of, to sense",
  "example": "Fish perceive electrical signals in water."
}
```

**Rules:**
- `term`: lowercase English word
- `hu`: Hungarian translation
- `definition`: Simple B1-level definition, avoid circular definitions
- `example`: Natural English sentence using the word

---

### Audio Sources

Use these free test audio sources:
```
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
...
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3
```

**Note:** These are placeholder URLs. For real tests, you would need actual recorded audio matching the transcript.

---

### Example: Creating a B1 Mock

1. **Header**: Set level to "b1", mockNumber to 1
2. **Vocabulary**: Write 15-20 words from readings
3. **Reading**:
   - Part 1: 5 short texts + heading match
   - Part 2: 1 passage + MCQ
   - Part 3: 3-4 short texts + matching info
4. **Writing**: Task 1 (150w) + Task 2 (250w)
5. **Speaking**: Interview + Discussion + Collaborative
6. **Listening**: 4 parts with different question types
7. **Language Elements**: 2 parts with MCQ cloze
