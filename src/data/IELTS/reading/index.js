// src/data/reading/index.js

// Import all mock and drill data
import { generalMock1 } from './mocks/general-reading-mock-1';
import { mock1 } from './mocks/mock-1';

// Flatten all tasks from mock data into a single lookup object keyed by id
const readingMockData = [
  generalMock1, mock1 
];

export const readingMocks = readingMockData.reduce((acc, data) => {
  acc[data.id] = data;
  return acc;
}, {});

// The Hub Structure for the UI
export const READING_HUB = {
  title: "Reading Hub",
  categories: [
    {
      id: 'mock-tests',
      title: 'IELTS Reading Mock Exams',
      tasks: [
        { id: 'generalMock1', title: 'IELTS General Mock #1', xp: 1200, type: 'ielts-mock', tier: 'bronze' },
        { id: 'academicMock1', title: 'IELTS Academic Mock #1', xp: 1200, type: 'ielts-mock', tier: 'bronze' },
      ]
    }
  ]
};
