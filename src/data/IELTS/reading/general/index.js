// Import your General Mocks
import { generalReadingMock1 } from '../mocks/general-reading-mock-1';
// Import your General-specific Drills
// import { gtDrill1 } from './drills/gt-drill-1';

// 1. The Lookup Table
export const readingMocks = {
  'general-reading-mock-1': generalReadingMock1,
};

// 2. The Hub Configuration
export const READING_HUB = {
  title: "General Training Reading",
  description: "Everyday English, workplace documents, and general interest texts.",
  categories: [
    {
      id: 'gt-mocks',
      title: 'General Mock Exams',
      tasks: [
        { id: 'general-reading-mock-1', title: 'General Training Mock #1', xp: 2000, type: 'ielts-mock', tier: 'bronze' },
      ]
    }
  ]
};