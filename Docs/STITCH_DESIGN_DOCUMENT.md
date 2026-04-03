# English Exam Excellence - Design Document for Stitch

## 1. Project Overview

**Project Name:** English Exam Excellence (The Exam Lab)  
**Project Type:** Educational Web Application  
**Core Functionality:** An online platform for practicing English language exams (IELTS, TOEFL, LangCert) with both full mock tests and bite-sized "Atom" exercises for daily skill-building.  
**Target Users:** Students preparing for English proficiency exams (IELTS, TOEFL, LangCert)

---

## 2. User Journey & Navigation Flow

### 2.1 Primary Navigation Routes

```
Landing Page (/)
    └── Dashboard (/dashboard)
            ├── IELTS Hub
            │       ├── Academic Reading
            │       ├── General Reading
            │       ├── Academic Writing
            │       ├── General Writing
            │       ├── Listening
            │       └── Speaking
            ├── LangCert Hub
            │       ├── Speaking
            │       └── Reading
            ├── TOEFL Hub
            │       ├── Academic Reading
            │       ├── General Reading
            │       ├── Academic Writing
            │       └── General Writing
            ├── Drills Hub (Grammar & Vocabulary)
            │       ├── Find exercises
            │       └── Grammar drills
            └── Vocabulary Hub
```

### 2.2 Test Flow

1. **Landing Page** → Click "Go to Tests" → Dashboard
2. **Dashboard** → Select Exam Type (IELTS/LangCert/TOEFL) → Select Module (Reading/Writing/Listening/Speaking)
3. **Hub View** → Choose between Full Mock Tests or Skill Atoms (15-min exercises)
4. **Test Taking** → Complete questions → Submit → View Results
5. **Results** → See score, review answers, earn XP

---

## 3. Page Types

### 3.1 Landing Page (`/`)
**Purpose:** First impression, marketing, conversion

**Layout Sections:**
- **Navbar:** Logo ("THE EXAM LAB"), "The Methodology" button (navigates to on-page section or modal; displays overview, key sections: Purpose, Steps, Evidence, Outcomes, and linked resources), "Sign In" button
- **Hero Section:**
  - Badge: "IELTS • TOEFL • LangCert"
  - Headline: "Stop practicing. Start training."
  - Subtext: Explains the methodology (practice tests measure level vs. exercises improve skills)
  - CTA Button: "GO TO TESTS" → navigates to Dashboard
  - Hint: "No credit cards. Just hard work."
- **Features Grid (3 cards):**
  - "Focus That Counts" - vocabulary and skill exercises
  - "The Secret Sauce" - AI assessment for speaking/writing
  - "Exam Atoms" - bite-sized 15-minute practice sessions
- **Teacher Note Section:** Personal message from the teacher about the methodology

**Visual Style:**
- Dark sidebar navigation on landing page
- Gradient text for "Start training" emphasis
- Minimal, clean design with clear CTAs

---

### 3.2 Dashboard (`/dashboard`)
**Purpose:** Central hub for selecting exam type and practice modules

**Layout Sections:**
- **Dashboard Hero:**
  - Welcome message: "Let's get to work." or "Ready for today's session?"
  - Training philosophy subtext
  - XP Badge showing total experience points
- **Exam Selection Grid:**
  - Cards for IELTS, LangCert, TOEFL
  - Each card has: icon (BookOpen), title, description, color accent
- **Practice Skills Grid:**
  - Cards for Drills Hub, Vocabulary, Speaking Practice
  - Each card has: icon, title, description

**Visual Style:**
- Cards with colored icon backgrounds
- Grid layout (responsive)
- Clean typography with hierarchy

---

### 3.3 Hub Views (BrandTestHub)
**Purpose:** Show available tests/exercises within a specific exam type

**Components:**
- **Hub Header:** Title and description of the exam type
- **Category Tabs:** e.g., "Full Tests" | "Atoms" | "Strategy"
- **Task Cards:** Each test/exercise shows:
  - Title
  - XP reward
  - Tier badge (bronze/silver/gold)
  - Time estimate

---

### 3.4 Skill Hub (SkillHub)
**Purpose:** Display specific skill modules (Reading, Writing, Listening, Speaking)

