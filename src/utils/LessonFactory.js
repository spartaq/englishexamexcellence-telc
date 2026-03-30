import { ieltsMocks } from '../data/IELTS/mocks';
import { lessonDatabase } from '../data/index';
import { loadFullLesson } from './lessonLoader';
import { getMockById } from '../data/IELTS/mocks';
import { 
  pluckRandom, 
  pluckRandomFullMock, 
  findVocabFromReading, 
  pluckSingleSpeakingPart 
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
    
    // Add speaking parts
    if (mock.speaking?.parts) {
      mock.speaking.parts.forEach(part => {
        sections.push({
          ...part,
          skill: 'speaking',
          type: 'SPEAKING'
        });
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
      id: `full-mock-${mock.id}`,
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
        if (path.startsWith('ielts-general-mock-') || path.startsWith('ielts-academic-mock-')) {
            specificMock = getMockById(path);
        } else if (path.includes('full-test-')) {
            const mockId = path.split('full-test-').pop();
            specificMock = getMockById(mockId);
        }
    }

    // Fallback to random if no specific mock found
    const type = testType.includes('general') ? 'general' : 'academic';
    const mockData = specificMock || pluckRandomFullMock(type);
    
    // Transform and return
    return LessonFactory.createFullMockFromMock(mockData, type);
  },

  // 3. MAIN ENTRY POINT: Used by App.jsx handleStartTask
  create: (taskMetadata) => {
    console.log('[LessonFactory] Preparing task:', taskMetadata.type || taskMetadata.id);

    // Standalone Vocab
    if (taskMetadata.type === 'VOCAB' || taskMetadata.type === 'VOCAB_FLASHCARDS') {
      return {
        ...taskMetadata,
        questions: taskMetadata.questions || taskMetadata.vocabList || []
      };
    }

    // Mini-test Flows
    if (taskMetadata.type === 'flow' || taskMetadata.id === 'mini-test-flow') {
      const readingExercise = pluckRandom('reading');
      const vocabExercise = findVocabFromReading(readingExercise);
      return {
        id: 'dynamic-flow-' + Date.now(),
        title: 'Daily Mini Test',
        type: 'mixed-flow',
        xpReward: 1500,
        sections: [
          { ...vocabExercise, skill: 'vocab' },
          { ...readingExercise, skill: 'reading' },
          { ...pluckRandom('listening'), skill: 'listening' },
          { ...(pluckSingleSpeakingPart()?.sections?.[0]), skill: 'speaking' },
          { ...pluckRandom('writing'), skill: 'writing' }
        ].filter(Boolean)
      };
    }

    // Command-style strings for mini-tests and random exercises
    if (taskMetadata.id) {
      console.log('[LessonFactory] Checking command-style id:', taskMetadata.id);
      // General Mini Test - single random exercise
      if (taskMetadata.id === 'ielts-general-mini-test') {
        console.log('[LessonFactory] Matched ielts-general-mini-test');
        return LessonFactory.createMiniTest('general');
      }

      // Academic Mini Test - single random exercise
      if (taskMetadata.id === 'ielts-academic-mini-test') {
        console.log('[LessonFactory] Matched ielts-academic-mini-test');
        return LessonFactory.createMiniTest('academic');
      }

      // General Quick Practice - single random exercise
      if (taskMetadata.id === 'ielts-mini-random-general') {
        console.log('[LessonFactory] Matched ielts-mini-random-general');
        return LessonFactory.createMiniTest('general');
      }

      // Academic Quick Practice - single random exercise
      if (taskMetadata.id === 'ielts-mini-random-academic') {
        console.log('[LessonFactory] Matched ielts-mini-random-academic');
        return LessonFactory.createMiniTest('academic');
      }

      // Atom Skill - random exercise for specific skill
      if (taskMetadata.id === 'atom-skill') {
        console.log('[LessonFactory] Matched atom-skill');
        return LessonFactory.createAtomSkill(taskMetadata.skill);
      }
    }

    // Mock sections (from Hubs)
    if (taskMetadata.mockId) {
        const mock = ieltsMocks[taskMetadata.mockId];
        switch (taskMetadata.skill) {
            case 'reading':
                return { ...mock.reading, skill: 'reading', passages: mock.reading.sections.flatMap(s => s.passages) };
            case 'listening':
                return { ...mock.listening, skill: 'listening' };
            case 'writing':
                return { ...mock.writing, skill: 'writing', sections: mock.writing.sections };
            case 'speaking':
                return { ...mock.speaking, skill: 'speaking' };
            default: return mock;
        }
    }

    // Standalone Drills
    return loadFullLesson(taskMetadata, lessonDatabase);
  },

  // 4. HELPER: Create a mini-test with a single random exercise
  createMiniTest: (testType) => {
    console.log('[LessonFactory] Creating mini-test for:', testType);
    const skillTypes = ['vocab', 'reading', 'listening', 'writing', 'speaking'];
    const randomSkill = skillTypes[Math.floor(Math.random() * skillTypes.length)];
    console.log('[LessonFactory] Random skill selected:', randomSkill);
    
    let singleExercise = null;
    
    if (randomSkill === 'vocab') {
      const readingExercise = pluckRandom(`reading_${testType}`);
      console.log('[LessonFactory] Reading exercise for vocab:', readingExercise);
      singleExercise = findVocabFromReading(readingExercise);
    } else if (randomSkill === 'reading') {
      singleExercise = pluckRandom(`reading_${testType}`);
    } else if (randomSkill === 'writing') {
      singleExercise = pluckRandom(`writing_${testType}`);
    } else if (randomSkill === 'speaking') {
      const speakingWrapper = pluckSingleSpeakingPart();
      singleExercise = speakingWrapper?.sections?.[0] || {
        id: 'speaking-fallback',
        title: 'Speaking Practice',
        type: 'SPEAKING',
        xp: 200,
        prompts: ['Tell me about your hometown.', 'What do you like to do in your free time?']
      };
    } else if (randomSkill === 'listening') {
      singleExercise = pluckRandom('listening');
    }
    
    console.log('[LessonFactory] Single exercise:', singleExercise);
    
    // Create a mini-test flow with only ONE random exercise
    const miniTest = {
      id: `mini-test-${testType}-${Date.now()}`,
      title: testType === 'general' ? 'General Mini Test' : 'Academic Mini Test',
      type: 'mini-test-flow',
      xp: singleExercise?.xp || 200,
      sections: [{ ...singleExercise, skill: randomSkill }].filter(Boolean)
    };
    
    console.log('[LessonFactory] Mini-test created:', miniTest);
    return miniTest.sections.length > 0 ? miniTest : null;
  },

  // 5. HELPER: Create an atom skill exercise for a specific skill
  createAtomSkill: (skill) => {
    const skillMap = {
      'reading-ac': 'reading',
      'reading-gt': 'reading',
      'writing-ac': 'writing',
      'writing-gt': 'writing',
      'listening': 'listening',
      'speaking': 'speaking'
    };
    const randomExercise = pluckRandom(skillMap[skill] || skill);
    return randomExercise || null;
  }
};