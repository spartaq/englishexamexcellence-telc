code
Code
# TELC Mock Test Template

Use this template when creating new TELC mock tests (B1, B2, C1). Follow the structure exactly.

---

## TELC Level Differences

| Level | Parts | Time | Notes |
|-------|-------|------|-------|
| **B1** | 3 Reading, 2 Writing, 3 Speaking, 3 Listening, 2 Language Elements | 20/60/15/30/90 min | Standard structure |
| **B2** | 3 Reading, 2 Writing, 3 Speaking, 3 Listening, 2 Language Elements | 20/60/15/30/90 min | Same as B1 |
| **C1** | 3 Reading, 2 Writing, 2 Speaking, 3 Listening, 1 Language Elements | 90/60/15/30/- | Different task types |

---

### Question ID Format

> **IMPORTANT**: For Reading questions, use sequential IDs (1, 2, 3... through the parts). Language Elements uses IDs 21-30, 31-40, etc. Listening questions for B2 mock start from 1 for the first section. Question IDs can be strings ("1", "2") or numbers (1, 2) - be consistent within each section.

- **Reading**: Questions 1-20 across all 3 parts
- **Language Elements**: Questions 21-30 (Part 1), 31-40 (Part 2)
- **Listening**: Questions 1-5 (Part 1), 6-10 (Part 2), 11-15 (Part 3)
- **Writing**: Use task IDs like "w-m[N]-t1", "w-m[N]-t2"
- **Speaking**: Use "p1q1", "p2q1", etc. (part + question)

### Answer Formats

- **Listening MCQ**: Answers can be index (0, 1, 2) OR full text of the option
- **Reading MCQ**: Answers can be index OR full text
- **Matching Info**: Single letter "A", "B", etc.
- **Heading Match**: Index number (0, 1, 2...)
- **Trinary**: "TRUE", "FALSE", "NOT GIVEN" (not +, -, X)

---

## 1. Mock File Header

### File Location
B1: src/data/TELC/mocks/b1/telc-b1-mock-[N].json
B2: src/data/TELC/mocks/b2/telc-b2-mock-[N].json
C1: src/data/TELC/mocks/c1/telc-c1-mock-[N].json
code
Code
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
  "instructions": "Read the instructions for each part of the paper carefully. Answer all the questions. Write your answers in the answer sheet. You must complete the answer sheet within the time limit. At the end of the test, hand in both this question paper and your answer sheet."
}
2. Vocabulary Section
Structure (All Levels)
code
JSON
"vocabulary": {
  "id": "vocab-general-[N]",
  "title": "Test Vocabulary",
  "level": "B1|B2|C1",
  "words": [
    { "term": "Word", "hu": "hungarian", "definition": "english definition", "example": "example sentence" }
  ]
}
Note: term field can be capitalized, as seen in Femininity.
3. Reading Section
Structure
code
JSON
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
          "vocabList": ["word1", "word2"],
          "content": [
            { "id": "1", "text": "Paragraph content..." }
          ],
          "subTasks": [
            {
              "type": "heading-match|mcq|matching-info|sentence-insert|trinary",
              "instruction": "Question instruction...",
              "questions": [{ "id": "1", "text": "Question text...", "answer": "Answer format" }],
              "options": [...],
              "headings": []
            }
          ]
        }
      ]
    }
  ]
}
 Note: passages[].title can be "Various texts" for Part 1. **IMPORTANT**: For Part 1 (heading match with 5 short texts), all 5 texts MUST be in a SINGLE passage object with content IDs "1", "2", "3", "4", "5" - NOT as separate passage objects. subTasks[].questions for heading-match use text as "Paragraph 1" and answer as an index number. For mcq, answer can be the full text of the option. For matching-info, answer is a single letter (A-L).

### Canonical Example: Reading Part 1 (Heading Match)

For B2 mock tests, Part 1 of Reading (heading match with 5 short texts) must follow this exact structure:

