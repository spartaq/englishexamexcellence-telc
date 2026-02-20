// src/data/IELTS/speaking/index.js
import { speakingMock1 } from './mocks/ielts-speaking-mock1';
import { speakingMock2 } from './mocks/ielts-speaking-mock2';
import { speakingMock3 } from './mocks/ielts-speaking-mock3';
import { speakingMock4 } from './mocks/ielts-speaking-mock4';
import { speakingMock5 } from './mocks/ielts-speaking-mock5';

// 1. Keep this for easy data lookups by ID (needed for your dynamic routes)
export const speakingMocks = {
  'ielts-speaking-mock1': speakingMock1,
  'ielts-speaking-mock2': speakingMock2,
  'ielts-speaking-mock3': speakingMock3,
  'ielts-speaking-mock4': speakingMock4,
  'ielts-speaking-mock5': speakingMock5,
};

// 2. The Hub Structure for the UI
export const SPEAKING_HUB = {
  title: "IELTS Speaking Hub",
  categories: [
    {
      id: 'full-mocks',
      title: 'Full Mock Exams',
      description: 'Complete IELTS Speaking simulations',
      tasks: [
        { 
          id: 'ielts-speaking-mock1', 
          title: 'Speaking Mock #1', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'ielts-speaking-mock2', 
          title: 'Speaking Mock #2', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'ielts-speaking-mock3', 
          title: 'Speaking Mock #3', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'ielts-speaking-mock4', 
          title: 'Speaking Mock #4', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'ielts-speaking-mock5', 
          title: 'Speaking Mock #5', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
      ]
    }
  ]
};
