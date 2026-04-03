# IELTS Test Flows Analysis

## Overview

This document analyzes all the different test flows in the IELTS section of the application.

---

## 1. BUTTON TITLES & PATHS

### BrandTestHub.jsx (IELTS Test Hub - Main Entry)
| Path | Button Title | Description |
|------|--------------|-------------|
| `'skill-tests'` | (Card click - "Skill Tests") | Shows Skill Tests view with individual skill buttons |
| `'general-full-mock'` | "Take General Mock" | Start General Training full mock (4 skills) |
| `'academic-full-mock'` | "Take Academic Mock" | Start Academic full mock (4 skills) |
| `'random-mock'` | "Take Random Mock" | Random mock (general or academic) |
| `'mocks'` | "View All Mocks" | Navigate to Test Hub grid |

### ExamStrategy.jsx (Strategy Screen - After selecting IELTS)
| Path | Button Title | Description |
|------|--------------|-------------|
| `'atoms'` | "Train Atoms" | Quick skill practice with daily mixed flow |
| `'mocks'` | "Take Full Mock" | Full mock exam (same as 'general-full-mock') |

### SkillTests View (Individual Skill Practice)
| Path | Button | Action |
|------|--------|--------|
| - | "Reading" | `pluckRandom('reading')` +300 XP |
| - | "Listening" | `pluckRandom('listening')` +250 XP |
| - | "Writing" | `pluckRandom('writing')` +400 XP |
| - | "Speaking" | `pluckSingleSpeakingPart()` +300 XP |

---

## 2. MINI TEST FLOWS

### 2.1 General Mini Test
- **Route:** `/ielts/general-mini-test`
- **Trigger:** `path === 'general-mini-test'`
- **Type:** `'mini-test-flow'`
- **Content:**
  - Reading: `pluckRandom('reading_general')` - General Reading passage
  - Writing: `pluckRandom('writing_general')` - General Writing task
  - Listening: `pluckRandom('listening')` - Listening exercise
  - Speaking: Single speaking part from `pluckSingleSpeakingPart()`
  - Vocab: From reading passage via `findVocabFromReading()`
- **Structure:** 5 sections with `skill` property (vocab, reading, listening, writing, speaking)
- **Speaking:** Shows single part (NOT Part 1/2/3 tabs)
- **XP Reward:** 1000

### 2.2 Academic Mini Test
- **Route:** `/ielts/academic-mini-test`
- **Trigger:** `path === 'academic-mini-test'`
- **Type:** `'academic-mini-flow'`
- **Content:**
  - Reading: `pluckRandom('reading_academic')` - Academic Reading passage
  - Writing: `pluckRandom('writing_academic')` - Academic Writing task
  - Listening: `pluckRandom('listening')` - Listening exercise
  - Speaking: Single speaking part from `pluckSingleSpeakingPart()`
  - Vocab: From reading passage via `findVocabFromReading()`
- **Structure:** 5 sections with `skill` property
- **Speaking:** Shows single part (NOT Part 1/2/3 tabs)
- **XP Reward:** 1500

---

## 3. FULL MOCK FLOWS (via Hubs)

### 3.1 IELTS Test Hub - Reading Academic
- **Route:** `/ielts/reading-academic`
- **Hub Key:** `reading_academic`
- **Data Source:** IELTS_READING_AC (Academic Reading Hub)
- **Content:** Academic reading passages with subTasks

### 3.2 IELTS Test Hub - Reading General
- **Route:** `/ielts/reading-general`
- **Hub Key:** `reading_general`
- **Data Source:** IELTS_READING_GT (General Reading Hub)
- **Content:** General reading passages with subTasks

### 3.3 IELTS Test Hub - Writing Academic
- **Route:** `/ielts/writing-academic`
- **Hub Key:** `writing_academic`
- **Data Source:** IELTS_WRITING_AC (Academic Writing Hub)

### 3.4 IELTS Test Hub - Writing General
- **Route:** `/ielts/writing-general`
- **Hub Key:** `writing_general`
- **Data Source:** IELTS_WRITING_GT (General Writing Hub)

### 3.5 IELTS Test Hub - Listening
- **Route:** `/ielts/listening`
- **Hub Key:** `listening`
- **Data Source:** IELTS_LISTENING (Listening Hub)

### 3.6 IELTS Test Hub - Speaking
- **Route:** `/ielts/speaking`
- **Hub Key:** `speaking`
- **Data Source:** IELTS_SPEAKING (Speaking Hub)
- **Content:**
  - Full speaking mocks with 3 parts (Part 1: Interview, Part 2: Long Turn, Part 3: Discussion)
  - Shows Part 1/2/3 tabs for full mock tests
- **Type:** `'ielts-speaking'`
- **Parts:** Array of 3 parts with `type: 'interview'`, `'long-turn'`, `'discussion'`

---

## 4. FULL TEST FLOWS (Combined 4-Skill Tests)

### 4.1 General Full Mock Test
- **Button:** "Take General Mock"
- **Route:** `/ielts/general-full-test`
- **Trigger:** `pluckRandomFullMock('general')`
- **Type:** `'general-reading-mock'` or similar
- **Content:** All 4 skills in sequence
- **Structure:** Uses `sections` array with different skills

### 4.2 Academic Full Mock Test
- **Button:** "Take Academic Mock"
- **Route:** `/ielts/academic-full-test`
- **Trigger:** `pluckRandomFullMock('academic')`
- **Type:** `'academic-reading-mock'` or similar
- **Content:** All 4 skills in sequence
- **Structure:** Uses `sections` array with different skills

