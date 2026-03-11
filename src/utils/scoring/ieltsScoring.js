/**
 * IELTS Scoring Module
 * 
 * Converts raw scores (marks out of 40) to IELTS 9-band scale
 * Based on official IELTS scoring criteria
 */

// IELTS Band Score Thresholds
// These are the average number of marks needed for each band

const ACADEMIC_READING_THRESHOLDS = [
  { band: 1, marks: 0 },
  { band: 2, marks: 1 },
  { band: 3, marks: 4 },
  { band: 4, marks: 9 },
  { band: 5, marks: 15 },
  { band: 6, marks: 23 },
  { band: 7, marks: 30 },
  { band: 8, marks: 35 },
  { band: 9, marks: 39 }
];

const GENERAL_TRAINING_READING_THRESHOLDS = [
  { band: 1, marks: 0 },
  { band: 2, marks: 1 },
  { band: 3, marks: 4 },
  { band: 4, marks: 15 },
  { band: 5, marks: 23 },
  { band: 6, marks: 30 },
  { band: 7, marks: 35 },
  { band: 8, marks: 38 },
  { band: 9, marks: 40 }
];

const LISTENING_THRESHOLDS = [
  { band: 1, marks: 0 },
  { band: 2, marks: 1 },
  { band: 3, marks: 4 },
  { band: 4, marks: 9 },
  { band: 5, marks: 16 },
  { band: 6, marks: 23 },
  { band: 7, marks: 30 },
  { band: 8, marks: 35 },
  { band: 9, marks: 39 }
];

/**
 * Convert raw marks to IELTS band score
 * @param {number} marks - Raw score (0-40)
 * @param {Array} thresholds - Array of {band, marks} objects
 * @returns {object} - { band, rawMarks, totalMarks, isHalfBand }
 */
const marksToBand = (marks, thresholds) => {
  // Clamp marks to valid range without mutating parameter
  const clampedMarks = Math.max(0, Math.min(marks, 40));
  
  if (marks < 0) return { band: 1, rawMarks: 0, totalMarks: 40, isHalfBand: false };
  
  let lowerBand = thresholds[0];
  let upperBand = thresholds[thresholds.length - 1];
  
  // Find the band range
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (clampedMarks >= thresholds[i].marks && clampedMarks < thresholds[i + 1].marks) {
      lowerBand = thresholds[i];
      upperBand = thresholds[i + 1];
      break;
    }
  }
  
  // If exactly at threshold, return that band
  if (clampedMarks === upperBand.marks) {
    return { 
      band: upperBand.band, 
      rawMarks: clampedMarks, 
      totalMarks: 40, 
      isHalfBand: false 
    };
  }
  
  // Calculate if it's a half band (between thresholds)
  const rangeSize = upperBand.marks - lowerBand.marks;
  const positionInRange = clampedMarks - lowerBand.marks;
  const isHalfBand = rangeSize > 1 && positionInRange < rangeSize / 2;
  
  // Determine the band (could be half)
  let band;
  if (positionInRange === 0) {
    band = lowerBand.band;
  } else if (isHalfBand) {
    band = lowerBand.band + 0.5;
  } else {
    band = upperBand.band;
  }
  
  // Round to nearest 0.5
  band = Math.round(band * 2) / 2;
  band = Math.max(1, Math.min(9, band));
  
  return { 
    band, 
    rawMarks: clampedMarks, 
    totalMarks: 40, 
    isHalfBand: band % 1 === 0.5 
  };
};

/**
 * Calculate IELTS Reading score
 * @param {number} correctAnswers - Number of correct answers (0-40)
 * @param {string} testType - 'academic' or 'general'
 * @returns {object} - Score result with band and breakdown
 */
export const calculateIELTSReadingScore = (correctAnswers, testType = 'academic') => {
  const thresholds = testType === 'general' 
    ? GENERAL_TRAINING_READING_THRESHOLDS 
    : ACADEMIC_READING_THRESHOLDS;
  
  const result = marksToBand(correctAnswers, thresholds);
  
  return {
    skill: 'reading',
    testType,
    ...result,
    description: getBandDescription(result.band, 'reading')
  };
};

