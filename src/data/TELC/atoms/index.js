// TELC Atoms - Configuration for TELC skill practice
// Data is dynamically pulled from full mocks using mockPlucker utility

import { pluckRandom, generateMiniTest, getAllReadingDrills, pluckRandomFullMock } from '../../../utils/mockPlucker';

export const atomsData = {
  getReading: () => pluckRandom('reading'),
  getListening: () => pluckRandom('listening'),
  getSpeaking: () => pluckRandom('speaking'),
  getWriting: () => pluckRandom('writing'),
  getVocab: () => pluckRandom('vocabulary'),
  getMiniTest: () => generateMiniTest()
};

export const TELC_ATOMS = {
  title: "TELC Atoms",
  description: "Quick practice exercises from each skill area - dynamically generated from full mocks",
  
  skillCategories: {
    'full-test': {
      id: 'full-test',
      title: 'Full Test',
      description: 'Complete TELC test with all 4 skills - Reading, Writing, Speaking, Listening',
      type: 'full-flow',
      sequence: ['reading', 'writing', 'speaking', 'listening'],
      xp: 3000,
      tier: 'bronze',
      getContent: () => pluckRandomFullMock()
    },
    'telc-mini-test': {
      id: 'telc-mini-test',
      title: 'Mini Test',
      description: 'A quick blast of all 4 skills plus vocab',
      type: 'flow',
      sequence: ['vocab', 'reading', 'listening', 'speaking', 'writing'], 
      xp: 1500,
      tier: 'bronze',
      getContent: () => generateMiniTest()
    },
    'reading': {
      id: 'reading',
      title: 'Reading',
      description: 'Random Reading exercise',
      type: 'random-pick',
      skill: 'reading',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('reading')
    },
    'writing': {
      id: 'writing',
      title: 'Writing',
      description: 'Random Writing exercise',
      type: 'random-pick',
      skill: 'writing',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('writing')
    },
    'listening': {
      id: 'listening',
      title: 'Listening',
      description: 'Random Listening exercise (from full mocks)',
      type: 'random-pick',
      skill: 'listening',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('listening')
    },
    'speaking': {
      id: 'speaking',
      title: 'Speaking',
      description: 'Random Speaking exercise (from full mocks)',
      type: 'random-pick',
      skill: 'speaking',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('speaking')
    }
  },
  
  categories: [
    {
      id: 'mini-test-flow',
      title: 'Take a Full Mini-Test',
      description: 'A quick blast of all 4 skills',
      type: 'flow',
      sequence: ['vocab', 'reading', 'writing'], 
      xp: 1000,
      tier: 'bronze',
      getContent: () => generateMiniTest()
    },
    {
      id: 'reading-practice',
      title: 'Mini Reading Test',
      description: 'One random passage from the archives',
      type: 'random-pick',
      skill: 'reading',
      xp: 500,
      tier: 'bronze',
      getContent: () => pluckRandom('reading')
    }
  ]
};

export const getAtomContent = (categoryId) => {
  const category = TELC_ATOMS.skillCategories[categoryId] || 
                   TELC_ATOMS.categories?.find(c => c.id === categoryId);
  
  if (category && category.getContent) {
    return category.getContent();
  }
  
  return pluckRandom(category?.skill || 'reading');
};

export const getReadingDrills = () => getAllReadingDrills();

export const ATOM_HUB = TELC_ATOMS;