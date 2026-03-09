import { academicReadingMock1 } from '../mocks/academic-reading-mock-1';

// 1. Lookup Table (Mocks only)
export const readingMocks = {
  'academic-reading-mock-1': academicReadingMock1,
};

// 2. Hub Configuration
export const READING_HUB = {
  title: "Academic Reading",
  description: "Advanced texts from journals, books, and magazines.",
  categories: [
    {
      id: 'academic-mocks',
      title: 'Full Academic Reading Exams',
      tasks: [
        { id: 'academic-reading-mock-1', title: 'Academic Mock #1', xp: 2000, type: 'ielts-mock', tier: 'bronze' },
      ]
    }
  ]
};