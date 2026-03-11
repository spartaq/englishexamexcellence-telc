/**
 * Scoring Module Index
 * 
 * Factory pattern for platform-specific scoring systems
 */

// IELTS Scoring
export { 
  calculateIELTSReadingScore, 
  calculateIELTSListeningScore, 
  calculateOverallBand,
  calculateIELTSScore 
} from './ieltsScoring';

// Base scoring utilities
export { calculateAccuracy, calculateXP } from './baseScorer';

/**
 * Factory function to get the appropriate scorer for a platform
 * @param {string} platform - 'ielts', 'toefl', 'langcert', etc.
 * @returns {object} - Platform scoring functions
 */
export const getScorer = (platform) => {
  // Defensively handle nullish inputs
  const normalizedPlatform = (platform ?? '').toLowerCase();
  
  switch (normalizedPlatform) {
    case 'ielts':
      return {
        calculateReadingScore: (correctAnswers, testType) => 
          require('./ieltsScoring').calculateIELTSReadingScore(correctAnswers, testType),
        calculateListeningScore: (correctAnswers) => 
          require('./ieltsScoring').calculateIELTSListeningScore(correctAnswers),
        calculateOverall: (scores) => 
          require('./ieltsScoring').calculateOverallBand(scores),
        calculateFull: (answers, options) => 
          require('./ieltsScoring').calculateIELTSScore(answers, options)
      };
    
    case 'toefl':
      // TOEFL scorer not implemented
      return {
        calculateReadingScore: () => {
          throw new Error('TOEFL scorer not implemented: call calculateReadingScore');
        },
        calculateListeningScore: () => {
          throw new Error('TOEFL scorer not implemented: call calculateListeningScore');
        },
        calculateOverall: () => {
          throw new Error('TOEFL scorer not implemented: call calculateOverall');
        },
        calculateFull: () => {
          throw new Error('TOEFL scorer not implemented: call calculateFull');
        }
      };
    
    case 'langcert':
      // LangCert scorer not implemented
      return {
        calculateReadingScore: () => {
          throw new Error('LangCert scorer not implemented: call calculateReadingScore');
        },
        calculateListeningScore: () => {
          throw new Error('LangCert scorer not implemented: call calculateListeningScore');
        },
        calculateOverall: () => {
          throw new Error('LangCert scorer not implemented: call calculateOverall');
        },
        calculateFull: () => {
          throw new Error('LangCert scorer not implemented: call calculateFull');
        }
      };
    
    default:
      console.warn(`No scorer found for platform: ${platform}. Using IELTS as fallback.`);
      return {
        calculateReadingScore: () => {
          throw new Error(`Unknown platform scorer: no implementation for "${normalizedPlatform}"`);
        },
        calculateListeningScore: () => {
          throw new Error(`Unknown platform scorer: no implementation for "${normalizedPlatform}"`);
        },
        calculateOverall: () => {
          throw new Error(`Unknown platform scorer: no implementation for "${normalizedPlatform}"`);
        },
        calculateFull: () => {
          throw new Error(`Unknown platform scorer: no implementation for "${normalizedPlatform}"`);
        }
      };
  }
};

/**
 * Detect platform from test/lesson type
 * @param {string|object} lessonType - Lesson type identifier or object with platform info
 * @returns {string} - Platform name
 */
export const detectPlatform = (lessonType) => {
  if (!lessonType) return 'ielts';
  
  let type = '';
  
  // Handle object inputs by extracting candidate string from common keys
  if (typeof lessonType === 'object' && lessonType !== null) {
    const candidateKeys = ['type', 'lessonType', 'platform', 'name'];
    for (const key of candidateKeys) {
      if (lessonType[key] && typeof lessonType[key] === 'string') {
        type = lessonType[key].toLowerCase();
        break;
      }
    }
    // Fall back to trying String() if no keys matched
    if (!type) {
      type = String(lessonType).toLowerCase();
    }
  } else {
    type = String(lessonType).toLowerCase();
  }
  
  if (type.includes('ielts')) return 'ielts';
  if (type.includes('toefl')) return 'toefl';
  if (type.includes('langcert')) return 'langcert';
  
  return 'ielts'; // Default
};

export default {
  getScorer,
  detectPlatform
};
