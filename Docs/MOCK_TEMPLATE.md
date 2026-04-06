# IELTS Mock Test Template

Use this template when creating new IELTS mock tests. Follow the structure exactly and ensure vocabulary words from reading passages are also added to vocabulary.js.

---

### Question ID Format

> ⚠️ **IMPORTANT**: For Reading and Listening questions, use simple sequential IDs (1, 2, 3, etc.) from 1-40. Do NOT use complex prefixes like "r1q1", "sp1q1", etc.

- **Reading**: Questions 1-40 across all passages
- **Listening**: Questions 1-40 across all parts
- **Writing**: Use task IDs like "w-m[N]-t1"
- **Speaking**: Use format "sp1q1", "sp3q1" (part + question)

---

## Section Summary

| Section | Number of Parts | Time |
|---------|-----------------|------|
| Reading | **3 sections** (each with 1 passage) | 60 min |
| Writing | **2 tasks** (Task 1 + Task 2) | 60 min |
| Listening | **4 parts** | 30 min |
| Speaking | **3 parts** (Interview + Long Turn + Discussion) | 14-15 min |

### Reading Details:
- **Section 1**: 1 passage (~13 questions)
- **Section 2**: 1 passage (~13 questions)
- **Section 3**: 1 passage (~14 questions)
- Total: ~40 questions across 3 passages
- Each passage: 6-8 paragraphs (A-H)
- **Total Words**: 2,150–2,750 words (across 3 sections)

#### Academic vs General Training Texts:
- **Academic Reading**: Longer, more complex texts from books, journals, or magazines
- **General Training**: 
  - Section 1 & 2: Shorter texts (notices, advertisements, leaflets)
  - Section 3: Longer, more complex text (similar to Academic)

### Writing Details:
- **Task 1**: Letter (150 words, 20 min)
- **Task 2**: Essay (250 words, 40 min)

### Listening Details:
- **Part 1**: Form/Note/Table/Flow Chart/Summary completion (10 questions)
- **Part 2**: Multiple choice + Matching (10 questions)
- **Part 3**: Plan/Map/Diagram Labelling + Sentence completion (10 questions)
- **Part 4**: Short-answer questions (10 questions)
- Total: 40 questions

### Speaking Details:
- **Part 1**: 2 topics × 4 questions = 8 questions (4-5 min)
- **Part 2**: 1 cue card with bullet points (3-4 min)
- **Part 3**: 4 discussion questions (4-5 min)

---

## 1. Mock File Setup

### File Location
Create in: `src/data/IELTS/mocks/ielts-[general|academic]-mock-[NUMBER].json`

### Header Fields
```json
{
  "id": "ielts-[general|academic]-mock-[NUMBER]",
  "mockNumber": [NUMBER],
  "title": "IELTS [General Training|Academic] Mock Test [NUMBER]",
  "type": "[general|academic]",
  "description": "Complete IELTS [General Training|Academic] test with all 4 skills",
  "xpReward": 5000,
  "tier": "bronze",
  "instructions": "Read the instructions for each part of the paper carefully. Answer all the questions. Write your answers in the answer sheet. You must complete the answer sheet within the time limit. At the end of the test, hand in both this question paper and your answer sheet.",
```

---

## 2. Vocabulary Section

### Structure
```json
"vocabulary": {
  "id": "vocab-[general|academic]-[NUMBER]",
  "title": "Test Vocabulary",
  "level": "[B2|C1]",
  "words": [
    // 15-20 words from the reading passages
  ]
}
```

