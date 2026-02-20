import { wMock1 } from './mocks/writing-mock1';
import { wMock2 } from './mocks/writing-mock2';

export const writingMocks = {
  'writing-mock1': wMock1,
  'writing-mock2': wMock2,
};

export const WRITING_HUB = {
  title: "Writing Lab",
  description: "Master Task 1 and Task 2 academic writing.",
  categories: [
    {
      id: 'mock-tests',
      title: 'Exam Tasks',
      description: 'Timed Task 1 and Task 2 sessions',
      tasks: [
        { id: 'writing-mock1', title: 'Writing Mock 1', xp: 800, type: 'WRITING_MOCK', tier: 'bronze' },
        { id: 'writing-mock2', title: 'Writing Mock 2', xp: 800, type: 'WRITING_MOCK', tier: 'bronze' },
      ]
    }
  ]
};