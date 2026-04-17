// Mock Plucker - Dynamically pulls content from TELC full mocks
// This is the "source of truth" for generating atom tests

// Import from JSON mocks (single source of truth)
import { 
  telcMocks,
  getAllReadingPassages as jsonGetReading,
  getAllWritingTasks as jsonGetWriting,
  getAllListeningSections as jsonGetListening,
  getAllSpeakingParts as jsonGetSpeaking,
  getAllVocab as jsonGetVocab,
  getAllLanguageElements as jsonGetLanguageElements
} from '../data/TELC/mocks';

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
const allReadingMocks = telcMocks;

// All speaking mocks combined (from JSON)
const allSpeakingMocks = telcMocks;

// All listening mocks combined (from JSON)
const allListeningMocks = telcMocks;

// All writing mocks combined (from JSON)
const allWritingMocks = telcMocks;

/**
 * Extract all reading passages from all reading mocks
 */
const getAllReadingPassages = () => {
  return jsonGetReading();
};

/**
 * Extract all speaking sections from all speaking mocks
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
 * @param {string} skill - The skill type (reading, writing, listening, speaking, vocabulary)
 * @param {string} level - Optional level filter (b1, b2, c1)
 */
export const pluckRandom = (skill, level = null) => {
  
  if (skill === 'reading') {
    const allPassages = getAllReadingPassages();
    const passages = level ? allPassages.filter(p => p.level === level) : allPassages;
    const passage = getRandomItem(passages);
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
    const passages = level ? allPassages.filter(p => p.level === level) : allPassages;
    const randomPassage = getRandomItem(passages);
    
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
    const tasks = level ? allWritingTasks.filter(t => t.level === level) : allWritingTasks;
    const randomTask = getRandomItem(tasks);
    
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
    console.log('[pluckRandom listening] allListeningSections count:', allListeningSections.length);
    const sections = level ? allListeningSections.filter(s => s.level === level) : allListeningSections;
    console.log('[pluckRandom listening] filtered sections count:', sections.length);
    const randomSection = getRandomItem(sections);
    console.log('[pluckRandom listening] randomSection:', randomSection?.id);
    
    if (randomSection) {
      // Return wrapped with sections array (like full-mock format)
      return {
        title: 'Listening',
        time: 30,
        sections: [randomSection],  // The listening part becomes a section in the wrapper
        skill: 'listening',
        type: 'LISTENING',
        xp: randomSection.xp || 150,
        ...randomSection  // Spread listening part properties too
      };
    }
    
    // Fallback
    return {
      id: 'listening-quick',
      title: 'Quick Listening',
      type: 'LISTENING',
      skill: 'listening',
      xp: 100
    };
  }
  
  if (skill === 'speaking') {
    // Pick a random speaking mock from the values of telcMocks
    const mockValues = Object.values(allSpeakingMocks);
    // Filter by level if specified
    const filteredMocks = level ? mockValues.filter(m => m.level === level) : mockValues;
    const randomMock = getRandomItem(filteredMocks.length > 0 ? filteredMocks : mockValues);
    
    // Access speaking sections from the normalized JSON structure
    const speakingData = randomMock?.speaking;
    
    if (speakingData && speakingData.sections && speakingData.sections.length > 0) {
      // Return first section directly (like reading)
      const firstSection = speakingData.sections[0];
      return {
        ...firstSection,
        skill: 'speaking',
        type: 'SPEAKING',
        xp: 150,
        level: randomMock.level
      };
    }
    
    // Final fallback
    return {
      id: 'speaking-quick',
      title: 'Quick Speaking Task',
      type: 'SPEAKING',
      skill: 'speaking',
      xp: 150,
      prompts: [
        'Tell me about your hometown.',
        'What do you like to do in your free time?'
      ]
    };
  }
  
if (skill === 'language-elements') {
    const allLanguageElements = jsonGetLanguageElements();
    console.log('[pluckRandom language-elements] allLanguageElements count:', allLanguageElements.length);
    const elements = level ? allLanguageElements.filter(e => e.level === level) : allLanguageElements;
    console.log('[pluckRandom language-elements] filtered elements count:', elements.length);
    const randomElement = getRandomItem(elements);
    console.log('[pluckRandom language-elements] randomElement:', randomElement?.id);
    
    if (randomElement) {
      // Return wrapped with sections array (like full-mock format)
      // This matches how Engine passes leSections to LanguageElementsBlock
      const result = {
        ...randomElement,  // Spread LE part properties first
        title: randomElement.title || 'Language Elements',
        time: 90,
        sections: [randomElement],  // The LE part becomes a section in the wrapper
        skill: 'language-elements',
        type: 'LANGUAGE_ELEMENTS',
        xp: randomElement.xp || 150
      };
      return result;
    }
    
    return {
      id: 'language-elements-quick',
      title: 'Quick Language Elements',
      type: 'LANGUAGE_ELEMENTS',
      skill: 'language-elements',
      xp: 100
    };
  }
  
  // Level-specific reading filters
  if (skill === 'reading_b1') {
    const b1ReadingPassages = getAllReadingPassages().filter(p => p.level === 'b1');
    const passage = getRandomItem(b1ReadingPassages);
    if (passage) {
      return {
        ...passage,
        type: passage.type || 'reading-practice'
      };
    }
  }
  
  if (skill === 'reading_b2') {
    const b2ReadingPassages = getAllReadingPassages().filter(p => p.level === 'b2');
    const passage = getRandomItem(b2ReadingPassages);
    if (passage) {
      return {
        ...passage,
        type: passage.type || 'reading-practice'
      };
    }
  }
  
  if (skill === 'reading_c1') {
    const c1ReadingPassages = getAllReadingPassages().filter(p => p.level === 'c1');
    const passage = getRandomItem(c1ReadingPassages);
    if (passage) {
      return {
        ...passage,
        type: passage.type || 'reading-practice'
      };
    }
  }
  
  // Level-specific writing filters
  if (skill === 'writing_b1') {
    const b1WritingTasks = getAllWritingTasks().filter(t => t.level === 'b1');
    const task = getRandomItem(b1WritingTasks);
    if (task) {
      return {
        ...task,
        type: 'WRITING',
        xp: task.xp || 150
      };
    }
    
    // Fallback to B1-specific writing task
    return {
      id: 'writing-b1-quick',
      title: 'B1 Writing Task',
      type: 'WRITING',
      prompt: 'Write a short email to a friend about your weekend plans.',
      xp: 150
    };
  }
  
  if (skill === 'writing_b2') {
    const b2WritingTasks = getAllWritingTasks().filter(t => t.level === 'b2');
    const task = getRandomItem(b2WritingTasks);
    if (task) {
      return {
        ...task,
        type: 'WRITING',
        xp: task.xp || 150
      };
    }
    
    // Fallback to B2-specific writing task
    return {
      id: 'writing-b2-quick',
      title: 'B2 Writing Task',
      type: 'WRITING',
      prompt: 'Write a semi-formal letter to your landlord about a repair issue.',
      xp: 150
    };
  }
  
  if (skill === 'writing_c1') {
    const c1WritingTasks = getAllWritingTasks().filter(t => t.level === 'c1');
    const task = getRandomItem(c1WritingTasks);
    if (task) {
      return {
        ...task,
        type: 'WRITING',
        xp: task.xp || 150
      };
    }
    
    // Fallback to C1-specific writing task
    return {
      id: 'writing-c1-quick',
      title: 'C1 Writing Task',
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
export const pluckSingleSpeakingPart = (level = null) => {
  const mockValues = Object.values(allSpeakingMocks);
  const filteredMocks = level ? mockValues.filter(m => m.level === level) : mockValues;
  const randomMock = getRandomItem(filteredMocks.length > 0 ? filteredMocks : mockValues);
  
  if (randomMock && randomMock.speaking?.sections && randomMock.speaking.sections.length > 0) {
    // Pick a random section from the speaking mock
    const randomSection = getRandomItem(randomMock.speaking.sections);
    
    return {
      id: `speaking-part-${randomSection.id || Date.now()}`,
      title: `Speaking: ${randomSection.title || 'Practice'}`,
      level: randomMock.level,
      type: 'telc-speaking',
      xp: 50,
      sections: [{
        ...randomSection,
        skill: 'speaking',
        type: 'SPEAKING'
      }]
    };
  }
  
  // Fallback
  return {
    id: 'speaking-quick',
    title: 'Quick Speaking Task',
    type: 'telc-speaking',
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
 * @param {string} level - Optional level filter (b1, b2, c1)
 */
export const generateMiniTest = (level = null) => {
  return {
    id: `mini-test-${Date.now()}`,
    type: 'mini-test',
    title: 'TELC Mini Test',
    description: 'A quick blast of all 5 skills plus vocab',
    skills: {
      vocab: pluckRandom('vocabulary', level),
      reading: pluckRandom('reading', level),
      listening: pluckRandom('listening', level),
      speaking: pluckRandom('speaking', level),
      writing: pluckRandom('writing', level),
      'language-elements': pluckRandom('language-elements', level)
    }
  };
};

/**
 * Get all available reading passages for drill selection
 */
export const getAllReadingDrills = (level = null) => {
  const allPassages = getAllReadingPassages();
  const passages = level ? allPassages.filter(p => p.level === level) : allPassages;
  return {
    id: 'plucked-reading',
    title: 'Reading Passages',
    tasks: passages.map(p => ({
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
 * @param {string} level - 'b1', 'b2', or 'c1' to filter mocks by level
 */
export const pluckRandomFullMock = (level = null) => {
  // Get all mocks
  const mockValues = Object.values(telcMocks);
  
  // Filter by level if specified
  let filteredMocks = mockValues;
  if (level) {
    filteredMocks = mockValues.filter(m => m.level === level);
  }
  
  // Get a random mock
  const mock = getRandomItem(filteredMocks.length > 0 ? filteredMocks : mockValues);
  
  if (!mock) {
    console.error('No mock found for full test');
    return null;
  }
  
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
  
  // Add speaking sections (from mock.speaking.sections)
  if (mock.speaking?.sections) {
    mock.speaking.sections.forEach(section => {
      sections.push({
        ...section,
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
  
  // Combine into a full mock test - return the RAW mock, not built object
  return mock;
};

/**
 * Get Mock 1 specifically for full test (not random)
 * This ensures users start with Mock 1 and can refresh to retry
 * @param {string} level - 'b1', 'b2', or 'c1' to filter mocks by level
 */
export const pluckFullMock1 = (level = null) => {
  // Get all mocks
  const mockValues = Object.values(telcMocks);
  
  // Filter by level if specified
  let filteredMocks = mockValues;
  if (level) {
    filteredMocks = mockValues.filter(m => m.level === level);
  }
  
  // Always get the first mock (mock 1)
  const mock = filteredMocks.length > 0 ? filteredMocks[0] : mockValues[0];
  
  if (!mock) {
    console.error('No mock found for full test');
    return null;
  }
  
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
 
  // Add speaking sections (from mock.speaking.sections)
  if (mock.speaking?.sections) {
    mock.speaking.sections.forEach(section => {
      sections.push({
        ...section,
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
    id: `mock-${level}-1`,
    title: `TELC ${level?.toUpperCase()} Mock Test 1`,
    type: 'full-mock',
    level: level,
    mockNumber: 1,
    xp: 2000,
    sections: sections
  };
  
  return fullMock;
};