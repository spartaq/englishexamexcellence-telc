import React from 'react';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import QuestionDispatcher from './QuestionDispatcher';
import { flattenQuestions } from '../../utils/questionFlattener';
import './ReadingBlock.css';
import './engine.css';

const ReadingBlock = ({ 
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
  // 1. Extract Passage Content
  const content = data?.content || data?.passage;
  const title = data?.title;
  const subtitle = data?.subtitle;

  // 2. Flatten questions for the Carousel
  // Uses centralized flattenQuestions utility
  const flatQuestions = flattenQuestions(data?.subTasks || []);
  // Always use carousel to ensure parts tabs are shown (consistent with Listening/Writing)
  const useCarousel = true;

// 3. Helper to calculate question range (e.g. "Questions 1-5")
  const getQuestionRange = () => {
    if (flatQuestions.length === 0) return 'Questions';
    const extractIds = (items) => {
      const ids = [];
      items.forEach(item => {
        if (item.questions) item.questions.forEach(q => {
          const numId = parseInt(String(q.id).replace(/\D/g, ''), 10);
          console.log('[ReadingBlock] Question id:', q.id, '-> parsed:', numId);
          ids.push(numId);
        });
        else if (item.labels) item.labels.forEach(l => {
          const numId = parseInt(String(l.id).replace(/\D/g, ''), 10);
          console.log('[ReadingBlock] Label id:', l.id, '-> parsed:', numId);
          ids.push(numId);
        });
        else if (item.id) {
          const numId = parseInt(String(item.id).replace(/\D/g, ''), 10);
          console.log('[ReadingBlock] Item id:', item.id, '-> parsed:', numId);
          ids.push(numId);
        }
      });
      return ids.filter(id => !isNaN(id));
    };
    const ids = extractIds(flatQuestions).sort((a, b) => a - b);
    console.log('[ReadingBlock] All extracted IDs:', ids);
    return ids.length ? `Questions ${ids[0]}${ids.length > 1 ? `-${ids[ids.length-1]}` : ''}` : 'Questions';
  };

  return (
    <div className="invictus-reading-layout reading-wrapper">
      <SplitPane
        content={<>
          {(title || subtitle) && (
            <div className="invictus-content-header">
              {subtitle && <p className="invictus-content-subtitle">{subtitle}</p>}
              {title && <h2 className="invictus-content-title">{title}</h2>}
            </div>
          )}

            {/* Passage Content Rendering */}
            {typeof content === 'string' ? (
              <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: content }} />
            ) : Array.isArray(content) ? (
              content.map((item, index) => {
                const pId = typeof item === 'object' ? item.id : null;
                const pText = typeof item === 'object' ? item.text : item;
                return (
                  <div key={index} className="invictus-paragraph-wrapper">
                    {pId && <span className="invictus-paragraph-letter">{pId}</span>}
                    <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: pText }} />
                  </div>
                );
              })
            ) : null}
        </>}

        exercise={
          <div className="invictus-question-column">
            <h2 className="invictus-total-range">{getQuestionRange()}</h2>
            
            {flatQuestions.length > 0 && (
                useCarousel ? (
                  <QuestionCarousel
                    key={flatQuestions.map(q => q.id).join('-')}
                    questions={flatQuestions}
                    renderQuestion={(q) => (
                      <QuestionDispatcher 
                        data={q} 
                        userAnswers={userAnswers} 
                        onUpdate={onUpdate} 
                        isReviewMode={isReviewMode}
                        passageContent={content}
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
                    sections={sections}
                    activeSkillTab={activeSkillTab}
                    activeSectionIndex={activeSectionIndex}
                    setActiveSectionIndex={setActiveSectionIndex}
                    setActivePassageIndex={setActivePassageIndex}
                    setIsReviewMode={setIsReviewMode}
                    availableSkills={availableSkills}
                  />
                ) : (
                  <div className="invictus-static-list">
                    {flatQuestions.map((q, idx) => (
                      <QuestionDispatcher 
                        key={q.id || idx}
                        data={q} 
                        userAnswers={userAnswers} 
                        onUpdate={onUpdate} 
                        isReviewMode={isReviewMode}
                        passageContent={content}
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          }
        />
      </div>
    );
  };

export default ReadingBlock;