**Components:**
- **Module Header:** Skill name and description
- **Sub-modules:** Full tests, Mini tests, Practice atoms
- **Task Cards:** Similar to BrandTestHub

---

### 3.5 Test Page (TestPage)
**Purpose:** The actual exam-taking experience

**Main Components:**
- **Split Pane Layout:**
  - Left/Top: Reading passage or Audio player (Listening)
  - Right/Bottom: Questions
- **Question Carousel:** Navigate between questions
- **Timer:** Countdown for timed sections
- **Progress Indicator:** Shows current question / total
- **Navigation Controls:** Previous, Next, Submit

---

### 3.6 Result Screen (`ResultScreen`)
**Purpose:** Display test results and allow review

**Layout Sections:**
- **Score Header:**
  - IELTS Score (e.g., "Band 7.0")
  - Accuracy percentage
  - XP earned
- **Performance Summary:**
  - Correct/Incorrect counts
  - Time taken
- **Review Mode Toggle:** "Review Answers"
- **Answer Review List:**
  - Each question shows: question text, user's answer, correct answer
  - Visual indicators: green check (correct), red X (incorrect)
- **Action Buttons:**
  - "Claim XP" 
  - "Try Again"
  - "Back to Dashboard"

---

## 4. UI Components Library

### 4.1 Navigation Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Top navigation bar with logo and auth buttons |
| `Sidebar` | Left sidebar with exam categories and navigation (desktop) |
| `DashboardWrapper` | Wrapper providing dashboard structure |

### 4.2 Layout Components

| Component | Description |
|-----------|-------------|
| `SplitPane` | Two-column layout for content + questions |
| `QuestionCarousel` | Horizontal navigation between questions |
| `ReflectionGate` | Modal for user reflection before showing results |

### 4.3 Interactive Blocks (Question Types)

These are the core exercise components - **each has unique UI patterns**:

| Block Component | Question Type | UI Pattern |
|-----------------|---------------|------------|
| `MCQBlock` | Multiple Choice | Radio buttons with A/B/C/D options |
| `ShortAnswerBlock` | Short Answer | Text input field |
| `MatchingInfoBlock` | Matching Information | Dropdown or list matching |
| `HeadingMatchBlock` | Matching Headings | List of headings to match to paragraphs |
| `SentenceCompleteBlock` | Sentence Completion | Fill-in-the-blank with word bank |
| `GapFillBlock` | Gap Fill | Click-to-fill gaps in text |
| `TrinaryBlock` | True/False/Not Given | Three-option toggle buttons |
| `MatchingFeaturesBlock` | Matching Features | Table with matching options |
| `TokenSelectBlock` | Token Selection | Clickable word tokens |
| `DiagramLabelBlock` | Diagram Labeling | Image with clickable label points |
| `TableCompletionBlock` | Table Completion | Table with input fields |
| `FlowChartCompletionBlock` | Flow Chart | Flow diagram with drop zones |
| `NotesCompletionBlock` | Notes Completion | Notes with gap fills |
| `PunctuationCorrectionBlock` | Punctuation | Text with clickable correction points |
| `SentenceMatchingBlock` | Sentence Matching | Match sentence halves |
| `ReorderingBlock` | Sentence Reordering | Drag-and-drop ordering |
| `SmartInputBlock` | Smart Input | Enhanced text input |

### 4.4 Gamification Components

| Component | Description |
|-----------|-------------|
| `XPBadge` | Shows user's experience points (animated) |
| `XPBanner` | Shows XP earned for completing a test |

### 4.5 Speaking-Specific Components

| Component | Description |
|-----------|-------------|
| `SpeakingBlock` | Recording interface with timer |
| Audio Player | Play/pause for listening |
| Recording Controls | Record, Stop, Playback buttons |
| AI Feedback Display | Shows AI analysis results |

### 4.6 Writing-Specific Components

| Component | Description |
|-----------|-------------|
| `WritingBlock` | Text editor for essay writing |
| Word Count | Live word count display |
| Timer | Countdown for timed writing |

---

## 5. Design System

### 5.1 Color Palette

