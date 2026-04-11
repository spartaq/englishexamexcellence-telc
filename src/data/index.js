// ==========================================
// 1. Import from TELC Mocks (Single Source of Truth)
// ==========================================
import { 
  telcMocks,
  b1Mocks,
  b2Mocks,
  c1Mocks,
  getAllReadingPassages,
  getAllWritingTasks,
  getAllListeningSections,
  getAllSpeakingParts
} from './TELC/mocks';

// ==========================================
// 2. Import LangCert (separate exam brand)
// ==========================================
import { SPEAKING_HUB as LANGCERT_SPEAKING, speakingMocks as langcertSpeakingMocks } from './LangCert/speaking/index';
import { READING_HUB as LANGCERT_READING, readingMocks as langcertReadingMocks } from './LangCert/reading/index';

// ==========================================
// 3. Import Practice Exercises & Vocabulary
// ==========================================
import { DRILLS_HUB, drillsData } from './DrillsHub/index';
import { VOCAB_HUB, VOCAB_LEVELS, VOCAB_LESSONS } from './vocabulary';

// Import TELC hub builders
import { 
  TELC_B1_READING, 
  TELC_B2_READING, 
  TELC_C1_READING,
  TELC_B1_WRITING, 
  TELC_B2_WRITING, 
  TELC_C1_WRITING,
  TELC_B1_SPEAKING, 
  TELC_B2_SPEAKING, 
  TELC_C1_SPEAKING,
  TELC_B1_LISTENING, 
  TELC_B2_LISTENING, 
  TELC_C1_LISTENING
} from './TELC/hubs';

// Pre-combined vocab lessons for the database
const vocabLessons = VOCAB_LESSONS;

// ==========================================
// 4. Master lookup table for the engine
// ==========================================
const lessonDatabase = {
  ...telcMocks,
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
  // B1 Level
  telc_b1_reading: TELC_B1_READING,
  telc_b1_writing: TELC_B1_WRITING,
  telc_b1_speaking: TELC_B1_SPEAKING,
  telc_b1_listening: TELC_B1_LISTENING,
  
  // B2 Level
  telc_b2_reading: TELC_B2_READING,
  telc_b2_writing: TELC_B2_WRITING,
  telc_b2_speaking: TELC_B2_SPEAKING,
  telc_b2_listening: TELC_B2_LISTENING,
  
  // C1 Level
  telc_c1_reading: TELC_C1_READING,
  telc_c1_writing: TELC_C1_WRITING,
  telc_c1_speaking: TELC_C1_SPEAKING,
  telc_c1_listening: TELC_C1_LISTENING,
  
  // Learning Tools (shared)
  drillshub: DRILLS_HUB, 
  vocabulary: VOCAB_HUB,
  
  // LangCert (separate exam)
  langcert_reading: LANGCERT_READING
};

/**
 * EXAM_CONFIG: Drives the Dashboard and Test Hub UI
 */
export const EXAM_CONFIG = {
  telc_b1: {
    id: 'telc_b1',
    title: "TELC B1",
    description: "B1 Level preparation",
    color: "#10b981",
    modules: {
      reading: TELC_B1_READING,
      writing: TELC_B1_WRITING,
      speaking: TELC_B1_SPEAKING,
      listening: TELC_B1_LISTENING,
    }
  },
  telc_b2: {
    id: 'telc_b2',
    title: "TELC B2",
    description: "B2 Level preparation",
    color: "#3b82f6",
    modules: {
      reading: TELC_B2_READING,
      writing: TELC_B2_WRITING,
      speaking: TELC_B2_SPEAKING,
      listening: TELC_B2_LISTENING,
    }
  },
  telc_c1: {
    id: 'telc_c1',
    title: "TELC C1",
    description: "C1 Level preparation",
    color: "#8b5cf6",
    modules: {
      reading: TELC_C1_READING,
      writing: TELC_C1_WRITING,
      speaking: TELC_C1_SPEAKING,
      listening: TELC_C1_LISTENING,
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

// Re-export telcMocks for direct access in App.jsx
export { telcMocks, b1Mocks, b2Mocks, c1Mocks };