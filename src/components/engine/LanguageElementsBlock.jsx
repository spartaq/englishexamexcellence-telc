import React, { useState, useEffect } from 'react';
import QuestionCarousel from './QuestionCarousel';
import SplitPane from './SplitPane';
import QuestionDispatcher from './QuestionDispatcher';
import { flattenQuestions } from '../../utils/questionFlattener';
import './LanguageElementsBlock.css'; // Updated CSS import
import './engine.css';

const LanguageElementsBlock = ({
  data,
  userAnswers = {},
  onUpdate = () => {},
  onQuestionIndexChange,
  navigationProps,
  showCheckAnswers = false,
  onCheckAnswers,
  isReviewMode = false,
  // Parts tabs props - used for LE parts (e.g., part 1, part 2)
  sections = [],
  activeSkillTab = 0,
  activeSectionIndex = 0,
  setActiveSectionIndex,
  setActivePassageIndex,
  setIsReviewMode,
  availableSkills = []
}) => {
  // For LE structure:
  // data = languageElements object { title, time, sections: [le-part1, le-part2] }
  // sections = le-part array (part1, part2) - passed from Engine via leSections
// 
  // NOTE: ReadingBlock uses data=currentPassage and sections=full availableSections array
  // For LE, we use sections prop which already contains [part1, part2]
  // So we don't extract from data.sections again
  
  // The 'sections' prop already contains the LE parts
  // Just use it directly for tabs
  const leParts = sections && sections.length > 0 ? sections : [];
  
  // For LE parts, we need a separate local index since global activeSectionIndex could be 9+ 
  // but leParts only has 2 items. Track locally in state, or use prop if provided.
  // Use the internalActiveSectionIndex if set, otherwise fall back to activeSectionIndex
  const [localLeIndex, setLocalLeIndex] = useState(0);
  // Use internal active index from prop, or the local state if prop is out of range
  const effectiveIndex = (activeSectionIndex < leParts.length) ? activeSectionIndex : localLeIndex;
  const currentPart = leParts[effectiveIndex] || leParts[0] || {};
  
  // Sync local index when activeSectionIndex is in valid range
  useEffect(() => {
    if (activeSectionIndex < leParts.length) {
      setLocalLeIndex(activeSectionIndex);
    }
  }, [activeSectionIndex, leParts.length]);

  // Wrap onUpdate to handle both formats: object from GapFillBlock or key-value from other blocks
  const handleLeUpdate = (updates) => {
    if (typeof updates === 'object' && !Array.isArray(updates)) {
      Object.entries(updates).forEach(([key, val]) => {
        onUpdate(key, val);
      });
    } else {
      onUpdate(updates);
    }
  };
  
  // Content can be in passages[0] (full-mock) or directly on currentPart (practice atoms)
  const currentPassage = currentPart?.passages?.[0] || currentPart || {};
  const content = currentPassage?.content || data?.content;
  
  const title = currentPart?.title || data?.title;
  const subtitle = currentPassage?.subtitle || data?.subtitle;
  
  // For LE: subTasks can be in passages[0] (full-mock) or directly on currentPart (practice atoms)
  const subTasks = currentPassage?.subTasks || currentPart?.subTasks || [];
  
  // Check if this is gap-fill-tokens format (needs interactive gaps in content pane)
  const isGapFillTokens = subTasks[0]?.type === 'gap-fill-tokens';
  const tokens = subTasks[0]?.tokens || [];
  const answers = subTasks[0]?.answers || [];
  
  // Helper to render content with interactive gaps for gap-fill-tokens format
  const renderInteractiveGaps = (text) => {
    if (!text || !isGapFillTokens) return <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: text }} />;
    
    // Parse text and replace ____(n)____ with interactive elements
    const parts = text.split(/____\((\d+)\)____/g);
    return (
      <div className="invictus-passage-text">
        {parts.map((part, idx) => {
          if (idx % 2 === 0) {
            return <span key={idx} dangerouslySetInnerHTML={{ __html: part }} />;
          }
          const gapNum = parseInt(part);
          // Map gap marker number (31+) to answer key (1+) - gap 31 = key 1
          const answerKey = gapNum <= 30 ? gapNum : gapNum - 30;
          // Handle both selection formats: numeric index (from GapFillBlock) or direct key
          const selectedToken = userAnswers?.[answerKey] || userAnswers?.[String(answerKey)];
          return (
            <span
              key={idx}
              className={`interactive-gap ${selectedToken ? 'filled' : 'empty'}`}
            >
              {selectedToken || '____'}
            </span>
          );
        })}
      </div>
    );
  };
  
  // DEBUG: Log the structure
  
  // 2. Flatten questions for the Carousel
  const flatQuestions = flattenQuestions(subTasks);
  const useCarousel = true;

