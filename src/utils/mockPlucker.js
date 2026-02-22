// Mock Plucker - Dynamically pulls content from IELTS full mocks
// This is the "source of truth" for generating atom tests

// Import ALL reading mocks
import { generalReadingMock1 } from '../data/IELTS/reading/mocks/general-reading-mock-1';
import { academicReadingMock1 } from '../data/IELTS/reading/mocks/academic-reading-mock-1';

// Import ALL speaking mocks
import { speakingMock1 } from '../data/IELTS/speaking/mocks/ielts-speaking-mock1';
import { speakingMock2 } from '../data/IELTS/speaking/mocks/ielts-speaking-mock2';
import { speakingMock3 } from '../data/IELTS/speaking/mocks/ielts-speaking-mock3';
import { speakingMock4 } from '../data/IELTS/speaking/mocks/ielts-speaking-mock4';
import { speakingMock5 } from '../data/IELTS/speaking/mocks/ielts-speaking-mock5';

// Import listening mocks
import { listeningMock1 } from '../data/IELTS/listening/mocks/ielts-listening-mock1';

// Import writing mocks
import { writingMock1 } from '../data/IELTS/writing/mocks/writing-mock1';
import { wMock2 } from '../data/IELTS/writing/mocks/writing-mock2';

// Import vocab hub
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
          words: task.words || []
        };
      }
    }
  }
  return null;
};

// All reading mocks combined
const allReadingMocks = [
  generalReadingMock1,
  academicReadingMock1
];

// All speaking mocks combined
const allSpeakingMocks = [
  speakingMock1,
  speakingMock2,
  speakingMock3,
  speakingMock4,
  speakingMock5
];

// All listening mocks combined
const allListeningMocks = [
  listeningMock1
];

// All writing mocks combined
const allWritingMocks = [
  writingMock1,
  wMock2
];

/**
 * Extract all reading passages from all reading mocks
 */
const getAllReadingPassages = () => {
  return allReadingMocks.flatMap(mock => {
    // Handle mocks with sections (e.g., generalReadingMock1, mock1, mock2)
    if (mock.sections) {
      return mock.sections.flatMap(section => 
        (section.passages || []).map(p => ({
          ...p,
          mockId: mock.id,
          skill: 'reading',
          sourceTitle: mock.title
        }))
      );
    }
    // Handle mocks with passages directly at root (e.g., mock3-6, academicReadingMock1)
    if (mock.passages) {
      return mock.passages.map(p => ({
        ...p,
        mockId: mock.id,
        skill: 'reading',
        sourceTitle: mock.title
      }));
    }
    return [];
  });
};

/**
 * Extract all speaking parts from all speaking mocks
 */
const getAllSpeakingParts = () => {
  return allSpeakingMocks.flatMap(mock => {
    if (mock.parts) {
      return mock.parts.map(part => ({
        ...part,
        mockId: mock.id,
        mockTitle: mock.title,
        skill: 'speaking'
      }));
    }
    return [];
  });
};

/**
 * Extract all listening sections from all listening mocks
 */
const getAllListeningSections = () => {
  return allListeningMocks.flatMap(mock => {
    if (mock.sections) {
      return mock.sections.map(section => ({
        ...section,
        mockId: mock.id,
        mockTitle: mock.title,
        skill: 'listening'
      }));
    }
    return [];
  });
};

/**
 * Extract all writing tasks from all writing mocks
 */
const getAllWritingTasks = () => {
  return allWritingMocks.flatMap(mock => {
    if (mock.sections) {
      return mock.sections.map(section => ({
        ...section,
        mockId: mock.id,
        mockTitle: mock.title,
        skill: 'writing'
      }));
    }
    return [];
  });
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
    // Pick a random speaking mock
    const randomMock = getRandomItem(allSpeakingMocks);
    
    if (randomMock && randomMock.parts && randomMock.parts.length > 0) {
      // For mini-test, pick only ONE random part instead of all parts
      const randomPart = getRandomItem(randomMock.parts);
      
      return {
        id: `speaking-${randomMock.id}-${randomPart.id}`,
        title: `${randomMock.title} - ${randomPart.title}`,
        type: 'ielts-speaking',
        xp: 150,
        // Return only the single part, not the full parts array
        parts: [randomPart]
      };
    }
    
    // Final fallback
    return {
      id: 'speaking-quick',
      title: 'Quick Speaking Task',
      type: 'ielts-speaking',
      xp: 150,
      parts: [
        {
          id: 'part1',
          title: 'Part 1: Introduction',
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
      return p.mockId === 'general-reading-mock-1' || p.sourceTitle?.includes('General');
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
      // Check if passage is from academicReadingMock1 or has academic indicator
      return p.mockId === 'academic-reading-mock-1' || p.sourceTitle?.includes('Academic');
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
      return t.mockId === 'writing-mock2' || t.title?.includes('Letter') || t.mockTitle?.includes('Letter');
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
      // Check if task is from academic writing hub or has academic indicator
      return t.mockId === 'writing-mock1' || t.title?.includes('Academic') || t.prompt?.includes('Academic');
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
      speaking: pluckRandom('speaking'),
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
 */
export const pluckRandomFullMock = () => {
  // Get a random reading mock
  const readingMock = getRandomItem(allReadingMocks);
  // Get a random listening mock
  const listeningMock = getRandomItem(allListeningMocks);
  // Get a random speaking mock
  const speakingMock = getRandomItem(allSpeakingMocks);
  // Get a random writing mock
  const writingMock = getRandomItem(allWritingMocks);
  
  // Combine into a full mock test
  const fullMock = {
    id: `full-mock-${Date.now()}`,
    title: 'IELTS Full Mock Test',
    type: 'full-mock',
    xp: 2000,
    sections: []
  };
  
  // Add reading sections/passages
  if (readingMock) {
    if (readingMock.sections) {
      fullMock.sections.push(...readingMock.sections.map(s => ({ ...s, skill: 'reading' })));
    } else if (readingMock.passages) {
      fullMock.sections.push({
        id: `reading-${readingMock.id}`,
        title: 'Reading Section',
        skill: 'reading',
        passages: readingMock.passages
      });
    }
  }
  
  // Add listening sections
  if (listeningMock && listeningMock.sections) {
    fullMock.sections.push(...listeningMock.sections.map(s => ({ ...s, skill: 'listening' })));
  }
  
  // Add writing section
  if (writingMock && writingMock.sections) {
    fullMock.sections.push(...writingMock.sections.map(s => ({ ...s, skill: 'writing' })));
  }
  
  // Add speaking section
  if (speakingMock) {
    fullMock.sections.push({
      ...speakingMock,
      skill: 'speaking'
    });
  }
  
  return fullMock;
};
