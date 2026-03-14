// Mock Plucker - Dynamically pulls content from IELTS full mocks
// This is the "source of truth" for generating atom tests

// Import from JSON mocks (single source of truth)
import { 
  ieltsMocks,
  getAllReadingPassages as jsonGetReading,
  getAllWritingTasks as jsonGetWriting,
  getAllListeningSections as jsonGetListening,
  getAllSpeakingParts as jsonGetSpeaking,
  getAllVocab as jsonGetVocab
} from '../data/IELTS/mocks';

// Import vocab hub for fallback
import { VOCAB_HUB } from '../data/vocabulary';

// Helper to get a random item from an array
const getRandomItem = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

// Get vocab category by ID from VOCAB_HUB
export const getVocabById = (vocabId) => {
  if (!vocabId) return null;
  
  // Look through VOCAB_HUB categories for matching vocab
  for (const category of VOCAB_HUB.categories || []) {
    for (const task of category.tasks || []) {
      if (task.id === vocabId) {
        return {
          id: task.id,
          title: task.title,
          type: 'VOCAB',
          xp: task.xp || 100,
          level: task.level,
          words: task.words || []
        };
      }
    }
  }
  return null;
};

// All reading mocks combined (from JSON)
const allReadingMocks = ieltsMocks;

// All speaking mocks combined (from JSON)
const allSpeakingMocks = ieltsMocks;

// All listening mocks combined (from JSON)
const allListeningMocks = ieltsMocks;

// All writing mocks combined (from JSON)
const allWritingMocks = ieltsMocks;

/**
 * Extract all reading passages from all reading mocks
 */
const getAllReadingPassages = () => {
  return jsonGetReading();
};

/**
 * Extract all speaking parts from all speaking mocks
 */
const getAllSpeakingParts = () => {
  return jsonGetSpeaking();
};

/**
 * Extract all listening sections from all listening mocks
 */
const getAllListeningSections = () => {
  return jsonGetListening();
};

/**
 * Extract all writing tasks from all writing mocks
 */
const getAllWritingTasks = () => {
  return jsonGetWriting();
};

/**
 * Pluck a random exercise by skill type
 * This is the main function used by atoms to generate content
 */
