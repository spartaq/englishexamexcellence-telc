// IELTS Mocks - Single Source of Truth
// All mock tests are stored as JSON files
// This index provides access to all mocks for the application

import academicMock1 from './ielts-academic-mock-1.json';
import generalMock1 from './ielts-general-mock-1.json';
import generalMock2 from './ielts-general-mock-2.json';

// All mocks combined
const allMocks = [
  academicMock1,
  generalMock1,
  generalMock2
];

// Export as object for easy lookup by ID
export const ieltsMocks = {
  'ielts-academic-mock-1': academicMock1,
  'ielts-general-mock-1': generalMock1,
  'ielts-general-mock-2': generalMock2
};

// Academic mocks
export const academicMocks = {
  'ielts-academic-mock-1': academicMock1
};

// General Training mocks
export const generalMocks = {
  'ielts-general-mock-1': generalMock1,
  'ielts-general-mock-2': generalMock2
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
          skill: 'writing'
        });
      });
    }
    
    return tasks;
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
          skill: 'listening'
        });
      });
    }
    
    return sections;
  });
};

// Helper to get all speaking parts from all mocks
export const getAllSpeakingParts = () => {
  return allMocks.flatMap(mock => {
    const parts = [];
    
    if (mock.speaking?.parts) {
      mock.speaking.parts.forEach(part => {
        parts.push({
          ...part,
          mockId: mock.id,
          mockTitle: mock.title,
          mockNumber: mock.mockNumber,
          testType: mock.type,
          skill: 'speaking'
        });
      });
    }
    
    return parts;
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
        skill: 'vocabulary'
      }));
    }
    return [];
  });
};

// Get random mock by type
export const getRandomMock = (type = 'academic') => {
  const filtered = allMocks.filter(m => m.type === type);
  if (filtered.length === 0) return allMocks[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
};

// Get mock by ID
export const getMockById = (id) => {
  return ieltsMocks[id] || null;
};

export default {
  ieltsMocks,
  academicMocks,
  generalMocks,
  getAllReadingPassages,
  getAllWritingTasks,
  getAllListeningSections,
  getAllSpeakingParts,
  getAllVocab,
  getRandomMock,
  getMockById
};
