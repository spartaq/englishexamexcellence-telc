// ==========================================
// 1. Import from JSON Mocks (Single Source of Truth)
// ==========================================
import { 
  ieltsMocks,
  academicMocks, 
  generalMocks,
  getAllReadingPassages,
  getAllWritingTasks,
  getAllListeningSections,
  getAllSpeakingParts
} from './IELTS/mocks';

// ==========================================
// 2. Import LangCert (still uses old structure)
// ==========================================
import { SPEAKING_HUB as LANGCERT_SPEAKING, speakingMocks as langcertSpeakingMocks } from './LangCert/speaking/index';
import { READING_HUB as LANGCERT_READING, readingMocks as langcertReadingMocks } from './LangCert/reading/index';

// ==========================================
// 3. Import Practice Exercises & Vocabulary
// ==========================================
import { IELTS_ATOMS } from './IELTS/atoms/index';
import { DRILLS_HUB, drillsData } from './DrillsHub/index';
import { VOCAB_HUB, VOCAB_LEVELS } from './vocabulary';

// Helper to extract the vocab tasks from your categories so the engine can load them
const extractVocabLessons = (hub) => {
  const lessons = {};
  if (hub && hub.categories) {
    hub.categories.forEach(category => {
      if (category.tasks) {
        category.tasks.forEach(task => {
          if (task && task.id) {
            lessons[task.id] = task;
          }
        });
      }
    });
  }
  return lessons;
};

// Extract from both VOCAB_HUB (topic-based) and VOCAB_LEVELS (level-based)
const vocabLessonsFromHub = extractVocabLessons(VOCAB_HUB);
const vocabLessonsFromLevels = extractVocabLessons(VOCAB_LEVELS);
const vocabLessons = { ...vocabLessonsFromHub, ...vocabLessonsFromLevels };

// ==========================================
// 4. Create Hub Structures from JSON Mocks
// ==========================================

// Create Reading Hub from JSON
const createReadingHub = (type, title) => {
  const passages = getAllReadingPassages().filter(p => p.testType === type);
  return {
    title: `${title} Reading`,
    description: `Practice ${type} reading passages`,
    categories: [
      {
        id: `${type}-reading-mocks`,
        title: 'Full Reading Mocks',
        description: `Complete ${type} reading tests`,
        tasks: passages.map((passage, idx) => ({
          id: passage.mockId || `passage-${idx}`,
          title: passage.title || 'Reading Passage',
          xp: 300,
          type: 'reading-practice',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Create Writing Hub from JSON
const createWritingHub = (type, title) => {
  const tasks = getAllWritingTasks().filter(t => t.testType === type);
  return {
    title: `${title} Writing`,
    description: `Practice ${type} writing tasks`,
    categories: [
      {
        id: `${type}-writing-mocks`,
        title: 'Full Writing Mocks',
        description: `Complete ${type} writing tasks`,
        tasks: tasks.map((task, idx) => ({
          id: task.mockId || `task-${idx}`,
          title: task.title || 'Writing Task',
          xp: task.xp || 300,
          type: 'WRITING',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Create Speaking Hub from JSON
const createSpeakingHub = () => {
  const parts = getAllSpeakingParts();
  return {
    title: 'IELTS Speaking',
    description: 'Practice all three parts of the IELTS Speaking test',
    categories: [
      {
        id: 'speaking-mocks',
        title: 'Speaking Mocks',
        description: 'Complete IELTS Speaking simulations',
        tasks: Object.values(ieltsMocks).map(mock => ({
          id: mock.id,
          title: mock.title || 'Speaking Test',
          xp: 1200,
          type: 'speaking-mock',
          tier: 'bronze'
        }))
      }
    ]
  };
};

// Create Listening Hub from JSON
const createListeningHub = () => {
  const sections = getAllListeningSections();
  return {
    title: 'IELTS Listening',
    description: 'Practice IELTS Listening tests',
    categories: [
      {
        id: 'listening-mocks',
        title: 'Listening Mocks',
        description: 'Complete IELTS Listening tests',
        tasks: Object.values(ieltsMocks).map(mock => ({
          id: mock.id,
          title: mock.title || 'Listening Test',
          xp: 300,
          type: 'listening-practice',
          tier: 'bronze'
        }))
      }
    ]
  };
};

const IELTS_READING_AC = createReadingHub('academic', 'Academic');
const IELTS_READING_GT = createReadingHub('general', 'General Training');
const IELTS_WRITING_AC = createWritingHub('academic', 'Academic');
const IELTS_WRITING_GT = createWritingHub('general', 'General Training');
const IELTS_SPEAKING = createSpeakingHub();
const IELTS_LISTENING = createListeningHub();

// ==========================================
// 5. Master lookup table for the engine
// ==========================================
const lessonDatabase = {
  ...ieltsMocks,
  ...langcertSpeakingMocks,
  ...langcertReadingMocks,
  ...drillsData,  
  ...vocabLessons,
};

/**
 * HUBS: Maps keys to data objects. 
 * App.jsx uses these keys in handleSelectModule()
 */
export const HUBS = {
  reading_academic: IELTS_READING_AC,
  reading_general: IELTS_READING_GT,
  writing_academic: IELTS_WRITING_AC,
  writing_general: IELTS_WRITING_GT,
  speaking: IELTS_SPEAKING,
  listening: IELTS_LISTENING,
  ielts_atoms: IELTS_ATOMS, 
  general_drills: DRILLS_HUB, 
  vocabulary: VOCAB_LEVELS,
  langcert_reading: LANGCERT_READING
};

/**
 * EXAM_CONFIG: Drives the Dashboard and Test Hub UI
 */
export const EXAM_CONFIG = {
  ielts: {
    id: 'ielts',
    title: "IELTS Preparation",
    description: "Academic and General Training modules.",
    color: "#e11d48",
    modules: {
      listening: IELTS_LISTENING,
      speaking: IELTS_SPEAKING,
      reading_academic: IELTS_READING_AC,
      reading_general: IELTS_READING_GT,
      writing_academic: IELTS_WRITING_AC,
      writing_general: IELTS_WRITING_GT,
      ielts_atoms: IELTS_ATOMS,
    }
  },
  langcert: {
    id: 'langcert',
    title: "LangCert ESOL",
    description: "Official B2/C1 Communicator exam prep.",
    color: "#2563eb",
    modules: {
      speaking: LANGCERT_SPEAKING,
      reading: LANGCERT_READING
    }
  },
  // This section powers the "Skill Building" logic
  extra: {
    id: 'extra',
    title: "Learning Tools",
    modules: {
      vocabulary: VOCAB_LEVELS,
      general_drills: DRILLS_HUB
    }
  }
};

export const loadFullLesson = (metadata) => {
  // If we are loading a vocab lesson, we look in the database
  const content = lessonDatabase[metadata.id];
  
  if (!content) {
    console.error(`FATAL: No content found in database for ID: ${metadata.id}`);
    return metadata;
  }

  // Merge metadata first, then content, but preserve the type from metadata
  // This ensures mock-test types from the hub are preserved while getting all content properties
  const merged = { ...metadata, ...content };
  
  // Ensure metadata type is preserved
  if (metadata.type) {
    merged.type = metadata.type;
  }
  
  return merged;
};

export const getHub = (testType, skill) => {
  return EXAM_CONFIG[testType]?.modules[skill] || null;
};