export const pluckRandom = (skill) => {
  
  if (skill === 'reading') {
    const allPassages = getAllReadingPassages();
    const passage = getRandomItem(allPassages);
    if (passage) {
      return {
        ...passage,
        type: passage.type || 'reading-practice'
      };
    }
  }
  
  if (skill === 'vocabulary') {
    // Pick a random reading passage first
    const allPassages = getAllReadingPassages();
    const randomPassage = getRandomItem(allPassages);
    
    // Get vocabulary - check passage vocabList first, then vocabId from categories
    let vocabData = null;
    
    // Priority 1: Use vocabList directly in passage
    if (randomPassage && randomPassage.vocabList && randomPassage.vocabList.length > 0) {
      vocabData = {
        id: randomPassage.vocabId || `vocab-${randomPassage.id}`,
        title: randomPassage.vocabTitle || `${randomPassage.title} Vocabulary`,
        words: randomPassage.vocabList
      };
    }
    // Priority 2: Look up vocab by ID from VOCAB_HUB categories
    else if (randomPassage && randomPassage.vocabId) {
      vocabData = getVocabById(randomPassage.vocabId);
    }
    
    // Priority 3: Fall back to random vocab from VOCAB_HUB if nothing found
    if (!vocabData || !vocabData.words || vocabData.words.length === 0) {
      const allVocabTasks = VOCAB_HUB.categories.flatMap(cat => cat.tasks || []);
      vocabData = getRandomItem(allVocabTasks);
    }
    
    if (vocabData && vocabData.words && vocabData.words.length > 0) {
      // Select 3-5 random words from the vocab list
      const shuffledWords = [...vocabData.words].sort(() => Math.random() - 0.5);
      const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));
      
      return {
        id: `vocab-${randomPassage?.id || 'quick'}`,
        title: `Vocab: ${randomPassage?.title || 'Quick Drill'}`,
        type: 'VOCAB',
        xp: 100,
        level: vocabData.level,
        vocabId: vocabData.id,
        sourceTitle: randomPassage?.sourceTitle,
        passageTitle: randomPassage?.title,
        words: selectedWords
      };
    }
    
    // Fallback: return static words if nothing found
    return {
      id: 'vocab-quick',
      title: 'Quick Vocab Drill',
      type: 'VOCAB',
      xp: 100,
      words: [
        {
          term: 'ubiquitous',
          hu: 'mindenhol jelenlevő',
          definition: 'Present, appearing, or found everywhere',
          example: 'Smartphones have become ubiquitous in modern society.'
        },
        {
          term: 'ephemeral',
          hu: 'rövid életű',
          definition: 'Lasting for a very short time',
          example: 'The ephemeral beauty of cherry blossoms makes them special.'
        },
        {
          term: 'pragmatic',
          hu: 'gyakorlatias',
          definition: 'Dealing with things sensibly and realistically',
          example: 'She took a pragmatic approach to solving the problem.'
        }
      ]
    };
  }
  
  if (skill === 'writing') {
    // Pull a random writing task from writing mocks
    const allWritingTasks = getAllWritingTasks();
    const randomTask = getRandomItem(allWritingTasks);
    
    if (randomTask) {
      return {
        ...randomTask,
        type: 'WRITING',
        xp: randomTask.xp || 150
      };
    }
    
    // Fallback
    return {
      id: 'writing-quick',
      title: 'Quick Writing Task',
      type: 'WRITING',
      prompt: 'Write a short paragraph about your daily routine.',
      xp: 150
    };
  }
  
  if (skill === 'listening') {
    // Pull a random listening section from listening mocks
    const allListeningSections = getAllListeningSections();
    const randomSection = getRandomItem(allListeningSections);
    
    if (randomSection) {
      return {
        ...randomSection,
        type: 'LISTENING',
        xp: randomSection.xp || 150
      };
    }
    
    // Fallback
    return {
      id: 'listening-quick',
      title: 'Quick Listening Task',
      type: 'LISTENING',
      xp: 100
    };
  }
  
  if (skill === 'speaking') {
    // Pick a random speaking mock from the values of ieltsMocks
    const mockValues = Object.values(allSpeakingMocks);
    const randomMock = getRandomItem(mockValues);
    
    // Access speaking parts from the new JSON structure
    const speakingData = randomMock?.speaking;
    
    if (speakingData && speakingData.parts && speakingData.parts.length > 0) {
      console.log('Plucking speaking test:', randomMock.title);
      console.log('Number of parts:', speakingData.parts.length);
      
      // Return speaking test with parts as sections for App.jsx tab system
      return {
        id: `speaking-${randomMock.id}`,
        title: randomMock.title,
        type: 'ielts-speaking',
        xp: 150,
        sections: speakingData.parts.map(part => ({
          ...part,
          skill: 'speaking',
          type: 'SPEAKING'
        }))
      };
    }
    
    // Final fallback
    return {
      id: 'speaking-quick',
      title: 'Quick Speaking Task',
      type: 'ielts-speaking',
      xp: 150,
      sections: [
        {
          id: 'part1',
          title: 'Part 1: Introduction',
          skill: 'speaking',
          type: 'SPEAKING',
          prompts: [
            'Tell me about your hometown.',
            'What do you like to do in your free time?'
          ]
        }
      ]
    };
  }
  
  if (skill === 'reading_general') {
    // Pull only General Reading passages
    const generalReadingPassages = getAllReadingPassages().filter(p => {
      // Check if passage is from general mock (new format uses 'ielts-general-mock-1')
      return p.mockId === 'ielts-general-mock-1' || p.testType === 'general';
    });
    
    const passage = getRandomItem(generalReadingPassages);
    if (passage) {
      return {
        ...passage,
        type: passage.type || 'reading-practice'
      };
    }
  }
  
  if (skill === 'reading_academic') {
    // Pull only Academic Reading passages
    const academicReadingPassages = getAllReadingPassages().filter(p => {
      // Check if passage is from academic mock (new format uses 'ielts-academic-mock-1')
      return p.mockId === 'ielts-academic-mock-1' || p.testType === 'academic';
    });
    
    const passage = getRandomItem(academicReadingPassages);
    if (passage) {
      return {
        ...passage,
        type: passage.type || 'reading-practice'
      };
    }
  }
  
  if (skill === 'writing_general') {
    // Pull only General Writing tasks (letter writing, informal/semi-formal)
    const generalWritingTasks = getAllWritingTasks().filter(t => {
      // Check if task is from general mock (new format uses 'ielts-general-mock-1')
      return t.mockId === 'ielts-general-mock-1' || t.testType === 'general';
    });
    
    const task = getRandomItem(generalWritingTasks);
    if (task) {
      return {
        ...task,
        type: 'WRITING',
        xp: task.xp || 150
      };
    }
    
    // Fallback to general-specific writing task
    return {
      id: 'writing-general-quick',
      title: 'General Writing Task',
      type: 'WRITING',
      prompt: 'You recently moved to a new city. Write a letter to a friend telling them about your new home and inviting them to visit.',
      bullets: ['Describe your new home', 'Explain what you like about the area', 'Suggest when they could visit'],
      xp: 150
    };
  }
  
  if (skill === 'writing_academic') {
    // Pull only Academic Writing tasks
    const academicWritingTasks = getAllWritingTasks().filter(t => {
      // Check if task is from academic mock (new format uses 'ielts-academic-mock-1')
      return t.mockId === 'ielts-academic-mock-1' || t.testType === 'academic';
    });
    
    const task = getRandomItem(academicWritingTasks);
    if (task) {
      return {
        ...task,
        type: 'WRITING',
        xp: task.xp || 150
      };
    }
    
    // Fallback to academic-specific writing task
    return {
      id: 'writing-academic-quick',
      title: 'Academic Writing Task',
      type: 'WRITING',
      prompt: 'Discuss both views and give your opinion on the role of technology in education.',
      xp: 150
    };
  }
  
  return null;
};

