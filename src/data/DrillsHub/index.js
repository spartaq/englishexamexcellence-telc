import { findPassive1Data } from './find/find-passive-1';
import { findPresentPerfect1Data } from './find/find-presperf-1';
import { findNoun1Data } from './find/find-noun-1';
import { commaDrill1Data, commaDrill2Data, commaDrill3Data } from './grammar/comma-drill-1';

// 1. Lookup Table for Exercises
export const drillsData = {
  'find-passive-1': findPassive1Data,
  'find-presperf-1': findPresentPerfect1Data,
  'find-noun-1': findNoun1Data,
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
        { id: 'find-passive-1', title: 'Find the passsive voice', xp: 500, type: 'reading-drill', tier: 'bronze' },
        { id: 'find-presperf-1', title: 'Find the present perfect', xp: 500, type: 'reading-drill', tier: 'bronze' },
        { id: 'find-noun-1', title: 'Find the noun phrase', xp: 500, type: 'reading-drill', tier: 'bronze' },
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