// 3. Helper to calculate question range (e.g. "Questions 1-5")
  const getQuestionRange = () => {
    if (flatQuestions.length === 0) return 'Questions';
    const extractIds = (items) => {
      const ids = [];
      items.forEach(item => {
        if (item.questions) item.questions.forEach(q => {
          const numId = parseInt(String(q.id).replace(/\D/g, ''), 10);
          ids.push(numId);
        });
        else if (item.labels) item.labels.forEach(l => {
          const numId = parseInt(String(l.id).replace(/\D/g, ''), 10);
          ids.push(numId);
        });
        else if (item.id) {
          const numId = parseInt(String(item.id).replace(/\D/g, ''), 10);
          ids.push(numId);
        }
      });
      return ids.filter(id => !isNaN(id));
    };
    const ids = extractIds(flatQuestions).sort((a, b) => a - b);
    return ids.length ? `Questions ${ids[0]}${ids.length > 1 ? `-${ids[ids.length-1]}` : ''}` : 'Questions';
  };

  return (
    <div className="invictus-language-elements-layout language-elements-wrapper"> {/* Updated class names */}
      <SplitPane
        content={<>
          {(title || subtitle) && (
            <div className="invictus-content-header">
              {subtitle && <p className="invictus-content-subtitle">{subtitle}</p>}
              {title && <h2 className="invictus-content-title">{title}</h2>}
            </div>
          )}

            {/* Passage Content Rendering - exactly like ReadingBlock */}
            {typeof content === 'string' ? (
              isGapFillTokens ? renderInteractiveGaps(content) : <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: content }} />
            ) : Array.isArray(content) ? (
              content.map((item, index) => {
                const pId = typeof item === 'object' ? item.id : null;
                const pText = typeof item === 'object' ? (item.text || item.passage) : item;
                return (
                  <div key={index} className="invictus-paragraph-wrapper">
                    {pId && <span className="invictus-paragraph-letter">{pId}</span>}
                    {isGapFillTokens ? renderInteractiveGaps(pText) : <div className="invictus-passage-text" dangerouslySetInnerHTML={{ __html: pText }} />}
                  </div>
                );
              })
            ) : (
              <div className="invictus-passage-text">No content available</div>
            )}
        </>}

        exercise={
          <div className="invictus-question-column">
            <h2 className="invictus-total-range">{getQuestionRange()}</h2>

            {flatQuestions.length > 0 ? (
                useCarousel ? (
                  <QuestionCarousel
                    key={flatQuestions.map(q => q.id).join('-')}
                    questions={flatQuestions}
                    renderQuestion={(q) => (
                      <QuestionDispatcher
                        data={q}
                        userAnswers={userAnswers}
                        onUpdate={handleLeUpdate}
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
                    sections={leParts}
                    activeSkillTab={0}
                    activeSectionIndex={effectiveIndex}
                    setActiveSectionIndex={(idx) => {
                      // Only update local LE index - for LE tab switching in carousel
                      setLocalLeIndex(idx);
                    }}
                    setActivePassageIndex={setActivePassageIndex}
                    setIsReviewMode={setIsReviewMode}
                    availableSkills={[]}
                    showPartsTabs={true}
                  />
                ) : (
                  <div className="invictus-static-list">
                    {flatQuestions.map((q, idx) => (
                      <QuestionDispatcher
                        key={q.id || idx}
                        data={q}
                        userAnswers={userAnswers}
                        onUpdate={handleLeUpdate}
                        isReviewMode={isReviewMode}
                        passageContent={content}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="no-questions-message">
                  <p>No questions available for this section.</p>
                  <pre style={{ fontSize: '10px', maxWidth: '100%', overflow: 'auto' }}>
                    {JSON.stringify({ content: content?.substring?.(0, 200), subTasks: data?.subTasks }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  };

export default LanguageElementsBlock;