### How to Create Vocabulary
1. Extract 15-20 important words from all 3 reading passages
2. Each word needs:
   - `term`: English word (lowercase)
   - `hu`: Hungarian translation
   - `definition`: Simple English definition,no more than level b1, synonyms if possible
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
  "time": 60,
  "sections": [
    {
      "id": "s1",
      "section": 1,
      "title": "[Section Title]",
      "description": "Questions 1-13 based on Part 1",
      "passages": [
        {
          "id": "p1",
          "title": "[Passage Title]",
          "type": "ielts-complex",
          "vocabId": "v_[category]_[level]",
          "vocabList": [
            // 8-10 words from this passage
          ],
          "content": [
            // Paragraphs A-H
          ],
          "subTasks": [
            // Question types
          ]
        }
      ]
    }
  ]
}
```

### Types of Reading Passages

**Format**: Use `id` and `text` format (NOT HTML paragraph tags):
```json
"content": [
  { "id": "A", "text": "Paragraph content here..." },
  { "id": "B", "text": "Another paragraph..." }
]
```
**Do NOT use**: `<p>(A) text...</p>` or any HTML tags inside content.

**General Training Topics:**
- Work & Employment (job applications, workplace issues)
- Business & Companies (products, services, advertising)
- Travel & Tourism (destinations, accommodation, transport)
- Health & Safety (first aid, emergencies, nutrition)
- Environment (conservation, climate, wildlife)
- Food & Culture (restaurants, cuisines, traditions)
- Housing & Accommodation (real estate, neighborhoods)
- Education & Training (schools, courses, learning)

**Academic Topics:**
- Science & Nature (animals, plants, weather, space)
- Technology & Innovation (computers, AI, engineering)
- History & Archaeology (ancient civilizations, discoveries)
- Society & Culture (behavior, relationships, urbanization)
- Business & Economics (markets, trade, management)
- Medicine & Health (diseases, treatments, research)
- Environment & Ecology (ecosystems, pollution, energy)
- Psychology & Behavior (learning, memory, cognition)

### Question Types to Use 

**1. Matching Information (Paragraph Matching)**
- Match statements to paragraphs (A-H)
- Tests: Scanning & locating specific information
- Type: `matching-info`

**2. Multiple Choice (MCQ)**
- 4 options (A, B, C, D)
- Only ONE correct answer
- Tests: Understanding details, author's purpose, inferring meaning
- Type: `mcq`

**3. Short Answer**
- Write NO MORE THAN 2-3 WORDS
- Answers from the text directly
- Tests: Finding specific information
- Type: `short-answer`

**4. True/False/Not Given**
- Statements about the passage
- Must be explicitly stated to be TRUE/FALSE
- Tests: Understanding claims vs. text
- Type: `trinary` (with `mode: "tfng"`)

**5. Yes/No/Not Given**
- Statements about the passage
- Tests: Understanding claims vs. information
- Type: `trinary` (with `mode: "ynng"`)

**6. Sentence Completion**
- Complete sentences using words from text
- NO MORE THAN 2 WORDS
- Tests: Understanding detail
- Type: `sentence-complete`

**7. Sentence Matching**
- Match sentence beginnings to correct sentence endings
- Tests: Understanding how ideas connect
- Answers are full text (not letter codes)
- Type: `sentence-matching`

**8. Heading Match**
- Match headings to paragraphs
- Only 1 correct answer
- Tests: Understanding main idea
- Type: `heading-match`

**9. Diagram Labeling**
- Label parts of a diagram
- Tests: Visual understanding
- Type: `diagram-label`

**10. Summary/Gap Fill**
- Complete a summary using words from the text
- NO MORE THAN 2 WORDS
- Type: `gap-fill`



**14. Matching Features**
- Match features to entities
- Type: `matching-features`

**15. Token Select**
- Select correct words/tokens
- Type: `token-select`

**16. Punctuation Correction**
- Fix punctuation in text
- Type: `punctuation`

### Listening Question Types

**1. Multiple Choice**
- 3 options (A, B, C)
- One correct answer
- Type: `mcq`

**2. Matching**
- Match items to categories or features
- Type: `matching`

**3. Plan/Map/Diagram Labelling**
- Label locations on a map or diagram
- Write the correct letter (A-H)
- Type: `diagram-label`

**4. Form/Note/Table/Flow Chart/Summary Completion**
- Complete forms, notes, tables, flow charts, or summaries
- NO MORE THAN 2 WORDS AND/OR A NUMBER
- Type: `notes-completion` (for structured notes/forms), `flow-chart` (for flow charts)

**5. Sentence Completion**
- Complete sentences from the audio
- NO MORE THAN 2-3 WORDS
- Type: `sentence-complete`

**6. Short-Answer Questions**
- Write NO MORE THAN 2 WORDS
- Answers from the audio
- Type: `short-answer`

**13. Notes Completion**
- Complete notes using words from text or word list
- NO MORE THAN 2 WORDS AND/OR A NUMBER
- Type: `notes-completion`


### Question Type `type` Values

> ⚠️ **IMPORTANT**: Use these exact `type` values in your JSON. Do NOT use descriptive names!

| Question Type | JSON `type` Value | Component |
|---------------|-------------------|-----------|
| Matching Information (Paragraph Matching) | `matching-info` | MatchingInfoBlock |
| Multiple Choice | `mcq` | MCQBlock |
| Short Answer | `short-answer` | ShortAnswerBlock |
| True/False/Not Given | `trinary` | TrinaryBlock |
| Yes/No/Not Given | `trinary` (with `"mode": "ynng"`) | TrinaryBlock |
| Sentence Completion | `sentence-complete` | SentenceCompleteBlock |
| Sentence Matching | `sentence-matching` | SentenceMatchingBlock |
| Diagram Labeling | `diagram-label` | DiagramLabelBlock |
| Summary/Gap Fill | `gap-fill` | GapFillBlock |
| Table Completion | `table-completion` | TableCompletionBlock |
| Flow Chart Completion | `flow-chart` | FlowChartCompletionBlock |
| Notes Completion | `notes-completion` | NotesCompletionBlock |
| Heading Match | `heading-match` | HeadingMatchBlock |
| Matching Features | `matching-features` | MatchingFeaturesBlock |
| Token Select | `token-select` | TokenSelectBlock |
| Punctuation Correction | `punctuation` | PunctuationCorrectionBlock |

#### Example: True/False/Not Given Question
```json
{
  "id": 1,
  "type": "trinary",
  "mode": "tfng",
  "instruction": "Do the following statements agree with the views of the writer?",
  "questions": [
    { "id": 1, "text": "The writer claims...", "answer": "TRUE" },
    { "id": 2, "text": "According to the author...", "answer": "FALSE" },
    { "id": 3, "text": "It is mentioned that...", "answer": "NOT GIVEN" }
  ]
}
```

#### Example: Yes/No/Not Given Question
```json
{
  "id": 1,
  "type": "trinary",
  "mode": "ynng",
  "instruction": "Do the following statements agree with the information given in the passage?",
  "questions": [
    { "id": 1, "text": "The main concern is...", "answer": "YES" },
    { "id": 2, "text": "The solution is effective...", "answer": "NO" },
    { "id": 3, "text": "Further research is needed...", "answer": "NOT GIVEN" }
  ]
}
```

#### Example: Heading Match Question
```json
{
  "id": 1,
  "type": "heading-match",
  "instruction": "Choose the correct heading for each paragraph.",
  "headings": [
    "The history of the institution",
    "Funding sources",
    "Student life",
    "Academic programs"
  ],
  "questions": [
    { "id": "q1", "text": "Paragraph A", "answer": 0 },
    { "id": "q2", "text": "Paragraph B", "answer": 1 },
    { "id": "q3", "text": "Paragraph C", "answer": 2 },
    { "id": "q4", "text": "Paragraph D", "answer": 3 }
  ]
}
```
> Note: The `answer` value is the index (0-based) of the correct heading in the `headings` array.

#### Example: Sentence Matching Question
```json
{
  "id": "company-descriptions-match",
  "type": "sentence-matching",
  "instruction": "Match the sentence beginnings with the correct endings.",
  "options": [
    "good growth opportunities and above-average pay.",
    "The company has flexible schedules but requires a lot of effort.",
    "This company provides outsourced sales and marketing services.",
    "It is one of the largest security service providers.",
    "Employees appreciate the ability to provide one-on-one care."
  ],
  "questions": [
    { "id": 15, "text": "This company has", "answer": "good growth opportunities and above-average pay." },
    { "id": 16, "text": "Chipotle offers", "answer": "The company has flexible schedules but requires a lot of effort." },
    { "id": 17, "text": "Advantage Sales & Marketing provides", "answer": "This company provides outsourced sales and marketing services." }
  ]
}
```
> Note: The `answer` is the full text of the matching option (not a letter code). The dropdown will display options numbered 1, 2, 3... based on the order in the `options` array.

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
      "instruction": "You should spend about 20 minutes on this task. Write at least 150 words.",
      "targetWords": 150,
      "xp": 250,
      "prompt": "The situation description...",
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

### Task 1 Types (General Training)

**Letter Types:**
- **Formal Letter**: Complaint, application, request to authority
- **Informal Letter**: Letter to friend about news, invitation
- **Semi-formal Letter**: To colleague or neighbor

**Sample Prompts:**
```
"You have just moved into a new apartment. Write a letter to your landlord about some problems you're experiencing."
```

**Must include 3 bullet points to address in the letter**

### Task 2 (Essay)
```json
{
  "id": "w-m[N]-t2",
  "taskType": 2,
  "title": "Task 2: Essay",
  "instruction": "You should spend about 40 minutes on this task. Write at least 250 words.",
  "targetWords": 250,
  "xp": 500,
  "prompt": "Essay question/statement",
  "bullets": [
    "Give reasons for your answer",
    "Include relevant examples"
  ],
  "type": "essay"
}
```

### Essay Question Types:
- **Opinion Essay**: "To what extent do you agree/disagree?"
- **Discussion Essay**: "Discuss both views and give your opinion"
- **Advantages/Disadvantages**: "Do the advantages outweigh the disadvantages?"
- **Problem/Solution**: "What are the causes and solutions?"
- **Direct Questions**: "What are the reasons? How can this be improved?"

---

## 5. Listening Section

### Structure
```json
"listening": {
  "title": "Listening",
  "time": 30,
  "instructions": "You will hear a number of different recordings...",
  "sections": [
    {
      "id": "part1",
      "part": 1,
      "title": "",
      "subtitle": "[Conversation Topic]",
      "description": "You will hear [description]. First, you have some time to look at questions 1-10.",
      "transcript": "[Full transcript of the audio recording - written in dialogue format with speaker labels. The transcript should contain ALL the information needed to answer the questions correctly. Write it so an AI can derive the answers from it.]",
      "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-[1-16].mp3",
      "context": "Conversation between two speakers - social situation",
      "type": "LISTENING",
      "skill": "listening",
      "questions": [
        // Question groups
      ]
    }
  ]
}
```

### Transcript Guidelines

**IMPORTANT**: The `transcript` field is required for AI-generated content. When creating new listening parts:

1. **Write the transcript FIRST** before creating questions
2. The transcript must contain ALL information needed to answer every question
3. Base the answer keys directly on what is stated in the transcript
4. Write in clear dialogue format with speaker labels

**Transcript Structure Example:**
```json
{
  "id": "part1",
  "title": "Booking a Holiday Cottage",
  "description": "You will hear a conversation between a travel agent and a customer...",
  "transcript": "Travel Agent: Good morning, Lake District Holidays. How can I help you?\n\nCustomer: Good morning. I'm interested in booking a holiday cottage in the Lake District.\n\nTravel Agent: Of course. May I take your name?\n\nCustomer: Yes, it's Sarah Mitchell. S-A-R-A-H M-I-T-C-H-E-L-L.",
  ...
}
```

### Audio Sources
Use SoundHelix free MP3s: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-[1-16].mp3`

