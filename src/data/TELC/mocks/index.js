// TELC Mocks - Single Source of Truth
// All mock tests are stored as JSON files
// This index provides access to all mocks for the application

import telcB1Mock1 from './b1/telc-b1-mock-1.json';
import telcB2Mock1 from './b2/telc-b2-mock-1.json';
import telcB2Mock2 from './b2/telc-b2-mock-2.json';
import telcC1Mock1 from './c1/telc-c1-mock-1.json';
import telcC1Mock2 from './c1/telc-c1-mock-2.json';

// All mocks combined
const allMocks = [
  telcB1Mock1,
  telcB2Mock1,
  telcB2Mock2,
  telcC1Mock1,
  telcC1Mock2
];

// Export as object for easy lookup by ID
export const telcMocks = {
  'telc-b1-mock-1': telcB1Mock1,
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2,
  'telc-c1-mock-1': telcC1Mock1,
  'telc-c1-mock-2': telcC1Mock2
};

// Export by level
export const b1Mocks = {
  'telc-b1-mock-1': telcB1Mock1
};

export const b2Mocks = {
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2
};

export const c1Mocks = {
  'telc-c1-mock-1': telcC1Mock1,
  'telc-c1-mock-2': telcC1Mock2
};

// Helper to get all reading passages from all mocks
export const getAllReadingPassages = () => {
  return allMocks.flatMap(mock => {
    const passages = [];
    
    if (mock.reading?.sections) {
      mock.reading.sections.forEach(section => {
        if (section.passages) {
          section.passages.forEach(passage => {
            passages.push({
              ...passage,
              mockId: mock.id,
              mockTitle: mock.title,
              mockNumber: mock.mockNumber,
              testType: mock.type,
              level: mock.level,
              skill: 'reading'
            });
          });
        }
      });
    }
    
    return passages;
  });
};

// Helper to get all writing tasks from all mocks
export const getAllWritingTasks = () => {
  return allMocks.flatMap(mock => {
    const tasks = [];
    
    if (mock.writing?.sections) {
      mock.writing.sections.forEach(section => {
        tasks.push({
          ...section,
          mockId: mock.id,
          mockTitle: mock.title,
          mockNumber: mock.mockNumber,
          testType: mock.type,
          level: mock.level,
          skill: 'writing'
        });
      });
    }
    
    return tasks;
  });
};

// Helper to get all language elements from all mocks
export const getAllLanguageElements = () => {
  return allMocks.flatMap(mock => {
    const sections = [];
    
    if (mock.languageElements?.sections) {
      mock.languageElements.sections.forEach(section => {
        sections.push({
          ...section,
          mockId: mock.id,
          mockTitle: mock.title,
          mockNumber: mock.mockNumber,
          testType: mock.type,
          level: mock.level,
          skill: 'language-elements'
        });
      });
    }
    
    return sections;
  });
};

// Helper to get all listening sections from all mocks
export const getAllListeningSections = () => {
  return allMocks.flatMap(mock => {
    const sections = [];
    
    if (mock.listening?.sections) {
      mock.listening.sections.forEach(section => {
        sections.push({
          ...section,
          mockId: mock.id,
          mockTitle: mock.title,
          mockNumber: mock.mockNumber,
          testType: mock.type,
          level: mock.level,
          skill: 'listening'
        });
      });
    }
    
    return sections;
  });
};

// Helper to get all speaking sections from all mocks
export const getAllSpeakingParts = () => {
  return allMocks.flatMap(mock => {
    const sections = [];
    
    if (mock.speaking?.sections) {
      mock.speaking.sections.forEach(section => {
        sections.push({
          ...section,
          mockId: mock.id,
          mockTitle: mock.title,
          mockNumber: mock.mockNumber,
          testType: mock.type,
          level: mock.level,
          skill: 'speaking'
        });
      });
    }
    
    return sections;
  });
};

// Helper to get all vocabulary from all mocks
export const getAllVocab = () => {
  return allMocks.flatMap(mock => {
    if (mock.vocabulary?.words) {
      return mock.vocabulary.words.map(word => ({
        ...word,
        mockId: mock.id,
        mockTitle: mock.title,
        mockNumber: mock.mockNumber,
        testType: mock.type,
        level: mock.level,
        skill: 'vocabulary'
      }));
    }
    return [];
  });
};

// Get random mock by level
export const getRandomMock = (level = null) => {
  if (level) {
    const filtered = allMocks.filter(m => m.level === level);
    if (filtered.length === 0) return allMocks[0];
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  return allMocks[Math.floor(Math.random() * allMocks.length)];
};

// Get mock by ID
export const getMockById = (id) => {
  return telcMocks[id] || null;
};

export default {
  telcMocks,
  b1Mocks,
  b2Mocks,
  c1Mocks,
  getAllReadingPassages,
  getAllWritingTasks,
  getAllListeningSections,
  getAllSpeakingParts,
  getAllVocab,
  getAllLanguageElements,
  getRandomMock,
  getMockById
};