```json
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
      "type": "READING",
      "vocabList": ["word1", "word2", "word3"],
      "content": [
        { "id": "1", "text": "First short text content..." },
        { "id": "2", "text": "Second short text content..." },
        { "id": "3", "text": "Third short text content..." },
        { "id": "4", "text": "Fourth short text content..." },
        { "id": "5", "text": "Fifth short text content..." }
      ],
      "subTasks": [
        {
          "type": "heading-match",
          "instruction": "Choose the correct heading for each paragraph.",
          "questions": [
            { "id": "1", "text": "Paragraph 1", "answer": 2 },
            { "id": "2", "text": "Paragraph 2", "answer": 0 },
            { "id": "3", "text": "Paragraph 3", "answer": 5 },
            { "id": "4", "text": "Paragraph 4", "answer": 1 },
            { "id": "5", "text": "Paragraph 5", "answer": 4 }
          ],
          "headings": [
            "Heading A",
            "Heading B",
            "Heading C",
            "Heading D",
            "Heading E",
            "Heading F",
            "Heading G"
          ]
        }
      ]
    }
  ]
}
```

**CRITICAL**: Do NOT create 5 separate passage objects. All 5 texts must be within the `content` array of a SINGLE passage object, with sequential IDs "1" through "5".

**IMPORTANT**: For heading-match questions, the `headings` array should contain plain text WITHOUT letter prefixes (e.g., "Local Sports Team Wins Championship" NOT "A. Local Sports Team Wins Championship"). The answer field uses the index number (0, 1, 2...) to reference the correct heading.

