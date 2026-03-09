# English Exam Excellence

A modern web application for preparing for IELTS, TOEFL, PTE, and other English language certification exams. Built with React, Vite, and Zustand.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF)
![Zustand](https://img.shields.io/badge/Zustand-5.0.10-purple)

## Overview

English Exam Excellence is an interactive exam preparation platform that moves beyond traditional practice tests. It breaks down exams into bite-sized "atoms" - focused 15-minute training sessions that build real skills through targeted practice.

### Key Features

- **Exam Atoms**: Micro-learning exercises targeting specific exam skills
- **Full Mock Tests**: Complete IELTS Academic and General Training tests
- **Multiple Exam Types**: Support for IELTS, LangCert, and more
- **All Four Skills**: Reading, Listening, Speaking, and Writing practice
- **Gamification**: XP system with badges and progress tracking
- **Vocabulary Builder**: Category-based vocabulary training
- **Grammar Drills**: Focused practice on comma usage and other grammar points

## Supported Exams

### IELTS
- **Academic Reading** - Full mocks and practice exercises
- **General Training Reading** - Full mocks and practice exercises
- **Listening** - Academic and General Training
- **Speaking** - Parts 1, 2, and 3 with sample questions
- **Writing** - Task 1 (Academic & General) and Task 2 essays

### LangCert
- **Reading** - Multiple mock tests
- **Speaking** - Various test formats

## Interactive Question Types

The application supports 15+ different question types:

| Category | Question Types |
|----------|----------------|
| Reading | MCQ, Short Answer, Gap Fill, Table Completion, Flow Chart, Diagram Label, Sentence Complete, Matching Headings |
| Listening | MCQ, Gap Fill, Map Label, Table Completion, Flow Chart, Short Answer |
| Speaking | Audio prompts, Cue card questions, Follow-up questions |
| Writing | Essay evaluation, Task response analysis |
| Vocabulary | Token selection, Matching, Gap fill |
| Grammar | Comma drills, Error correction |

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 7 (Rolldown)
- **State Management**: Zustand
- **Routing**: React Router 7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin with Service Worker
- **Linting**: ESLint

## Project Structure

```
src/
├── components/
│   ├── engine/              # Core exam engine components
│   │   ├── InteractiveBlocks/  # Question type components
│   │   ├── ListeningBlock.jsx
│   │   ├── ReadingBlock.jsx
│   │   ├── SpeakingBlock.jsx
│   │   └── WritingBlock.jsx
│   ├── LandingPage/         # Landing page component
│   ├── ui/                  # UI components (Dashboard, Hub, etc.)
│   └── gamified/            # XP and gamification components
├── data/
│   ├── IELTS/               # IELTS exam data
│   │   ├── atoms/           # Skill atoms
│   │   ├── listening/       # Listening tests
│   │   ├── reading/         # Reading tests
│   │   ├── speaking/        # Speaking tests
│   │   └── writing/         # Writing tests
│   ├── LangCert/            # LangCert exam data
│   ├── DrillsHub/           # Grammar and find drills
│   └── vocabulary.js        # Vocabulary lessons
├── hooks/                   # Custom React hooks
├── store/                   # Zustand stores
├── styles/                  # Global styles
└── utils/                   # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd englishexamexcellence

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## PWA Support

This application includes PWA support for offline capability. The service worker is configured in `dev-dist/sw.js` and enables installation as a standalone app.

## Development

### Adding New Exam Content

1. Create mock data files in the appropriate directory under `src/data/`
2. Import and export through the index files
3. The lesson database in `src/data/index.js` will automatically pick up new content

### Question Types

Each question type has its own component in `src/components/engine/InteractiveBlocks/`. To add a new question type:

1. Create a new component following the existing pattern
2. Implement the `validateAnswer()` method for answer evaluation
3. Add the component to the QuestionCarousel

## License

Private - All rights reserved

## Acknowledgments

Built with a focus on effective, bite-sized exam preparation that builds real skills through daily practice.
