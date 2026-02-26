/**
 * LangCert Reading Data
 * 
 * Index file for LangCert reading exercises.
 */

import { readingMock1 } from './mocks/langcert-reading-mock1';
import { readingMock2 } from './mocks/langcert-reading-mock2';
import { readingMock3 } from './mocks/langcert-reading-mock3';

// Export the mock data for lessonDatabase lookups
export const readingMocks = {
  'langcert-reading-1': readingMock1,
  'langcert-reading-2': readingMock2,
  'langcert-reading-3': readingMock3
};

// Reading hub configuration - matching the structure of other hubs
export const READING_HUB = {
  title: "Reading Hub",
  categories: [ 
        { 
          id: 'langcert-reading-1', 
          title: 'Reading Practice Test 1', 
          xp: 50, 
          type: 'gap-fill-tokens',
          tier: 'bronze'
        },
        { 
          id: 'langcert-reading-2', 
          title: 'Reading Practice Test 2', 
          xp: 50, 
          type: 'gap-fill-tokens',
          tier: 'bronze'
        },   
        {
          id: 'langcert-reading-3',
          title: 'Reading Practice Test 3',
          xp: 150,
          type: 'langcert-reading-mock',
          tier: 'bronze'
        }    
  ]
};

export default READING_HUB;
