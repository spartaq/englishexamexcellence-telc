import React from 'react';
import ReadingBlock from './ReadingBlock';
import ListeningBlock from './ListeningBlock';
import WritingBlock from './WritingBlock';
import SpeakingBlock from './SpeakingBlock';
import FlashcardBlock from './FlashcardBlock';
import QuestionDispatcher from './QuestionDispatcher';
import './engine.css';

const Engine = ({
  activeLesson,
  activeSectionIndex,
  activePassageIndex,
  userAnswers,
  onUpdateAnswers,
  onCheckAnswers,
  isReviewMode = false,
  showCheckAnswers = true,
  // Navigation & Skill Tabs Props
  availableSections = [],
  activeSkillTab = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {

  // 1. Resolve Data hierarchy
  const sections = activeLesson?.sections || [];
  const currentSection = sections[activeSectionIndex] || activeLesson;
  const passages = currentSection?.passages || [];
  const currentPassage = passages[activePassageIndex] || currentSection;

  // 2. Identify the Task Type
  const lessonType = activeLesson?.type;
  const skill = activeLesson?.skill || currentSection?.skill;

  /**
   * SWITCHER LOGIC
   * We delegate the actual rendering to specialized "Shell" components.
   */
  const renderLayout = () => {
    
    // A. READING LAYOUT (IELTS / TOEFL / Reading Drills)
    if (lessonType === 'ielts-complex' || lessonType === 'READING' || skill === 'reading' || lessonType === 'reading-practice') {
      return (
        <ReadingBlock 
          data={currentPassage} 
          userAnswers={userAnswers}
          onUpdate={onUpdateAnswers}
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
          showCheckAnswers={showCheckAnswers}
          // Pass shared navigation props
          sections={availableSections}
          activeSkillTab={activeSkillTab}
          activeSectionIndex={activeSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          setActivePassageIndex={setActivePassageIndex}
          setIsReviewMode={setIsReviewMode}
          availableSkills={availableSkills}
        />
      );
    }

    // B. LISTENING LAYOUT
    if (lessonType === 'LISTENING' || skill === 'listening') {
      return (
        <ListeningBlock 
          data={currentSection} 
          userAnswers={userAnswers}
          onUpdate={onUpdateAnswers}
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
          showCheckAnswers={showCheckAnswers}
          // Pass shared navigation props
          sections={availableSections}
          activeSkillTab={activeSkillTab}
          activeSectionIndex={activeSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          setActivePassageIndex={setActivePassageIndex}
          setIsReviewMode={setIsReviewMode}
          availableSkills={availableSkills}
        />
      );
    }

    // C. WRITING LAYOUT
    if (lessonType === 'WRITING' || skill === 'writing' || lessonType === 'writing-mock') {
      // Merge task-specific data if nested sections exist
      const writingTask = currentSection?.sections?.length > 0
        ? { ...currentSection, ...currentSection.sections[activeSectionIndex] || currentSection.sections[0] }
        : currentSection;

      return (
        <WritingBlock 
          data={writingTask} 
          onComplete={onCheckAnswers}
          sections={availableSections}
          activeSkillTab={activeSkillTab}
          activeSectionIndex={activeSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          setActivePassageIndex={setActivePassageIndex}
          setIsReviewMode={setIsReviewMode}
          availableSkills={availableSkills}
        />
      );
    }

    // D. SPEAKING LAYOUT
    if (lessonType === 'SPEAKING' || skill === 'speaking' || lessonType === 'ielts-speaking') {
      return (
        <SpeakingBlock 
          data={currentSection} 
          onComplete={onCheckAnswers}
          sections={availableSections}
          activeSkillTab={activeSkillTab}
          activeSectionIndex={activeSectionIndex}
          setActiveSectionIndex={setActiveSectionIndex}
          setActivePassageIndex={setActivePassageIndex}
          setIsReviewMode={setIsReviewMode}
          availableSkills={availableSkills}
        />
      );
    }

   // E. VOCAB / FLASHCARDS
if (lessonType === 'VOCAB' || lessonType === 'VOCAB_FLASHCARDS' || skill === 'vocab') {
  // If the data came from a passage's vocabList, 
  // ensure we pass the correct array to the FlashcardBlock
  const vocabData = currentSection.vocabList ? { ...currentSection, questions: currentSection.vocabList } : currentSection;
  
  return (
    <FlashcardBlock 
      data={vocabData} 
      onComplete={onCheckAnswers}
    />
  );
}

    // F. FALLBACK: STANDALONE QUESTION DISPATCHER
    // Use this if the lesson doesn't fit a major skill layout (e.g. a simple grammar drill)
    return (
      <div className="engine-fallback-container">
        <QuestionDispatcher 
          data={currentSection}
          userAnswers={userAnswers}
          onUpdate={onUpdateAnswers}
          isReviewMode={isReviewMode}
        />
      </div>
    );
  };

  return (
    <div className="invictus-engine-root">
      {renderLayout()}
    </div>
  );
};

export default Engine;