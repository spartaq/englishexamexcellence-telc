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
  switch (platform.toLowerCase()) {
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
      // TODO: Implement TOEFL scorer
      return {
        calculateReadingScore: null,
        calculateListeningScore: null,
        calculateOverall: null,
        calculateFull: null
      };
    
    case 'langcert':
      // TODO: Implement LangCert scorer
      return {
        calculateReadingScore: null,
        calculateListeningScore: null,
        calculateOverall: null,
        calculateFull: null
      };
    
    default:
      console.warn(`No scorer found for platform: ${platform}. Using base scorer.`);
      return {
        calculateReadingScore: null,
        calculateListeningScore: null,
        calculateOverall: null,
        calculateFull: null
      };
  }
};

/**
 * Detect platform from test/lesson type
 * @param {string|object} lessonType - Lesson type identifier
 * @returns {string} - Platform name
 */
export const detectPlatform = (lessonType) => {
  if (!lessonType) return 'ielts';
  
  const type = String(lessonType).toLowerCase();
  
  if (type.includes('ielts')) return 'ielts';
  if (type.includes('toefl')) return 'toefl';
  if (type.includes('langcert')) return 'langcert';
  
  return 'ielts'; // Default
};

export default {
  getScorer,
  detectPlatform
};
