// Import your Academic Writing Mocks
import { writingMock1 } from '../mocks/writing-mock1';
// import { writingMock2 } from './mocks/writing-mock2';

// 1. The Lookup Table (Dictionary)
export const writingMocks = {
  'writing-mock1': writingMock1,
};

// 2. The Hub Configuration (UI Structure)
export const WRITING_HUB = {
  title: "Academic Writing",
  description: "Master Task 1 (Reports) and Task 2 (Essays).",
  categories: [
    {
      id: 'ac-writing-mocks',
      title: 'Full Writing Mocks',
      tasks: [
        { id: 'writing-mock1', title: 'Writing Mock 1', xp: 800, type: 'WRITING_MOCK', tier: 'bronze' },
      ]
    }
  ]
};