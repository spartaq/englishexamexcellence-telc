// TELC Hub creation utilities
// These functions create hub structures from raw mock data, filtered by level

import { telcMocks, b1Mocks, b2Mocks, c1Mocks } from './mocks';
import { getAllReadingPassages, getAllWritingTasks, getAllListeningSections, getAllSpeakingParts } from './mocks';

// Helper to get mock by level
const getMocksByLevel = (level) => {
  switch (level) {
    case 'b1': return b1Mocks;
    case 'b2': return b2Mocks;
    case 'c1': return c1Mocks;
    default: return telcMocks;
  }
};

// Create Reading Hub from JSON filtered by level
export const createReadingHub = (level) => {
  const passages = getAllReadingPassages().filter(p => p.level === level);
  // Get unique mocks for this level
  const uniqueMocks = [...new Set(passages.map(p => p.mockId))];
  const levelMocks = getMocksByLevel(level);
  
  const levelName = level.toUpperCase();
  
  return {
    title: `TELC ${levelName} Reading`,
    description: `Practice ${levelName} reading passages`,
    categories: [
      {
        id: `${level}-reading-mocks`,
        title: 'Full Reading Mocks',
        description: `Complete ${levelName} reading tests`,
        tasks: uniqueMocks.map(mockId => {
          const mock = levelMocks[mockId];
          return {
            id: mockId,
            mockId: mockId,
            title: mock?.title || `TELC ${levelName} Reading Test`,
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

// Create Writing Hub from JSON filtered by level
export const createWritingHub = (level) => {
  const tasks = getAllWritingTasks().filter(t => t.level === level);
  // Get unique mocks for this level
  const uniqueMocks = [...new Set(tasks.map(t => t.mockId))];
  const levelMocks = getMocksByLevel(level);
  
  const levelName = level.toUpperCase();
  
  return {
    title: `TELC ${levelName} Writing`,
    description: `Practice ${levelName} writing tasks`,
    categories: [
      {
        id: `${level}-writing-mocks`,
        title: 'Full Writing Mocks',
        description: `Complete ${levelName} writing tasks`,
        tasks: uniqueMocks.map(mockId => {
          const mock = levelMocks[mockId];
          return {
            id: mockId,
            mockId: mockId,
            title: mock?.title || `TELC ${levelName} Writing Test`,
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

// Create Speaking Hub from JSON filtered by level
export const createSpeakingHub = (level) => {
  const parts = getAllSpeakingParts().filter(p => p.level === level);
  const levelMocks = getMocksByLevel(level);
  
  const levelName = level.toUpperCase();
  
  return {
    title: `TELC ${levelName} Speaking`,
    description: `Practice all three parts of the TELC ${levelName} Speaking test`,
    categories: [
      {
        id: `${level}-speaking-mocks`,
        title: 'Speaking Mocks',
        description: `Complete TELC ${levelName} Speaking simulations`,
        tasks: Object.values(levelMocks).map(mock => ({
          id: mock.id,
          mockId: mock.id,
          title: mock.title || `TELC ${levelName} Speaking Test`,
          xp: 1200,
          type: 'speaking',
          skill: 'speaking',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Create Listening Hub from JSON filtered by level
export const createListeningHub = (level) => {
  const sections = getAllListeningSections().filter(s => s.level === level);
  const levelMocks = getMocksByLevel(level);
  
  const levelName = level.toUpperCase();
  
  return {
    title: `TELC ${levelName} Listening`,
    description: `Practice TELC ${levelName} Listening tests`,
    categories: [
      {
        id: `${level}-listening-mocks`,
        title: 'Listening Mocks',
        description: `Complete TELC ${levelName} Listening tests`,
        tasks: Object.values(levelMocks).map(mock => ({
          id: mock.id,
          mockId: mock.id,
          title: mock.title || `TELC ${levelName} Listening Test`,
          xp: 300,
          type: 'LISTENING',
          skill: 'listening',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Export pre-built TELC hubs by level
export const TELC_B1_READING = createReadingHub('b1');
export const TELC_B2_READING = createReadingHub('b2');
export const TELC_C1_READING = createReadingHub('c1');

export const TELC_B1_WRITING = createWritingHub('b1');
export const TELC_B2_WRITING = createWritingHub('b2');
export const TELC_C1_WRITING = createWritingHub('c1');

export const TELC_B1_SPEAKING = createSpeakingHub('b1');
export const TELC_B2_SPEAKING = createSpeakingHub('b2');
export const TELC_C1_SPEAKING = createSpeakingHub('c1');

export const TELC_B1_LISTENING = createListeningHub('b1');
export const TELC_B2_LISTENING = createListeningHub('b2');
export const TELC_C1_LISTENING = createListeningHub('c1');