/**
 * Helper function to find vocab from a reading exercise
 * Extracts vocabId from reading exercise and returns corresponding vocab block
 * @param {Object} readingExercise - The reading exercise to extract vocab from
 * @returns {Object} The vocab block or null if no vocab found
 */
export const findVocabFromReading = (readingExercise) => {
  let vocabExercise = null;
  
  // Priority 1: Check if the reading exercise itself has vocabList directly
  if (readingExercise?.vocabList && readingExercise.vocabList.length > 0) {
    const shuffledWords = [...readingExercise.vocabList].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));
    vocabExercise = {
      id: readingExercise.vocabId || `vocab-${readingExercise.id}`,
      title: readingExercise.vocabTitle || `${readingExercise.title} Vocabulary`,
      type: 'VOCAB',
      xp: 100,
      words: selectedWords
    };
  }
  
  // Priority 2: Check if the reading exercise itself has a vocabId
  if (!vocabExercise && readingExercise?.vocabId) {
    vocabExercise = getVocabById(readingExercise.vocabId);
  }
  
  // Priority 3: Check if reading has sections (nested passages)
  if (!vocabExercise && readingExercise?.sections) {
    for (const section of readingExercise.sections) {
      if (section?.passages) {
        for (const passage of section.passages) {
          if (passage?.vocabList && passage.vocabList.length > 0) {
            const shuffledWords = [...passage.vocabList].sort(() => Math.random() - 0.5);
            const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));
            vocabExercise = {
              id: passage.vocabId || `vocab-${passage.id}`,
              title: passage.vocabTitle || `${passage.title} Vocabulary`,
              type: 'VOCAB',
              xp: 100,
              words: selectedWords
            };
            break;
          }
          if (!vocabExercise && passage?.vocabId) {
            vocabExercise = getVocabById(passage.vocabId);
          }
          if (vocabExercise) break;
        }
      }
      if (vocabExercise) break;
    }
  }
  
  // Priority 4: Check for passages at root level
  if (!vocabExercise && readingExercise?.passages) {
    for (const passage of readingExercise.passages) {
      if (passage?.vocabList && passage.vocabList.length > 0) {
        const shuffledWords = [...passage.vocabList].sort(() => Math.random() - 0.5);
        const selectedWords = shuffledWords.slice(0, Math.min(5, shuffledWords.length));
        vocabExercise = {
          id: passage.vocabId || `vocab-${passage.id}`,
          title: passage.vocabTitle || `${passage.title} Vocabulary`,
          type: 'VOCAB',
          xp: 100,
          words: selectedWords
        };
        break;
      }
      if (!vocabExercise && passage?.vocabId) {
        vocabExercise = getVocabById(passage.vocabId);
        break;
      }
    }
  }
  
  // Fall back to random vocab if no vocabId found
  if (!vocabExercise) {
    vocabExercise = pluckRandom('vocabulary');
  }
  
  return vocabExercise;
};