| Color Name | Hex | Usage |
|------------|-----|-------|
| `lab-indigo` | #5850EC | Primary brand color, CTAs |
| `lab-indigo-bg` | #e0e7ff | Light backgrounds |
| `deep-slate` | #1F2937 | Sidebar, dark elements |
| `surface-white` | #FFFFFF | Cards, content areas |
| `xp-amethyst` | #8B5CF6 | XP badges, rewards |
| `success-mint` | #10B981 | Correct answers |
| `warning-amber` | #F59E0B | Warnings, time alerts |
| `bg-app` | #F9FAFB | Main background |
| `neutral-gray` | #6B7280 | Secondary text |
| `border-color` | #E5E7EB | Borders, dividers |

**Exam-Specific Colors:**
- IELTS: #e11d48 (Rose red)
- LangCert: #2563eb (Blue)
- TOEFL: #3b82f6 (Light blue)

### 5.2 Typography

| Element | Font | Weight |
|---------|------|--------|
| Headings | Plus Jakarta Sans | 700-800 |
| Body | Plus Jakarta Sans | 400-600 |
| Buttons | Plus Jakarta Sans | 600 |

**Sizes:**
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

### 5.3 Spacing System

| Token | Value |
|-------|-------|
| `--radius-lg` | 16px |
| `--radius-md` | 10px |
| `--sidebar-width` | 260px |
| `--max-content-width` | 1400px |

### 5.4 Border Radius
- Cards: 16px
- Buttons: 10px
- Inputs: 8px
- Small elements: 6px

---

## 6. Content Data Structure

### 6.1 Mock Test Structure

```json
{
  "id": "ielts-academic-mock-1",
  "title": "IELTS Academic Mock Test 1",
  "type": "academic",
  "xpReward": 5000,
  "tier": "bronze",
  "vocabulary": { ... },
  "reading": {
    "title": "Reading",
    "time": 60,
    "sections": [
      {
        "id": "reading-section-1",
        "title": "Electroreception",
        "passages": [
          {
            "id": "reading-passage-1",
            "title": "Electroreception",
            "content": ["<p>Paragraph A...</p>", "<p>Paragraph B...</p>"],
            "subTasks": [
              {
                "type": "matching-info",
                "instruction": "Which paragraph contains...",
                "questions": [
                  { "id": "r1q1", "text": "...", "answer": "C" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "listening": { ... },
  "writing": { ... },
  "speaking": { ... }
}
```

### 6.2 Question Types Supported

- `mcq` - Multiple Choice
- `short-answer` - Short Answer
- `matching-info` - Matching Information
- `matching-headings` - Matching Headings
- `sentence-complete` - Sentence Completion
- `gap-fill` - Gap Fill
- `true-false-notgiven` - True/False/Not Given
- `matching-features` - Matching Features
- `diagram-label` - Diagram Labeling
- `table-complete` - Table Completion
- `flowchart-complete` - Flow Chart Completion
- `notes-complete` - Notes Completion
- `sentence-matching` - Sentence Matching
- `reordering` - Sentence Reordering

---

## 7. Key Features

### 7.1 Gamification System
- **XP (Experience Points):** Earned for completing tests and exercises
- **Tiers:** Bronze, Silver, Gold for different difficulty levels
- **XP Badge:** Animated display of total XP

### 7.2 Atom Exercises (Bite-sized Practice)
- 15-minute focused exercises
- Break down complex skills into manageable chunks
- Can be done daily for skill building

### 7.3 AI-Assisted Feedback
- **Provider(s):** OpenAI GPT-4 + Whisper API (or Azure Speech Services as alternative)
- **Speaking Evaluation:**
  - Uses OpenAI Whisper for audio transcription
  - Metrics: Pronunciation accuracy, fluency score, intonation/pitch stability, word error rate
  - Response time SLA: ≤10s for 30s audio recording
  - UI: Shows recording progress, displays transcription + feedback, retry on timeout
  - Fallback: Queue for later processing, notify user with offline message
- **Writing Evaluation:**
  - Uses GPT-4 for essay analysis
  - Metrics: Grammar score, coherence, lexical richness, readability score, rubric-based scoring
  - Response time SLA: ≤2s for short text, ≤5s for full essays
  - UI: Shows analysis progress indicator, results panel with score breakdown, retry attempts
  - Fallback: Degrade to local grammar checks (if available), inform user of service unavailability

