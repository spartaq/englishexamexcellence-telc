// IELTS Hub creation utilities
// These functions create hub structures from raw mock data

import { ieltsMocks } from './mocks';
import { getAllReadingPassages, getAllWritingTasks, getAllListeningSections, getAllSpeakingParts } from './mocks';

// Create Reading Hub from JSON
export const createReadingHub = (type, title) => {
  const passages = getAllReadingPassages().filter(p => p.testType === type);
  // Get unique mocks for this type
  const uniqueMocks = [...new Set(passages.map(p => p.mockId))];
  return {
    title: `${title} Reading`,
    description: `Practice ${type} reading passages`,
    categories: [
      {
        id: `${type}-reading-mocks`,
        title: 'Full Reading Mocks',
        description: `Complete ${type} reading tests`,
        tasks: uniqueMocks.map(mockId => {
          const mock = ieltsMocks[mockId];
          return {
            id: mockId,
            mockId: mockId,
            title: mock?.title || `${type} Reading Test`,
            xp: 300,
            type: 'READING',
            skill: 'reading',
            tier: 'bronze'
          };
        })
      }
    ]
  };
};

// Create Writing Hub from JSON
export const createWritingHub = (type, title) => {
  const tasks = getAllWritingTasks().filter(t => t.testType === type);
  // Get unique mocks for this type
  const uniqueMocks = [...new Set(tasks.map(t => t.mockId))];
  return {
    title: `${title} Writing`,
    description: `Practice ${type} writing tasks`,
    categories: [
      {
        id: `${type}-writing-mocks`,
        title: 'Full Writing Mocks',
        description: `Complete ${type} writing tasks`,
        tasks: uniqueMocks.map(mockId => {
          const mock = ieltsMocks[mockId];
          return {
            id: mockId,
            mockId: mockId,
            title: mock?.title || `${type} Writing Test`,
            xp: 500,
            type: 'WRITING',
            skill: 'writing',
            tier: 'bronze'
          };
        })
      }
    ]
  };
};

// Create Speaking Hub from JSON
export const createSpeakingHub = () => {
  const parts = getAllSpeakingParts();
  return {
    title: 'IELTS Speaking',
    description: 'Practice all three parts of the IELTS Speaking test',
    categories: [
      {
        id: 'speaking-mocks',
        title: 'Speaking Mocks',
        description: 'Complete IELTS Speaking simulations',
        tasks: Object.values(ieltsMocks).map(mock => ({
          id: mock.id,
          mockId: mock.id,
          title: mock.title || 'Speaking Test',
          xp: 1200,
          type: 'speaking',
          skill: 'speaking',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Create Listening Hub from JSON
export const createListeningHub = () => {
  const sections = getAllListeningSections();
  return {
    title: 'IELTS Listening',
    description: 'Practice IELTS Listening tests',
    categories: [
      {
        id: 'listening-mocks',
        title: 'Listening Mocks',
        description: 'Complete IELTS Listening tests',
        tasks: Object.values(ieltsMocks).map(mock => ({
          id: mock.id,
          mockId: mock.id,
          title: mock.title || 'Listening Test',
          xp: 300,
          type: 'LISTENING',
          skill: 'listening',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Export pre-built IELTS hubs
export const IELTS_READING_AC = createReadingHub('academic', 'Academic');
export const IELTS_READING_GT = createReadingHub('general', 'General Training');
export const IELTS_WRITING_AC = createWritingHub('academic', 'Academic');
export const IELTS_WRITING_GT = createWritingHub('general', 'General Training');
export const IELTS_SPEAKING = createSpeakingHub();
export const IELTS_LISTENING = createListeningHub();