/**
 * Pluck a single speaking part (for mini tests)
 * Returns just one part instead of all 3 parts
 */
export const pluckSingleSpeakingPart = () => {
  const randomMock = getRandomItem(Object.values(allSpeakingMocks));
  
  if (randomMock && randomMock.speaking?.parts && randomMock.speaking.parts.length > 0) {
    // Pick a random part from the speaking mock
    const randomPart = getRandomItem(randomMock.speaking.parts);
    
    return {
      id: `speaking-part-${randomPart.id || Date.now()}`,
      title: `Speaking: ${randomPart.title || 'Practice'}`,
      type: 'ielts-speaking',
      xp: 50,
      sections: [{
        ...randomPart,
        skill: 'speaking',
        type: 'SPEAKING'
      }]
    };
  }
  
  // Fallback
  return {
    id: 'speaking-quick',
    title: 'Quick Speaking Task',
    type: 'ielts-speaking',
    xp: 50,
    sections: [
      {
        id: 'part1',
        title: 'Part 1: Introduction',
        skill: 'speaking',
        type: 'SPEAKING',
        prompts: [
          'Tell me about your hometown.',
          'What do you like to do in your free time?'
        ]
      }
    ]
  };
};

/**
 * Generate a complete mini-test atom with all 4 skills plus vocab
 * This is used by the "Mini Test" atom type
 */
export const generateMiniTest = () => {
  return {
    id: `mini-test-${Date.now()}`,
    type: 'mini-test',
    title: 'IELTS Mini Test',
    description: 'A quick blast of all 4 skills plus vocab',
    skills: {
      vocab: pluckRandom('vocabulary'),
      reading: pluckRandom('reading'),
      listening: pluckRandom('listening'),
      speaking: pluckSingleSpeakingPart(), // Only one speaking part for mini tests
      writing: pluckRandom('writing')
    }
  };
};

/**
 * Get all available reading passages for drill selection
 */
export const getAllReadingDrills = () => {
  const allPassages = getAllReadingPassages();
  return {
    id: 'plucked-reading',
    title: 'Reading Passages',
    tasks: allPassages.map(p => ({
      ...p,
      xp: 500,
      tier: 'bronze',
      type: 'reading-practice'
    }))
  };
};

/**
 * Legacy function - kept for backward compatibility
 */
export const getAtomsFromMocks = (type) => {
  if (type === 'reading-drills') {
    return getAllReadingDrills();
  }
  return { title: 'Empty', tasks: [] };
};

/**
 * Get a random full mock test (complete exam with all sections)
 * Returns a combined mock with reading, listening, writing, speaking sections
 * @param {string} testType - 'general' or 'academic' to filter mocks by type
 */
export const pluckRandomFullMock = (testType = null) => {
  // Get all mocks
  const mockValues = Object.values(ieltsMocks);
  
  // Filter by test type if specified
  let filteredMocks = mockValues;
  if (testType) {
    filteredMocks = mockValues.filter(m => m.type === testType);
  }
  
  // Get a random mock
  const mock = getRandomItem(filteredMocks.length > 0 ? filteredMocks : mockValues);
  
  if (!mock) {
    console.error('No mock found for full test');
    return null;
  }
  
  // Determine title based on test type
  const mockTitle = testType === 'general' 
    ? 'IELTS General Training Full Mock' 
    : testType === 'academic' 
      ? 'IELTS Academic Full Mock' 
      : 'IELTS Full Mock Test';
  
  // Build sections from the new JSON structure
  const sections = [];
  
  // Add reading sections (from mock.reading.sections)
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
  
  // Add writing sections (from mock.writing.sections)
  if (mock.writing?.sections) {
    mock.writing.sections.forEach(section => {
      sections.push({
        ...section,
        skill: 'writing',
        type: 'WRITING'
      });
    });
  }
  
  // Add listening sections (from mock.listening.sections)
  if (mock.listening?.sections) {
    mock.listening.sections.forEach(section => {
      sections.push({
        ...section,
        skill: 'listening',
        type: 'LISTENING'
      });
    });
  }
  
  // Add speaking parts (from mock.speaking.parts)
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
  
  // Combine into a full mock test
  const fullMock = {
    id: `full-mock-${testType || 'random'}-${Date.now()}`,
    title: mockTitle,
    type: 'full-mock',
    testType: testType,
    xp: 2000,
    sections: sections
  };
  
  return fullMock;
};