/**
 * Calculate IELTS Listening score
 * @param {number} correctAnswers - Number of correct answers (0-40)
 * @returns {object} - Score result with band and breakdown
 */
export const calculateIELTSListeningScore = (correctAnswers) => {
  const result = marksToBand(correctAnswers, LISTENING_THRESHOLDS);
  
  return {
    skill: 'listening',
    testType: 'academic', // Listening uses same scale for Academic and GT
    ...result,
    description: getBandDescription(result.band, 'listening')
  };
};

/**
 * Get band score description
 * @param {number} band - IELTS band score
 * @param {string} skill - 'reading' or 'listening'
 * @returns {string} - Description of the band level
 */
const getBandDescription = (band, skill) => {
  const descriptions = {
    9: 'Expert User - Has full command of the language with complete understanding',
    8: 'Very Good User - Has full operational command with occasional inaccuracies',
    7: 'Good User - Operational command with occasional inaccuracies and misunderstandings',
    6: 'Competent User - Has effective command with some inaccuracies and misunderstandings',
    5: 'Modest User - Has partial command with frequent problems',
    4: 'Limited User - Basic competence limited to familiar situations',
    3: 'Extremely Limited User - Can convey general meaning in familiar situations',
    2: 'Intermittent User - Has great difficulty understanding spoken/written English',
    1: 'Non User - Cannot use English beyond isolated words'
  };
  
  return descriptions[Math.floor(band)] || descriptions[1];
};

/**
 * Calculate overall IELTS score from multiple skills
 * @param {object} scores - { reading: number, listening: number, writing: number, speaking: number }
 * @returns {object} - Overall band score
 */
export const calculateOverallBand = (scores) => {
  const validBands = [];
  
  if (scores.reading !== undefined) validBands.push(scores.reading);
  if (scores.listening !== undefined) validBands.push(scores.listening);
  if (scores.writing !== undefined) validBands.push(scores.writing);
  if (scores.speaking !== undefined) validBands.push(scores.speaking);
  
  if (validBands.length === 0) {
    return { band: 0, description: 'No scores available' };
  }
  
  // Calculate average
  const average = validBands.reduce((sum, band) => sum + band, 0) / validBands.length;
  
  // Round to nearest 0.5
  const overallBand = Math.round(average * 2) / 2;
  
  return {
    band: overallBand,
    componentCount: validBands.length,
    description: getBandDescription(overallBand, 'overall')
  };
};

/**
 * Full IELTS score calculation for a test
 * @param {object} answers - Object with question type keys and correct count values
 * @param {object} options - { testType: 'academic' | 'general', includeSkills: [] }
 * @returns {object} - Complete score breakdown
 */
export const calculateIELTSScore = (answers = {}, options = {}) => {
  const { testType = 'academic', includeSkills = ['reading', 'listening'] } = options;
  
  const results = {};
  
  // Reading
  if (includeSkills.includes('reading') && answers.reading !== undefined) {
    results.reading = calculateIELTSReadingScore(answers.reading, testType);
  }
  
  // Listening
  if (includeSkills.includes('listening') && answers.listening !== undefined) {
    results.listening = calculateIELTSListeningScore(answers.listening);
  }
  
  // Calculate overall if we have multiple skills
  const availableBands = {};
  if (results.reading) availableBands.reading = results.reading.band;
  if (results.listening) availableBands.listening = results.listening.band;
  // Writing and speaking would be added when those are scored
  
  if (Object.keys(availableBands).length > 0) {
    results.overall = calculateOverallBand(availableBands);
  }
  
  return results;
};

export default {
  calculateIELTSReadingScore,
  calculateIELTSListeningScore,
  calculateOverallBand,
  calculateIELTSScore
};
