// TELC Mocks - Single Source of Truth
// All mock tests are stored as JSON files
// This index provides access to all mocks for the application

import telcB1Mock1 from './b1/telc-b1-mock-1.json';
import telcB1Mock2 from './b1/telc-b1-mock-2.json';
import telcB1Mock3 from './b1/telc-b1-mock-3.json';
import telcB1Mock4 from './b1/telc-b1-mock-4.json';
import telcB1Mock5 from './b1/telc-b1-mock-5.json';
import telcB1Mock6 from './b1/telc-b1-mock-6.json';
import telcB1Mock7 from './b1/telc-b1-mock-7.json';
import telcB1Mock8 from './b1/telc-b1-mock-8.json';
import telcB1Mock9 from './b1/telc-b1-mock-9.json';
import telcB1Mock10 from './b1/telc-b1-mock-10.json';
import telcB2Mock1 from './b2/telc-b2-mock-1.json';
import telcB2Mock2 from './b2/telc-b2-mock-2.json';
import telcB2Mock3 from './b2/telc-b2-mock-3.json';
import telcB2Mock4 from './b2/telc-b2-mock-4.json';
import telcB2Mock5 from './b2/telc-b2-mock-5.json';
import telcB2Mock6 from './b2/telc-b2-mock-6.json';
import telcB2Mock7 from './b2/telc-b2-mock-7.json';
import telcB2Mock8 from './b2/telc-b2-mock-8.json';
import telcB2Mock9 from './b2/telc-b2-mock-9.json';
import telcB2Mock10 from './b2/telc-b2-mock-10.json';
import telcC1Mock1 from './c1/telc-c1-mock-1.json';
import telcC1Mock2 from './c1/telc-c1-mock-2.json';
import telcC1Mock3 from './c1/telc-c1-mock-3.json';
import telcC1Mock4 from './c1/telc-c1-mock-4.json';
import telcC1Mock5 from './c1/telc-c1-mock-5.json';
import telcC1Mock6 from './c1/telc-c1-mock-6.json';
import telcC1Mock7 from './c1/telc-c1-mock-7.json';
import telcC1Mock8 from './c1/telc-c1-mock-8.json';
import telcC1Mock9 from './c1/telc-c1-mock-9.json';

// All mocks combined
const allMocks = [
   telcB1Mock1,
   telcB1Mock2,
   telcB1Mock3,
   telcB1Mock4,
   telcB1Mock5,
   telcB1Mock6,
   telcB1Mock7,
   telcB1Mock8,
   telcB1Mock9,
   telcB1Mock10,
   telcB2Mock1,
   telcB2Mock2,
   telcB2Mock3,
   telcB2Mock4,
   telcB2Mock5,
   telcB2Mock6,
   telcB2Mock7,
   telcB2Mock8,
   telcB2Mock9,
   telcB2Mock10,
   telcC1Mock1,
   telcC1Mock2,
   telcC1Mock3,
   telcC1Mock4,
   telcC1Mock5,
   telcC1Mock6,
   telcC1Mock7,
   telcC1Mock8,
   telcC1Mock9
  ];

// Export as object for easy lookup by ID
export const telcMocks = {
   'telc-b1-mock-1': telcB1Mock1,
   'telc-b1-mock-2': telcB1Mock2,
   'telc-b1-mock-3': telcB1Mock3,
   'telc-b1-mock-4': telcB1Mock4,
   'telc-b1-mock-5': telcB1Mock5,
   'telc-b1-mock-6': telcB1Mock6,
   'telc-b1-mock-7': telcB1Mock7,
   'telc-b1-mock-8': telcB1Mock8,
   'telc-b1-mock-9': telcB1Mock9,
   'telc-b1-mock-10': telcB1Mock10,
   'telc-b2-mock-1': telcB2Mock1,
   'telc-b2-mock-2': telcB2Mock2,
   'telc-b2-mock-3': telcB2Mock3,
   'telc-b2-mock-4': telcB2Mock4,
   'telc-b2-mock-5': telcB2Mock5,
   'telc-b2-mock-6': telcB2Mock6,
   'telc-b2-mock-7': telcB2Mock7,
   'telc-b2-mock-8': telcB2Mock8,
   'telc-b2-mock-9': telcB2Mock9,
   'telc-b2-mock-10': telcB2Mock10,
   'telc-c1-mock-1': telcC1Mock1,
   'telc-c1-mock-2': telcC1Mock2,
   'telc-c1-mock-3': telcC1Mock3,
   'telc-c1-mock-4': telcC1Mock4,
   'telc-c1-mock-5': telcC1Mock5,
   'telc-c1-mock-6': telcC1Mock6,
   'telc-c1-mock-7': telcC1Mock7,
   'telc-c1-mock-8': telcC1Mock8,
   'telc-c1-mock-9': telcC1Mock9
  };

// Export by level
export const b1Mocks = {
  'telc-b1-mock-1': telcB1Mock1,
  'telc-b1-mock-2': telcB1Mock2,
  'telc-b1-mock-3': telcB1Mock3,
  'telc-b1-mock-4': telcB1Mock4,
  'telc-b1-mock-5': telcB1Mock5,
  'telc-b1-mock-6': telcB1Mock6,
  'telc-b1-mock-7': telcB1Mock7,
  'telc-b1-mock-8': telcB1Mock8,
  'telc-b1-mock-9': telcB1Mock9,
  'telc-b1-mock-10': telcB1Mock10
};

export const b2Mocks = {
  'telc-b2-mock-1': telcB2Mock1,
  'telc-b2-mock-2': telcB2Mock2,
  'telc-b2-mock-3': telcB2Mock3,
  'telc-b2-mock-4': telcB2Mock4,
  'telc-b2-mock-5': telcB2Mock5,
  'telc-b2-mock-6': telcB2Mock6,
  'telc-b2-mock-7': telcB2Mock7,
  'telc-b2-mock-8': telcB2Mock8,
  'telc-b2-mock-9': telcB2Mock9,
  'telc-b2-mock-10': telcB2Mock10
};

export const c1Mocks = {
   'telc-c1-mock-1': telcC1Mock1,
   'telc-c1-mock-2': telcC1Mock2,
   'telc-c1-mock-3': telcC1Mock3,
   'telc-c1-mock-4': telcC1Mock4,
   'telc-c1-mock-5': telcC1Mock5,
   'telc-c1-mock-6': telcC1Mock6,
   'telc-c1-mock-7': telcC1Mock7,
   'telc-c1-mock-8': telcC1Mock8,
   'telc-c1-mock-9': telcC1Mock9
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