### Listening Part Topics

**Part 1 (Social Situations):**
- Booking services (hotel, restaurant, car rental)
- Making inquiries (information, reservations)
- Community services (library, leisure center)
- Travel arrangements

**Part 2 (Monologue - Information):**
- Local facility tour (museum, park, campus)
- Public announcement
- Instructions or directions
- Information about events or services

**Part 3 (Two/Multi-speaker - Academic):**
- Tutorial or seminar discussion
- Student-supervisor meeting
- Group project planning
- Course selection advice

**Part 4 (Lecture/Talk):**
- Academic lecture on any topic
- Scientific explanation
- Historical presentation
- Research findings

### Listening Question Types

**1. Multiple Choice**
- 3 options (A, B, C)
- One correct answer
- Type: `mcq`

**2. Matching**
- Match items to categories or features
- Type: `matching`

**3. Plan/Map/Diagram Labelling**
- Label locations on a map or diagram
- Write the correct letter (A-H)
- Type: `diagram-label`

**4. Form/Note/Table/Flow Chart/Summary Completion**
- Complete forms, notes, tables, flow charts, or summaries
- NO MORE THAN 2 WORDS AND/OR A NUMBER
- Type: `notes-completion`

**5. Sentence Completion**
- Complete sentences from the audio
- NO MORE THAN 2-3 WORDS
- Type: `sentence-complete`

