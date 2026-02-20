// Import your General Writing Mocks (Ensure these exist or create placeholders)
// import { gtWritingMock1 } from './mocks/gt-writing-mock1';

// 1. The Lookup Table
export const writingMocks = {
  // 'gt-writing-mock1': gtWritingMock1,
};

// 2. The Hub Configuration
export const WRITING_HUB = {
  title: "General Training Writing",
  description: "Master Task 1 (Letters) and Task 2 (Essays).",
  categories: [
    {
      id: 'gt-writing-mocks',
      title: 'General Writing Mocks',
      tasks: [
        { id: 'writing-mock1', title: 'Writing Mock 1', xp: 800, type: 'WRITING_MOCK', tier: 'bronze' },
        { id: 'writing-mock2', title: 'Writing Mock 2', xp: 800, type: 'WRITING_MOCK', tier: 'bronze' },
      ]
    }
  ]
};