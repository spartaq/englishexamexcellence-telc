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
  availableSkills = [],
  onNavigateToMyWords
}) => {
  console.log('!!! ENGINE COMPONENT RENDERING !!!');

  // 1. Resolve Data hierarchy
  const sections = activeLesson?.sections || availableSections || [];
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
    console.log('[Engine] activeLesson:', activeLesson?.id, 'activeSectionIndex:', activeSectionIndex);
    console.log('[Engine] currentSection:', currentSection?.id, currentSection?.title);
    console.log('[Engine] skill:', skill, 'lessonType:', lessonType);
    
    // A. READING LAYOUT (IELTS / TOEFL / Reading Drills / Full Mocks reading sections)
    const isFullMockReading = lessonType === 'full-mock' && currentSection?.skill === 'reading';
    if (lessonType === 'ielts-complex' || isFullMockReading || lessonType === 'READING' || skill === 'reading' || lessonType === 'reading-practice') {
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

    // B. LISTENING LAYOUT (including full-mock listening sections)
    const isFullMockListening = lessonType === 'full-mock' && currentSection?.skill === 'listening';
    if (lessonType === 'LISTENING' || skill === 'listening' || isFullMockListening) {
      // For full-mocks, need to pass the full lesson so ListeningBlock can access activeLesson.listening
      const listeningData = isFullMockListening ? activeLesson : currentSection;
      return (
        <ListeningBlock 
          data={listeningData} 
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

    // C. WRITiNG LAYOUT (including full-mock writing sections)
    const isFullMockWriting = lessonType === 'full-mock' && currentSection?.skill === 'writing';
    if (lessonType === 'WRITING' || skill === 'writing' || lessonType === 'writing-mock' || isFullMockWriting) {
      // Merge task-specific data if nested sections exist
      const writingTask = currentSection?.sections?.length > 0
        ? { ...currentSection, ...currentSection.sections[activeSectionIndex] || currentSection.sections[0] }
        : currentSection;

      return (
        <WritingBlock 
          data={writingTask} 
          onComplete={onCheckAnswers}
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
          showCheckAnswers={showCheckAnswers}
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

    // D. SPEAKING LAYOUT (including full-mock speaking sections)
    const isFullMockSpeaking = lessonType === 'full-mock' && currentSection?.skill === 'speaking';
    if (lessonType === 'SPEAKING' || skill === 'speaking' || lessonType === 'ielts-speaking' || isFullMockSpeaking) {
      return (
        <SpeakingBlock 
          data={currentSection} 
          onComplete={onCheckAnswers}
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
          showCheckAnswers={showCheckAnswers}
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

   // E. VOCAB / FLASHCARDS (including full-mock vocab sections)
   const isFullMockVocab = lessonType === 'full-mock' && currentSection?.skill === 'vocab';
   if (lessonType === 'VOCAB' || lessonType === 'VOCAB_FLASHCARDS' || skill === 'vocab' || isFullMockVocab) {
  // If the data came from a passage's vocabList, 
  // ensure we pass the correct array to the FlashcardBlock
  const vocabData = currentSection.vocabList ? { ...currentSection, questions: currentSection.vocabList } : currentSection;
  
  return (
    <FlashcardBlock 
      data={vocabData} 
      onComplete={onCheckAnswers}
      onNavigateToMyWords={onNavigateToMyWords}
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
          onCheckAnswers={onCheckAnswers}
          isReviewMode={isReviewMode}
          showCheckAnswers={showCheckAnswers}
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