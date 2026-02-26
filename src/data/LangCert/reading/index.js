/**
 * LangCert Reading Data
 * 
 * Index file for LangCert reading exercises.
 */

import { readingMock1 } from './mocks/langcert-reading-mock1';
import { readingMock2 } from './mocks/langcert-reading-mock2';

// Export the mock data for lessonDatabase lookups
export const readingMocks = {
  'langcert-reading-1': readingMock1,
  'langcert-reading-2': readingMock2
};

// Reading hub configuration - matching the structure of other hubs
export const READING_HUB = {
  title: "Reading Hub",
  categories: [
    {
      id: 'gap-fill-exercises',
      title: 'Gap Fill Exercises',
      description: 'Complete the passages by selecting the correct words',
      tasks: [
        { 
          id: 'langcert-reading-1', 
          title: 'Language Learning Tips', 
          xp: 50, 
          type: 'gap-fill-tokens',
          tier: 'bronze'
        },
        { 
          id: 'langcert-reading-2', 
          title: 'The History of Coffee', 
          xp: 50, 
          type: 'gap-fill-tokens',
          tier: 'bronze'
        }
      ]
    }
  ]
};

export default READING_HUB;
