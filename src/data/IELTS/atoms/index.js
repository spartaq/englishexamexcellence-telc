// IELTS Atoms - Configuration for IELTS skill practice
// Data is dynamically pulled from full mocks using mockPlucker utility

// Import plucking functions from mockPlucker - the source of truth
import { pluckRandom, generateMiniTest, getAllReadingDrills, pluckRandomFullMock } from '../../../utils/mockPlucker';

/**
 * atomsData - Legacy export for backward compatibility
 * Returns a random exercise by skill type (dynamically from mocks)
 */
export const atomsData = {
  // Reading - dynamically plucked from reading mocks
  getReading: () => pluckRandom('reading'),
  
  // Listening - dynamically plucked from listening mocks
  getListening: () => pluckRandom('listening'),
  
  // Speaking - dynamically plucked from speaking mocks
  getSpeaking: () => pluckRandom('speaking'),
  
  // Writing - dynamically plucked from writing mocks
  getWriting: () => pluckRandom('writing'),
  
  // Vocab - dynamically plucked from reading passages
  getVocab: () => pluckRandom('vocabulary'),
  
  // Mini test - all 4 skills + vocab
  getMiniTest: () => generateMiniTest()
};

/**
 * IELTS_ATOMS - Configuration for IELTS skill practice
 * 
 * Each skill category maps to a specific practice type:
 * - mini-test: Random pick from each skill (vocab, reading, listening, writing)
 * - reading-ac: Academic Reading exercises
 * - reading-gt: General Training Reading exercises
 * - writing-ac: Academic Writing exercises
 * - writing-gt: General Training Writing exercises
 * - listening: Listening exercises
 * - speaking: Speaking exercises
 */
export const IELTS_ATOMS = {
  title: "IELTS Atoms",
  description: "Quick practice exercises from each skill area - dynamically generated from full mocks",
  
  // Skill-specific categories for the BrandTestHub buttons
  skillCategories: {
    'full-test': {
      id: 'full-test',
      title: 'Full Test',
      description: 'Complete IELTS test with all 4 skills - Reading, Writing, Speaking, Listening',
      type: 'full-flow',
      sequence: ['reading', 'writing', 'speaking', 'listening'],
      xp: 3000,
      tier: 'bronze',
      // Function to get the content dynamically
      getContent: () => pluckRandomFullMock()
    },
    'mini-test': {
      id: 'mini-test',
      title: 'Mini Test',
      description: 'A quick blast of all 4 skills plus vocab',
      type: 'flow',
      sequence: ['vocab', 'reading', 'listening', 'speaking', 'writing'], 
      xp: 1500,
      tier: 'bronze',
      // Function to get the content dynamically
      getContent: () => generateMiniTest()
    },
    'reading-ac': {
      id: 'reading-ac',
      title: 'Academic Reading',
      description: 'Random Academic Reading exercise',
      type: 'random-pick',
      skill: 'reading',
      moduleType: 'academic',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('reading')
    },
    'reading-gt': {
      id: 'reading-gt',
      title: 'General Reading',
      description: 'Random General Training Reading exercise',
      type: 'random-pick',
      skill: 'reading',
      moduleType: 'general',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('reading')
    },
    'writing-ac': {
      id: 'writing-ac',
      title: 'Academic Writing',
      description: 'Random Academic Writing exercise',
      type: 'random-pick',
      skill: 'writing',
      moduleType: 'academic',
      xp: 300,
      tier: 'bronze',
      getContent: () => pluckRandom('writing')
    },
    'writing-gt': {
      id: 'writing-gt',
      title: 'General Writing',
      description: 'Random General Training Writing exercise',
      type: 'random-pick',
      skill: 'writing',
      moduleType: 'general',
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
  
  // Legacy categories for backward compatibility with TaskSelection
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

/**
 * Get content for a specific atom type
 * @param {string} categoryId - The category ID (e.g., 'mini-test', 'reading-ac', 'listening')
 * @returns {object} - The dynamically generated content
 */
export const getAtomContent = (categoryId) => {
  const category = IELTS_ATOMS.skillCategories[categoryId] || 
                   IELTS_ATOMS.categories?.find(c => c.id === categoryId);
  
  if (category && category.getContent) {
    return category.getContent();
  }
  
  // Fallback to default pluckRandom
  return pluckRandom(category?.skill || 'reading');
};

/**
 * Get all available reading drills (extracted from all reading mocks)
 */
export const getReadingDrills = () => getAllReadingDrills();

// Re-export for backward compatibility
export const ATOM_HUB = IELTS_ATOMS;
