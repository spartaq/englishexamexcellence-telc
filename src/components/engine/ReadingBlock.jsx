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
  setActiveSkillTab,
  availableSkills = [],
  // Full sections for cross-skill nav
  allSections = []
}) => {
  // Get reading sections for tabs - filter all sections by reading skill
  const readingSections = sections.filter(s => s.skill === 'reading');
  
   // 1. Extract Passage Content
   const content = data?.content || data?.passage;
   const title = data?.title;
   const subtitle = data?.subtitle;
   
   // Check if subTasks contain sentence-insert (which renders its own passage)
   const hasSentenceInsert = (data?.subTasks || []).some(st => st.type === 'sentence-insert');

  // 2. Flatten questions for the Carousel
  // Uses centralized flattenQuestions utility
  const flatQuestions = flattenQuestions(data?.subTasks || []);
  console.log('[ReadingBlock] flatQuestions count:', flatQuestions.length, 'for section:', data?.title || data?.skill);
  // Always use carousel to ensure parts tabs are shown (consistent with Listening/Writing)
  const useCarousel = true;

  // 3. Calculate navigation
  const hasNextSection = activeSectionIndex < readingSections.length - 1;
  const passageLength = data?.passages?.length ?? 0;
  const hasNextPassage = activeSectionIndex < passageLength - 1;

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
               {subtitle && (
                 <p className="invictus-content-subtitle">
                   {data?.level ? `${data.level.toUpperCase()} Practice Test ${data.mockNumber} - ` : ''}
                   {subtitle}
                 </p>
               )}
               {title && <h2 className="invictus-content-title">{title}</h2>}
             </div>
           )}

            {/* Passage Content Rendering */}
            {typeof content === 'string' ? (
              <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: content }} />
            ) : Array.isArray(content) ? (
              content.map((item, index) => {
                // For sentence-insert, render as plain text (gaps shown as markers)
                // For non-sentence-insert, use dangerouslySetInnerHTML
                const pId = typeof item === 'object' ? item.id : null;
                const pText = typeof item === 'object' ? item.text : item;
                return (
                  <div key={index} className="invictus-paragraph-wrapper">
                    {pId && <span className="invictus-paragraph-letter">{pId}</span>}
                    {hasSentenceInsert ? (
                      // For sentence-insert, render as plain text (gaps shown as markers)
                      <div className="invictus-passage-text" style={{ whiteSpace: 'pre-wrap' }}>{pText}</div>
                    ) : (
                      <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: pText }} />
                    )}
                  </div>
                );
              })
            ) : null}
        </>}

        exercise={<>
          
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
                    hasNextPassage={hasNextPassage}
                    hasNextSection={hasNextSection}
                    showCheckAnswers={showCheckAnswers}
                    onCheckAnswers={onCheckAnswers}
                    isReviewMode={isReviewMode}
                    sections={sections}
                    showPartsTabs={readingSections.length > 1}
                    activeSkillTab={activeSkillTab}
                    activeSectionIndex={activeSectionIndex}
                    setActiveSectionIndex={setActiveSectionIndex}
                    setActivePassageIndex={setActivePassageIndex}
                    setIsReviewMode={setIsReviewMode}
                    setActiveSkillTab={setActiveSkillTab}
                    availableSkills={availableSkills}
                    allSections={allSections}
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
              
            
          </>}
        />
      </div>
    );
  };

export default ReadingBlock;