### 4.3 Random Full Mock Test
- **Button:** "Take Random Mock"
- **Route:** `path === 'random-mock'`
- **Trigger:** `pluckRandomFullMock()` (no type filter)
- **Content:** Random general or academic mock

---

## 5. VIEW ALL MOCKS (Test Hub Grid)

- **Button:** "View All Mocks"
- **Route:** `path === 'mocks'`
- **Trigger:** Navigates to test hub with URL change
- **Content:** Shows grid of all available mocks by skill

---

## 6. ATOM/FLOW TYPES

### 6.1 Daily Flow (flow type)
- **Button:** "Train Atoms" (from Strategy)
- **Trigger:** `taskMetadata.type === 'flow'`
- **Type:** `'mixed-flow'`
- **Content:** Random exercises from each skill
- **Sources:**
  - Reading: `pluckRandom('reading')`
  - Writing: `pluckRandom('writing')`
  - Listening: `pluckRandom('listening')`
  - Speaking: `pluckSingleSpeakingPart()`
  - Vocab: `pluckRandom('vocabulary')`

### 6.2 Academic Flow (academic-flow type)
- **Trigger:** `taskMetadata.type === 'academic-flow'`
- **Type:** `'mixed-flow'`
- **Content:** Academic-specific exercises
- **Sources:**
  - Reading: `pluckRandom('reading_academic')`
  - Writing: `pluckRandom('writing_academic')`

---

## 7. SKILL TESTS (Individual Skills)

- **View:** "Skill Tests" (from BrandTestHub card click)
- **Route:** `path === 'skill-tests'` → `navigateToView('skillTests')`
- **Content:** Individual skill exercises (not combined flow)
- **Available Skills:**
  | Skill | Action | XP |
  |-------|--------|-----|
  | Reading | `pluckRandom('reading')` | +300 |
  | Listening | `pluckRandom('listening')` | +250 |
  | Writing | `pluckRandom('writing')` | +400 |
  | Speaking | `pluckSingleSpeakingPart()` | +300 |

---

## 8. SPEAKING PART TYPES

| Part | Type | Content |
|------|------|---------|
| Part 1 | `'interview'` | Prompts with topics and questions |
| Part 2 | `'long-turn'` | Topic card with bullet points |
| Part 3 | `'discussion'` | Topics with discussion questions |

**Tab Display Names:**
| Type | Tab Label |
|------|----------|
| `'interview'` | "Part 1" |
| `'long-turn'` | "Part 2" |
| `'discussion'` | "Part 3" |

---

## 9. ROUTING SUMMARY

### Public Routes
- `/` → Landing Page
- `/ielts-info` → IELTS Info page (SEO, public)
- `/free-mock` → Free mock without login (redirects to general mini test)

### IELTS Routes (Exam-Based Routing)
- `/ielts` → IELTS Hub (main entry)
- `/ielts/general-mini-test` → General Mini Test
- `/ielts/academic-mini-test` → Academic Mini Test
- `/ielts/general-full-test` → General Full Mock Test
- `/ielts/academic-full-test` → Academic Full Mock Test
- `/ielts/general-full-individual` → General Full Mock Individual Skills
- `/ielts/academic-full-individual` → Academic Full Mock Individual Skills
- `/ielts/reading-academic` → Academic Reading Hub
- `/ielts/reading-general` → General Reading Hub
- `/ielts/writing-academic` → Academic Writing Hub
- `/ielts/writing-general` → General Writing Hub
- `/ielts/listening` → Listening Hub
- `/ielts/speaking` → Speaking Hub
- `/ielts/vocabulary` → Vocabulary Hub
- `/ielts/drillshub` → Drills Hub
- `/ielts/mini-individual` → Mini Individual Hub
- `/ielts/full-individual` → Full Individual Test Hub

### LangCert Routes (Exam-Based Routing)
- `/langcert` → LangCert Hub
- `/langcert/test-hub` → LangCert Test Hub
- `/langcert/reading` → LangCert Reading

### TOEFL Routes (Exam-Based Routing)
- `/toefl` → TOEFL Hub
- `/toefl/test-hub` → TOEFL Test Hub

### Navigation Flow
```
Landing Page → IELTS Hub
  ├── Mini Tests (General/Academic)
  ├── Full Mock Tests (General/Academic)
  ├── Individual Skill Hubs
  │   ├── Reading (AC/GT)
  │   ├── Writing (AC/GT)
  │   ├── Listening
  │   └── Speaking
  ├── Vocabulary Hub
  └── Drills Hub
```

---

## 10. KEY DIFFERENCES: MINI vs FULL MOCK vs SKILL TESTS

| Feature | Skill Tests | Mini Test | Full Mock (Hub) |
|---------|--------------|-----------|-----------------|
| Speaking Parts | 1 (single part) | 1 (single part) | 3 (Part 1/2/3 tabs) |
| Sections | 1 (single skill) | 5 (one per skill) | Varies by module |
| Skill Tabs | Shows single skill | Shows all 5 skills | Shows single skill |
| Content Source | Random pluck | Random pluck | Specific hub data |

---

## 11. ISSUES IDENTIFIED & FIXED

1. ✅ Part 3 questions not rendering - Fixed by adding `'discussion'` type to render conditions
2. ✅ Mini test showing Part 1/2/3 tabs - Fixed by adding `!activeLesson.type?.includes('mini')` condition

---

## 12. POTENTIAL ISSUES TO CHECK

1. General vs Academic flows - Ensure correct data is plucked for each
2. Speaking in full mocks - Ensure all 3 parts render correctly
3. Navigation between parts in full mocks
4. Review mode for speaking parts
5. Scoring/evaluation for each part type
6. Skill Tests writing - Ensure correct data is plucked (currently using 'writing' not 'writing_general' or 'writing_academic')