**6. Short-Answer Questions**
- Write NO MORE THAN 2 WORDS
- Type: `short-answer`

---

## 6. Speaking Section

### Structure
```json
"speaking": {
  "title": "Speaking",
  "time": 15,
  "parts": [
    {
      "id": "part1",
      "title": "Part 1: Introduction and Interview",
      "type": "interview",
      "duration": "4-5 minutes",
      "instruction": "Answer the examiner's questions about familiar topics.",
      "topics": [
        {
          "topic": "Topic Name",
          "questions": [
            { "id": "p1q1", "text": "Question?" }
          ]
        }
      ]
    }
  ]
}
```

### Part 1 Topics (General):
- Home town or city
- Accommodation (your home, neighborhood)
- Work or studies
- Hobbies and free time
- Family and friends
- Food and cooking
- Transport and travel
- Shopping
- Weather and seasons
- Holidays and celebrations
- Sports and exercise
- Music and entertainment

### Part 2 (Long Turn)
```json
{
  "id": "part2",
  "title": "Part 2: Long Turn",
  "type": "long-turn",
  "duration": "3-4 minutes",
  "instruction": "You will have 1 minute to prepare, then speak for 1-2 minutes.",
  "topicCard": {
    "id": "task1",
    "topic": "Describe something...",
    "description": "You should say:",
    "bullets": [
      "what it is",
      "how you got it",
      "what you use it for",
      "explain why it is valuable"
    ],
    "roundingQuestions": [
      { "id": "r1", "text": "Follow-up question?" }
    ]
  }
}
```

