import { useCallback } from 'react';

/**
 * Custom hook for handling check answers logic
 * Extracts the scoring and evaluation logic from App.jsx
 */
const useCheckAnswers = ({
  activeLesson,
  activeSectionIndex,
  activePassageIndex,
  userAnswers,
  gapFillSelections,
  headingSelections,
  activeTest,
}) => {
  
  // Helper to get any stored answer
  const getAnyStoredAnswer = useCallback((questionId) => {
    if (userAnswers && userAnswers[questionId] !== undefined) {
      return userAnswers[questionId];
    }
    if (gapFillSelections && gapFillSelections[questionId]) {
      return gapFillSelections[questionId];
    }
    return null;
  }, [userAnswers, gapFillSelections]);

  // Flatten questions from lesson
  const getFlattenedQuestions = useCallback((lesson) => {
    const questions = [];
    
    const extractFromSection = (section, passageTitle) => {
      // Get passages
      const passages = section?.passages || [];
      passages.forEach(passage => {
        const subTasks = passage?.subTasks || passage?.questions || [];
        subTasks.forEach(task => {
          // If task has nested questions
          if (task.questions && Array.isArray(task.questions)) {
            task.questions.forEach(q => {
              questions.push({
                ...q,
                passage: passage.title || passageTitle
              });
            });
          } else {
            questions.push({
              ...task,
              passage: passage.title || passageTitle
            });
          }
        });
      });
      
      // Also check section-level questions
      if (section.questions && Array.isArray(section.questions)) {
        section.questions.forEach(task => {
          if (task.questions && Array.isArray(task.questions)) {
            task.questions.forEach(q => {
              questions.push({
                ...q,
                passage: section.title
              });
            });
          } else {
            questions.push({
              ...task,
              passage: section.title
            });
          }
        });
      }
    };

    if (lesson.sections) {
      lesson.sections.forEach(section => {
        extractFromSection(section, section.title);
      });
    } else if (lesson.passages) {
      lesson.passages.forEach(passage => {
        const subTasks = passage?.subTasks || passage?.questions || [];
        subTasks.forEach(task => {
          if (task.questions && Array.isArray(task.questions)) {
            task.questions.forEach(q => {
              questions.push({
                ...q,
                passage: passage.title
              });
            });
          } else {
            questions.push({
              ...task,
              passage: passage.title
            });
          }
        });
      });
    } else if (lesson.questions) {
      lesson.questions.forEach(q => {
        questions.push(q);
      });
    }

    return questions;
  }, []);

  // Check answers and calculate results
  const checkAnswers = useCallback((drillAnswers = null) => {
    // Handle ielts-complex type differently - the lesson itself contains passages
    const isIeltsComplex = activeLesson.type === 'ielts-complex' || activeLesson.type === 'READING';
    const currentSection = isIeltsComplex ? activeLesson : activeLesson.sections?.[activeSectionIndex];
    const passages = currentSection?.passages || [];
    const currentPassage = passages[activePassageIndex] || currentSection;

    const isWritingTask = 
      activeLesson.type?.includes('WRITING') || 
      currentSection?.type === 'WRITING' || 
      currentPassage?.type === 'WRITING' ||
      activeLesson.type === 'writing-mock';

    const isSpeakingTask = 
      activeLesson.type?.includes('SPEAKING') || 
      currentSection?.type === 'SPEAKING' || 
      currentPassage?.type === 'SPEAKING' ||
      activeLesson.type === 'ielts-speaking';

    // Writing and speaking tasks are processed normally
    // (they are handled differently via AI check answers)

    let results = { accuracy: 0, earnedXP: 0, isPerfect: false };
    let ieltsScore = null;

    // Detect if this is an IELTS test
    const isIELTS = 
      activeTest?.id === 'ielts' || 
      activeLesson.type?.includes('ielts') ||
      activeLesson.id?.includes('ielts') ||
      activeLesson.type === 'general-reading-mock' ||
      activeLesson.type === 'academic-reading-mock' ||
      activeLesson.type === 'ielts-listening-mock' ||
      activeLesson.type === 'full-mock';
    
    console.log('[useCheckAnswers] isIELTS:', isIELTS, 'currentPassage:', currentPassage?.title, 'activeSectionIndex:', activeSectionIndex);
    
    const isReading = activeLesson.skill === 'reading' || 
                     activeLesson.type === 'READING' ||
                     activeLesson.type === 'reading' ||
                     activeLesson.type === 'general-reading-mock' ||
                     activeLesson.type === 'academic-reading-mock' ||
                     currentSection?.type === 'READING' ||
                     currentPassage?.type === 'READING';
    const isListening = activeLesson.skill === 'listening' || 
                        activeLesson.type === 'LISTENING' ||
                        activeLesson.type === 'ielts-listening-mock' ||
                        currentSection?.type === 'LISTENING' ||
                        currentPassage?.type === 'LISTENING';

    // Determine test type for IELTS (academic vs general)
    const isGeneralTraining = activeLesson.type === 'general-training' || 
                               activeLesson.id?.includes('general');

    // Handle special question types
    if (activeLesson.type === 'heading-match') {
      const totalQuestions = Object.keys(activeLesson.answers || {}).length;
      let correctCount = 0;
      Object.keys(activeLesson.answers || {}).forEach(paraId => {
        if (String(headingSelections[paraId]) === String(activeLesson.answers[paraId])) {
          correctCount++;
        }
      });
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else if (activeLesson.type === 'token-select') {
      const selected = userAnswers[activeLesson.id] || [];
      // Simple evaluation
      const correct = selected.filter((s, i) => 
        activeLesson.correctTokens?.includes(s)
      ).length;
      const accuracy = selected.length > 0 ? Math.round((correct / selected.length) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else if (activeLesson.type === 'gap-fill-tokens') {
      const selections = gapFillSelections[activeLesson.id] || {};
      const answers = activeLesson.answers || activeLesson.answer || [];
      let correctCount = 0;
      answers.forEach((answer, index) => {
        const gapIndex = index + 1;
        const userAnswer = selections[gapIndex];
        if (userAnswer && userAnswer.toLowerCase() === answer.toLowerCase()) {
          correctCount++;
        }
      });
      const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else if (activeLesson.type === 'punctuation-correction') {
      const placements = userAnswers[activeLesson.id] || {};
      const sentences = activeLesson.sentences || [];
      let totalCorrect = 0;
      let totalExpected = 0;
      
      sentences.forEach(sentence => {
        const userPositions = new Set(placements[sentence.id] || []);
        const expectedPositions = new Set(sentence.correctPositions || []);
        
        const correct = [...userPositions].filter(pos => expectedPositions.has(pos));
        totalCorrect += correct.length;
        totalExpected += expectedPositions.size;
      });
      
      const accuracy = totalExpected > 0 ? Math.round((totalCorrect / totalExpected) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    } 
    else {
      // For IELTS tests with passages, only check the current passage's questions
      // to avoid showing results from other passages
      let allQuestions;
      console.log('[useCheckAnswers] Checking with isIELTS:', isIELTS, 'currentPassage:', currentPassage?.title);
      if (isIELTS && currentPassage) {
        // Extract questions from current passage's subTasks
        const passageQuestions = [];
        const subTasks = currentPassage?.subTasks || [];
        console.log('[useCheckAnswers] subTasks length:', subTasks.length);
        subTasks.forEach(task => {
          if (task.questions && Array.isArray(task.questions)) {
            task.questions.forEach(q => {
              passageQuestions.push({
                ...q,
                passage: currentPassage.title
              });
            });
          } else {
            passageQuestions.push({
              ...task,
              passage: currentPassage.title
            });
          }
        });
        // Also check for direct questions on the passage
        if (currentPassage.questions && Array.isArray(currentPassage.questions)) {
          currentPassage.questions.forEach(q => {
            passageQuestions.push({
              ...q,
              passage: currentPassage.title
            });
          });
        }
        console.log('[useCheckAnswers] passageQuestions count:', passageQuestions.length);
        allQuestions = passageQuestions;
      } else {
        // Default: iterate through all flattened questions
        console.log('[useCheckAnswers] Using getFlattenedQuestions fallback');
        allQuestions = getFlattenedQuestions(activeLesson);
      }
      let correctCount = 0;
      allQuestions.forEach(q => {
        const userVal = getAnyStoredAnswer(q.id);
        const correctVal = q.answer;
        if (Array.isArray(correctVal)) {
          const isCorrect = Array.isArray(userVal) && 
            correctVal.every((val, idx) => 
              String(val).trim().toLowerCase() === String(userVal[idx] || "").trim().toLowerCase()
            );
          if (isCorrect) correctCount++;
        } else {
          if (String(userVal || "").trim().toLowerCase() === String(correctVal || "").trim().toLowerCase()) {
            correctCount++;
          }
        }
      });
      const accuracy = allQuestions.length > 0 ? Math.round((correctCount / allQuestions.length) * 100) : 0;
      results = { 
        accuracy, 
        earnedXP: Math.round((activeLesson.xpReward || 0) * (accuracy / 100)), 
        isPerfect: accuracy >= 100 
      };
    }

    // Apply IELTS scoring if applicable
    if (isIELTS && isReading) {
      const scaledMarks = results.isPerfect ? 40 : Math.round((results.accuracy / 100) * 40);
      const testType = isGeneralTraining ? 'general' : 'academic';
      ieltsScore = calculateIELTSReadingScore(scaledMarks, testType);
    }

    return {
      results,
      ieltsScore,
      isIELTS,
      isReading,
      isListening,
      isGeneralTraining,
      needsReflection: false
    };
  }, [
    activeLesson,
    activeSectionIndex,
    activePassageIndex,
    userAnswers,
    gapFillSelections,
    headingSelections,
    activeTest,
    getFlattenedQuestions,
    getAnyStoredAnswer
  ]);

  // Simple IELTS score calculator (placeholder - use scoring utils in production)
  const calculateIELTSReadingScore = (marks, testType) => {
    const bands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const thresholds = testType === 'general' 
      ? [0, 4, 6, 9, 12, 16, 20, 23, 27, 30]
      : [0, 3, 5, 8, 11, 15, 19, 22, 26, 29];
    
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (marks >= thresholds[i]) {
        return { band: bands[i], marks, maxMarks: 40 };
      }
    }
    return { band: 0, marks, maxMarks: 40 };
  };

  return {
    checkAnswers,
    getFlattenedQuestions,
    getAnyStoredAnswer
  };
};

export default useCheckAnswers;