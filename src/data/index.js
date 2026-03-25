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
import { VOCAB_HUB, VOCAB_LEVELS, VOCAB_LESSONS } from './vocabulary';

// Import IELTS hub builders
import { 
  IELTS_READING_AC, 
  IELTS_READING_GT, 
  IELTS_WRITING_AC, 
  IELTS_WRITING_GT, 
  IELTS_SPEAKING, 
  IELTS_LISTENING 
} from './IELTS/hubs';

// Pre-combined vocab lessons for the database
const vocabLessons = VOCAB_LESSONS;

// ==========================================
// 4. Master lookup table for the engine
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
  // Aliases for short URLs
  reading_ac: IELTS_READING_AC,
  reading_gt: IELTS_READING_GT,
  writing_ac: IELTS_WRITING_AC,
  writing_gt: IELTS_WRITING_GT,
  speaking: IELTS_SPEAKING,
  listening: IELTS_LISTENING,
  ielts_atoms: IELTS_ATOMS, 
  drillshub: DRILLS_HUB, 
  vocabulary: VOCAB_HUB,
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
      drillshub: DRILLS_HUB
    }
  }
};

// Export lesson database for use by loadFullLesson
export { lessonDatabase };

// Re-export ieltsMocks for direct access in App.jsx
export { ieltsMocks };
