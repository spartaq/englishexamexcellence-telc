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
  }
};