import { useCallback } from 'react';

/**
 * Custom hook for handling check answers logic
 */
const useCheckAnswers = ({
  activeLesson,
  activeSectionIndex,
  activePassageIndex,
  userAnswers,
  activeTest,
}) => {
  
  // 1. HELPER: Get answer from any possible state bucket (Unified)
  const getAnyStoredAnswer = useCallback((questionId) => {
    if (userAnswers && userAnswers[questionId] !== undefined) {
      return userAnswers[questionId];
    }
    return null;
  }, [userAnswers]);

  // 2. HELPER: The "Crawler" - turns a complex lesson into a flat list of questions
  const getFlattenedQuestions = useCallback((lesson) => {
    let flat = [];
    const crawl = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      
      // It's a question if it has an ID and an answer
      const hasContent = obj.text || obj.question || obj.prompt || obj.stem || obj.label;
      const hasAnswer = obj.answer !== undefined || obj.answers !== undefined || obj.correctIndex !== undefined;
      
      if (obj.id !== undefined && hasContent && hasAnswer) {
        flat.push(obj);
      }

      // Dig deeper into all possible nested keys
      const childrenKeys = ['sections', 'passages', 'parts', 'questions', 'subTasks', 'labels', 'notes'];
      childrenKeys.forEach(key => {
        if (Array.isArray(obj[key])) obj[key].forEach(crawl);
        else if (obj[key] && typeof obj[key] === 'object') crawl(obj[key]);
      });
    };
    crawl(lesson);
    return flat;
  }, []);

  // 3. HELPER: Check if a specific passage is 100% correct (UI helper)
  const getPassageStatus = useCallback((passage, isReviewMode) => {
    if (!isReviewMode || !passage) return null;
    const questions = getFlattenedQuestions(passage);
    if (questions.length === 0) return null;
    
    let correct = 0;
    questions.forEach(q => {
      const userVal = String(getAnyStoredAnswer(q.id) || "").trim().toLowerCase();
      const correctVal = String(q.answer || q.correctIndex).trim().toLowerCase();
      if (userVal === correctVal) correct++;
    });
    return correct === questions.length ? 'correct' : 'incorrect';
  }, [getFlattenedQuestions, getAnyStoredAnswer]);

  // 4. MAIN LOGIC: The Grading Engine
  const checkAnswers = useCallback((drillAnswers = null) => {
    // Context Detection
    const isIeltsComplex = activeLesson.type === 'ielts-complex' || activeLesson.type === 'READING';
    const currentSection = isIeltsComplex ? activeLesson : activeLesson.sections?.[activeSectionIndex];
    const passages = currentSection?.passages || [];
    const currentPassage = passages[activePassageIndex] || currentSection;

    let results = { accuracy: 0, earnedXP: 0, isPerfect: false };
    let telcScore = null;

    // TELC Metadata
    const isTELC = activeTest?.platform === 'telc' || activeTest?.id === 'telc' || activeLesson.type?.includes('telc') || activeLesson.type === 'full-mock';
    const isReading = activeLesson.skill === 'reading' || activeLesson.type === 'READING' || currentSection?.type === 'READING';
    const isGeneralTraining = activeLesson.type === 'general-training' || activeLesson.id?.includes('general');

    // SCORING BY TYPE
    // A. Heading Match
    if (activeLesson.type === 'heading-match') {
      const answers = activeLesson.answers || {};
      const totalQuestions = Object.keys(answers).length;
      let correctCount = 0;
      Object.keys(answers).forEach(paraId => {
        if (String(userAnswers[paraId]) === String(answers[paraId])) correctCount++;
      });
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      results = { accuracy, earnedXP: Math.round((activeLesson.xpReward || 500) * (accuracy / 100)), isPerfect: accuracy >= 100 };
    } 
    // B. Token Select / Punctuation
    else if (activeLesson.type === 'token-select' || activeLesson.type === 'punctuation-correction') {
      const userSelections = userAnswers[activeLesson.id] || [];
      const correctOnes = activeLesson.correctTokens || activeLesson.correctPositions || [];
      const correct = userSelections.filter(s => correctOnes.includes(s)).length;
      const accuracy = correctOnes.length > 0 ? Math.round((correct / correctOnes.length) * 100) : 0;
      results = { accuracy, earnedXP: Math.round((activeLesson.xpReward || 300) * (accuracy / 100)), isPerfect: accuracy >= 100 };
    }
    // C. Standard Flow (MCQ, Short Answer, Gap Fill)
    else {
      // For IELTS, we usually grade per passage. For drills, we grade the whole lesson.
      const questionsToGrade = (isIELTS && currentPassage) 
        ? getFlattenedQuestions(currentPassage) 
        : getFlattenedQuestions(activeLesson);

      let correctCount = 0;
      questionsToGrade.forEach(q => {
        const userVal = getAnyStoredAnswer(q.id);
        const correctVal = q.answer ?? q.correctIndex;

        if (Array.isArray(correctVal)) {
          const isCorrect = Array.isArray(userVal) && 
            correctVal.every((val, idx) => String(val).trim().toLowerCase() === String(userVal[idx] || "").trim().toLowerCase());
          if (isCorrect) correctCount++;
        } else {
          if (String(userVal || "").trim().toLowerCase() === String(correctVal || "").trim().toLowerCase()) correctCount++;
        }
      });

      const accuracy = questionsToGrade.length > 0 ? Math.round((correctCount / questionsToGrade.length) * 100) : 0;
      results = { accuracy, earnedXP: Math.round((activeLesson.xpReward || activeLesson.xp || 500) * (accuracy / 100)), isPerfect: accuracy >= 100 };
    }

    // Apply TELC Score calculation if applicable
if (isTELC) {
  const skillResults = {};
  
  // Get skill type from lesson
  const skill = activeLesson.skill || currentSection?.skill || 'reading';
  
  // Calculate simple TELC score for this skill
  const questionsToGrade = isTELC && currentPassage 
    ? getFlattenedQuestions(currentPassage) 
    : getFlattenedQuestions(activeLesson);
  
  const correctCount = questionsToGrade.filter(q => {
    const userVal = getAnyStoredAnswer(q.id);
    const correctVal = q.answer ?? q.correctIndex;
    return String(userVal || "").trim().toLowerCase() === String(correctVal || "").trim().toLowerCase();
  }).length;
  
  // Use simple TELC scoring
  telcScore = {
    skill: skill,
    correct: correctCount,
    total: questionsToGrade.length,
    ...require('../../utils/scoring/telcScoring').calculateSimpleTELCScore(
      correctCount, 
      questionsToGrade.length, 
      skill
    )
  };
}

    return { results, telcScore };
  }, [activeLesson, activeSectionIndex, activePassageIndex, userAnswers, activeTest, getFlattenedQuestions, getAnyStoredAnswer]);

  return {
    checkAnswers,
    getFlattenedQuestions,
    getAnyStoredAnswer,
    getPassageStatus
  };
};

export default useCheckAnswers;