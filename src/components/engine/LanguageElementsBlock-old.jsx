import React from 'react';
import { flattenQuestions } from '../../utils/questionFlattener';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import QuestionDispatcher from './QuestionDispatcher';
import './LanguageElementsBlock.css';

/**
 * LanguageElementsBlock - Layout for TELC Language Elements section
 * 
 * Handles two data formats:
 * 1. New format: sections[].passages[].content (with gap markers ____(n)____)
 *    and sections[].passages[].subTasks[].questions
 * 2. Legacy format: sections[].subTasks[].passage (plain text)
 *    and sections[].subTasks[].questions
 * 
 * Uses QuestionCarousel for navigation between parts (similar to ReadingBlock)
 * Uses QuestionDispatcher for rendering questions
 */
const LanguageElementsBlock = ({ 
  data, 
  userAnswers = {}, 
  onUpdate = () => {}, 
  onQuestionIndexChange, 
  navigationProps, 
  showCheckAnswers = false, 
  onCheckAnswers, 
  isReviewMode = false,
  // Parts tabs props
  sections = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  // Get the languageElements data - may be nested in full-mock or direct
  // In full-mock, data is activeLesson which has languageElements inside
  // In standalone, data is the languageElements object itself
  const languageElementsData = data?.languageElements || data;
  
  // Get sections from data (the languageElements object passed by Engine)
  const dataSections = languageElementsData?.sections || [];
  
  // Use props sections if provided (from Engine), otherwise use data sections
  const allSections = sections.length > 0 ? sections : dataSections;
  
  // Use activeSectionIndex prop (local to LE, 0 or 1)
  const safePartIndex = activeSectionIndex !== undefined ? activeSectionIndex : 0;
  const currentSection = allSections[safePartIndex];
  
  // Check which format we're using:
  // New format: has passages array
  // Legacy format: has subTasks directly
  const hasNewFormat = currentSection?.passages && currentSection.passages.length > 0;
  
  // Get content and questions based on format
  let passageContent = '';
  let passageInstruction = '';
  let subTasks = [];
  let passageSubtitle = '';
  let passageTitle = '';
  
  if (hasNewFormat) {
    // New format: sections[].passages[]
    const currentPassage = currentSection.passages[0];
    // Content can be array of objects with text property
    const contentRaw = currentPassage?.content;
    if (Array.isArray(contentRaw)) {
      passageContent = contentRaw.map(c => c.text || '').join('\n\n');
    } else {
      passageContent = contentRaw || '';
    }
    passageInstruction = currentPassage?.instruction || '';
    passageSubtitle = currentPassage?.subtitle || '';
    passageTitle = currentPassage?.title || '';
    subTasks = currentPassage?.subTasks || [];
  } else {
    // Legacy format: sections[].subTasks[].passage
    subTasks = currentSection?.subTasks || [];
    const currentST = subTasks[0];
    passageContent = currentST?.passage || '';
    passageInstruction = currentST?.instruction || '';
  }
  
  // If no sections found, show error
  if (allSections.length === 0) {
    return (
      <div className="language-elements-error">
        <p>No language elements sections found.</p>
      </div>
    );
  }
  
  // Helper to get question range for header
  const getQuestionRange = () => {
    const questionIds = [];
    subTasks.forEach(st => {
      if (st.questions) {
        st.questions.forEach(q => {
          const numId = parseInt(String(q.id).replace(/\D/g, ''), 10);
          if (!isNaN(numId)) questionIds.push(numId);
        });
      }
    });
    const sortedIds = questionIds.sort((a, b) => a - b);
    return sortedIds.length ? `Questions ${sortedIds[0]}${sortedIds.length > 1 ? `-${sortedIds[sortedIds.length - 1]}` : ''}` : 'Questions';
  };
  
  // Format passage text with gap markers (handles both formats)
  const renderPassageWithGaps = (text) => {
    if (!text) return null;
    
    // Check if text has gap markers (new format)
    if (text.includes('____(')) {
      const parts = text.split(/____\((\d+)\)____/g);
      return (
        <div className="gap-fill-passage">
          {parts.map((part, idx) => 
            idx % 2 === 0 ? (
              <span key={idx} className="passage-text">{part}</span>
            ) : (
              <span key={idx} className="gap-marker">▼</span>
            )
          )}
        </div>
      );
    }
    
    // Legacy format: no markers, just plain text
    return (
      <div className="gap-fill-passage">
        <span className="passage-text">{text}</span>
      </div>
    );
  };
  
  // Content pane - shows the passage with gaps
  const contentPane = currentSection ? (
    <div className="language-elements-passage-content">
      <div className="invictus-content-header">
        <h2 className="invictus-content-title">{currentSection.title || data?.title}</h2>
        {currentSection.description && (
          <p className="invictus-content-subtitle">{currentSection.description}</p>
        )}
      </div>
      {passageSubtitle && (
        <p className="invictus-content-subtitle">{passageSubtitle}</p>
      )}
      {passageTitle && (
        <h3 className="invictus-content-title">{passageTitle}</h3>
      )}
      {passageInstruction && (
        <p className="gap-fill-instruction">{passageInstruction}</p>
      )}
      {passageContent && renderPassageWithGaps(passageContent)}
    </div>
  ) : null;
  
  // Create flat questions array for carousel
  // Uses centralized flattenQuestions utility
  const flatQuestions = flattenQuestions(subTasks);
   
  return (
    <div className="invictus-reading-layout reading-wrapper">
      <SplitPane
        content={contentPane}
        exercise={
          <div className="invictus-question-column">
            <h2 className="invictus-total-range">{getQuestionRange()}</h2>
            
            {flatQuestions.length > 0 && (
              <QuestionCarousel
                key={flatQuestions.map(q => q.id).join('-')}
                questions={flatQuestions}
                renderQuestion={(q) => (
                  <QuestionDispatcher 
                    data={q}
                    userAnswers={userAnswers} 
                    onUpdate={onUpdate} 
                    isReviewMode={isReviewMode}
                    passageContent={passageContent}
                  />
                )}
                showInstruction={true}
                onIndexChange={onQuestionIndexChange}
                hasNextPassage={navigationProps?.hasNextPassage}
                hasNextSection={navigationProps?.hasNextSection}
                onNextPart={navigationProps?.onNextPart}
                showCheckAnswers={showCheckAnswers}
                onCheckAnswers={onCheckAnswers}
                isReviewMode={isReviewMode}
                sections={allSections}
                activeSkillTab={activeSkillTab}
                activeSectionIndex={safePartIndex}
                setActiveSectionIndex={setActiveSectionIndex}
                setActivePassageIndex={setActivePassageIndex}
                setIsReviewMode={setIsReviewMode}
                availableSkills={availableSkills}
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default LanguageElementsBlock;
