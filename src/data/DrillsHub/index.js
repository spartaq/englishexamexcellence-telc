// 1. Lookup Table for Exercises
import { findPassive1Data } from './C1Drills/reading/c1-drill-find-passive-1';
import { findPresentPerfect1Data } from './B2Drills/reading/b2-drill-find-presperf-1';
import { findNoun1Data } from './B1Drills/reading/b1-drill-find-noun-1';
import { commaDrill1Data, commaDrill2Data, commaDrill3Data } from './C1Drills/writing/c1-drill-comma-1';
import { conjunctions1Data } from './B2Drills/writing/b2-drill-conjunctions-1';

export const drillsData = {
  'find-passive-1': { ...findPassive1Data, level: 'c1' },
  'find-presperf-1': { ...findPresentPerfect1Data, level: 'b2' },
  'find-noun-1': { ...findNoun1Data, level: 'b1' },
  'comma-drill-1': { ...commaDrill1Data, level: 'c1' },
  'comma-drill-2': { ...commaDrill2Data, level: 'c1' },
  'comma-drill-3': { ...commaDrill3Data, level: 'c1' },
  'conjunctions-1': { ...conjunctions1Data, level: 'b2' },
  'ideas-list-1': { id: 'ideas-list-1', title: 'Ideas List', type: 'writing-prompt', xp: 50, level: 'b1' },
  'wordforms': { id: 'wordforms', title: 'Word Forms', type: 'language-element', xp: 75, level: 'b1' },
  'thinkingwhatyoullsay': { id: 'thinkingwhatyoullsay', title: 'Thinking What You\'ll Say', type: 'speaking-preparation', xp: 100, level: 'b2' },
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
        { id: 'find-passive-1', title: 'Find the passive voice', xp: 500, type: 'reading-drill', tier: 'bronze', level: 'c1' },
        { id: 'find-presperf-1', title: 'Find the present perfect', xp: 500, type: 'reading-drill', tier: 'bronze', level: 'b2' },
        { id: 'find-noun-1', title: 'Find the noun phrase', xp: 500, type: 'reading-drill', tier: 'bronze', level: 'b1' },
      ]
    },
    {
      id: 'writing-drills',
      title: 'Writing Skills',
      tasks: [
        { id: 'comma-drill-1', title: 'Commas: Introductory Elements', xp: 100, type: 'punctuation-correction', tier: 'bronze', level: 'c1' },
        { id: 'comma-drill-2', title: 'Commas: Compound Sentences', xp: 100, type: 'punctuation-correction', tier: 'bronze', level: 'c1' },
        { id: 'comma-drill-3', title: 'Commas: Lists and Series', xp: 100, type: 'punctuation-correction', tier: 'bronze', level: 'c1' },
        { id: 'conjunctions-1', title: 'Conjunctions: Although, However, etc.', xp: 100, type: 'gap-fill-tokens', tier: 'bronze', level: 'b2' },
        { id: 'ideas-list-1', title: 'Ideas List', xp: 50, type: 'writing-prompt', tier: 'bronze', level: 'b1' },
      ]
    },
    {
      id: 'language-elements',
      title: 'Language Elements',
      tasks: [
        { id: 'wordforms', title: 'Word Forms', xp: 75, type: 'language-element', tier: 'bronze', level: 'b1' },
      ]
    },
    {
      id: 'speaking-drills',
      title: 'Speaking Skills',
      tasks: [
        { id: 'thinkingwhatyoullsay', title: 'Thinking What You\'ll Say', xp: 100, type: 'speaking-preparation', tier: 'bronze', level: 'b2' },
      ]
    }
  ]
};