Reading Question Types
Type	Description	Answer Format
heading-match	Match headings to paragraphs	index (0, 1, 2...)
mcq	Multiple choice (3-4 options)	index or "a/b/c" or full text
matching-info	Find paragraph with info	letter (a, b, c...)
sentence-insert	Insert missing sentences	letter (a, b, c...)
trinary	True/False/Not Given	"TRUE", "FALSE", "NOT GIVEN"
Content Format
code
JSON
"content": [
  { "id": "A", "text": "Paragraph content..." },
  { "id": "B", "text": "Another paragraph..." }
]
Do NOT use HTML tags inside content.
4. Writing Section
B1/B2 Structure (2 independent tasks)
code
JSON
"writing": {
  "title": "Writing",
  "time": 60,
  "sections": [
    {
      "id": "w-m[N]-t1",
      "taskType": 1,
      "title": "Task 1: [Type]",
      "subtitle": "Part 1: Writing",
      "intro": "Optional introductory text for the task, e.g., 'You see this advert online'",
      "instruction": "Write instructions...",
      "context": "Full context/context for the task (shown to test-taker)...",
      "targetWords": 150,
      "xp": 250,
      "prompt": "What to write about",
      "bullets": ["Point 1", "Point 2"],
      "type": "letter|article|review"
    },
    {
      "id": "w-m[N]-t2",
      "taskType": 2,
      "title": "Task 2: [Type]",
      "subtitle": "Part 2: Writing",
      "instruction": "Write instructions...",
      "context": "Full context/context for the task (shown to test-taker)...",
      "targetWords": 250,
      "xp": 500,
      "prompt": "What to write about",
      "bullets": ["Point 1", "Point 2"],
      "type": "letter|article|review"
    }
  ]
}
Note: sections[].intro is an optional field for extra introductory context to the task. sections[].bullets can also contain a single bullet point like "Please write at least 80 words."
C1 Structure (Compulsory task + Optional tasks with options array)
code
JSON
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
      "context": "Full context/context for the task (shown to test-taker)...",
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
        { "id": "optional-a", "title": "A: [Title]", "context": "Full context...", "targetWords": 150, "xp": 300, "type": "letter" },
        { "id": "optional-b", "title": "B: [Title]", "context": "Full context...", "targetWords": 150, "xp": 300, "type": "informative" },
        { "id": "optional-c", "title": "C: [Title]", "context": "Full context...", "targetWords": 150, "xp": 300, "type": "letter" },
        { "id": "optional-d", "title": "D: [Title]", "context": "Full context...", "targetWords": 150, "xp": 300, "type": "article" }
      ]
    }
  ]
}
5. Speaking Section
B1/B2 (3 parts: Interview, Discussion, Collaborative)
code
JSON
"speaking": {
  "title": "Speaking",
  "time": 15,
  "sections": [
    {
      "id": "part1",
      "title": "Introduction and Interview",
      "subtitle": "Part 1: Speaking",
      "type": "interview",
      "duration": "4-5 minutes",
      "instruction": "You are expected to give a short presentation to your partner(s) on one of the following topics. (The prompts in brackets may help you.) Your presentation should take about 90 seconds and you should answer your partner’s questions afterwards. While your partner is giving his/her presentation, listen and think of the questions you would like to ask. You should not interrupt your partner during the presentation",
      "topics": [
        { "topic": "Topic name", "questions": [{ "id": "p1q1", "text": "Question text or prompt for presentation" }] }
      ]
    },
    {
      "id": "part2",
      "title": "Discussion",
      "subtitle": "Part 2: Speaking",
      "type": "discussion",
      "duration": "3-4 minutes",
      "instruction": "Read the following text from a magazine. Discuss the content of the text with your partner(s). Tell them your opinions; give reasons and personal examples to support your ideas. Talk about your own experience with the problems mentioned and possible solutions.",
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
C1 (2 parts: Presentation, Discussion with quote)
code
JSON
"speaking": {
  "title": "Speaking",
  "time": 15,
  "sections": [
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
Speaking Types
interview - Q&A format with single topic
presentation - Short talk (1-2 topics with follow-up questions)
discussion - Discuss text/quote with multiple questions
collaborative - Partner discussion and decision


6. Listening Section
Structure (All Levels - 3 parts)
code
JSON
"listening": {
  "title": "Listening",
  "time": 30,
  "instructions": "You will hear a number of different recordings and you will have to answer questions on what you hear. There will be time for you to read the instructions and questions, and you will have a chance to check your work. All the recordings will be played once only. The test is in 3 parts. At the end of the test, you will be given 10 minutes to transfer your answers to the answer sheet.",
  "sections": [
    {
      "id": "part1",
      "part": 1,
      "title": "Title",
      "subtitle": "Part 1: Listening",
      "description": "Part instructions...",
      "transcript": "Transcript of audio...",
      "audioUrl": "/audio/PEL-B2-Test[N]-Part[N].mp3",
      "context": "Context type",
      "type": "LISTENING",
      "skill": "listening",
      "subTasks": [
        {
          "type": "heading-match|mcq|trinary|notes-completion|matching-info",
          "instruction": "Question instruction...",
          "questions": [{ "id": "[N]", "text": "Question text...", "answer": "Answer format" }],
          "options": [...],
          "headings": [...],
          "tokens": [...],
          "answers": {},
          "mode": "tfng" // Only for trinary type
        }
      ]
    }
  ]
}
Listening Question Types
heading-match - Match headlines to news items
mcq - Multiple choice (3-8 options) - answers can be full text or index
trinary - True/False/Not Given - answers: "TRUE", "FALSE", "NOT GIVEN" (not +, -, X). Can include mode: "tfng".
notes-completion - Fill in notes from recording
matching-info - Match speakers to statements
B2 Mock Reference: telc-b2-mock-2.json Listening Structure

B1 and B2 tests use a standard 3-part listening structure:
Part 1: Heading Match (Situations) - 5 everyday situations.  Match to headings (index).
Part 2: Trinary (Interview/Topic) - True/False/Not Given. 5 statements.  Answers: "TRUE", "FALSE", "NOT GIVEN".
Part 3: MCQ (Opinions/Methods) - 5 speakers, match to opinions (A-H, multiple unused). Answers: index.
Audio: Actual recordings available, indicated by /audio/PEL-B2-Test[N]-Part[N].mp3.

7. Language Elements Section
B1/B2 (2 parts)
code
JSON
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
          "subtitle": "Language Elements",
          "type": "LANGUAGE-ELEMENTS",
          "content": [
            { "id": "1", "text": "Full text with gaps like ____(21)____" }
          ],
          "subTasks": [
            {
              "type": "mcq",
              "instruction": "Choose the correct answer for each gap.",
              "questions": [
                { "id": "21", "text": "Text with gap", "options": ["a", "b", "c"], "answer": "full text of option" }
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
      "description": "Read the following",
      "passages": [
        {
          "id": "p2",
          "title": "Text Title",
          "subtitle": "Language Elements Part 2",
          "type": "LANGUAGE-ELEMENTS",
          "content": [
            { "id": "1", "text": "Full text with gaps like ____(a)____" }
          ],
          "subTasks": [
            {
              "type": "gap-fill-tokens",
              "instruction": "Choose the correct word (a-o) to complete each sentence.",
              "tokens": ["WORD1", "WORD2", "WORD3", ...],
              "questions": [{ "id": "a", "text": "expected word" }],
              "answers": {
                "a": "WORD1",
                "b": "WORD2"
              }
            }
          ]
        }
      ]
    }
  ]
}
C1 (1 part only)
code
JSON
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
Language Elements Question Types
mcq - Multiple choice cloze (3 options per gap) - answers are full text of option string.
gap-fill-tokens - Token selection (a-j, 10 tokens), uses "tokens" array and "answers" object. questions array contains objects with id and text (expected word), and answers object maps id to the capitalized token string.
8. Common Fields
Required Type Fields for All Sections
code
JSON
"reading": { "title": "Reading", "time": N, "sections": [...] }
"writing": { "title": "Writing", "time": 60, "sections": [...] }
"speaking": { "title": "Speaking", "time": 15, "sections": [...] }
"listening": { "title": "Listening", "time": 30, "instructions": "...", "sections": [...] }
"languageElements": { "title": "Language Elements", "time": 90, "sections": [...] }
9. Register the Mock
After creating the mock JSON file, you must register it in src/data/TELC/mocks/index.js:
Step 1: Import the mock
code
JavaScript
import telcB2Mock2 from './telc-b2-mock-2.json';
Step 2: Add to allMocks array
code
JavaScript
const allMocks = [
  telcB1Mock1,
  telcB2Mock1,
  telcB2Mock2,  // Add here
  telcC1Mock1
];
Step 3: Add to telcMocks object
code
JavaScript
export const telcMocks = {
  'telc-b1-mock-1': telcB1Mock1,
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2,  // Add here
  'telc-c1-mock-1': telcC1Mock1
};
Step 4: Add to level-specific export
code
JavaScript
export const b2Mocks = {
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2  // Add here
};
File Paths by Level
B1: src/data/TELC/mocks/telc-b1-mock-[N].json
B2: src/data/TELC/mocks/telc-b2-mock-[N].json
C1: src/data/TELC/mocks/telc-c1-mock-[N].json
Example: Creating telc-b2-mock-2.json
10. Content Creation Guide
Reading Passages
B1/B2 Topics (Short, real-world texts)
News stories (100-150 words each, 5 short texts for Part 1)
Advertisements, announcements, letters
Information texts about places, products, events
Email exchanges
Tips:
Keep passages short and simple for B1
B2 can have slightly more complex sentences
Use real, authentic English where possible
Avoid overly academic or technical language
5 texts for Part 1 (B1/B2):
Each 80-150 words
Topics: news, travel, shopping, health, entertainment
Longer passage for Part 2/3:
300-500 words
Topic-based article (environment, technology, lifestyle, work)
C1 Topics (More complex)
Academic-style texts
Longer articles (400-600 words per passage)
More sophisticated vocabulary and sentence structure
Question Types:
Part	Type	Description	Questions
B1/B2 Part 1	Heading Match	Match 5 headings to 5 short texts	5
B1/B2 Part 2	MCQ	3-option multiple choice	5
B1/B2 Part 3	Matching Info	Match statements to paragraphs	10
C1 Part 1	Sentence Insert	Insert missing sentences	6
C1 Part 2	Selective Understanding	Find specific info in text	6
C1 Part 3	True/False/Not Given	Verify statements against text	6
Writing Tasks
B1/B2 Task 1 (150 words)
Types:
Letter (with specific bullet points/options for content, can include an intro field)
Email to editor
Response to advertisement
Common prompts:
Write a letter of complaint
Write a letter applying for something
Write a letter to a friend about an event
Write about your favorite recipe
B1/B2 Task 2 (250 words)
Types:
Informal letter to friend
Article for magazine/website
Review
Common prompts:
Give advice to a friend
Describe a place/experience
Write about a topic you know well
C1 Task 1 - Compulsory (200 words)
Types:
Formal letter to editor
Opinion essay
Proposal
Common prompts:
Letter to newspaper about local issue (wind turbines example)
Essay giving your opinion on a topic
Proposal for changes
C1 Task 2 - Optional (150 words each, choose 1 of 4)
Option types:
A: Letter to yourself (personal reflection)
B: Promotional text (sports club, etc.)
C: Complaint letter to manufacturer
D: Contribution to website
Speaking Tasks
B1/B2 Part 1 - Interview
Single topic (city, music, hobby, etc.)
1-2 presentation prompts, with follow-up questions implied by instruction
Answer from personal experience
Example topics:
A city you particularly like
Music you often listen to
A hobby you enjoy
B1/B2 Part 2 - Discussion
Text/quote to discuss (magazine excerpt)
Questions about the text
Example texts:
Short article on a topic
Quotes from famous people
Statistics or facts
B1/B2 Part 3 - Collaborative Task
Topic with 2-3 suggestions/options
Discuss and make a decision together
Example:
Discuss advantages/disadvantages
Choose the best option
Plan something together
C1 Part 1 - Presentation
2 topics to choose from
3-minute presentation
Follow-up questions
Example topics:
"Is donating to charity popular in your country?"
"How important is your mobile phone?"
C1 Part 2 - Discussion
Quote to discuss
4 discussion questions
Example quote:
"I do not like work, even when someone else does it." Mark Twain
Questions:
What do you understand by this statement?
In what way do you agree or disagree?
Give reasons and examples
React to your partner's arguments
Listening Scripts
B1/B2 Part 1 - News Items
5 short situations/announcements
Match to headings (a-f, one unused)
B1/B2 Part 2 - Interview/Dialogue
True/False/Not Given questions
5 questions
B1/B2 Part 3 - Longer Talk/Announcement
Multiple choice (A-H, multiple unused)
5 questions
C1 Part 1 - Opinions (Matching)
8 speakers
Match to statements (8 of 10 statements)
C1 Part 2 - Interview/Talk (MCQ)
Multiple choice
10 questions
C1 Part 3 - Presentation (Notes)
Note completion
10 items to fill in
Language Elements
B1/B2 Part 1 - Multiple Choice Cloze
10 gaps (questions 21-30)
Text: 150-200 words
3 options per gap (a, b, c)
Topics:
Personal letters
Informal emails
Short articles
B1/B2 Part 2 - Word Formation OR Token Selection
10 gaps
Either: transform word OR select from tokens (a-o)
C1 Part 1 - Multiple Choice Cloze
20 gaps (questions 21-40)
Longer text (250-300 words)
More complex grammar
Vocabulary Creation
Extract 15-20 important words from ALL reading passages:
code
JSON
{
  "term": "Word",
  "hu": "hungarian",
  "definition": "english definition",
  "example": "example sentence"
}
Rules:
term: Can be capitalized or lowercase English word
hu: Hungarian translation
definition: Simple B1-level definition, avoid circular definitions
example: Natural English sentence using the word
Audio Sources
Use these free test audio sources:
code
Code
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3
...
https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3
Note: For actual tests, audioUrl can point to specific paths like /audio/PEL-B2-Test[N]-Part[N].mp3.
Example: Creating a B1 Mock
Header: Set level to "b1", mockNumber to 1
Vocabulary: Write 15-20 words from readings
Reading:
Part 1: 5 short texts + heading match
Part 2: 1 passage + MCQ
Part 3: 3-4 short texts + matching info
Writing: Task 1 (150w) + Task 2 (250w)
Speaking: Interview + Discussion + Collaborative
Listening: 3 parts with different question types
Language Elements: 2 parts with MCQ cloze