# IELTS Mock Test Template

Use this template when creating new IELTS mock tests. Follow the structure exactly and ensure vocabulary words from reading passages are also added to vocabulary.js.

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

### Writing Details:
- **Task 1**: Letter (150 words, 20 min)
- **Task 2**: Essay (250 words, 40 min)

### Listening Details:
- **Part 1**: Form completion (10 questions)
- **Part 2**: Multiple choice + matching (10 questions)
- **Part 3**: Conversation discussion (10 questions)
- **Part 4**: Lecture/short answers (10 questions)
- Total: 40 questions

### Speaking Details:
- **Part 1**: 2 topics × 4 questions = 8 questions (4-5 min)
- **Part 2**: 1 cue card with bullet points (3-4 min)
- **Part 3**: 4 discussion questions (4-5 min) |

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
1. Extract 15-20 important words from your reading passages
2. Each word needs:
   - `term`: English word (lowercase)
   - `hu`: Hungarian translation
   - `definition`: Simple English definition
   - `example`: Example sentence in English

### Example
```json
{ "term": "perceive", "hu": "érzékel", "definition": "To become aware of through the senses", "example": "Fish perceive electrical signals in water." }
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

**2. Multiple Choice**
- 4 options (A, B, C, D)
- Only ONE correct answer
- Tests: Understanding details, author's purpose, inferring meaning

**3. Short Answer**
- Write NO MORE THAN 2-3 WORDS
- Answers from the text directly
- Tests: Finding specific information

**4. True/False/Not Given**
- Statements about the passage
- Must be explicitly stated to be TRUE/FALSE
- Tests: Understanding claims vs. text

**5. Sentence Completion**
- Complete sentences using words from text
- NO MORE THAN 2 WORDS
- Tests: Understanding detail

**6. Diagram Labeling**
- Label a diagram (map, device, process)
- Choose from options or write word
- Tests: Understanding visual information

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

**1. Form/Table Completion:**
- Complete application forms
- Fill in tables with details
- Write NO MORE THAN 2 WORDS

**2. Multiple Choice:**
- 3 options (A, B, C)
- One correct answer

**3. Short Answer:**
- Write NO MORE THAN 2 WORDS
- Answers from the audio

**4. Sentence Completion:**
- Complete sentences
- Word limit: 2-3 words

**5. Map/Diagram Labeling:**
- Label locations on a map
- Label parts of a device or process
- Choose from options (A-H)

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
    "bulletPoints": [
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

## Quick Reference: Question Types Summary

### Reading
| Type | Tests | Answer Format |
|------|-------|----------------|
| Matching Information | Finding specific paragraphs | A-H |
| Multiple Choice | Understanding details, inference | A/B/C/D |
| Short Answer | Finding specific info | 1-3 words |
| True/False/Not Given | Checking claims | TRUE/FALSE/NOT GIVEN |
| Sentence Completion | Detail understanding | 1-3 words |
| Diagram Labeling | Visual understanding | Letter or word |

### Listening
| Type | Tests | Answer Format |
|------|-------|----------------|
| Form Completion | Detail recording | 1-2 words/numbers |
| Multiple Choice | Understanding details | A/B/C |
| Short Answer | Finding specific info | 1-2 words |
| Map/Diagram | Spatial understanding | A-H letters |
| Sentence Completion | Detail understanding | 1-3 words |

---

## Checklist

- [ ] Create mock JSON file in `src/data/IELTS/mocks/`
- [ ] Add mockNumber field
- [ ] Create 3 reading sections with passages (6-8 paragraphs each)
- [ ] Add vocabulary words (15-20 words from readings)
- [ ] Add vocabulary to appropriate category in `vocabulary.js`
- [ ] Create 2 writing tasks (letter + essay)
- [ ] Create 4 listening parts with questions
- [ ] Create 3 speaking parts (interview, long turn, discussion)
- [ ] Register mock in `src/data/IELTS/mocks/index.js`
- [ ] Test the mock loads correctly
