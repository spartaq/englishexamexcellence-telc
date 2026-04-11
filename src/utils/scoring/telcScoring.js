/**
 * TELC Scoring Module
 * 
 * TELC English exams use a 300-point total scale:
 * - Written: 225 points (reading, listening, language elements, writing)
 * - Oral: 75 points
 * - Passing: 60% (180 points) overall
 * - Must achieve 60% in BOTH written AND oral sections
 */

// Maximum scores
const TELC_WRITTEN_MAX = 225;
const TELC_ORAL_MAX = 75;
const TELC_TOTAL_MAX = 300;
const TELC_PASSING_PERCENT = 60;
const TELC_WRITTEN_PASSING = Math.round(TELC_WRITTEN_MAX * TELC_PASSING_PERCENT / 100); // 135
const TELC_ORAL_PASSING = Math.round(TELC_ORAL_MAX * TELC_PASSING_PERCENT / 100); // 45

// Written section breakdown weights (total 225)
const WRITTEN_WEIGHTS = {
  reading: 0.25,     // ~56 points
  listening: 0.25,   // ~56 points
  language: 0.25,     // ~56 points  
  writing: 0.25       // ~56 points
};

/**
 * Calculate score for a single skill component
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total questions in component
 * @param {number} maxPoints - Maximum points available for this component
 * @returns {object} - Score breakdown
 */
const calculateComponentScore = (correctAnswers, totalQuestions, maxPoints) => {
  if (!totalQuestions || totalQuestions === 0) {
    return { correct: 0, total: 0, points: 0, percent: 0 };
  }
  
  const ratio = correctAnswers / totalQuestions;
  const points = Math.round(ratio * maxPoints);
  const percent = Math.round(ratio * 100);
  
  return {
    correct: correctAnswers,
    total: totalQuestions,
    points: points,
    percent: percent
  };
};

/**
 * Calculate TELC written score from component results
 * @param {object} skillResults - { reading: { correct, total }, listening: { correct, total }, ... }
 * @returns {object} - Written score breakdown
 */
export const calculateWrittenScore = (skillResults) => {
  let totalPoints = 0;
  const breakdown = {};
  
  // Calculate each written component
  if (skillResults.reading) {
    const score = calculateComponentScore(
      skillResults.reading.correct,
      skillResults.reading.total,
      Math.round(TELC_WRITTEN_MAX * WRITTEN_WEIGHTS.reading)
    );
    breakdown.reading = score;
    totalPoints += score.points;
  }
  
  if (skillResults.listening) {
    const score = calculateComponentScore(
      skillResults.listening.correct,
      skillResults.listening.total,
      Math.round(TELC_WRITTEN_MAX * WRITTEN_WEIGHTS.listening)
    );
    breakdown.listening = score;
    totalPoints += score.points;
  }
  
  if (skillResults.language) {
    const score = calculateComponentScore(
      skillResults.language.correct,
      skillResults.language.total,
      Math.round(TELC_WRITTEN_MAX * WRITTEN_WEIGHTS.language)
    );
    breakdown.language = score;
    totalPoints += score.points;
  }
  
  if (skillResults.writing) {
    const score = calculateComponentScore(
      skillResults.writing.correct,
      skillResults.writing.total,
      Math.round(TELC_WRITTEN_MAX * WRITTEN_WEIGHTS.writing)
    );
    breakdown.writing = score;
    totalPoints += score.points;
  }
  
  return {
    score: totalPoints,
    max: TELC_WRITTEN_MAX,
    percent: TELC_WRITTEN_MAX > 0 ? Math.round((totalPoints / TELC_WRITTEN_MAX) * 100) : 0,
    passed: totalPoints >= TELC_WRITTEN_PASSING,
    breakdown: breakdown
  };
};

/**
 * Calculate TELC oral score
 * @param {object} speakingResult - { correct, total } or null
 * @returns {object} - Oral score breakdown
 */
export const calculateOralScore = (speakingResult) => {
  if (!speakingResult) {
    return { score: 0, max: TELC_ORAL_MAX, percent: 0, passed: false };
  }
  
  const score = calculateComponentScore(
    speakingResult.correct,
    speakingResult.total,
    TELC_ORAL_MAX
  );
  
  return {
    score: score.points,
    max: TELC_ORAL_MAX,
    percent: score.percent,
    passed: score.points >= TELC_ORAL_PASSING
  };
};

