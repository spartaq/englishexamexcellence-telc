/**
 * Scoring Module Index
 * 
 * Factory pattern for platform-specific scoring systems
 */

// TELC Scoring
export { 
  calculateTELCScore,
  calculateWrittenScore,
  calculateOralScore,
  calculateSimpleTELCScore
} from './telcScoring';

// Base scoring utilities
export { calculateAccuracy, calculateXP } from './baseScorer';

/**
 * Factory function to get the appropriate scorer for a platform
 * @param {string} platform - 'telc'
 * @returns {object} - Platform scoring functions
 */
export const getScorer = (platform) => {
  // Defensively handle nullish inputs
  const normalizedPlatform = (platform ?? '').toLowerCase();
  
  switch (normalizedPlatform) {
    case 'telc':
      return {
        calculateReadingScore: (correctAnswers, totalQuestions, skill = 'reading') => 
          require('./telcScoring').calculateSimpleTELCScore(correctAnswers, totalQuestions, skill),
        calculateListeningScore: (correctAnswers, totalQuestions) => 
          require('./telcScoring').calculateSimpleTELCScore(correctAnswers, totalQuestions, 'listening'),
        calculateOverall: (scores) => 
          require('./telcScoring').calculateTELCScore(scores),
        calculateFull: (answers, options) => 
          require('./telcScoring').calculateTELCScore(answers, options)
      };
    
   
    
    
    
    default:
      console.warn(`No scorer found for platform: ${platform}. Using TELC as fallback.`);
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
  if (!lessonType) return 'telc';
  
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
  
  if (type.includes('telc')) return 'telc';
  
  return 'telc'; // Default to TELC for this platform
};

export default {
  getScorer,
  detectPlatform
};