### Part 2 Cue Card Types:
- Describe a place you visited
- Describe a person you admire
- Describe an object you own
- Describe a memorable event
- Describe a skill you learned
- Describe a book or film
- Describe a holiday destination
- Describe a restaurant or café

### Part 3 (Discussion)
```json
{
  "id": "part3",
  "title": "Part 3: Discussion",
  "type": "discussion",
  "duration": "4-5 minutes",
  "instruction": "Discuss more abstract topics related to Part 2.",
  "topics": [
    {
      "topic": "Theme",
      "questions": [
        { "id": "p3q1", "text": "Discussion question?" }
      ]
    }
  ]
}
```

### Part 3 Discussion Topics (related to Part 2):
- Advantages and disadvantages
- Causes and solutions
- Changes over time
- Social trends
- Future predictions
- Comparisons between cultures/times

---

## 7. IMPORTANT: Adding Words to vocabulary.js

After creating the mock, you MUST add vocabulary words to `src/data/vocabulary.js`.

### CEFR Level Classification

When adding vocabulary words to `vocabulary.js`, use **CEFRLookup** (or similar frequency-based tools like COCA, BNC corpora) to determine the correct CEFR level (B2 or C1):

- **B2 Level**: Common intermediate vocabulary - high frequency words used in everyday academic and professional contexts
- **C1 Level**: Advanced vocabulary - lower frequency, more specialized or academic words

To determine the level:
1. Look up each word in CEFRLookup or check its frequency band
2. Words appearing in the 2000-5000 most common words → B2
3. Words appearing above 5000+ (more specialized) → C1
4. More academic/scientific terms → typically C1

### Categories in vocabulary.js:
- **topic-environment** - Environment & Ecology
- **topic-sociology** - Sociology & Psychology  
- **topic-business** - Business & Economics
- **topic-tech** - Technology
- **topic-edu** - Education
- **topic-health** - Health & Well-being
- **topic-science** - Science & Nature
- **topic-sports** - Sports & Events
- **topic-physics** - Physics & Time
- **topic-community** - Community & Facilities
- **topic-employment** - Employment
- **topic-history** - History & Communication

### Adding Words to Existing Tasks:

Find the category and add words to an existing level task:

```javascript
// In topic-environment, find v_env_b2 task and add:
{ term: 'word', hu: 'hungarian', definition: 'definition', example: 'example sentence.' }
```

### Word Format:
```javascript
{ term: 'perceive', hu: 'érzékel', definition: 'To become aware of through the senses', example: 'Fish perceive electrical signals in water.' }
```

---

## 8. Register the Mock

Add to `src/data/IELTS/mocks/index.js`:

```javascript
import generalMock[N] from './ielts-general-mock-[N].json';

// Add to allMocks array
generalMock[N],

// Add to ieltsMocks object
'ielts-general-mock-[N]': generalMock[N],

// Add to generalMocks object
'ielts-general-mock-[N]': generalMock[N],
```

---

## 9. Hub Routes and Type Fields

### Important: The `type` and `skill` Fields

For hub routes to work correctly (Reading Academic, Reading General, Writing Academic, Writing General, Listening, Speaking), the mock data must include either a `type` field or a `skill` field (they are alternatives, not both required):

#### In Mock Root Header:
```json
{
  "id": "ielts-general-mock-1",
  "mockNumber": 1,
  "type": "general",  // or "academic"
  ...
}
```

#### In Reading Sections:
```json
"reading": {
  "title": "Reading",
  "time": 60,
  "type": "READING",  // Required for hub routes (alternatively, use "skill": "reading")
  "sections": [ ... ]
}
```