/**
 * Full TELC score calculation
 * @param {object} skillResults - { reading: { correct, total }, listening: { correct, total }, speaking: { correct, total }, writing: { correct, total }, language: { correct, total } }
 * @returns {object} - Complete TELC score breakdown
 */
export const calculateTELCScore = (skillResults = {}) => {
  const written = calculateWrittenScore(skillResults);
  const oral = calculateOralScore(skillResults.speaking);
  
  const totalScore = written.score + oral.score;
  const totalPercent = Math.round((totalScore / TELC_TOTAL_MAX) * 100);
  
  // Determine pass/fail
  // Must pass BOTH written AND oral AND overall
  const passed = totalScore >= (TELC_TOTAL_MAX * TELC_PASSING_PERCENT / 100) &&
                written.passed && oral.passed;
  
  return {
    // Scores
    written: written.score,
    oral: oral.score,
    total: totalScore,
    
    // Max values
    writtenMax: TELC_WRITTEN_MAX,
    oralMax: TELC_ORAL_MAX,
    totalMax: TELC_TOTAL_MAX,
    
    // Percentages
    writtenPercent: written.percent,
    oralPercent: oral.percent,
    totalPercent: totalPercent,
    
    // Pass/fail status
    passed: passed,
    writtenPassed: written.passed,
    oralPassed: oral.passed,
    writtenRequired: TELC_WRITTEN_PASSING,
    oralRequired: TELC_ORAL_PASSING,
    totalRequired: 180,
    
    // Detailed breakdown
    writtenBreakdown: written.breakdown,
    oralBreakdown: oral,
    
    // Level determination
    level: getTELCLevel(totalPercent),
    
    // Description
    description: getTELCDescription(passed, written.passed, oral.passed, totalPercent)
  };
};

/**
 * Determine TELC level based on total percentage
 * @param {number} percent - Total score percentage
 * @returns {string} - TELC level
 */
const getTELCLevel = (percent) => {
  if (percent >= 90) return 'C1';
  if (percent >= 80) return 'B2';
  if (percent >= 70) return 'B1';
  if (percent >= 60) return 'B1';
  if (percent >= 50) return 'A2';
  return 'A1';
};

/**
 * Get description based on pass/fail status
 * @param {boolean} passed - Overall passed
 * @param {boolean} writtenPassed - Written section passed
 * @param {boolean} oralPassed - Oral section passed
 * @param {number} percent - Total percentage
 * @returns {string} - Description
 */
const getTELCDescription = (passed, writtenPassed, oralPassed, percent) => {
  if (passed) {
    if (percent >= 90) return 'Excellent! You passed with a C1 level score.';
    if (percent >= 80) return 'Great job! You passed with a B2 level score.';
    return ' Congratulations! You passed the TELC exam.';
  }
  
  if (!writtenPassed && !oralPassed) {
    return 'You need to improve both written and oral sections. You must achieve 60% in each.';
  }
  
  if (!writtenPassed) {
    return `You passed the oral section but need 60% in written. Required: ${TELC_WRITTEN_PASSING}/225 points.`;
  }
  
  return `You passed the written section but need 60% in oral. Required: ${TELC_ORAL_PASSING}/75 points.`;
};

/**
 * Simple score converter for quick results display
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total questions
 * @param {string} skill - Skill type (reading, listening, writing, speaking, language)
 * @returns {object} - Simple score result
 */
export const calculateSimpleTELCScore = (correctAnswers, totalQuestions, skill) => {
  // Determine max points based on skill type
  let maxPoints;
  let category;
  
  if (skill === 'speaking') {
    maxPoints = TELC_ORAL_MAX;
    category = 'oral';
  } else if (['reading', 'listening', 'language', 'writing'].includes(skill)) {
    maxPoints = Math.round(TELC_WRITTEN_MAX * (WRITTEN_WEIGHTS[skill] || 0.25));
    category = 'written';
  } else {
    maxPoints = 75; // Default component max
    category = 'written';
  }
  
  const score = calculateComponentScore(correctAnswers, totalQuestions, maxPoints);
  
  return {
    skill: skill,
    category: category,
    correct: correctAnswers,
    total: totalQuestions,
    points: score.points,
    max: maxPoints,
    percent: score.percent,
    passed: score.percent >= TELC_PASSING_PERCENT
  };
};

export default {
  calculateTELCScore,
  calculateWrittenScore,
  calculateOralScore,
  calculateSimpleTELCScore
};