### 7.4 Timed Tests
- Reading: 60 minutes
- Listening: 30 minutes
- Speaking: Variable (with preparation time)

### 7.5 Result Review
- Detailed score breakdown
- Review each question with correct answers
- Visual feedback on correct/incorrect

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked layout |
| Tablet | 640px - 1024px | Two columns where appropriate |
| Desktop | > 1024px | Full sidebar, split pane layout |

---

## 9. Animations & Interactions

- **XP Badge:** Animated counter
- **Question Transitions:** Smooth slide animations
- **Recording:** Pulsing animation when recording
- **Results:** Fade-in for score reveal
- **Hover States:** All interactive elements have hover feedback

---

## 10. External Dependencies

**Core Framework:**
- **React:** `"react": "^18.0.0"` - UI library
- **React DOM:** `"react-dom": "^18.0.0"` - React rendering

**Build Tool:**
- **Vite:** `"vite": "^4.0.0"` - Fast build tooling and dev server

**Language & Runtime:**
- **TypeScript:** `"typescript": "^5.0.0"` - Optional, for type safety

**Routing & State:**
- **React Router:** `"react-router-dom": "^6.0.0"` - Client-side routing
- **Zustand:** `"zustand": "^4.0.0"` - Lightweight state management

**UI & Animation:**
- **Lucide React:** `"lucide-react": "^0.200.0"` - Icon library
- **Framer Motion:** `"framer-motion": "^10.0.0"` - Animation library
- **Google Fonts:** Plus Jakarta Sans - Typography via CDN

**Audio & Recording:**
- **MediaRecorder API:** Native browser API - Audio recording (no external library required)
- **RecordRTC:** `"recordrtc": "^5.6.0"` - Alternative cross-browser audio recording

**HTTP Client:**
- **Axios:** `"axios": "^1.0.0"` - HTTP requests (or native fetch)

**Testing:**
- **Vitest:** `"vitest": "^0.30.0"` - Unit test framework
- **React Testing Library:** `"@testing-library/react": "^14.0.0"` - Component testing
- **Jest:** (Optional) `"jest": "^29.0.0"` - Alternative test runner

---

## 12. Authentication & Authorization

**User Flows:**
- **Sign Up:** POST `/auth/signup` with email, password → returns access token + refresh token
- **Sign In:** POST `/auth/signin` with credentials → returns access token + refresh token
- **Refresh Token:** POST `/auth/refresh` → returns new access token
- **Sign Out:** POST `/auth/logout` → invalidates refresh token on server
- **Session Lifecycle:** Access token (short-lived, ~1hr), Refresh token (long-lived, ~7 days)

**Roles:**
- `"student"` - Default user role, can take tests and access exercises
- `"teacher"` - (Future) Admin capabilities
- `"admin"` - (Future) System administration

**Implementation:**
- Store access token in memory; refresh token in secure httpOnly cookie
- Include Authorization header: `Authorization: Bearer {accessToken}` on all protected requests
- On 401 response, automatically refresh token and retry request

---

## 13. Error Handling

**Client-Side Error Formats:**
```json
{
  "type": "API_ERROR | VALIDATION_ERROR | NETWORK_ERROR | UNKNOWN_ERROR",
  "message": "User-friendly error description",
  "code": "ERROR_CODE",
  "details": { ...optional details... }
}
```

**Retry & Backoff Policy:**
- Max 3 retries with exponential backoff (1s, 2s, 4s)
- Do NOT retry on: 4xx errors (except 408, 429), invalid auth
- DO retry on: 5xx, 408, 429 (rate limit)

**UX Patterns:**
- **Global ErrorBoundary:** Catches React component crashes, displays fallback UI, logs error
- **Per-Component Error:** Forms, async operations show inline error messages
- **Toast/Notification:** Success messages (2s), warnings (4s), errors (6s or user dismissal)
- **Retry UI:** Show retry button for recoverable errors (network failures, timeouts)

---

## 14. Loading States

