import { drill1Data } from './find/find-drill-1';
import { drill2Data } from './find/find-drill-2'; 

// 1. Lookup Table for Exercises
export const drillsData = {
  'drill-1': drill1Data,
  'drill-2': drill2Data,
}

// 2. The Hub Configuration
export const DRILLS_HUB = {
  title: "General Practice Drills",
  description: "Targeted exercises to improve core English skills.",
  categories: [
    {
      id: 'reading-drills',
      title: 'Reading Skills',
      tasks: [
        { id: 'drill-1', title: 'Find the past tense', xp: 500, type: 'reading-drill', tier: 'bronze' },
        { id: 'drill-2', title: 'Find the present perfect', xp: 500, type: 'reading-drill', tier: 'bronze' },
      ]
    },
    {
      id: 'grammar-drills',
      title: 'Grammar & Structure',
      tasks: [
        // Add future grammar drills here
      ]
    }
  ]
};