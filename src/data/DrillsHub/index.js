import { drill1Data } from './find/find-drill-1';
import { drill2Data } from './find/find-drill-2'; 
import { commaDrill1Data, commaDrill2Data, commaDrill3Data } from './grammar/comma-drill-1';

// 1. Lookup Table for Exercises
export const drillsData = {
  'drill-1': drill1Data,
  'drill-2': drill2Data,
  'comma-drill-1': commaDrill1Data,
  'comma-drill-2': commaDrill2Data,
  'comma-drill-3': commaDrill3Data,
}

// 2. The Hub Configuration
export const DRILLS_HUB = {
  title: "Drills Hub",
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
        { id: 'comma-drill-1', title: 'Commas: Introductory Elements', xp: 100, type: 'punctuation-correction', tier: 'bronze' },
        { id: 'comma-drill-2', title: 'Commas: Compound Sentences', xp: 100, type: 'punctuation-correction', tier: 'bronze' },
        { id: 'comma-drill-3', title: 'Commas: Lists and Series', xp: 100, type: 'punctuation-correction', tier: 'bronze' },
      ]
    }
  ]
};