/**
 * Base Scorer - Common scoring utilities used across platforms
 */

/**
 * Calculate accuracy percentage
 * @param {number} correct - Number of correct answers
 * @param {number} total - Total number of questions
 * @returns {number} - Accuracy as percentage (0-100)
 */
export const calculateAccuracy = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

/**
 * Calculate XP earned based on accuracy
 * @param {number} xpReward - Maximum XP reward for the task
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @param {object} options - { perfectBonus, penalty }
 * @returns {number} - XP earned
 */
export const calculateXP = (xpReward, accuracy, options = {}) => {
  const { 
    perfectBonus = 0,      // Extra XP for perfect score
    penalty = 0,          // Minimum XP to guarantee
    multiplier = 1        // XP multiplier
  } = options;
  
  if (accuracy === 0) return penalty;
  
  // Base XP is proportional to accuracy
  let earnedXP = Math.round(xpReward * (accuracy / 100) * multiplier);
  
  // Add perfect score bonus
  if (accuracy === 100 && perfectBonus > 0) {
    earnedXP += perfectBonus;
  }
  
  // Ensure minimum if penalty is set
  if (penalty > 0 && earnedXP < penalty) {
    earnedXP = penalty;
  }
  
  return earnedXP;
};

/**
 * Calculate score for multiple choice questions
 * @param {Array} userAnswers - User's selected answers
 * @param {Array} correctAnswers - Correct answers
 * @returns {object} - { correct, incorrect, missed, accuracy }
 */
export const calculateMultipleChoiceScore = (userAnswers, correctAnswers) => {
  let correct = 0;
  let incorrect = 0;
  let missed = 0;
  
  correctAnswers.forEach((correctAnswer, index) => {
    const userAnswer = userAnswers[index];
    
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      missed++;
    } else if (String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase()) {
      correct++;
    } else {
      incorrect++;
    }
  });
  
  return {
    correct,
    incorrect,
    missed,
    total: correctAnswers.length,
    accuracy: calculateAccuracy(correct, correctAnswers.length)
  };
};

/**
 * Calculate score for matching/ordering questions
 * @param {object} userSelections - User's selections { questionId: selectedIndex }
 * @param {object} correctAnswers - Correct answers { questionId: correctIndex }
 * @returns {object} - { correct, incorrect, missed, accuracy }
 */
export const calculateMatchingScore = (userSelections, correctAnswers) => {
  let correct = 0;
  let incorrect = 0;
  let missed = 0;
  
  Object.keys(correctAnswers).forEach(questionId => {
    const userAnswer = userSelections[questionId];
    const correctAnswer = correctAnswers[questionId];
    
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      missed++;
    } else if (String(userAnswer) === String(correctAnswer)) {
      correct++;
    } else {
      incorrect++;
    }
  });
  
  const total = Object.keys(correctAnswers).length;
  
  return {
    correct,
    incorrect,
    missed,
    total,
    accuracy: calculateAccuracy(correct, total)
  };
};

/**
 * Calculate partial credit score (for grid-in questions)
 * @param {Array} userAnswers - Array of user's answers
 * @param {Array} correctAnswers - Array of correct answers
 * @param {number} partialCreditWeight - Weight for partial credit (0-1)
 * @returns {object} - Score with partial credit applied
 */
export const calculatePartialCreditScore = (userAnswers, correctAnswers, partialCreditWeight = 0.5) => {
  let totalScore = 0;
  
  userAnswers.forEach((userAnswer, index) => {
    const correctAnswer = correctAnswers[index];
    
    // Guard against missing correctAnswer
    if (!correctAnswer) {
      return; // Skip scoring if correctAnswer is undefined/null
    }
    
    if (String(userAnswer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim()) {
      totalScore += 1;
    } else if (userAnswer && partialCreditWeight > 0) {
      // Check for partial match (e.g., same root word)
      const userRoot = userAnswer.toLowerCase().trim().replace(/[^a-z]/g, '');
      const correctRoot = correctAnswer.toLowerCase().trim().replace(/[^a-z]/g, '');
      
      if (userRoot && correctRoot && (userRoot === correctRoot || userRoot.includes(correctRoot) || correctRoot.includes(userRoot))) {
        totalScore += partialCreditWeight;
      }
    }
  });
  
  const maxScore = correctAnswers.length;
  const rawAccuracy = calculateAccuracy(totalScore, maxScore);
  
  return {
    rawScore: totalScore,
    maxScore,
    accuracy: Math.round(rawAccuracy),
    isPerfect: totalScore === maxScore
  };
};

export default {
  calculateAccuracy,
  calculateXP,
  calculateMultipleChoiceScore,
  calculateMatchingScore,
  calculatePartialCreditScore
};