**Skeleton/Spinner Techniques:**
- **Test Page Loading:** Show skeleton placeholders for passage, questions, timer
- **Question Carousel:** Loading spinner while loading next question or checking answers
- **Audio Loading:** Spinner for audio playback initialization (reading passages, listening comprehension)
- **Results Page:** Progressive loading of score breakdown, detailed feedback

**Implementation:**
- Use CSS spinners or Framer Motion for animations
- Show estimated remaining time: "Loading... (2s)"
- For long operations (>3s), show progress bar with percentage

---

## 15. API Structure

**Base URL:** `https://api.englishexamexcellence.com` (or local: `http://localhost:5000`)

**Core Resources:**
- `/tests` - Full test metadata (id, title, description, duration, sections)
- `/passages` - Reading/listening passages (id, content, audio URL, length)
- `/questions` - Questions within a passage (id, type, text, options, correctAnswer)
- `/results` - User test results (userId, testId, score, answers submitted, timestamp)
- `/xp` - User XP data (totalXP, badges, tier level)

**Request/Response Format:**
```json
{
  "data": { ...resource data... },
  "status": "success | error",
  "message": "Optional message",
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

**Authentication Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Pagination:**
- Query: `?page=1&limit=20`
- Response includes `pagination.total` for record count

---

## 16. State Management

**Zustand Store Architecture:**

**1. Auth Store** (`authStore`)
- State: `{ user, accessToken, refreshToken, isAuthenticated, role }`
- Actions: `login(email, password)`, `logout()`, `refreshAuth()`, `updateUser(patch)`
- Selectors: `useAuthStore(state => state.user)`, `useAuthStore(state => state.isAuthenticated)`

**2. Test Store** (`testStore`)
- State: `{ currentTest, currentQuestion, userAnswers, startTime, timerRunning, score }`
- Actions: `loadTest(testId)`, `submitAnswer(questionId, value)`, `nextQuestion()`, `previousQuestion()`, `finishTest()`
- Selectors: `useTestStore(state => state.currentTest)`, `useTestStore(state => state.userAnswers)`

**3. UI Store** (`uiStore`)
- State: `{ sidebarOpen, activeTab, modal, notification }`
- Actions: `toggleSidebar()`, `setActiveTab(tab)`, `openModal(type, data)`, `closeModal()`, `showNotification(message, type)`
- Selectors: `useUIStore(state => state.sidebarOpen)`, `useUIStore(state => state.modal)`

**Key Methods & Selectors for Components:**
- **Navbar:** `useAuthStore((state) => state.user)`, `useAuthStore((state) => state.isAuthenticated)`, action: `logout()`
- **DashboardWrapper:** Uses all three stores for layout context
- **BrandTestHub:** `useTestStore((state) => state.currentTest)`, action: `loadTest(hubKey)`
- **TestPage:** `useTestStore((state) => state.userAnswers)`, `useTestStore((state) => state.timerRunning)`, action: `submitAnswer(id, value)`

---

## 11. Design Priorities for Stitch

1. **Clean, educational aesthetic** - Professional but approachable
2. **Focus on readability** - Especially for reading passages
3. **Clear visual hierarchy** - Content vs. questions distinction
4. **Consistent component patterns** - For 15+ question types
5. **Mobile-friendly** - Many users practice on phones
6. **Gamification integration** - XP should be visually appealing
7. **Accessibility** - WCAG 2.1 AA compliance with:
   - **Keyboard Navigation:** Tab order follows visual flow, focusable elements clearly indicated, focus traps in modals/dropdowns, standard keyboard shortcuts (Escape closes modals, Enter submits forms)
   - **Screen Reader Support:** Semantic HTML (proper heading hierarchy, nav elements, form labels), ARIA attributes (aria-label for icon buttons, aria-live for dynamic content, aria-expanded for toggles)
   - **Focus Management:** Visible focus indicators (2px outline, 3:1 contrast), focus trap in modals (trap shift+tab at end), manage focus on page navigation
   - **Contrast Ratios:** 4.5:1 for normal text, 3:1 for large text (18pt+), 3:1 for UI components; test with WCAG contrast checker
   - **Accessible Forms:** Label each input, error messages linked to fields via aria-describedby, hint text visible

---

*Document generated for Stitch UI design generation*
*Last Updated: 2026-03-20*
