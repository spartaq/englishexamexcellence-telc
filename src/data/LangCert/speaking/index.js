// src/data/speaking/index.js
import { speakingMock1 } from './mocks/langcert-speaking-mock1';
import { speakingMock2 } from './mocks/langcert-speaking-mock2';
import { speakingMock3 } from './mocks/langcert-speaking-mock3';
import { speakingMock4 } from './mocks/langcert-speaking-mock4';
import { speakingMock5 } from './mocks/langcert-speaking-mock5';

// 1. Keep this for easy data lookups by ID (needed for your dynamic routes)
export const speakingMocks = {
  'langcert-speaking-mock1': speakingMock1,
  'langcert-speaking-mock2': speakingMock2,
  'langcert-speaking-mock3': speakingMock3,
  'langcert-speaking-mock4': speakingMock4,
  'langcert-speaking-mock5': speakingMock5,
};

// 2. The Hub Structure for the UI
export const SPEAKING_HUB = {
  title: "Speaking Hub",
  categories: [
    {
      id: 'full-mocks',
      title: 'Full Mock Exams',
      description: 'Complete LangCert Speaking simulations',
      tasks: [
        { 
          id: 'langcert-speaking-mock1', 
          title: 'Speaking Mock #1', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'langcert-speaking-mock2', 
          title: 'Speaking Mock #2', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'langcert-speaking-mock3', 
          title: 'Speaking Mock #3', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'langcert-speaking-mock4', 
          title: 'Speaking Mock #4', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
        { 
          id: 'langcert-speaking-mock5', 
          title: 'Speaking Mock #5', 
          xp: 1200, 
          type: 'speaking-mock', 
          tier: 'bronze' 
        },
      ]
    },
    {
      id: 'skill-drills',
      title: 'Pronunciation & Fluency',
      description: 'Practice specific speaking skills',
      tasks: [
        // You can add smaller drills here later
        { id: 'drill-1', title: 'Sentence Stress', xp: 150, type: 'audio-drill', tier: 'bronze' },
        { id: 'drill-2', title: 'Intonation Patterns', xp: 150, type: 'audio-drill', tier: 'bronze' },
      ]
    }
  ]
};