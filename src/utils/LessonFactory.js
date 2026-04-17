import { telcMocks } from '../data/TELC/mocks';
import { lessonDatabase } from '../data/index';
import { loadFullLesson } from './lessonLoader';
import { getMockById } from '../data/TELC/mocks';
import { 
  pluckRandom, 
  pluckRandomFullMock, 
  findVocabFromReading
} from './mockPlucker';

/**
 * LessonFactory
 * Centralizes the logic for preparing a lesson before it hits the Engine.
 */
export const LessonFactory = {
  
  // 1. TRANSFORMER: The "Chef" logic you just provided
  // Converts a raw Mock object into a structured "Full Test" for the Engine
  createFullMockFromMock: (mock, testType) => {
    if (!mock) return null;
    
    const sections = [];
    
    // Add reading sections
    if (mock.reading?.sections) {
      mock.reading.sections.forEach(section => {
        if (section.passages) {
          section.passages.forEach(passage => {
            sections.push({
              ...passage,
              skill: 'reading',
              type: passage.type || 'reading-practice'
            });
          });
        }
      });
    }
    
    // Add writing sections
    if (mock.writing?.sections) {
      mock.writing.sections.forEach(section => {
        sections.push({
          ...section,
          skill: 'writing',
          type: 'WRITING'
        });
      });
    }
    
    // Add speaking sections (for TELC tests)
    if (mock.speaking?.sections) {
      mock.speaking.sections.forEach(section => {
        sections.push({
          ...section,
          skill: 'speaking',
          type: 'SPEAKING'
        });
      });
    }
    
    // Add listening sections
    if (mock.listening?.sections) {
      mock.listening.sections.forEach(section => {
        sections.push({
          ...section,
          skill: 'listening',
          type: 'LISTENING'
        });
      });
    }
    
    // Add language elements sections (for TELC tests)
    // Preserve the original structure with passages and content for LanguageElementsBlock
    if (mock.languageElements?.sections && mock.languageElements.sections.length > 0) {
      // Add the entire languageElements object as a section, preserving nested structure
      sections.push({
        ...mock.languageElements,  // Preserve: title, time, sections with passages
        id: 'language-elements',
        skill: 'language-elements',
        type: 'LANGUAGE_ELEMENTS'
      });
    }
    
    // Add vocabulary
    if (mock.vocabulary) {
      sections.unshift({
        ...mock.vocabulary,
        skill: 'vocab',
        type: 'VOCAB'
      });
    }
    
    return {
      id: `mock-${testType}-${Date.now()}`,
      title: mock.title,
      type: 'full-mock',
      testType: testType,
      mockNumber: mock.mockNumber,
      xpReward: 2000,
      sections: sections
    };
  },

  // 2. RESOLVER: Logic to find which mock to use based on path/type
  prepareFullTest: (testType, path = null) => {
    let specificMock = null;

    // Resolve specific mock from path if provided
    if (path) {
        if (path.startsWith('telc-') && path.includes('-mock-')) {
            specificMock = getMockById(path);
        } else if (path.includes('full-test-')) {
            const mockId = path.split('full-test-').pop();
            specificMock = getMockById(mockId);
        }
    }

    // Fallback to random if no specific mock found
    const type = testType.match(/b1|b2|c1/i)?.[1]?.toLowerCase() || 'b2';
    const mockData = specificMock || pluckRandomFullMock(type);
    
    // Transform and return
    return LessonFactory.createFullMockFromMock(mockData, type);
  },

  // 3. MAIN ENTRY POINT: Used by App.jsx handleStartTask
  create: (taskMetadata) => {
    // Standalone Vocab
    if (taskMetadata.type === 'VOCAB' || taskMetadata.type === 'VOCAB_FLASHCARDS') {
      return {
        ...taskMetadata,
        questions: taskMetadata.questions || taskMetadata.vocabList || taskMetadata.words || []
      };
    }

    // Command-style strings for mini-tests and random exercises
    if (taskMetadata.id) {
      // Atom Skill - random exercise for specific skill
      if (taskMetadata.id === 'atom-skill') {
        return LessonFactory.createAtomSkill(taskMetadata.skill);
      }

      // Random Full Mock - Quick Start button
      if (taskMetadata.id === 'random-mock') {
        const type = taskMetadata.testType || 'b2';
        const rawMock = pluckRandomFullMock(type);
        return LessonFactory.createFullMockFromMock(rawMock, type);
      }

      // Mini-test with single random exercise (from BrandTestHub Quick Start)
      if (taskMetadata.id && taskMetadata.id.includes('single-exercise')) {
        const level = taskMetadata.id.match(/telc-(b1|b2|c1)/)?.[1] || 'b2';
        return LessonFactory.createMiniTest(level);
      }

      // Mini-test with ALL skills (from free-mock /free-mock route)
      if (taskMetadata.id && taskMetadata.id.includes('mini-test')) {
        const type = taskMetadata.id.match(/telc-(b1|b2|c1)/)?.[1] || 'b2';
        const readingExercise = pluckRandom('reading', type);
        const vocabExercise = findVocabFromReading(readingExercise);
        return {
          id: `mini-test-full-${Date.now()}`,
          title: `${type.toUpperCase()} Mini Test`,
          type: 'mixed-flow',
          xpReward: 1500,
          sections: [
            { ...vocabExercise, skill: 'vocab' },
            { ...readingExercise, skill: 'reading' },
            { ...pluckRandom('listening', type), skill: 'listening' },
            { ...pluckRandom('speaking', type), skill: 'speaking' },
            { ...pluckRandom('writing', type), skill: 'writing' },
            { ...pluckRandom('language-elements', type), skill: 'language-elements' }
          ].filter(Boolean)
        };
      }
    }

    // Mock sections (from Hubs)
    if (taskMetadata.mockId) {
        const mock = telcMocks[taskMetadata.mockId];
        switch (taskMetadata.skill) {
            case 'reading':
                return { ...mock.reading, skill: 'reading', passages: mock.reading.sections.flatMap(s => s.passages) };
            case 'listening':
                return { ...mock.listening, skill: 'listening' };
            case 'writing':
                return { ...mock.writing, skill: 'writing', sections: mock.writing.sections };
            case 'speaking':
                return { ...mock.speaking, skill: 'speaking' };
            case 'language-elements':
                return { ...mock.languageElements, skill: 'language-elements', sections: mock.languageElements?.sections };
            default: return mock;
        }
    }

    // Standalone Drills
    return loadFullLesson(taskMetadata, lessonDatabase);
  },

  // 4. HELPER: Create a mini-test with a single random exercise
  createMiniTest: (level) => {
    const skillTypes = ['vocab', 'reading', 'listening', 'writing', 'speaking', 'language-elements'];
    const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
    
    let singleExercise = null;
    
    if (randomSkill === 'vocab') {
      const readingExercise = pluckRandom('reading', level);
      singleExercise = findVocabFromReading(readingExercise);
    } else if (randomSkill === 'reading') {
      singleExercise = pluckRandom('reading', level);
    } else if (randomSkill === 'writing') {
      singleExercise = pluckRandom('writing', level);
    } else if (randomSkill === 'speaking') {
      singleExercise = pluckRandom('speaking', level);
    } else if (randomSkill === 'listening') {
      singleExercise = pluckRandom('listening', level);
    } else if (randomSkill === 'language-elements') {
      singleExercise = pluckRandom('language-elements', level);
    }
    
    // Fallback if any skill returns null
    if (!singleExercise) {
      singleExercise = LessonFactory.getFallbackExercise(randomSkill);
    }
    
    // Create a mini-test flow with only ONE random exercise
    const miniTest = {
      id: `mini-test-${level}-${Date.now()}`,
      title: `${level.toUpperCase()} Mini Test`,
      type: 'mini-test-flow',
      xp: singleExercise?.xp || 200,
      sections: [{ ...singleExercise, skill: randomSkill }].filter(Boolean)
    };
    
    return miniTest.sections.length > 0 ? miniTest : null;
  },
  
  // 4b. HELPER: Fallback exercise for any skill
  getFallbackExercise: (skill) => {
    const fallbacks = {
      vocab: { id: 'vocab-fallback', title: 'Quick Vocab Drill', type: 'VOCAB', xp: 100, words: [] },
      reading: { id: 'reading-fallback', title: 'Quick Reading', type: 'reading-practice', xp: 150 },
      writing: { id: 'writing-fallback', title: 'Quick Writing', type: 'WRITING', xp: 150, prompt: 'Write a short paragraph.' },
      speaking: { id: 'speaking-fallback', title: 'Speaking Practice', type: 'SPEAKING', xp: 200, prompts: ['Tell me about your hometown.'] },
      listening: { id: 'listening-fallback', title: 'Quick Listening', type: 'LISTENING', xp: 150 },
      'language-elements': { id: 'le-fallback', title: 'Quick Language Elements', type: 'LANGUAGE_ELEMENTS', xp: 150 }
    };
    return fallbacks[skill] || null;
  },

  // 5. HELPER: Create an atom skill exercise for a specific skill
  createAtomSkill: (skill) => {
    const skillMap = {
      'reading': 'reading',
      'writing': 'writing',
      'listening': 'listening',
      'speaking': 'speaking',
      'language-elements': 'language-elements'
    };
    const randomExercise = pluckRandom(skillMap[skill] || skill);
    return randomExercise || null;
  }
};