#### In Writing Sections:
```json
"writing": {
  "title": "Writing",
  "time": 60,
  "type": "WRITING",  // Required for hub routes (alternatively, use "skill": "writing")
  "sections": [ ... ]
}
```

#### In Listening Sections:
```json
"listening": {
  "title": "Listening",
  "time": 30,
  "type": "LISTENING",  // Required for hub routes (alternatively, use "skill": "listening")
  "sections": [ ... ]
}
```

#### In Speaking Sections:
```json
"speaking": {
  "title": "Speaking",
  "time": 15,
  "type": "SPEAKING",  // Required for hub routes (alternatively, use "skill": "speaking")
  "parts": [ ... ]
}
```

### Hub Routes Mapping

| Route | initialView | Loads Section |
|-------|-------------|---------------|
| `/dashboard/reading-academic` | `reading_academic` | Academic reading section |
| `/dashboard/reading-general` | `reading_general` | General reading section |
| `/dashboard/writing-academic` | `writing_academic` | Academic writing section |
| `/dashboard/writing-general` | `writing_general` | General writing section |
| `/dashboard/listening` | `listening` | Listening section |
| `/dashboard/speaking` | `speaking` | Speaking section |

### How Hub Tasks Work

1. Hub links pass `mockId` to identify which mock to load
2. App loads the mock and finds the section by matching `type` or `skill`
3. For Writing with multiple tasks, the app uses `activeSectionIndex` to render the correct task
4. Each writing task needs: `id`, `taskType`, `title`, `instruction`, `targetWords`, `prompt`, `bullets`

---

## Quick Reference: Question Types Summary

### Reading
| Type | Tests | Answer Format |
|------|-------|----------------|
| Matching Information | Finding specific paragraphs | A-H |
| Multiple Choice | Understanding details, inference | A/B/C/D |
| Short Answer | Finding specific info | 1-3 words |
| True/False/Not Given | Checking claims | TRUE/FALSE/NOT GIVEN |
| Yes/No/Not Given | Checking information | YES/NO/NOT GIVEN |
| Sentence Completion | Detail understanding | 1-2 words |
| Sentence Matching | Matching beginnings to endings | Full text |
| Heading Match | Main idea of paragraphs | 0-3 (index) |
| Diagram Labeling | Visual understanding | A-H letters |
| Summary/Gap Fill | Summary completion | 1-2 words |
| Table Completion | Table completion | 1-2 words |
| Flow Chart Completion | Process understanding | 1 word |
| Notes Completion | Notes completion | 1-2 words/numbers |
| Matching Features | Feature matching | A-D letters |
| Token Select | Word selection | Token selection |
| Punctuation Correction | Punctuation fixing | Corrected text |

### Listening
| Type | Tests | Answer Format |
|------|-------|----------------|
| Multiple Choice | Understanding details | A/B/C |
| Matching | Match items | A-D letters |
| Plan/Map/Diagram Labelling | Spatial understanding | A-H letters |
| Form/Note/Table/Flow Chart/Summary Completion | Detail recording | 1-2 words/numbers |
| Sentence Completion | Detail understanding | 1-3 words |
| Short-Answer Questions | Finding specific info | 1-2 words |

---

## Checklist

- [ ] Create mock JSON file in `src/data/IELTS/mocks/`
- [ ] Add mockNumber field
- [ ] Add `type` field to reading section (e.g., `"type": "READING"`)
- [ ] Add `type` field to writing section (e.g., `"type": "WRITING"`)
- [ ] Add `type` field to listening section (e.g., `"type": "LISTENING"`)
- [ ] Add `type` field to speaking section (e.g., `"type": "SPEAKING"`)
- [ ] Create 3 reading sections with passages (6-8 paragraphs each)
- [ ] Add vocabulary words (15-20 words from readings)
- [ ] Add vocabulary to appropriate category in `vocabulary.js`
- [ ] Create 2 writing tasks (letter + essay)
- [ ] Create 4 listening parts with questions
- [ ] Add `transcript` field to each listening part with the full audio script
- [ ] Ensure all question answers can be derived from the transcript
- [ ] Create 3 speaking parts (interview, long turn, discussion)
- [ ] Register mock in `src/data/IELTS/mocks/index.js`
- [ ] Test the mock loads correctly
- [ ] Test hub routes work (Reading Academic, Reading General, Writing Academic, Writing General, Listening, Speaking)
