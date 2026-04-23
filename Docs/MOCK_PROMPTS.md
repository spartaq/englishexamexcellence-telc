# TELC Mock Test Creation Prompts

Use these prompts to generate a complete mock test JSON for each level.

---

## Prompt 1: Create B1 Mock

Create a complete **TELC B1** mock test JSON. Include ALL sections below:

### Header
```json
{
  "id": "telc-b1-mock-[N]",
  "level": "b1",
  "mockNumber": [N],
  "title": "TELC B1 Mock Test [N]",
  "testBrand": "telc",
  "type": "general",
  "description": "Complete TELC B1 test with all 4 skills",
  "xpReward": 5000,
  "tier": "bronze",
  "instructions": "Read the instructions for each part of the paper carefully. Answer all the questions. Write your answers in the answer sheet. You must complete the answer sheet within the time limit. At the end of the test, hand in both this question paper and your answer sheet."
}
```

### Vocabulary (15-20 words)
- Extract from reading passages
- Fields: `term`, `hu`, `definition`, `example`

### Reading (3 parts, 20 min)
- Part 1: 5 short texts + heading match (questions 1-5)
- Part 2: 1 passage + MCQ (questions 6-10)
- Part 3: 8 texts (A-H) + matching info (questions 11-18)
- Include `vocabList` in each passage

### Writing (60 min, 2 tasks)
- Task 1: 150 words - formal letter (complaint/application)
- Task 2: 250 words - informal letter to friend
- Each task needs full `context` shown to test-taker

### Speaking (15 min, 3 parts)
- Part 1: Interview - 2 topics with follow-up questions
- Part 2: Discussion - text from magazine + 4 questions
- Part 3: Collaborative - topic with 8 suggestions

### Listening (30 min, 3 parts)
- Part 1: 5 news items → heading match (questions 41-45)
- Part 2: Interview → True/False/Not Given (questions 46-55)
- Part 3: 5 announcements → MCQ (questions 56-60)
- Use placeholder audio URLs (user will add transcripts separately)

### Language Elements (90 min, 2 parts)
- Part 1: MCQ cloze (questions 21-30, 8 gaps)
- Part 2: Gap-fill tokens (10 tokens, answers object)

---

## Prompt 2: Create B2 Mock

Create a complete **TELC B2** mock test JSON. Use B1 prompt as base but with:

### Differences from B1:
- More sophisticated vocabulary and topics
- Can reuse B1 prompt structure

### Additional B2 elements:
- Reading Part 3: Can have 8 questions (up to 18)
- More complex writing prompts
- More nuanced speaking topics

### Follow same structure as B1 otherwise - all 6 sections required.

---

## Prompt 3: Create C1 Mock

Create a complete **TELC C1** mock test JSON. Include ALL sections below:

### Header
```json
{
  "id": "telc-c1-mock-[N]",
  "level": "c1",
  "mockNumber": [N],
  "title": "TELC C1 Mock Test [N]",
  "testBrand": "telc",
  "type": "general",
  "description": "Complete TELC C1 test with all 4 skills",
  "xpReward": 5000,
  "tier": "bronze",
  "instructions": "Read the instructions for each part of the paper carefully..."
}
```

### Vocabulary (20 words)
- More advanced vocabulary from reading passages

### Reading (3 parts, 90 min)
- Part 1: Sentence insert (6 questions)
- Part 2: Selective understanding (6 questions)
- Part 3: True/False/Not Given (6 questions)

### Writing (60 min, 2 tasks)
- Task 1 (Compulsory): 200 words - formal letter/essay/proposal
- Task 2 (Optional): 4 choices × 150 words each

### Speaking (15 min, 2 parts)
- Part 1: Presentation - 2 topics to choose from + follow-up questions
- Part 2: Discussion - quote + 4 discussion questions

### Listening (30 min, 3 parts)
- Part 1: Matching (opinions)
- Part 2: MCQ (interview/talk)
- Part 3: Notes completion

### Language Elements (90 min, 1 part)
- MCQ cloze: 20 gaps (questions 21-40)

---

## Output Format

Return ONLY valid JSON - no explanations, no markdown code blocks. The JSON should be ready to save as:
- B1: `src/data/TELC/mocks/b1/telc-b1-mock-[N].json`
- B2: `src/data/TELC/mocks/b2/telc-b2-mock-[N].json`
- C1: `src/data/TELC/mocks/c1/telc-c1-mock-[N].json`