// ==========================================
// 1. Import IELTS Academic Hubs & Mocks
// ==========================================
import { READING_HUB as IELTS_READING_AC, readingMocks as ieltsReadingAcMocks } from './IELTS/reading/academic/index';
import { WRITING_HUB as IELTS_WRITING_AC, writingMocks as ieltsWritingAcMocks } from './IELTS/writing/academic/index'; 

// ==========================================
// 2. Import IELTS General Hubs & Mocks
// ==========================================
import { READING_HUB as IELTS_READING_GT, readingMocks as ieltsReadingGtMocks } from './IELTS/reading/general/index';
import { WRITING_HUB as IELTS_WRITING_GT, writingMocks as ieltsWritingGtMocks } from './IELTS/writing/general/index'; 

// ==========================================
// 3. Import Shared IELTS Hubs
// ==========================================
import { SPEAKING_HUB as IELTS_SPEAKING, speakingMocks as ieltsSpeakingMocks } from './IELTS/speaking/index';
import { LISTENING_HUB as IELTS_LISTENING, listeningMocks as ieltsListeningMocks } from './IELTS/listening/index';

// ==========================================
// 4. Import LangCert
// ==========================================
import { SPEAKING_HUB as LANGCERT_SPEAKING, speakingMocks as langcertSpeakingMocks } from './LangCert/speaking/index';

// ==========================================
// 5. Import Practice Exercises & Vocabulary
// ==========================================
import { IELTS_ATOMS } from './IELTS/atoms/index';
import { DRILLS_HUB, drillsData } from './DrillsHub/index';
import { VOCAB_HUB } from './vocabulary'; // Your vocabulary.js file

// Helper to extract the vocab tasks from your categories so the engine can load them
const extractVocabLessons = (hub) => {
  const lessons = {};
  hub.categories.forEach(category => {
    category.tasks.forEach(task => {
      lessons[task.id] = task;
    });
  });
  return lessons;
};

const vocabLessons = extractVocabLessons(VOCAB_HUB);

// ==========================================
// 6. Master lookup table for the engine
// ==========================================
const lessonDatabase = {
  ...ieltsReadingAcMocks,
  ...ieltsReadingGtMocks,
  ...ieltsWritingAcMocks,
  ...ieltsWritingGtMocks,
  ...ieltsListeningMocks,
  ...ieltsSpeakingMocks,
  ...langcertSpeakingMocks,
  ...drillsData,  
  ...vocabLessons,    // Extracted from your vocabulary.js
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
  vocabulary: VOCAB_HUB,        
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
    }
  },
  // This section powers the "Skill Building" logic
  extra: {
    id: 'extra',
    title: "Learning Tools",
    modules: {
      vocabulary: VOCAB_HUB,
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

  // Ensure the type is preserved for the engine
  return { ...metadata, ...content };
};

export const getHub = (testType, skill) => {
  return EXAM_CONFIG[testType]?.modules[skill] || null;
};